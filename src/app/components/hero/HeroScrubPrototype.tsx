import { useEffect, useRef } from "react";
import gsap from "gsap";
import { lenisInstance } from "../SmoothScroll";
import { useGlobalContext } from "../../context/GlobalContext";
import { HeroAudio } from "./HeroAudio";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
    __heroMounted?: boolean; // cosmic hero is on this route (Loader checks before waiting)
    __heroReady?: boolean; // first chapter (segA + rests) finished loading → Loader may reveal
    __loaderDone?: boolean; // loader has begun revealing → hero may arm scroll/gesture input
  }
}

/**
 * PREVIEW PROTOTYPE v9 — all-canvas chaptered auto-play (Round-12).
 * LIVE two-layer cross-dissolve: the moving ambient keeps playing and fades
 * across into the journey (and the F6 ambient fades in over the journey's
 * decelerating tail) — never parks on a static keyframe. Audio = the existing
 * HeroAudio mute button (bottom-right, inside the stage so it leaves with the
 * hero), the hero track synced to global isMuted, unmuted by default.
 */

const SEG_A = 242; // F2→F5 flight (121) + F5→F6 bloom (121)
const SEG_B = 256; // ending = clip#2 fall→becomes-star (181) + clip#3 detonation (75)
// boundaries (0-indexed), from actual extracted frame counts
const B_FALL_END = 180; // end of clip#2 = the calm Peace star (fall→becoming endpoint); detonation follows
const B_DETO_BURST = 210; // end of the detonation's fast initial "speed bump"; mid→end then plays normal/steady
const REST2_N = 103;
const REST6_N = 103;
const REST_FPS = 12;

const pad = (i: number) => String(i).padStart(4, "0");
// Frame paths are tier-aware (desktop full-res vs lighter "-m" mobile set) — the suffix
// is resolved inside the effect from the device check, so phones load ~¼ the bytes.

const DUR_A = 5.0;
// chapter-B (ending) — all REAL footage (clip#2 fall→becomes-star, clip#3 detonation).
// Pure CODE pacing levers, zero credits.
const DUR_FALL = 8.5; // clip#2 (10s) fall→becomes-star, played ~1.2x (a touch faster than native)
const DUR_BURST = 0.8; // detonation — fast initial speed-bump (ignition rips)
const DUR_DETO = 2.4; // detonation — mid→end at steady NORMAL pace (no slow-mo tail)
const WHITE_FLASH = 0.4; // code flash to pure white before the handoff
const DUR_REV = 4.0;
const XFADE = 1.5; // rest↔journey cross-dissolve

// handoff (end of chapter B → Recent Work) — cinematic cream cross-fade, no scroll motion
const HANDOFF_OFFSET = 140; // instant-jump landing offset past the #work top (a bit deeper)
const HANDOFF_FADE = 1.0; // cream cover fade-out → Recent Work fades in
const COVER_COLOR = "#fafbf6"; // matches the Recent Work background → seamless reveal (not pure white)
const MUSIC_FADE_OUT = 2.0; // fade music out over this long when the hero leaves the viewport
const MUSIC_FADE_IN = 1.0; // fade music in over this long when the hero (re)enters the viewport

const WHEEL_THRESHOLD = 40;
const TOUCH_THRESHOLD = 40;
const ARM_COOLDOWN = 250;

const MUSIC_ID = "tKaFYUKlZjY";
const MUSIC_VOL = 65;
const MUSIC_START = 60; // begin (and loop) from the 60s mark

type State = "loading" | "restF2" | "playA" | "restF6" | "playB" | "handoff" | "content";

export function HeroScrubPrototype() {
  // GlobalAudio is removed — the hero owns its own track now; only isMuted is shared.
  const { isMuted, setMusicPlaying, registerMusicPlay } = useGlobalContext();
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;
  // report actual playback to the mute button (so blocked/silent reads as muted)
  const setMusicPlayingRef = useRef(setMusicPlaying);
  setMusicPlayingRef.current = setMusicPlaying;
  const registerMusicPlayRef = useRef(registerMusicPlay);
  registerMusicPlayRef.current = registerMusicPlay;
  const applyAudioRef = useRef<() => void>(() => {});

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ytRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null); // #fafbf6 cover for the cinematic fade INTO Recent Work

  // keep the hero track's mute in sync with the global mute button
  useEffect(() => {
    applyAudioRef.current();
  }, [isMuted]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.__heroMounted = true; // tell the Loader a cosmic hero lives on this route

    // device tier — phones/touch get the lighter ~960px frame set ("-m"); ~¼ the bytes
    const mobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const tier = mobile ? "-m" : "";
    const aPath = (i: number) => `/hero-preview/scrub-a${tier}/a_${pad(i)}.webp`;
    const bPath = (i: number) => `/hero-preview/scrub-b${tier}/b_${pad(i)}.webp`;
    const r2Path = (i: number) => `/hero-preview/rest-f2${tier}/r_${pad(i)}.webp`;
    const r6Path = (i: number) => `/hero-preview/rest-f6${tier}/r_${pad(i)}.webp`;

    const segA: HTMLImageElement[] = [];
    const segB: HTMLImageElement[] = [];
    const rest2: HTMLImageElement[] = [];
    const rest6: HTMLImageElement[] = [];
    const draw = { img: null as HTMLImageElement | null };
    const overlay = { arr: null as HTMLImageElement[] | null, alpha: 0 };
    const zoom = { v: 1 }; // base-layer scale (kept at 1; harmless infra)
    const whiteFlash = { v: 0 }; // pure-white flash before handoff
    const resetFx = () => {
      zoom.v = 1;
      whiteFlash.v = 0;
    };

    let state: State = "loading";
    let played = false; // the journey has run to completion once this session → held = F6
    const go = (s: State) => (state = s);
    const setHudText = (_t: string) => {}; // debug HUD removed for production (calls kept as no-ops)

    // ---- render: base layer + a LIVE (moving) overlay layer for cross-dissolves ----
    const restArr = () =>
      state === "restF2"
        ? rest2
        : state === "restF6"
          ? rest6
          : state === "content"
            ? played
              ? rest6 // already journeyed → hold the F6 halo
              : rest2 // not yet → hold the F2 opening
            : null;
    const restIdx = (arr: HTMLImageElement[]) =>
      Math.floor(performance.now() / (1000 / REST_FPS)) % arr.length;
    const cover = (img: HTMLImageElement, alpha: number, z = 1) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * z;
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      ctx.globalAlpha = 1;
    };
    const render = () => {
      const ra = restArr();
      if (ra && ra.length) {
        const im = ra[restIdx(ra)];
        if (im?.complete) draw.img = im;
      }
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      if (draw.img) cover(draw.img, 1, zoom.v);
      if (overlay.arr && overlay.arr.length && overlay.alpha > 0.001) {
        const im = overlay.arr[restIdx(overlay.arr)];
        if (im?.complete) cover(im, overlay.alpha);
      }
      if (whiteFlash.v > 0.001) {
        // flood to the Recent Work cream (#fafbf6), not pure white, so the cover→content fade is seamless
        ctx.fillStyle = `rgba(250,251,246,${whiteFlash.v})`;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }
      raf = requestAnimationFrame(render);
    };
    let raf = requestAnimationFrame(render);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const startFadeOverlay = (arr: HTMLImageElement[], fromA: number, toA: number, dur: number) => {
      gsap.killTweensOf(overlay);
      overlay.arr = arr;
      overlay.alpha = fromA;
      gsap.to(overlay, {
        alpha: toA,
        duration: dur,
        ease: "power1.inOut",
        onComplete: () => {
          if (toA <= 0.001) overlay.arr = null;
        },
      });
    };
    const clearOverlay = () => {
      gsap.killTweensOf(overlay);
      overlay.arr = null;
      overlay.alpha = 0;
    };

    // ---- scroll ownership ----
    const lockNative = (on: boolean) => {
      document.documentElement.style.overflow = on ? "hidden" : "";
      if (on) window.scrollTo(0, 0);
    };
    const navEl = document.querySelector("header") as HTMLElement | null;
    const setNav = (show: boolean) => {
      if (!navEl) return;
      navEl.style.transition = "opacity 0.6s ease";
      navEl.style.opacity = show ? "" : "0";
      navEl.style.pointerEvents = show ? "" : "none";
    };

    // ---- YouTube hero music (synced to global isMuted; unmuted by default) ----
    let player: any = null;
    let playerReady = false;
    let started = false;
    const volProxy = { v: 0 };
    let pendingFade = false; // fade-in waits for real playback (PLAYING) so it rises from true silence
    const fadeMusic = (to: number, dur: number, then?: () => void, ease = "power1.inOut") => {
      gsap.killTweensOf(volProxy); // one volume tween at a time (clean toggles)
      gsap.to(volProxy, {
        v: to,
        duration: dur,
        ease,
        onUpdate: () => player?.setVolume?.(volProxy.v),
        onComplete: then,
      });
    };
    const startFadeIn = () => {
      if (!pendingFade) return;
      pendingFade = false;
      fadeMusic(MUSIC_VOL, 1.0, undefined, "power2.in"); // quick gentle swell from silence
    };
    const applyAudio = () => {
      // instant — used only at init to set the correct mute state before playback
      if (!player || !playerReady) return;
      try {
        if (isMutedRef.current) player.mute();
        else player.unMute();
      } catch {}
    };
    // user mute/unmute toggle → 1s fade (never an abrupt cut)
    const applyAudioFaded = () => {
      if (!player || !playerReady) return;
      try {
        if (isMutedRef.current) {
          fadeMusic(0, 1.0, () => {
            try {
              player.mute();
            } catch {}
          });
        } else {
          player.unMute();
          player.setVolume(0);
          volProxy.v = 0;
          try {
            player.playVideo(); // ensure it's actually playing when unmuted (e.g. was blocked)
          } catch {}
          fadeMusic(MUSIC_VOL, 1.0);
        }
      } catch {}
    };
    applyAudioRef.current = applyAudioFaded;
    const doPlay = () => {
      if (!player || !playerReady || started) return;
      started = true;
      try {
        player.setVolume(0); // silence BEFORE playing so there's no blast
        volProxy.v = 0;
        player.seekTo(MUSIC_START, true);
        applyAudio();
        pendingFade = true; // fade-in fires on the PLAYING event (rises from real silence)
        player.playVideo();
        // safety: if PLAYING never fires, fade anyway so the track isn't stuck at 0
        setTimeout(startFadeIn, 1500);
      } catch {}
    };
    // Direct, minimal play — mirrors the production GlobalAudio pattern that works on
    // mobile: invoked synchronously inside a REAL user gesture (first scroll/touch, or the
    // mute-button click), it just unmutes + playVideo. No seek / volume-ramp / synthetic
    // events — those left mobile silent or unstarted. No-op if already playing (keeps the
    // desktop autoplay fade undisturbed).
    const forcePlay = () => {
      if (!player || !playerReady) return;
      try {
        if (player.getPlayerState?.() === window.YT?.PlayerState?.PLAYING) return;
        if (isMutedRef.current) {
          player.mute();
        } else {
          player.unMute();
          player.setVolume(MUSIC_VOL);
          volProxy.v = MUSIC_VOL;
        }
        player.playVideo();
      } catch {}
    };
    // expose to the mute button so it can start playback directly in its click
    registerMusicPlayRef.current?.(forcePlay);
    const initPlayer = () => {
      if (player || !ytRef.current || !window.YT?.Player) return;
      player = new window.YT.Player(ytRef.current, {
        videoId: MUSIC_ID,
        playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: MUSIC_ID, rel: 0, enablejsapi: 1, start: MUSIC_START, playsinline: 1 },
        events: {
          onReady: () => {
            playerReady = true;
            applyAudio();
            doPlay(); // works if the browser allows; else the first gesture does it
          },
          onStateChange: (e: any) => {
            const S = window.YT?.PlayerState;
            // fade in only once playback ACTUALLY begins → rises from true silence (no buffering pop-in)
            if (e?.data === S?.PLAYING) {
              startFadeIn();
              setMusicPlayingRef.current(true); // → button shows the unmuted (volume) icon
            } else if (e?.data === S?.PAUSED) {
              setMusicPlayingRef.current(false); // → button shows the muted icon
            }
            // loop back to the 60s mark, not 0 (ENDED re-plays → PLAYING flips it back true)
            if (e?.data === S?.ENDED) {
              try {
                player.seekTo(MUSIC_START, true);
                player.playVideo();
              } catch {}
            }
          },
        },
      });
    };
    const ensureYT = () => {
      if (window.YT?.Player) return initPlayer();
      if (!document.querySelector('script[src*="iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      const wait = () => (window.YT?.Player ? initPlayer() : setTimeout(wait, 200));
      wait();
    };
    const onFirstGesture = () => forcePlay(); // direct play in the gesture (mobile-safe)
    const addGesture = () => {
      window.addEventListener("pointerdown", onFirstGesture, { once: true });
      window.addEventListener("keydown", onFirstGesture, { once: true });
      window.addEventListener("touchstart", onFirstGesture, { once: true });
    };
    const removeGesture = () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
    };

    // ---- input (one gesture = one chapter) ----
    let lastFire = -99999;
    let wheelAccum = 0;
    let touchStartY = 0;
    const armed = () => performance.now() - lastFire >= ARM_COOLDOWN;
    const advance = (dir: number) => {
      if (state === "restF2") {
        if (dir > 0 && armed()) {
          lastFire = performance.now();
          playChapter("A", 1);
        }
      } else if (state === "restF6") {
        if (!armed()) return;
        lastFire = performance.now();
        if (dir > 0) playChapter("B", 1);
        else playChapter("A", -1);
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (state !== "restF2" && state !== "restF6") {
        wheelAccum = 0;
        return;
      }
      wheelAccum += e.deltaY;
      if (Math.abs(wheelAccum) >= WHEEL_THRESHOLD) {
        const dir = wheelAccum > 0 ? 1 : -1;
        wheelAccum = 0;
        advance(dir);
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => e.preventDefault();
    const onTouchEnd = (e: TouchEvent) => {
      if (state !== "restF2" && state !== "restF6") return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) >= TOUCH_THRESHOLD) advance(dy > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      const down = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || e.key === "Spacebar";
      const up = e.key === "ArrowUp" || e.key === "PageUp";
      if (!down && !up) return;
      if (state === "restF2" || state === "restF6") {
        e.preventDefault();
        advance(down ? 1 : -1);
      }
    };
    const addInput = () => {
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("keydown", onKey);
    };
    const removeInput = () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
    // Attach gesture/scroll capture ONLY once the loader is gone. The loader is
    // opaque and stays up until every frame loads; if input were live behind it, a
    // stray scroll/inertia would advance chapters invisibly and dump the user into
    // Recent Work ("jumps straight down, no animation"). Scroll stays locked the
    // whole time (lockNative), so nothing moves before this.
    let inputArmed = false;
    let armTimer: number | undefined;
    const armNow = () => {
      if (inputArmed) return;
      inputArmed = true;
      addInput();
    };
    const armInputWhenRevealed = () => {
      if (window.__loaderDone) {
        armNow();
        return;
      }
      window.addEventListener("loader:done", armNow, { once: true });
      armTimer = window.setTimeout(armNow, 9000); // safety: never leave the hero un-armed
    };

    // ---- decode-ahead during the idle ambient ----
    const decodedFlags = { a: false, b: false };
    const decodeAhead = async (arr: HTMLImageElement[], count: number, key: "a" | "b") => {
      if (decodedFlags[key]) return;
      decodedFlags[key] = true;
      for (let i = 0; i < Math.min(count, arr.length); i++) {
        try {
          await arr[i]?.decode?.();
        } catch {}
      }
    };

    // ---- rest states ----
    const showCopy = (animate: boolean) => {
      if (!textRef.current) return;
      if (animate)
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.1, overwrite: true },
        );
      else gsap.set(textRef.current, { opacity: 1, y: 0 });
    };
    const enterRestF2 = (animateCopy: boolean) => {
      clearOverlay();
      resetFx();
      go("restF2");
      draw.img = rest2[0] ?? segA[0];
      setNav(true);
      showCopy(animateCopy);
      setHudText("F2 · drift — scroll to depart ↓");
      decodeAhead(segA, mobile ? 30 : 90, "a");
    };
    const enterRestF6 = () => {
      clearOverlay();
      resetFx();
      go("restF6");
      draw.img = rest6[0];
      setHudText("F6 · radiant halo — scroll to fall ↓  ·  ↑ to return");
      decodeAhead(segB, mobile ? 30 : 90, "b");
    };

    // ---- chapter playback (live cross-dissolve at both ends) ----
    let chapterTween: gsap.core.Tween | gsap.core.Timeline | null = null;
    let endFade: gsap.core.Tween | null = null;
    const killCh = () => {
      chapterTween?.kill();
      endFade?.kill();
      endFade = null;
    };
    const drawSeg = (seg: HTMLImageElement[], last: number, i: number) => {
      const img = seg[Math.max(0, Math.min(last, Math.round(i)))];
      // Only swap to a frame that's actually loaded — otherwise HOLD the last good
      // frame (never flash black while a frame is still streaming/decoding).
      if (img && img.complete && img.naturalWidth) draw.img = img;
    };
    function playChapter(which: "A" | "B", dir: number) {
      killCh();

      if (which === "A") {
        const last = SEG_A - 1;
        const fwd = dir > 0;
        startFadeOverlay(fwd ? rest2 : rest6, 1, 0, XFADE); // outgoing ambient keeps moving, fades out
        go("playA");
        const from = fwd ? 0 : last;
        const to = fwd ? last : 0;
        const proxy = { i: from };
        draw.img = segA[from];
        const dur = fwd ? DUR_A : DUR_REV;
        chapterTween = gsap.to(proxy, {
          i: to,
          duration: dur,
          ease: "power2.inOut",
          onUpdate: () => {
            drawSeg(segA, last, proxy.i);
            setHudText(`playA · F2→F6 · ${Math.round((Math.abs(proxy.i - from) / last) * 100)}%`);
          },
          onComplete: () => (fwd ? enterRestF6() : enterRestF2(false)),
        });
        // incoming ambient fades IN over the journey's final (still-moving) frames
        endFade = gsap.delayedCall(Math.max(0.01, dur - XFADE), () =>
          startFadeOverlay(fwd ? rest6 : rest2, 0, 1, XFADE),
        );
        return;
      }

      if (dir > 0) {
        // entry: keep the moving F6 halo cross-dissolving out (Round-12, as locked)
        startFadeOverlay(rest6, 1, 0, XFADE);
        go("playB");
        resetFx();
        const last = SEG_B - 1;
        const proxy = { i: 0 };
        draw.img = segB[0];
        const upd = () => {
          drawSeg(segB, last, proxy.i);
          setHudText(`playB · ending · ${Math.round((proxy.i / last) * 100)}%`);
        };
        const tl = gsap.timeline({ onComplete: handoff });
        // fall → gathers into the star → straight into detonation: ONE continuous motion, no freeze
        tl.to(proxy, { i: B_FALL_END, duration: DUR_FALL, ease: "none", onUpdate: upd });
        // detonation (clip#3), flows directly on. Two beats, both constant (ease "none"):
        // 1) fast initial speed-bump as it ignites, then 2) STEADY normal pace from mid → end (no slow-mo tail)
        tl.to(proxy, { i: B_DETO_BURST, duration: DUR_BURST, ease: "none", onUpdate: upd });
        tl.to(proxy, { i: last, duration: DUR_DETO, ease: "none", onUpdate: upd });
        // detonation floods to cream (#fafbf6) on the canvas → onComplete cross-fades
        // into Recent Work behind a matching cream cover (no scroll motion)
        tl.to(whiteFlash, { v: 1, duration: WHITE_FLASH, ease: "power2.in" });
        chapterTween = tl;
      }
    }

    // ---- re-arm: in "content" BEFORE the journey has played, a downward gesture at the
    // very top plays it once ("play once per session"). After it's played, the watcher is
    // inert and scrolling down is normal. ----
    let cTouchY = 0;
    const atTop = () => window.scrollY <= 2;
    const rearm = () => {
      removeContentWatch();
      lockNative(true);
      lenisInstance?.stop();
      resetFx();
      draw.img = rest2[0] ?? segA[0];
      if (started && !isMutedRef.current) {
        try {
          player?.playVideo?.();
        } catch {}
        fadeMusic(MUSIC_VOL, 1.0);
      }
      addInput();
      playChapter("A", 1); // play the journey forward from the opening
    };
    const onContentWheel = (e: WheelEvent) => {
      if (state === "content" && !played && atTop() && e.deltaY > 0) {
        e.preventDefault();
        rearm();
      }
    };
    const onContentTouchStart = (e: TouchEvent) => {
      cTouchY = e.touches[0].clientY;
    };
    const onContentTouchMove = (e: TouchEvent) => {
      if (state === "content" && !played && atTop() && cTouchY - e.touches[0].clientY > 24) {
        e.preventDefault();
        rearm();
      }
    };
    const addContentWatch = () => {
      window.addEventListener("wheel", onContentWheel, { passive: false });
      window.addEventListener("touchstart", onContentTouchStart, { passive: true });
      window.addEventListener("touchmove", onContentTouchMove, { passive: false });
    };
    const removeContentWatch = () => {
      window.removeEventListener("wheel", onContentWheel);
      window.removeEventListener("touchstart", onContentTouchStart);
      window.removeEventListener("touchmove", onContentTouchMove);
    };

    // ---- release the takeover into the normal scrollable page ----
    // held = F2 (not yet played) or F6 (played); a downward gesture at the very top plays
    // the journey once if it hasn't run yet.
    const releaseToContent = () => {
      killCh();
      removeInput();
      go("content");
      clearOverlay();
      lockNative(false);
      lenisInstance?.start();
      lenisInstance?.resize?.(); // recompute scroll bounds now that overflow is unlocked
      setNav(true);
      addContentWatch();
      // music fades out via the hero-visibility observer once the hero leaves the viewport
    };

    function handoff() {
      // chapter B finished — the canvas has flooded to cream (whiteFlash = 1).
      // Cross-fade INTO Recent Work behind a matching cream cover: NO scroll motion.
      played = true; // journey ran to completion → held state becomes the F6 halo
      killCh();
      removeInput();
      clearOverlay();
      // pin the fixed cream cover ON (canvas is already cream → seamless), then release scroll
      if (coverRef.current) gsap.set(coverRef.current, { opacity: 1 });
      lockNative(false);
      void document.documentElement.offsetHeight; // reflow so Lenis reads real scroll bounds
      lenisInstance?.start();
      lenisInstance?.resize?.();
      setNav(true);
      go("content");
      addContentWatch();
      // music fades out via the hero-visibility observer once the hero leaves the viewport
      requestAnimationFrame(() => {
        lenisInstance?.resize?.();
        const work = document.getElementById("work");
        if (work) {
          // INSTANT jump (hidden under the cover) — no visible scroll
          if (lenisInstance)
            lenisInstance.scrollTo(work, { offset: HANDOFF_OFFSET, immediate: true, force: true });
          else window.scrollTo(0, work.getBoundingClientRect().top + window.scrollY + HANDOFF_OFFSET);
        }
        whiteFlash.v = 0; // canvas cream no longer needed (hero is off-screen now)
        // fade the cream cover away → Recent Work fades in
        if (coverRef.current)
          gsap.to(coverRef.current, { opacity: 0, duration: HANDOFF_FADE, ease: "power2.out" });
      });
    }

    // Nav links work even during the cinematic: release the takeover, then let
    // SmoothScroll perform the normal anchor scroll to the clicked section.
    const onNavClick = (e: MouseEvent) => {
      const cinematic =
        state === "restF2" || state === "playA" || state === "restF6" || state === "playB";
      if (!cinematic) return;
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!a) return;
      whiteFlash.v = 0; // a manual jump — no white-out
      releaseToContent();
    };

    // ---- start ----
    const startDirect = () => {
      lockNative(true);
      lenisInstance?.stop();
      armInputWhenRevealed(); // gesture/scroll capture arms only after the loader reveals
      enterRestF2(true);
    };
    const reducedSetup = () => {
      go("handoff"); // static held state (no rest-loop, no takeover); hero is a 100svh section
      draw.img = rest2[0] ?? segA[0];
      setNav(true);
      showCopy(false);
    };

    // ---- preload ----
    // First-chapter readiness (segA + both rests) → tells the Loader it can reveal.
    // segB (the ending) is NOT gated; it streams in the background during the opening rest.
    let readyCount = 0;
    const readyTarget = SEG_A + REST2_N + REST6_N;
    const signalReady = () => {
      if (window.__heroReady) return;
      window.__heroReady = true;
      window.dispatchEvent(new Event("hero:ready"));
    };
    const bumpReady = () => {
      if (++readyCount >= readyTarget) signalReady();
    };
    let started2 = false;
    const tryStart = () => {
      if (started2) return;
      if (segA[0]?.complete && rest2[0]?.complete) {
        started2 = true;
        draw.img = segA[0];
        resize();
        if (reduce) {
          reducedSetup();
          signalReady(); // reduced motion: the poster is enough — reveal now
        } else startDirect();
      }
    };
    const load = (
      arr: HTMLImageElement[],
      n: number,
      path: (i: number) => string,
      decodeFirst = 0,
      countReady = false,
    ) => {
      for (let i = 1; i <= n; i++) {
        const img = new Image();
        const done = () => {
          if (countReady) bumpReady();
        };
        img.onload = () => {
          if (i <= decodeFirst) img.decode?.().catch(() => {});
          done();
          tryStart();
        };
        img.onerror = done; // a missing frame must not stall the loader
        img.src = path(i);
        arr[i - 1] = img;
      }
    };
    // Kick the music off NOW (while the loader is still up): the YT autoplay attempt +
    // first-gesture listener go live immediately, so the fade-in swells under the loader
    // for autoplay-allowed/returning visitors. (New visitors start it on first interaction.)
    if (!reduce) {
      ensureYT();
      addGesture();
    }

    load(rest2, REST2_N, r2Path, 4, true);
    load(segA, SEG_A, aPath, 16, true);
    load(rest6, REST6_N, r6Path, 4, true);
    load(segB, SEG_B, bPath, 16, false); // ending streams in the background — not gated by the loader

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("click", onNavClick, true); // nav links escape the cinematic

    // ---- music follows hero visibility ----
    // Single source of truth for play/pause: the track plays whenever the hero is
    // on screen (incl. when you scroll back UP to the held F6) and fades out + pauses
    // when you leave it. (Fixes "music stops at F6 on scroll-up".)
    const resumeMusic = () => {
      if (!player || !playerReady || isMutedRef.current) return;
      try {
        player.unMute();
        player.setVolume(0);
      } catch {}
      volProxy.v = 0;
      try {
        player.playVideo();
      } catch {}
      fadeMusic(MUSIC_VOL, MUSIC_FADE_IN, undefined, "power2.in");
    };
    const pauseMusic = () => {
      if (!player || !playerReady) return;
      fadeMusic(0, MUSIC_FADE_OUT, () => {
        try {
          player?.pauseVideo?.();
        } catch {}
      });
    };

    let heroInView = true; // hero starts in view; initial play is handled by doPlay/forcePlay
    const onHeroVisibility = (entries: IntersectionObserverEntry[]) => {
      const nowIn = entries[0].isIntersecting; // hero covers the viewport's vertical center
      if (nowIn === heroInView) return;
      heroInView = nowIn;
      if (nowIn) resumeMusic();
      else pauseMusic();
    };
    // Trip-line at the viewport's vertical center: collapse the observer root to a
    // zero-height line (rootMargin -50%/-50%) so "in hero" flips EXACTLY when the hero's
    // edge passes mid-screen. Gap-free — fixes music continuing while content fills the view
    // (the old [0,0.5,1] thresholds had no callback between 50%-out and fully-out).
    const heroIO = new IntersectionObserver(onHeroVisibility, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });
    if (stageRef.current) heroIO.observe(stageRef.current);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      removeInput();
      window.removeEventListener("loader:done", armNow);
      if (armTimer) clearTimeout(armTimer);
      removeGesture();
      removeContentWatch();
      document.removeEventListener("click", onNavClick, true);
      registerMusicPlayRef.current?.(null);
      heroIO.disconnect();
      killCh();
      gsap.killTweensOf(volProxy);
      gsap.killTweensOf(overlay);
      try {
        player?.destroy?.();
      } catch {}
      lockNative(false);
      lenisInstance?.start();
      setNav(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dark legibility shadow (not a light glow) so the white headline reads over the bright
  // F6 halo — invisible on the dark opening, gives glyphs a dark halo on bright frames.
  const heroGlow =
    "0 1px 3px rgba(0,0,0,0.55), 0 2px 28px rgba(0,0,0,0.55)";

  return (
    <>
      <div ref={stageRef} id="top" data-nav-theme="dark" style={{ position: "relative", width: "100%", height: "100svh", background: "#000", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ display: "block", position: "absolute", inset: 0, zIndex: 1 }} />

        {/* legibility scrim — darkens the bottom-left where the tagline sits so the white text
            reads over the bright F6 halo (the cropped mobile portrait shows the bright core right
            here); fades to transparent toward the upper-right so the art stays clear */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
            background:
              "linear-gradient(to top right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.18) 32%, rgba(0,0,0,0) 55%)",
          }}
        />

        {/* aligned to the site gutter (px-6 md:px-10 left, pb-6 md:pb-10 bottom) so the
            tagline lines up with the nav logo + content grid */}
        <div
          ref={textRef}
          className="absolute inset-x-0 bottom-0 px-6 md:px-10 pb-6 md:pb-10"
          style={{ opacity: 0, pointerEvents: "none", zIndex: 6 }}
        >
          <div style={{ maxWidth: "60rem" }}>
          <h1
            style={{
              fontFamily: "'Nyght Serif', serif",
              color: "#fff",
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              fontSize: "clamp(40px, 8.5vw, 72px)",
              textShadow: heroGlow,
              margin: 0,
            }}
          >
            I make things that
            <br />
            blow people&rsquo;s minds.
          </h1>
          <div
            style={{
              marginTop: "1.25rem",
              color: "rgba(255,255,255,0.92)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontSize: 13,
              fontWeight: 500,
              textShadow: "0 1px 14px rgba(0,0,0,0.6)",
            }}
          >
            Product Designer @ AmbitionBox (InfoEdge)
          </div>
          </div>
        </div>

        {/* hidden YouTube audio player (off-screen — same as production's GlobalAudio,
            which plays fine on mobile; playback is started by a direct gesture, not by
            the iframe being visible) */}
        <div style={{ position: "absolute", top: -9999, left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}>
          <div ref={ytRef} />
        </div>

        {/* existing mute/unmute button — absolute inside the stage so it scrolls
            away with the hero (not a sitewide sticky button) */}
        <HeroAudio positionClassName="absolute bottom-10 right-6 md:right-10 md:bottom-12" />
      </div>

      {/* cinematic cover: the climax floods to this cream, the page jumps under it,
          then it fades away → Recent Work fades in (matches the section bg → seamless) */}
      <div
        ref={coverRef}
        aria-hidden
        style={{ position: "fixed", inset: 0, zIndex: 90, background: COVER_COLOR, opacity: 0, pointerEvents: "none" }}
      />
    </>
  );
}

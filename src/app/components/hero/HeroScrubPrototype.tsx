import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGlobalContext } from "../../context/GlobalContext";
import { HeroAudio } from "./HeroAudio";
import { Mail } from "lucide-react";
import { HoverLink } from "../HoverLink";
import linkedInLogo from "../../../imports/InBug-Black.png";
import instagramLogo from "../../../imports/Instagram_Glyph_Black.svg";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
    __heroMounted?: boolean; // cosmic hero is on this route (Loader checks before waiting)
    __heroReady?: boolean; // chapter-A finished loading → Loader may reveal
    __loaderDone?: boolean; // (legacy; set by Loader — unused by the hero now)
  }
}

/**
 * HERO — ambient self-playing band (v10).
 * No takeover: the full cinematic sequence (Chapter A flight→bloom, Chapter B
 * fall→star→detonation) plays on its own and LOOPS continuously, behind a free,
 * scrollable page. The band is ~72svh so "Recent work." peeks below. Headline is
 * pinned top-left and always visible. Music autoplays (mute button in the corner)
 * and pauses when the hero scrolls out of the viewport, resuming when it returns.
 */

const SEG_A = 242; // F2→F5 flight (121) + F5→F6 bloom (121)
const SEG_B = 256; // ending = clip#2 fall→becomes-star (181) + clip#3 detonation (75)
// boundaries (0-indexed), from actual extracted frame counts
const B_FALL_END = 180; // end of clip#2 = the calm star (fall→becoming endpoint); detonation follows
const B_DETO_BURST = 210; // end of the detonation's fast initial "speed bump"; mid→end then plays steady
const REST2_N = 103; // F2 ambient (idle drift) frames — the 3s pause between loops
const REST_FPS = 12; // ambient playback rate
const REST_HOLD = 3.0; // hold the F2 ambient this long before replaying (not on the first play)

const pad = (i: number) => String(i).padStart(4, "0");

// loop pacing (pure code levers, zero credits)
const DUR_A = 5.0; // Chapter A — flight → bloom
const DUR_FALL = 8.5; // Chapter B — clip#2 fall → becomes-star
const DUR_BURST = 0.8; // detonation — fast initial speed-bump
const DUR_DETO = 2.4; // detonation — mid→end at steady pace
const XFADE = 1.5; // seam cross-dissolve: detonation end → back to the opening frame

const HERO_VANCHOR = 0.5; // vertical crop anchor in the short band (0 = top, 0.5 = centre, 1 = bottom)

const MUSIC_FADE_OUT = 2.0; // fade music out when the hero leaves the viewport
const MUSIC_FADE_IN = 1.0; // fade music in when the hero (re)enters the viewport

const MUSIC_ID = "tKaFYUKlZjY";
const MUSIC_VOL = 65;
const MUSIC_START = 60; // begin (and loop) from the 60s mark

const HERO_VH = 62; // band height (svh) — short enough that "Recent work." peeks below

// identity socials (bottom-left of the band) — same links as the case-study modal
const IG_URL = "https://www.instagram.com/anmol.maggon/";
const LI_URL = "https://www.linkedin.com/in/anmolmaggon40/";
// Same templated email as the "Let's Talk" CTA (pre-filled subject + body), so the hero
// Email icon opens the same draft instead of a blank message.
const MAIL_URL =
  "mailto:anmolmaggon40@gmail.com?subject=Let's%20chat%20about%20your%20portfolio%20%26%20work&body=Hi%20Anmol%2C%0A%0AI%20was%20just%20looking%20through%20your%20portfolio%20and%20really%20loved%20your%20work.%20I'd%20love%20to%20connect%20and%20chat%20more%20about%20what%20you're%20up%20to!%0A%0ABest%2C%0A%5BYour%20Name%5D";

// section nav — stacked top-right of the band; scrolls away with the hero
const HERO_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Toolkit", href: "#stack" },
  { label: "Principles", href: "#principles" },
  { label: "Films", href: "#off-the-clock" },
  { label: "Resume ↗", href: "https://drive.google.com/file/d/1b4gRk6FrWEbgmexVSOJjAjAtYRGk7AVJ/view?usp=sharing", external: true },
];

const heroGlow = "0 1px 3px rgba(0,0,0,0.55), 0 2px 28px rgba(0,0,0,0.55)";

export function HeroScrubPrototype() {
  // GlobalAudio is removed — the hero owns its own track; only isMuted is shared.
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
  const ytRef = useRef<HTMLDivElement>(null);

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

    const segA: HTMLImageElement[] = [];
    const segB: HTMLImageElement[] = [];
    const rest2: HTMLImageElement[] = []; // F2 ambient — cycled during the 3s pause
    const draw = { img: null as HTMLImageElement | null };
    const overlay = { arr: null as HTMLImageElement[] | null, alpha: 0 }; // seam cross-dissolve layer
    let restMode = false; // when true, the base layer cycles the F2 ambient
    const restIdx = (arr: HTMLImageElement[]) => Math.floor(performance.now() / (1000 / REST_FPS)) % arr.length;

    // ---- canvas sizing: measured to the BAND (stage), not the window ----
    let cw = 0;
    let ch = 0;
    const resize = () => {
      const el = stageRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      cw = Math.round(r.width) || el.clientWidth || window.innerWidth;
      ch = Math.round(r.height) || el.clientHeight || Math.round((window.innerHeight * HERO_VH) / 100);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // cover-fit a frame into the band (centred horizontally, anchored vertically)
    const cover = (img: HTMLImageElement | null, alpha: number) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) * HERO_VANCHOR, w, h);
      ctx.globalAlpha = 1;
    };

    // ---- render loop (base layer + a seam overlay for the loop cross-dissolve) ----
    let raf: number | null = null;
    const render = () => {
      // during the pause, the base layer cycles the F2 ambient
      if (restMode && rest2.length) {
        const im = rest2[restIdx(rest2)];
        if (im?.complete) draw.img = im;
      }
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      if (draw.img) cover(draw.img, 1);
      if (overlay.arr && overlay.arr.length && overlay.alpha > 0.001) {
        // a multi-frame overlay (the F2 ambient) keeps cycling; a single held frame doesn't
        const im = overlay.arr.length > 1 ? overlay.arr[restIdx(overlay.arr)] : overlay.arr[0];
        if (im?.complete) cover(im, overlay.alpha);
      }
      raf = requestAnimationFrame(render);
    };
    const startRender = () => {
      if (raf == null) raf = requestAnimationFrame(render);
    };
    const stopRender = () => {
      if (raf != null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const clearOverlay = () => {
      gsap.killTweensOf(overlay);
      overlay.arr = null;
      overlay.alpha = 0;
    };

    // ---- YouTube hero music (synced to global isMuted; unmuted by default) ----
    let player: any = null;
    let playerReady = false;
    let started = false;
    const volProxy = { v: 0 };
    let pendingFade = false; // fade-in waits for real playback (PLAYING) so it rises from true silence
    const fadeMusic = (to: number, dur: number, then?: () => void, ease = "power1.inOut") => {
      gsap.killTweensOf(volProxy);
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
      fadeMusic(MUSIC_VOL, 1.0, undefined, "power2.in");
    };
    const applyAudio = () => {
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
            player.playVideo();
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
        setTimeout(startFadeIn, 1500); // safety if PLAYING never fires
      } catch {}
    };
    // direct, minimal play — mobile-safe, invoked inside a real gesture (first scroll/touch/click)
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
    registerMusicPlayRef.current?.(forcePlay); // mute button can start playback directly in its click
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
            if (e?.data === S?.PLAYING) {
              startFadeIn();
              setMusicPlayingRef.current(true);
            } else if (e?.data === S?.PAUSED) {
              setMusicPlayingRef.current(false);
            }
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
    const onFirstGesture = () => forcePlay();
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

    // ---- decode-ahead (keeps the loop free of decode jank once warmed) ----
    const decodedFlags = { a: false, b: false, r: false };
    const decodeAhead = async (arr: HTMLImageElement[], count: number, key: "a" | "b" | "r") => {
      if (decodedFlags[key]) return;
      decodedFlags[key] = true;
      for (let i = 0; i < Math.min(count, arr.length); i++) {
        try {
          await arr[i]?.decode?.();
        } catch {}
      }
    };
    // UNguarded re-decode — the browser can evict decoded bitmaps for frames not painted for a
    // while (e.g. Chapter A's frames during the B + rest stretch). Re-warming them in an idle
    // window keeps the *next* playback smooth instead of decoding on the fly (the "lag").
    const warmDecode = async (arr: HTMLImageElement[], count: number) => {
      for (let i = 0; i < Math.min(count, arr.length); i++) {
        try {
          await arr[i]?.decode?.();
        } catch {}
      }
    };

    const drawSeg = (seg: HTMLImageElement[], last: number, i: number) => {
      const img = seg[Math.max(0, Math.min(last, Math.round(i)))];
      // only swap to a frame that's actually loaded — otherwise HOLD the last good frame
      // (never flash black while a frame is still streaming/decoding).
      if (img && img.complete && img.naturalWidth) draw.img = img;
    };

    // ---- the continuous loop: Chapter A → Chapter B → cross-dissolve back to the start ----
    let loopTl: gsap.core.Timeline | null = null;
    const startLoop = () => {
      if (loopTl || reduce) return;
      decodeAhead(segA, SEG_A, "a");
      gsap.delayedCall(DUR_A, () => decodeAhead(segB, SEG_B, "b")); // overlap Chapter A
      gsap.delayedCall(DUR_A + DUR_FALL, () => decodeAhead(rest2, REST2_N, "r")); // before the first pause

      const lastA = SEG_A - 1;
      const lastB = SEG_B - 1;
      const pa = { i: 0 };
      const pb = { i: 0 };

      // each iteration = Chapter A → Chapter B → 3s F2-ambient pause. Because the pause is at
      // the END, the FIRST play runs straight through; every later replay rests first.
      const tl = gsap.timeline({ repeat: -1 });

      // Chapter A — flight → bloom. PRODUCTION behavior: when coming out of the F2 rest, the
      // moving ambient keeps playing and cross-fades OUT over the start of the flight (segA
      // underneath) — never a hard cut from ambient → frame 0. (Matches the old
      // `startFadeOverlay(rest2, 1, 0, XFADE)` + `draw.img = segA[0]`.)
      tl.call(() => {
        if (restMode && rest2.length) {
          overlay.arr = rest2; // outgoing ambient, still moving, now on the overlay layer
          overlay.alpha = 1;
          gsap.killTweensOf(overlay);
          gsap.to(overlay, { alpha: 0, duration: XFADE, ease: "power1.inOut", onComplete: () => clearOverlay() });
        } else {
          clearOverlay();
        }
        restMode = false; // base is Chapter A from here on
        draw.img = segA[0];
        warmDecode(segB, mobile ? 90 : SEG_B); // prep Chapter B while A plays (5s window)
      });
      tl.set(pa, { i: 0 });
      tl.to(pa, {
        i: lastA,
        duration: DUR_A,
        ease: "power2.inOut",
        onUpdate: () => drawSeg(segA, lastA, pa.i),
      });

      // Chapter B — fall → star → detonation (one continuous motion, three beats)
      tl.set(pb, { i: 0 });
      tl.to(pb, { i: B_FALL_END, duration: DUR_FALL, ease: "none", onUpdate: () => drawSeg(segB, lastB, pb.i) });
      tl.to(pb, { i: B_DETO_BURST, duration: DUR_BURST, ease: "none", onUpdate: () => drawSeg(segB, lastB, pb.i) });
      tl.to(pb, { i: lastB, duration: DUR_DETO, ease: "none", onUpdate: () => drawSeg(segB, lastB, pb.i) });

      // Pause — cross-dissolve the bright detonation into the calm F2 ambient, then hold it.
      // (F2 == segA[0], so the next iteration's Chapter A picks up seamlessly.)
      tl.call(() => {
        warmDecode(segA, mobile ? 120 : SEG_A); // prep the replay during the 3s rest → smooth restart
        overlay.arr = rest2.length ? rest2 : [segA[0]];
        overlay.alpha = 0;
        gsap.killTweensOf(overlay);
        gsap.to(overlay, {
          alpha: 1,
          duration: XFADE,
          ease: "power1.inOut",
          onComplete: () => {
            restMode = rest2.length > 0; // base now cycles the ambient
            clearOverlay();
          },
        });
      });
      tl.to({}, { duration: XFADE }); // hold the timeline open while the dissolve runs
      tl.to({}, { duration: REST_HOLD }); // ...then rest at the F2 ambient

      loopTl = tl;
    };

    // ---- preload ----
    // Chapter-A readiness → tells the Loader it can reveal. Chapter B streams behind the loop.
    let readyCount = 0;
    const readyTarget = SEG_A;
    const signalReady = () => {
      if (window.__heroReady) return;
      window.__heroReady = true;
      window.dispatchEvent(new Event("hero:ready"));
      startLoop(); // start the loop as Chapter A frames are ready (runs live as the loader fades)
    };
    const bumpReady = () => {
      if (++readyCount >= readyTarget) signalReady();
    };
    let started2 = false;
    const tryStart = () => {
      if (started2) return;
      if (segA[0]?.complete) {
        started2 = true;
        draw.img = segA[0];
        resize();
        startRender();
        if (reduce) signalReady(); // reduced motion: the static poster is enough → reveal now
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
    // Kick the music off NOW (while the loader is still up): the autoplay attempt + first-gesture
    // listener go live immediately, so the fade-in swells under the loader for allowed/returning
    // visitors. (New visitors start it on first interaction.)
    if (!reduce) {
      ensureYT();
      addGesture();
    }

    load(segA, SEG_A, aPath, 16, true); // Chapter A gates the loader
    load(segB, SEG_B, bPath, 16, false); // ending streams in the background
    load(rest2, REST2_N, r2Path, 4, false); // F2 ambient streams in before the first pause (~18s in)

    resize();
    const ro = new ResizeObserver(() => resize());
    if (stageRef.current) ro.observe(stageRef.current);

    // ---- music follows hero visibility: play while on screen, pause when scrolled away ----
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
    let heroInView = true; // starts in view; initial play handled by doPlay/forcePlay
    const onHeroVisibility = (entries: IntersectionObserverEntry[]) => {
      const nowIn = entries[0].isIntersecting; // flips when the hero edge passes mid-screen
      if (nowIn === heroInView) return;
      heroInView = nowIn;
      if (nowIn) resumeMusic();
      else pauseMusic();
    };
    // Trip-line at the viewport's vertical centre (rootMargin -50%/-50%) — "in hero" flips
    // EXACTLY when the hero's edge crosses mid-screen.
    const heroIO = new IntersectionObserver(onHeroVisibility, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });
    if (stageRef.current) heroIO.observe(stageRef.current);

    // ---- pause the loop + rAF entirely when the band is fully off-screen (battery) ----
    const onRenderVisibility = (entries: IntersectionObserverEntry[]) => {
      const visible = entries[0].isIntersecting;
      if (visible) {
        loopTl?.resume();
        startRender();
      } else {
        loopTl?.pause();
        stopRender();
      }
    };
    const renderIO = new IntersectionObserver(onRenderVisibility, { threshold: 0 });
    if (stageRef.current) renderIO.observe(stageRef.current);

    return () => {
      stopRender();
      ro.disconnect();
      heroIO.disconnect();
      renderIO.disconnect();
      removeGesture();
      registerMusicPlayRef.current?.(null);
      loopTl?.kill();
      gsap.killTweensOf(volProxy);
      gsap.killTweensOf(overlay);
      try {
        player?.destroy?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scrim darkens the top strip (headline + nav links) and the bottom strip (name),
  // leaving the art bright through the middle so the white type always reads.
  const scrimBg =
    "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.6) 100%)";

  const headlineStyle = {
    fontFamily: "'Nyght Serif', serif",
    color: "#fff",
    fontWeight: 400,
    lineHeight: 1.0,
    letterSpacing: "-0.03em",
    // font-size lives in className so it can track the case-study titles per-breakpoint:
    // mobile = clamp(30px,8vw,52px) (the mobile card title), md+ = clamp(36px,6vw,96px) (the desktop card title).
    textShadow: heroGlow,
    margin: 0,
  } as const;
  const roleStyle = {
    color: "rgba(255,255,255,0.92)",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontSize: 14,
    fontWeight: 500,
    textShadow: "0 1px 14px rgba(0,0,0,0.6)",
  } as const;
  const headlineEl = (
    <h1 className="text-[clamp(30px,8vw,52px)] md:text-[clamp(36px,6vw,96px)]" style={headlineStyle}>
      I make things that
      <br />
      blow people&rsquo;s minds.
    </h1>
  );
  const roleEl = (extra: React.CSSProperties = {}) => (
    <div style={{ ...roleStyle, ...extra }}>Product Designer @ AmbitionBox (InfoEdge)</div>
  );

  return (
    <div
      ref={stageRef}
      id="top"
      data-nav-theme="dark"
      style={{ position: "relative", width: "100%", height: `${HERO_VH}svh`, background: "#000", overflow: "hidden" }}
    >
      <canvas ref={canvasRef} style={{ display: "block", position: "absolute", inset: 0, zIndex: 1 }} />

      {/* legibility scrim — darkens the top + bottom strips */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", background: scrimBg }} />

      {/* headline — top-left on all breakpoints */}
      <div className="absolute inset-x-0 top-0 px-6 md:px-10 pt-6 md:pt-8" style={{ pointerEvents: "none", zIndex: 6 }}>
        <div style={{ maxWidth: "60rem" }}>{headlineEl}</div>
      </div>

      {/* section nav — stacked top-right, scrolls away WITH the hero (not sticky) */}
      <nav
        className="hidden md:flex flex-col items-end gap-2 text-right absolute right-6 md:right-10 top-6 md:top-8 font-sans font-medium tracking-tight text-white"
        style={{ fontSize: "clamp(38px, 2.8vw, 40px)", textShadow: "0 1px 16px rgba(0,0,0,0.65)", zIndex: 6 }}
      >
        {HERO_LINKS.map((l) => (
          <HoverLink
            key={l.label}
            href={l.href}
            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {l.label}
          </HoverLink>
        ))}
      </nav>

      {/* mobile hamburger — lives INSIDE the hero so it scrolls away with the hero (not pinned);
          opens the Nav drawer via an event. The Nav's own hamburger takes over once scrolled past. */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => window.dispatchEvent(new Event("hero:open-menu"))}
        className="md:hidden absolute right-6 top-6 flex h-10 w-10 items-center justify-center text-white"
        style={{ zIndex: 6, filter: "drop-shadow(0 1px 14px rgba(0,0,0,0.6))" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* BOTTOM slot — desktop: name + socials + full role; mobile: the tagline (punchline) */}
      <div className="absolute inset-x-0 bottom-0 px-6 md:px-10 pb-6 md:pb-10" style={{ zIndex: 6 }}>
        {/* desktop: name + socials + role */}
        <div className="hidden md:block">
          <div className="flex items-center gap-4">
            <span
              className="italic font-[Nyght_Serif] font-medium text-white"
              style={{ fontSize: "clamp(32px, 3vw, 42px)", lineHeight: 1, textShadow: "0 1px 16px rgba(0,0,0,0.6)" }}
            >
              Anmol Maggon
            </span>
            {/* same social glyphs + links as the case-study modal, inverted white for the dark band.
                text-white → the HoverLink underline (after:bg-current) reads white on hover.
                translateY(5px) drops the icons onto the wordmark's optical centre — geometric flex
                centring leaves them sitting high against the caps, above the lowercase body. */}
            <div className="flex items-center gap-4 text-white" style={{ transform: "translateY(5px)" }}>
              <HoverLink href={LI_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white">
                <img
                  src={linkedInLogo}
                  alt="LinkedIn"
                  className="w-[22px] h-[22px] object-contain"
                  style={{ filter: "brightness(0) invert(1) drop-shadow(0 1px 8px rgba(0,0,0,0.6))" }}
                />
              </HoverLink>
              <HoverLink href={IG_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white">
                <img
                  src={instagramLogo}
                  alt="Instagram"
                  className="w-[22px] h-[22px] object-contain"
                  style={{ filter: "brightness(0) invert(1) drop-shadow(0 1px 8px rgba(0,0,0,0.6))" }}
                />
              </HoverLink>
              <HoverLink href={MAIL_URL} aria-label="Email" className="text-white">
                <Mail size={24} strokeWidth={1.8} style={{ filter: "drop-shadow(0 1px 8px rgba(0,0,0,0.6))" }} />
              </HoverLink>
            </div>
          </div>
          {roleEl({ marginTop: "0.55rem" })}
        </div>
        {/* mobile: compact name + role (no socials) */}
        <div className="md:hidden">
          <span
            className="italic font-[Nyght_Serif] font-medium text-white"
            style={{ fontSize: "26px", lineHeight: 1, textShadow: "0 1px 16px rgba(0,0,0,0.6)" }}
          >
            Anmol Maggon
          </span>
          <div style={{ ...roleStyle, fontSize: 12, letterSpacing: "0.12em", marginTop: "0.4rem" }}>
            Product Designer
          </div>
        </div>
      </div>

      {/* hidden YouTube audio player (off-screen — playback started by a direct gesture) */}
      <div style={{ position: "absolute", top: -9999, left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}>
        <div ref={ytRef} />
      </div>

      {/* mute/unmute button — bottom-right; inside the stage so it scrolls away with the hero */}
      <HeroAudio positionClassName="absolute bottom-6 right-6 md:right-10 md:bottom-8" />
    </div>
  );
}

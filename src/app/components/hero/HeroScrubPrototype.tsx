import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGlobalContext } from "../../context/GlobalContext";
import { HeroAudio } from "./HeroAudio";
import { Mail } from "lucide-react";
import { HoverLink } from "../HoverLink";
import linkedInLogo from "../../../imports/InBug-Black.png";
import instagramLogo from "../../../imports/Instagram_Glyph_Black.svg";
import { LETS_TALK_MAILTO } from "../../data/contact";

declare global {
  interface Window {
    __heroMounted?: boolean;
    __heroReady?: boolean;
    __loaderDone?: boolean;
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

const HERO_VH = 62;
const MUSIC_ID = "tKaFYUKlZjY";
const MUSIC_VOL = 100;
const MUSIC_START = 50; // starts at 50s mark

const IG_URL = "https://www.instagram.com/anmol.maggon/";
const LI_URL = "https://www.linkedin.com/in/anmolmaggon40/";
const MAIL_URL = LETS_TALK_MAILTO;

const HERO_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Toolkit", href: "#stack" },
  { label: "Principles", href: "#principles" },
  { label: "Films", href: "#off-the-clock" },
  { label: "Resume ↗", href: "https://drive.google.com/file/d/1b4gRk6FrWEbgmexVSOJjAjAtYRGk7AVJ/view?usp=sharing", external: true },
];

const heroGlow = "0 1px 3px rgba(0,0,0,0.55), 0 2px 28px rgba(0,0,0,0.55)";

export function HeroScrubPrototype() {
  const { isMuted, setMusicPlaying, setAudioLoading, registerMusicPlay } = useGlobalContext();
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const setMusicPlayingRef = useRef(setMusicPlaying);
  setMusicPlayingRef.current = setMusicPlaying;
  
  const setAudioLoadingRef = useRef(setAudioLoading);
  setAudioLoadingRef.current = setAudioLoading;
  
  const registerMusicPlayRef = useRef(registerMusicPlay);
  registerMusicPlayRef.current = registerMusicPlay;
  
  const applyAudioRef = useRef<() => void>(() => {});

  const stageRef = useRef<HTMLDivElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const activeVidRef = useRef<'A' | 'B'>('A');
  const ytRef = useRef<HTMLDivElement>(null);

  // keep the hero track's mute in sync with the global mute button
  useEffect(() => {
    applyAudioRef.current();
  }, [isMuted]);

  useEffect(() => {
    window.__heroMounted = true;
    const vidA = videoARef.current;
    const vidB = videoBRef.current;
    if (!vidA || !vidB) return;

    // --- Loading & Readiness (Video handles visuals) ---
    const signalReady = () => {
      if (window.__heroReady) return;
      window.__heroReady = true;
      window.dispatchEvent(new Event("hero:ready"));
    };

    const onTimeUpdate = () => {
      if (vidA.currentTime > 0.15) {
        setIsVideoLoading(false); // Only fade out when video ACTUALLY plays
        signalReady();
        vidA.removeEventListener("timeupdate", onTimeUpdate);
      }
    };
    vidA.addEventListener("timeupdate", onTimeUpdate);
    
    // Safety timeout
    const fallbackTimeout = setTimeout(signalReady, 2500);

    // --- DOUBLE BUFFER LOOP LOGIC ---
    let rafId: number;
    const overlap = 0.8; // length of crossfade in seconds
    const skipTime = 1.0; // skip the slow start on loops to remove the "stuck" feeling

    const updateLoop = () => {
      const active = activeVidRef.current === 'A' ? vidA : vidB;
      const inactive = activeVidRef.current === 'A' ? vidB : vidA;

      if (active.duration && active.currentTime >= active.duration - overlap) {
        if (inactive.paused) {
          inactive.currentTime = skipTime;
          inactive.play().catch(() => {});
        }
        
        let progress = (active.currentTime - (active.duration - overlap)) / overlap;
        progress = Math.max(0, Math.min(1, progress));

        active.style.opacity = (1 - progress).toString();
        inactive.style.opacity = progress.toString();

        if (progress >= 1 || active.ended) {
          active.pause();
          active.style.opacity = '0';
          inactive.style.opacity = '1';
          activeVidRef.current = activeVidRef.current === 'A' ? 'B' : 'A';
        }
      }

      rafId = requestAnimationFrame(updateLoop);
    };
    rafId = requestAnimationFrame(updateLoop);

    // --- Audio Control (YouTube handles audio) ---
    let player: any = null;
    let playerReady = false;
    let started = false;
    let heroInView = true;
    let pendingFade = false;

    const volProxy = { v: 0 };
    const fadeAudio = (to: number, dur: number) => {
      if (!player) return;
      gsap.killTweensOf(volProxy);
      gsap.to(volProxy, {
        v: to,
        duration: dur,
        onUpdate: () => {
          try { player.setVolume(volProxy.v); } catch {}
        }
      });
    };

    const applyAudio = () => {
      if (!player || !playerReady) return;
      try {
        if (isMutedRef.current) {
          player.mute();
          fadeAudio(0, 0.5);
        } else {
          player.unMute();
          fadeAudio(MUSIC_VOL, 1.0);
        }
      } catch {}
    };

    const applyAudioFaded = () => {
      if (!player || !playerReady) return;
      try {
        if (isMutedRef.current) {
          fadeAudio(0, 0.5);
          setTimeout(() => {
            try { if (isMutedRef.current) player.mute(); } catch {}
          }, 500);
        } else {
          player.unMute();
          fadeAudio(MUSIC_VOL, 1.0);
        }
      } catch {}
    };
    
    applyAudioRef.current = applyAudioFaded;

    const startFadeIn = () => {
      if (!pendingFade || isMutedRef.current) return;
      pendingFade = false;
      player.setVolume(0);
      volProxy.v = 0;
      fadeAudio(MUSIC_VOL, 2.0);
    };

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
            doPlay();
          },
          onStateChange: (e: any) => {
            const S = window.YT?.PlayerState;
            if (e?.data === S?.BUFFERING) {
              setAudioLoadingRef.current(true);
            } else if (e?.data === S?.PLAYING) {
              startFadeIn();
              setMusicPlayingRef.current(true);
              setAudioLoadingRef.current(false);
            } else if (e?.data === S?.PAUSED) {
              setMusicPlayingRef.current(false);
              setAudioLoadingRef.current(false);
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

    ensureYT();
    addGesture();

    const onHeroVisibility = (entries: IntersectionObserverEntry[]) => {
      const nowIn = entries[0].isIntersecting;
      if (nowIn === heroInView) return;
      heroInView = nowIn;
      
      if (nowIn) {
        const active = activeVidRef.current === 'A' ? vidA : vidB;
        active.play().catch(() => {});
        if (!isMutedRef.current && player && playerReady) {
          try {
            player.unMute();
            player.playVideo();
            fadeAudio(MUSIC_VOL, 1.0);
          } catch {}
        }
      } else {
        vidA.pause();
        vidB.pause();
        if (player && playerReady) {
          fadeAudio(0, 2.0);
          setTimeout(() => {
            try { player.pauseVideo(); } catch {}
          }, 2000);
        }
      }
    };

    const heroIO = new IntersectionObserver(onHeroVisibility, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });
    if (stageRef.current) heroIO.observe(stageRef.current);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(fallbackTimeout);
      heroIO.disconnect();
      vidA.removeEventListener("timeupdate", onTimeUpdate);
      removeGesture();
      registerMusicPlayRef.current?.(null);
      if (player) {
        try { player.destroy(); } catch {}
      }
    };
  }, []);

  const headlineStyle = {
    fontFamily: "'Nyght Serif', serif",
    color: "#fff",
    fontWeight: 400,
    letterSpacing: "-0.03em",
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
    <h1 className="text-fluid-h1 leading-tight md:leading-display" style={headlineStyle}>
      I make{" "}
      <br className="md:hidden" />
      things that{" "}
      <br className="hidden md:block" />
      blow{" "}
      <br className="md:hidden" />
      people&rsquo;s minds.
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
      <video
        ref={videoARef}
        autoPlay
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 50%",
          zIndex: 1,
          opacity: 1,
          transition: "none",
        }}
      >
        <source src="/hero-loop-mobile.webm" type="video/webm" media="(max-width: 768px)" />
        <source src="/hero-loop-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
        <source src="/hero-loop.webm" type="video/webm" />
        <source src="/hero-loop.mp4" type="video/mp4" />
      </video>

      <video
        ref={videoBRef}
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 50%",
          zIndex: 2,
          opacity: 0,
          transition: "none",
        }}
      >
        <source src="/hero-loop-mobile.webm" type="video/webm" media="(max-width: 768px)" />
        <source src="/hero-loop-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
        <source src="/hero-loop.webm" type="video/webm" />
        <source src="/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* Video Loader (Option A) */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
          pointerEvents: "none",
          opacity: isVideoLoading ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <div 
          style={{
            width: "32px",
            height: "32px",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            borderTopColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            animation: "heroVidSpinner 0.8s linear infinite",
          }}
        />
        <style>{`
          @keyframes heroVidSpinner {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      <div className="absolute inset-x-0 top-0 px-gutter md:px-gutter-lg pt-6 md:pt-8" style={{ pointerEvents: "none", zIndex: 6 }}>
        <div className="pr-14 md:pr-0" style={{ maxWidth: "60rem" }}>{headlineEl}</div>
      </div>

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

      <div className="absolute inset-x-0 bottom-0 px-gutter md:px-gutter-lg pb-6 md:pb-10" style={{ zIndex: 6 }}>
        <div className="hidden md:block">
          <div className="flex items-center gap-4">
            <span
              className="italic font-[Nyght_Serif] font-medium text-white"
              style={{ fontSize: "clamp(32px, 3vw, 42px)", lineHeight: 1, textShadow: "0 1px 16px rgba(0,0,0,0.6)" }}
            >
              Anmol Maggon
            </span>
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

      <div style={{ position: "absolute", top: -9999, left: -9999, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}>
        <div ref={ytRef} />
      </div>

      <HeroAudio positionClassName="absolute bottom-6 right-6 md:right-10 md:bottom-8" />
    </div>
  );
}

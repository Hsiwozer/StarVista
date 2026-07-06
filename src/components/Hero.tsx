import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

const explorationPath = [
  {
    id: "01",
    title: "地球夜空",
    destination: "Observer’s Manual",
    sectionId: "guide",
    text: "从熟悉的黑夜出发，辨认第一颗安静的亮星。",
  },
  {
    id: "02",
    title: "月球与行星",
    destination: "Deep Space Gallery",
    sectionId: "gallery",
    targetId: "gallery-moon",
    text: "近处的光，有山脉、环带与缓慢移动的轨道。",
  },
  {
    id: "03",
    title: "星云与恒星诞生",
    destination: "Deep Space Gallery",
    sectionId: "gallery",
    targetId: "gallery-nebula",
    text: "尘埃发光，年轻恒星在深处点亮第一束风。",
  },
  {
    id: "04",
    title: "星系与深空",
    destination: "Cosmic Archives",
    sectionId: "articles",
    text: "光年之外，旋臂把时间整理成巨大的档案。",
  },
  {
    id: "05",
    title: "黑洞与未知宇宙",
    destination: "Deep Space Gallery",
    sectionId: "gallery",
    targetId: "gallery-black-hole",
    text: "在看不见的边界，宇宙保留最后的沉默。",
  },
];

type HeroParallaxStyle = CSSProperties & Record<`--${string}`, string>;
type HeroTitleParticleColor = "white" | "blue" | "purple";

interface HeroTitleParticle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  delay: number;
  color: HeroTitleParticleColor;
}

type TitleParticleStyle = CSSProperties & Record<`--${string}`, string>;

const heroParallaxStyle: HeroParallaxStyle = {
  "--hero-nebula-x": "0px",
  "--hero-nebula-y": "0px",
  "--hero-dust-x": "0px",
  "--hero-dust-y": "0px",
  "--hero-far-y": "0px",
  "--hero-mid-y": "0px",
  "--hero-near-x": "0px",
  "--hero-near-y": "0px",
  "--hero-title-depth-y": "0px",
  "--hero-title-depth-scale": "1",
  "--hero-title-depth-opacity": "1",
  "--hero-title-depth-blur": "0px",
  "--hero-curtain-opacity": "0",
  "--hero-depth-status-opacity": "0",
  "--archive-depth-opacity": "0.18",
  "--archive-depth-brightness": "0.76",
  "--archive-depth-y": "2rem",
};

const heroTitleParticles: HeroTitleParticle[] = [
  { id: 1, x: 8, y: 18, dx: -16, dy: -12, size: 1, delay: 0, color: "white" },
  { id: 2, x: 18, y: 8, dx: -10, dy: -20, size: 1.5, delay: 80, color: "blue" },
  { id: 3, x: 31, y: 14, dx: 6, dy: -18, size: 1, delay: 150, color: "purple" },
  { id: 4, x: 48, y: 9, dx: 12, dy: -16, size: 1, delay: 40, color: "white" },
  { id: 5, x: 65, y: 16, dx: 18, dy: -10, size: 1.5, delay: 120, color: "blue" },
  { id: 6, x: 82, y: 28, dx: 22, dy: -4, size: 1, delay: 210, color: "white" },
  { id: 7, x: 92, y: 46, dx: 18, dy: 10, size: 1.5, delay: 70, color: "purple" },
  { id: 8, x: 74, y: 58, dx: 14, dy: 18, size: 1, delay: 180, color: "blue" },
  { id: 9, x: 56, y: 51, dx: 8, dy: 22, size: 2, delay: 20, color: "white" },
  { id: 10, x: 38, y: 60, dx: -6, dy: 20, size: 1, delay: 110, color: "purple" },
  { id: 11, x: 19, y: 52, dx: -18, dy: 12, size: 1.5, delay: 240, color: "blue" },
  { id: 12, x: 5, y: 42, dx: -22, dy: 4, size: 1, delay: 160, color: "white" },
  { id: 13, x: 13, y: 72, dx: -12, dy: 18, size: 1, delay: 260, color: "purple" },
  { id: 14, x: 29, y: 82, dx: -4, dy: 24, size: 1.5, delay: 60, color: "white" },
  { id: 15, x: 47, y: 78, dx: 6, dy: 26, size: 1, delay: 200, color: "blue" },
  { id: 16, x: 63, y: 84, dx: 14, dy: 22, size: 1.5, delay: 140, color: "purple" },
  { id: 17, x: 79, y: 76, dx: 20, dy: 16, size: 1, delay: 300, color: "white" },
  { id: 18, x: 90, y: 64, dx: 24, dy: 8, size: 1, delay: 90, color: "blue" },
];

function signalGalleryTarget(targetId?: string) {
  if (!targetId) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("star-archive:gallery-target", { detail: { targetId } }),
  );
}

function scrollToSection(id: string, targetId?: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  signalGalleryTarget(targetId);
}

function scrollToSectionSlowly(id: string) {
  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target.scrollIntoView({ behavior: "auto" });
    return;
  }

  const startY = window.scrollY;
  const scrollMarginTop = Number.parseFloat(
    window.getComputedStyle(target).scrollMarginTop,
  );
  const maxScrollY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const targetY = Math.min(
    maxScrollY,
    Math.max(
      0,
      target.getBoundingClientRect().top +
        startY -
        (Number.isFinite(scrollMarginTop) ? scrollMarginTop : 0),
    ),
  );
  const distance = targetY - startY;

  if (Math.abs(distance) < 1) {
    return;
  }

  const duration = 600;
  const startTime = window.performance.now();
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  let frameId = 0;
  let cancelled = false;

  const cleanup = () => {
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    window.removeEventListener("wheel", cancelScroll);
    window.removeEventListener("touchstart", cancelScroll);
    window.removeEventListener("keydown", cancelScroll);
  };

  const cancelScroll = () => {
    cancelled = true;
    window.cancelAnimationFrame(frameId);
    cleanup();
  };

  const animateScroll = (currentTime: number) => {
    if (cancelled) {
      return;
    }

    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      frameId = window.requestAnimationFrame(animateScroll);
      return;
    }

    cleanup();
  };

  document.documentElement.style.scrollBehavior = "auto";
  window.addEventListener("wheel", cancelScroll, { passive: true, once: true });
  window.addEventListener("touchstart", cancelScroll, {
    passive: true,
    once: true,
  });
  window.addEventListener("keydown", cancelScroll, { once: true });
  frameId = window.requestAnimationFrame(animateScroll);
}

interface HeroProps {
  ready: boolean;
}

export function Hero({ ready }: HeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const parallaxFrameRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const accessTimerRef = useRef<number | null>(null);
  const [settled, setSettled] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);

  const setHeroParallax = useCallback(
    (nebulaX: string, nebulaY: string, dustX: string, dustY: string) => {
      const hero = heroRef.current;

      if (!hero) {
        return;
      }

      hero.style.setProperty("--hero-nebula-x", nebulaX);
      hero.style.setProperty("--hero-nebula-y", nebulaY);
      hero.style.setProperty("--hero-dust-x", dustX);
      hero.style.setProperty("--hero-dust-y", dustY);
    },
    [],
  );

  const handleHeroMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      if (
        typeof window === "undefined" ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

      if (parallaxFrameRef.current !== null) {
        window.cancelAnimationFrame(parallaxFrameRef.current);
      }

      parallaxFrameRef.current = window.requestAnimationFrame(() => {
        setHeroParallax(
          `${offsetX * -10}px`,
          `${offsetY * -8}px`,
          `${offsetX * 12}px`,
          `${offsetY * 10}px`,
        );
        parallaxFrameRef.current = null;
      });
    },
    [setHeroParallax],
  );

  const handleHeroMouseLeave = useCallback(() => {
    if (parallaxFrameRef.current !== null) {
      window.cancelAnimationFrame(parallaxFrameRef.current);
      parallaxFrameRef.current = null;
    }

    setHeroParallax("0px", "0px", "0px", "0px");
  }, [setHeroParallax]);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const updateHeroDepth = () => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / viewportHeight, 0), 1);
      const compactMotion = window.matchMedia("(max-width: 767px)").matches;

      if (reducedMotion) {
        hero.style.setProperty("--hero-title-depth-y", "0px");
        hero.style.setProperty("--hero-title-depth-scale", "1");
        hero.style.setProperty("--hero-title-depth-opacity", "1");
        hero.style.setProperty("--hero-title-depth-blur", "0px");
        hero.style.setProperty("--hero-far-y", "0px");
        hero.style.setProperty("--hero-mid-y", "0px");
        hero.style.setProperty("--hero-near-x", "0px");
        hero.style.setProperty("--hero-near-y", "0px");
        hero.style.setProperty("--hero-curtain-opacity", "0");
        hero.style.setProperty("--hero-depth-status-opacity", "0");
        hero.style.setProperty("--archive-depth-opacity", "1");
        hero.style.setProperty("--archive-depth-brightness", "1");
        hero.style.setProperty("--archive-depth-y", "0px");
        return;
      }

      const titleTravel = compactMotion ? 44 : 72;
      const titleScaleLoss = compactMotion ? 0.04 : 0.075;
      const titleOpacityLoss = compactMotion ? 0.54 : 0.7;
      const titleBlur = compactMotion ? 2.4 : 5.2;
      const curtainOpacity =
        progress < 0.25
          ? 0
          : progress < 0.55
            ? ((progress - 0.25) / 0.3) * 0.46
            : progress < 0.82
              ? ((0.82 - progress) / 0.27) * 0.46
              : 0;
      const statusOpacity =
        progress < 0.18
          ? 0
          : progress < 0.48
            ? ((progress - 0.18) / 0.3) * 0.62
            : progress < 0.78
              ? ((0.78 - progress) / 0.3) * 0.62
              : 0;
      const archiveProgress = Math.min(
        Math.max((progress - 0.42) / 0.48, 0),
        1,
      );

      hero.style.setProperty(
        "--hero-title-depth-y",
        `${-progress * titleTravel}px`,
      );
      hero.style.setProperty(
        "--hero-title-depth-scale",
        `${1 - progress * titleScaleLoss}`,
      );
      hero.style.setProperty(
        "--hero-title-depth-opacity",
        `${1 - progress * titleOpacityLoss}`,
      );
      hero.style.setProperty(
        "--hero-title-depth-blur",
        `${progress * titleBlur}px`,
      );
      hero.style.setProperty(
        "--hero-far-y",
        `${-progress * (compactMotion ? 2 : 8)}px`,
      );
      hero.style.setProperty(
        "--hero-mid-y",
        `${-progress * (compactMotion ? 7 : 18)}px`,
      );
      hero.style.setProperty(
        "--hero-near-x",
        `${progress * (compactMotion ? 2 : 8)}px`,
      );
      hero.style.setProperty(
        "--hero-near-y",
        `${-progress * (compactMotion ? 12 : 34)}px`,
      );
      hero.style.setProperty(
        "--hero-curtain-opacity",
        `${Math.max(curtainOpacity, 0)}`,
      );
      hero.style.setProperty(
        "--hero-depth-status-opacity",
        `${Math.max(statusOpacity, 0)}`,
      );
      hero.style.setProperty(
        "--archive-depth-opacity",
        `${0.18 + archiveProgress * 0.82}`,
      );
      hero.style.setProperty(
        "--archive-depth-brightness",
        `${0.76 + archiveProgress * 0.24}`,
      );
      hero.style.setProperty(
        "--archive-depth-y",
        `${(1 - archiveProgress) * (compactMotion ? 18 : 32)}px`,
      );
    };

    const scheduleHeroDepth = () => {
      if (scrollFrameRef.current !== null) {
        return;
      }

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        updateHeroDepth();
        scrollFrameRef.current = null;
      });
    };

    updateHeroDepth();
    window.addEventListener("scroll", scheduleHeroDepth, { passive: true });
    window.addEventListener("resize", scheduleHeroDepth);

    return () => {
      window.removeEventListener("scroll", scheduleHeroDepth);
      window.removeEventListener("resize", scheduleHeroDepth);

      if (parallaxFrameRef.current !== null) {
        window.cancelAnimationFrame(parallaxFrameRef.current);
      }

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }

      if (accessTimerRef.current !== null) {
        window.clearTimeout(accessTimerRef.current);
      }
    };
  }, []);

  const handleArchiveAwaken = useCallback(() => {
    setIsAccessing(true);

    if (accessTimerRef.current !== null) {
      window.clearTimeout(accessTimerRef.current);
    }

    accessTimerRef.current = window.setTimeout(() => {
      setIsAccessing(false);
      accessTimerRef.current = null;
    }, 1400);

    scrollToSectionSlowly("archive-path");
  }, []);

  useEffect(() => {
    if (!ready) {
      setSettled(false);
      return;
    }

    const settleTimer = window.setTimeout(() => setSettled(true), 2900);
    return () => window.clearTimeout(settleTimer);
  }, [ready]);

  return (
    <section
      id="home"
      ref={heroRef}
      className={`hero-shell ${ready ? "hero-awake" : "hero-enter"} ${settled ? "hero-settled" : ""} relative overflow-hidden bg-space-950`}
      aria-label="星空档案馆首页"
      style={heroParallaxStyle}
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
    >
      <div className="hero-background-layer absolute inset-0 min-h-screen overflow-hidden">
        <img
          src="/images/hero-nebula.png"
          alt="紫蓝色星云与深夜星空"
          className="hero-nebula-image h-full w-full object-cover"
        />
        <div className="hero-stardust hero-stardust-a" aria-hidden="true" />
        <div className="hero-stardust hero-stardust-b" aria-hidden="true" />
        <div className="hero-meteor" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_20%,rgba(141,109,255,0.10),transparent_26rem),linear-gradient(90deg,rgba(2,3,10,0.92)_0%,rgba(2,3,10,0.64)_48%,rgba(2,3,10,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,10,0.18)_0%,rgba(2,3,10,0.24)_58%,rgba(2,3,10,0.76)_84%,#02030a_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 pb-24 pt-28 sm:pb-28 md:px-8 md:pt-32">
        <div className="w-full max-w-3xl">
          <p className="hero-enter-kicker mb-5 text-[0.68rem] uppercase tracking-[0.42em] text-galaxy-400/80 sm:text-xs sm:tracking-[0.48em]">
            Cosmic Signal Archive
          </p>
          <div className="hero-depth-title">
            <h1 className="hero-title hero-enter-title font-display text-6xl font-medium leading-[0.94] text-starlight sm:text-7xl md:text-8xl lg:text-9xl">
              <span className="hero-title-line">星空档案馆</span>
              <span className="hero-title-line hero-title-line-secondary mt-3 block text-5xl text-white/84 sm:text-6xl md:text-7xl lg:text-8xl">
                Star Archive
              </span>
              <span className="hero-title-stars" aria-hidden="true">
                {heroTitleParticles.map((particle) => {
                  const style: TitleParticleStyle = {
                    "--star-x": `${particle.x}%`,
                    "--star-y": `${particle.y}%`,
                    "--star-dx": `${particle.dx}px`,
                    "--star-dy": `${particle.dy}px`,
                    "--star-mid-x": `${particle.dx * 0.72}px`,
                    "--star-mid-y": `${particle.dy * 0.72}px`,
                    "--star-size": `${particle.size}px`,
                    "--star-delay": `${particle.delay}ms`,
                  };

                  return (
                    <span
                      className={`hero-title-star hero-title-star-${particle.color}`}
                      key={particle.id}
                      style={style}
                    />
                  );
                })}
              </span>
            </h1>
          </div>
          <div className="hero-depth-support">
            <p className="hero-enter-subtitle mt-7 max-w-2xl text-base leading-8 tracking-[0.14em] text-white/66 sm:mt-8 md:text-xl">
              在黑暗中，宇宙并非沉默。
            </p>
            <button
              type="button"
              onClick={handleArchiveAwaken}
              className={`hero-entry-button hero-enter-action mt-11 ${
                isAccessing ? "is-accessing" : ""
              }`}
              aria-label="唤醒星空档案并前往档案路径"
            >
              <span className="archive-button-label">唤醒星空档案</span>
              <span className="archive-button-status" aria-live="polite">
                {isAccessing ? "ACCESSING..." : "ARCHIVE NODE READY"}
              </span>
              <span className="archive-button-dot" aria-hidden="true" />
              <span className="archive-button-dust" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>

      </div>

      <div className="hero-depth-curtain" aria-hidden="true" />
      <p className="hero-depth-status" aria-hidden="true">
        ENTERING CELESTIAL RECORDS
      </p>

      <div
        id="archive-path"
        className="archive-depth-section relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 md:scroll-mt-28 md:px-8 md:pb-32"
      >
        <div className="mx-auto max-w-[1240px] text-center">
          <Reveal distance="short">
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-galaxy-400/70">
              Archive Route
            </p>
            <h2 className="archive-route-heading mt-4 text-balance font-display text-[clamp(2.5rem,8vw,4.1rem)] font-medium leading-[1.04] text-starlight md:whitespace-nowrap md:text-[clamp(3.5rem,5vw,6rem)] md:leading-[0.98]">
              从地球出发，沿信号进入深空。
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-5">
          {explorationPath.map((item, index) => (
            <Reveal key={item.id} delay={index * 90} distance="short">
              <button
                type="button"
                onClick={() => scrollToSection(item.sectionId, item.targetId)}
                className="archive-route-item relative min-h-52 w-full overflow-hidden border-l border-white/[0.035] bg-transparent p-5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-galaxy-400/24 md:min-h-72"
                aria-label={`打开${item.title}，前往 ${item.destination}`}
              >
                <span className="archive-route-scan" aria-hidden="true" />
                <span className="archive-route-axis" aria-hidden="true" />
                <span className="archive-route-index relative z-10 block font-display text-4xl">
                  {item.id}
                </span>
                <span className="archive-route-label relative z-10 mt-8 block text-[0.62rem] uppercase tracking-[0.2em]">
                  {item.destination}
                </span>
                <h3 className="archive-route-title relative z-10 mt-3 text-lg font-medium">
                  {item.title}
                </h3>
                <p className="archive-route-copy relative z-10 mt-4 text-sm leading-7">
                  {item.text}
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Menu, Waypoints, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const navItems = [
  { id: "daily", label: "每日星讯", subLabel: "Daily Signal" },
  { id: "gallery", label: "深空展厅", subLabel: "Deep Space Gallery" },
  { id: "articles", label: "宇宙档案", subLabel: "Cosmic Archives" },
  { id: "guide", label: "观测手册", subLabel: "Observer’s Manual" },
  { id: "about", label: "序章", subLabel: "Prologue" },
];

const hiddenCosmicEntrances = [
  {
    number: "01",
    href: "/solar-system",
    title: "太阳系漫游",
    subLabel: "ORBITAL ARCHIVE",
  },
  {
    number: "02",
    href: "/black-hole",
    title: "黑洞卡冈图雅",
    subLabel: "EVENT HORIZON FILE",
  },
];

const HIDDEN_ENTRY_CLOSE_DELAY_MS = 1000;

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

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [isHiddenEntryOpen, setIsHiddenEntryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const [hasPassedDailyNews, setHasPassedDailyNews] = useState(false);
  const [hasActivatedImmersiveNav, setHasActivatedImmersiveNav] =
    useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const hiddenEntryRef = useRef<HTMLDivElement | null>(null);
  const hiddenEntryCloseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrame: number | null = null;

    const syncScrollState = () => {
      animationFrame = null;
      setScrolled(window.scrollY > 24);

      const dailyNewsTrigger = document.getElementById("daily-star-news");
      if (!dailyNewsTrigger) {
        return;
      }

      const hasPassed = dailyNewsTrigger.getBoundingClientRect().top <= 72;
      setHasPassedDailyNews(hasPassed);
      if (hasPassed) {
        setHasActivatedImmersiveNav(true);
      }
    };

    const onScroll = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(syncScrollState);
      }
    };

    syncScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncHoverSupport = () => {
      setSupportsHover(hoverQuery.matches);
      if (!hoverQuery.matches) {
        setIsNavHovered(false);
      }
    };

    syncHoverSupport();
    hoverQuery.addEventListener("change", syncHoverSupport);
    return () => hoverQuery.removeEventListener("change", syncHoverSupport);
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const clearHiddenEntryCloseTimer = useCallback(() => {
    if (hiddenEntryCloseTimerRef.current !== null) {
      window.clearTimeout(hiddenEntryCloseTimerRef.current);
      hiddenEntryCloseTimerRef.current = null;
    }
  }, []);

  const scheduleHiddenEntryClose = useCallback(() => {
    if (!supportsHover || !isHiddenEntryOpen) {
      return;
    }

    clearHiddenEntryCloseTimer();
    hiddenEntryCloseTimerRef.current = window.setTimeout(() => {
      setIsHiddenEntryOpen(false);
      hiddenEntryCloseTimerRef.current = null;
    }, HIDDEN_ENTRY_CLOSE_DELAY_MS);
  }, [clearHiddenEntryCloseTimer, isHiddenEntryOpen, supportsHover]);

  const revealNav = useCallback(() => {
    clearHideTimer();
    setIsNavHovered(true);
  }, [clearHideTimer]);

  const concealNav = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setIsNavHovered(false);
      hideTimerRef.current = null;
    }, 40);
  }, [clearHideTimer]);

  useEffect(() => clearHideTimer, [clearHideTimer]);
  useEffect(
    () => clearHiddenEntryCloseTimer,
    [clearHiddenEntryCloseTimer],
  );

  useEffect(() => {
    if (!isHiddenEntryOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (
        hiddenEntryRef.current &&
        !hiddenEntryRef.current.contains(event.target as Node)
      ) {
        clearHiddenEntryCloseTimer();
        setIsHiddenEntryOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearHiddenEntryCloseTimer();
        setIsHiddenEntryOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [clearHiddenEntryCloseTimer, isHiddenEntryOpen]);

  const navigate = (id: string, targetId?: string) => {
    scrollToSection(id, targetId);
    setOpen(false);
    clearHiddenEntryCloseTimer();
    setIsHiddenEntryOpen(false);
  };

  const shouldShowNav =
    !supportsHover ||
    !hasPassedDailyNews ||
    isNavHovered ||
    open ||
    isHiddenEntryOpen;
  const immersiveNavClass = supportsHover
    ? hasPassedDailyNews
      ? shouldShowNav
        ? "nav-visible"
        : "nav-hidden"
      : hasActivatedImmersiveNav
        ? "nav-visible"
        : ""
    : "";

  return (
    <>
      {supportsHover && hasPassedDailyNews && (
        <div
          className="nav-hover-zone"
          aria-hidden="true"
          onPointerEnter={revealNav}
          onPointerLeave={concealNav}
        />
      )}
      <header
        className={`site-navbar fixed inset-x-0 top-0 z-[100] border-b border-white/10 ${immersiveNavClass} ${
          scrolled
            ? "bg-space-950/66 backdrop-blur-xl"
            : "bg-space-950/10 backdrop-blur-[2px]"
        }`}
        onPointerEnter={revealNav}
        onPointerLeave={concealNav}
        onFocusCapture={revealNav}
        onBlurCapture={concealNav}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-[4.5rem] md:px-8">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="text-left font-display text-xl text-starlight/88 outline-none transition hover:text-nebula-300 focus-visible:ring-2 focus-visible:ring-galaxy-400/40 md:text-2xl"
          >
            星空档案馆
            <span className="ml-2 hidden text-base text-white/54 sm:inline">
              Star Archive
            </span>
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => navigate(item.id)}
                className="group relative px-4 py-3 text-center transition focus:outline-none focus:ring-2 focus:ring-galaxy-400/40"
              >
                <span className="block text-sm text-white/70 transition group-hover:text-starlight">
                  {item.label}
                </span>
                <span className="mt-1 block text-[0.64rem] uppercase tracking-[0.2em] text-white/30 transition group-hover:text-galaxy-400/80">
                  {item.subLabel}
                </span>
                <span className="absolute inset-x-4 bottom-1 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-galaxy-400/70 to-transparent transition duration-500 group-hover:scale-x-100" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden-entry-shell"
              ref={hiddenEntryRef}
              onMouseEnter={clearHiddenEntryCloseTimer}
              onMouseLeave={scheduleHiddenEntryClose}
            >
              <button
                type="button"
                aria-label="打开隐藏宇宙入口"
                aria-haspopup="menu"
                aria-expanded={isHiddenEntryOpen}
                aria-controls="hidden-cosmic-entrances"
                onClick={() => {
                  clearHiddenEntryCloseTimer();
                  setIsHiddenEntryOpen((value) => !value);
                }}
                className={`cosmic-icon-button hidden-entry-trigger flex h-10 w-10 items-center justify-center ${
                  isHiddenEntryOpen ? "is-open" : ""
                }`}
              >
                <Waypoints
                  size={18}
                  strokeWidth={1.35}
                  className="cosmic-node-icon"
                  aria-hidden="true"
                />
              </button>

              <div
                id="hidden-cosmic-entrances"
                className={`hidden-entry-menu ${
                  isHiddenEntryOpen ? "is-open" : ""
                }`}
                role="menu"
                aria-hidden={!isHiddenEntryOpen}
              >
                <div className="hidden-entry-heading">
                  <span>隐秘坐标</span>
                  <small>HIDDEN COORDINATES</small>
                </div>

                <div className="hidden-entry-list">
                  {hiddenCosmicEntrances.map((entry) => (
                    <a
                      key={entry.number}
                      href={entry.href}
                      role="menuitem"
                      className="hidden-entry-item"
                      onClick={() => {
                        clearHiddenEntryCloseTimer();
                        setIsHiddenEntryOpen(false);
                      }}
                    >
                      <span className="hidden-entry-number">
                        {entry.number}
                      </span>
                      <span className="hidden-entry-copy">
                        <strong>{entry.title}</strong>
                        <small>{entry.subLabel}</small>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label={open ? "关闭菜单" : "打开菜单"}
              onClick={() => setOpen((value) => !value)}
              className="cosmic-icon-button flex h-10 w-10 items-center justify-center text-white/76 lg:hidden"
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="border-t border-white/[0.08] bg-space-950/90 px-5 py-4 backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className="cosmic-icon-button px-4 py-3 text-left hover:bg-white/[0.04]"
                >
                  <span className="block text-sm text-starlight/86">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-white/36">
                    {item.subLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { id: "daily", label: "每日星讯", subLabel: "Daily Signal" },
  { id: "gallery", label: "深空展厅", subLabel: "Deep Space Gallery" },
  { id: "articles", label: "宇宙档案", subLabel: "Cosmic Archives" },
  { id: "guide", label: "观测手册", subLabel: "Observer’s Manual" },
  { id: "about", label: "序章", subLabel: "Prologue" },
];

const searchEntries = [
  {
    id: "daily",
    targetLabel: "SIGNAL-DAILY",
    title: "每日星讯",
    description: "一束今日抵达的深空回声。",
  },
  {
    id: "gallery",
    targetId: "gallery-nebula",
    targetLabel: "GALLERY-NEBULA",
    title: "深空展厅 / 星云",
    description: "尘埃发光，年轻恒星正在暗处成形。",
  },
  {
    id: "gallery",
    targetId: "gallery-black-hole",
    targetLabel: "GALLERY-BLACK-HOLE",
    title: "深空展厅 / 黑洞",
    description: "光抵达边界，然后保持沉默。",
  },
  {
    id: "articles",
    targetLabel: "ARCHIVE-LIBRARY",
    title: "宇宙档案",
    description: "被归档的星系、恒星与未知。",
  },
  {
    id: "guide",
    targetLabel: "MANUAL-OBSERVE",
    title: "观测手册",
    description: "仰望之前，先学会等待黑暗。",
  },
  {
    id: "about",
    targetLabel: "PROLOGUE",
    title: "序章",
    description: "这座宇宙档案馆的第一段记录。",
  },
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

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  const navigate = (id: string, targetId?: string) => {
    scrollToSection(id, targetId);
    setOpen(false);
    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all duration-300 ${
          scrolled
            ? "bg-space-950/66 backdrop-blur-xl"
            : "bg-space-950/10 backdrop-blur-[2px]"
        }`}
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
            <button
              type="button"
              aria-label="扫描宇宙档案"
              onClick={() => setSearchOpen(true)}
              className="cosmic-icon-button archive-search-button flex h-10 w-10 items-center justify-center text-white/60 hover:text-starlight"
            >
              <Search size={17} className="relative z-10" />
            </button>
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

      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto bg-space-950/95 px-5 py-6 backdrop-blur-2xl md:px-8 md:py-9"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-search-title"
        >
          <div className="archive-search-grid pointer-events-none absolute inset-0 opacity-55" />
          <div className="relative mx-auto flex min-h-full max-w-5xl flex-col">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-galaxy-400/70">
                Archive Scan Interface
              </p>
              <button
                type="button"
                aria-label="关闭档案检索"
                onClick={() => setSearchOpen(false)}
                className="cosmic-icon-button flex h-10 w-10 items-center justify-center text-white/72"
              >
                <X size={19} />
              </button>
            </div>

            <div className="my-auto py-14 md:py-20">
              <div className="max-w-3xl">
                <h2
                  id="archive-search-title"
                  className="font-display text-5xl font-medium leading-tight text-starlight sm:text-6xl md:text-7xl"
                >
                  扫描宇宙档案
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/56 md:text-base md:leading-8">
                  在黑暗中，宇宙并非沉默。选择一条信号，进入对应档案。
                </p>
              </div>

              <div className="mt-10 grid gap-3 md:grid-cols-2">
                {searchEntries.map((entry) => (
                  <button
                    type="button"
                    key={`${entry.targetLabel}-${entry.targetId ?? entry.id}`}
                    onClick={() => navigate(entry.id, entry.targetId)}
                    className="archive-search-entry group relative overflow-hidden border border-white/[0.065] bg-white/[0.018] p-5 text-left transition duration-700 hover:border-galaxy-400/30 hover:bg-galaxy-500/[0.045] focus:outline-none focus:ring-2 focus:ring-galaxy-400/40"
                  >
                    <span className="archive-search-entry-scan" aria-hidden="true" />
                    <span className="relative z-10 text-[0.64rem] uppercase tracking-[0.24em] text-galaxy-400/58 transition group-hover:text-galaxy-400/88">
                      {entry.targetLabel}
                    </span>
                    <span className="relative z-10 mt-4 block font-display text-2xl text-starlight/82 transition group-hover:text-starlight">
                      {entry.title}
                    </span>
                    <span className="relative z-10 mt-3 block text-sm leading-7 text-white/46 transition group-hover:text-white/64">
                      {entry.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="pb-5 text-xs uppercase tracking-[0.26em] text-white/26">
              Visual scan only / Local archive index
            </p>
          </div>
        </div>
      )}
    </>
  );
}

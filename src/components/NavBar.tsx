import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { id: "daily", label: "今日宇宙", subLabel: "Signal" },
  { id: "gallery", label: "星空图库", subLabel: "Gallery" },
  { id: "articles", label: "天文文章", subLabel: "Archives" },
  { id: "guide", label: "观星指南", subLabel: "Manual" },
  { id: "about", label: "关于", subLabel: "Prologue" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
          onClick={() => scrollToSection("home")}
          className="text-left font-display text-xl text-starlight/88 outline-none transition hover:text-nebula-300 md:text-2xl"
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
              onClick={() => scrollToSection(item.id)}
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
            className="cosmic-icon-button archive-search-button hidden h-10 w-10 items-center justify-center text-white/60 hover:text-starlight md:flex"
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
                onClick={() => {
                  scrollToSection(item.id);
                  setOpen(false);
                }}
                className="cosmic-icon-button px-4 py-3 text-left hover:bg-white/[0.04]"
              >
                <span className="block text-sm text-starlight/86">{item.label}</span>
                <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-white/36">
                  {item.subLabel}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

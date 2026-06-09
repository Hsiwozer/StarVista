import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { id: "daily", label: "今日宇宙", subLabel: "Daily Cosmos" },
  { id: "gallery", label: "星空图库", subLabel: "Gallery" },
  { id: "articles", label: "天文文章", subLabel: "Articles" },
  { id: "guide", label: "观星指南", subLabel: "Guide" },
  { id: "about", label: "关于我们", subLabel: "About" },
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
          ? "bg-space-950/74 shadow-glow-blue backdrop-blur-2xl"
          : "bg-space-950/22 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="text-left font-display text-2xl text-starlight outline-none transition hover:text-nebula-300 md:text-3xl"
        >
          星空档案馆
          <span className="ml-2 hidden text-lg text-white/86 sm:inline">
            Star Archive
          </span>
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group rounded-lg px-5 py-3 text-center transition hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-galaxy-400/70"
            >
              <span className="block text-sm text-white/88 group-hover:text-starlight">
                {item.label}
              </span>
              <span className="mt-1 block text-xs text-white/44 group-hover:text-galaxy-400">
                {item.subLabel}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="搜索"
            className="cosmic-icon-button hidden h-11 w-11 items-center justify-center text-white/76 hover:text-starlight md:flex"
          >
            <Search size={19} />
          </button>
          <button
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            onClick={() => setOpen((value) => !value)}
            className="cosmic-icon-button flex h-11 w-11 items-center justify-center text-white/82 lg:hidden"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-space-950/92 px-5 py-4 backdrop-blur-2xl lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  scrollToSection(item.id);
                  setOpen(false);
                }}
                className="cosmic-icon-button px-4 py-3 text-left hover:bg-white/[0.06]"
              >
                <span className="block text-sm text-starlight">{item.label}</span>
                <span className="mt-1 block text-xs text-white/45">
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

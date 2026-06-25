import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export interface BlackHoleTelemetry {
  approach: number;
  timeDilation: number;
}

export function BlackHolePage() {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <main className="black-hole-page" aria-label="事件视界沉浸探索">
      <figure className="black-hole-image-scene" aria-label="黑洞事件视界与发光吸积盘">
        <img
          src="/images/black-hole-event-horizon.png"
          alt="黑洞事件视界被明亮吸积盘环绕，星空背景中可见上下弯曲的引力透镜光弧"
        />
      </figure>
      <div className="black-hole-veil" aria-hidden="true" />
      <a href="/" className="black-hole-back-button" aria-label="返回 StarVista 首页">
        <ArrowLeft size={15} aria-hidden="true" />
        <span>返回星空</span>
        <small>BACK TO STARVISTA</small>
      </a>
      <section className="black-hole-title" aria-label="事件视界">
        <p>EVENT HORIZON</p>
        <h1>事件视界</h1>
        <span>在这里，星光弯曲，时间沉默。</span>
      </section>
    </main>
  );
}

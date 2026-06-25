interface BlackHoleHUDProps {
  timeDilation: number;
  approach: number;
}

export function BlackHoleHUD({ timeDilation, approach }: BlackHoleHUDProps) {
  const lensingStrength = Math.round(72 + approach * 24);

  return (
    <aside className="black-hole-hud" aria-label="事件视界状态" tabIndex={0}>
      <div className="black-hole-hud-heading">
        <p>EVENT HORIZON</p>
        <h2>OBSERVATORY</h2>
      </div>
      <dl className="black-hole-hud-grid">
        <div>
          <dt>TIME DILATION</dt>
          <dd>{timeDilation.toFixed(2)}x</dd>
        </div>
        <div>
          <dt>LENSING</dt>
          <dd>ACTIVE · {lensingStrength}%</dd>
        </div>
        <div className="black-hole-hud-detail">
          <dt>SINGULARITY</dt>
          <dd>LOCKED</dd>
        </div>
        <div className="black-hole-hud-detail">
          <dt>DISK FLOW</dt>
          <dd>ASYMMETRIC</dd>
        </div>
        <div className="black-hole-hud-optional">
          <dt>PHOTON RING</dt>
          <dd>TRACE</dd>
        </div>
      </dl>
    </aside>
  );
}

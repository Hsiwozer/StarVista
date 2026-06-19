const timeOptions = [
  { label: "暂停", value: 0 },
  { label: "1x", value: 1 },
  { label: "10x", value: 10 },
  { label: "100x", value: 100 },
];

interface TimeControlProps {
  value: number;
  onChange: (value: number) => void;
}

export function TimeControl({ value, onChange }: TimeControlProps) {
  return (
    <div className="solar-time-control" aria-label="太阳系时间倍率">
      <span className="solar-control-label">Time Drift</span>
      <div className="solar-time-options">
        {timeOptions.map((option) => (
          <button
            type="button"
            key={option.value}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`solar-time-button ${
              value === option.value ? "solar-time-button-active" : ""
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

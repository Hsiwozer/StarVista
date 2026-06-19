import { ArrowLeft } from "lucide-react";

export function BackToHomeButton() {
  return (
    <a href="/" className="solar-back-button" aria-label="返回 StarVista 主站">
      <ArrowLeft size={16} aria-hidden="true" />
      返回 StarVista
    </a>
  );
}

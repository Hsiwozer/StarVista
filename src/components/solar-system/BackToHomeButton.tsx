import { ArrowLeft } from "lucide-react";

export function BackToHomeButton() {
  return (
    <a href="/#gallery" className="solar-back-button" aria-label="返回星空档案馆">
      <ArrowLeft size={16} aria-hidden="true" />
      返回星空档案馆
    </a>
  );
}

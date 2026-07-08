import { ArrowLeft } from "lucide-react";
import { usePageTransition } from "../../hooks/usePageTransition";

export function BackToHomeButton() {
  const { transitionLink } = usePageTransition();

  return (
    <a
      href="/#gallery"
      className="solar-back-button"
      aria-label="返回星空档案馆"
      onClick={(event) =>
        transitionLink(
          event,
          "/#gallery",
          "archive",
          "RESTORING ARCHIVE VECTOR",
        )
      }
    >
      <ArrowLeft size={16} aria-hidden="true" />
      返回星空档案馆
    </a>
  );
}

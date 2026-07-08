import { ArrowLeft } from "lucide-react";
import { usePageTransition } from "../../hooks/usePageTransition";
import { useEffect, useRef, useState } from "react";

const EVENT_HORIZON_VIDEO_URL = "/videos/event-horizon.mp4";
const EVENT_HORIZON_PLAYBACK_RATE = 0.75;

export interface BlackHoleTelemetry {
  approach: number;
  timeDilation: number;
}

export function BlackHolePage() {
  const { transitionLink } = usePageTransition();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | undefined;

    const playVideo = () => {
      requestAnimationFrame(() => {
        const video = videoRef.current;

        if (!video) {
          return;
        }

        video.muted = true;
        video.defaultMuted = true;
        video.playbackRate = EVENT_HORIZON_PLAYBACK_RATE;
        video.setAttribute("x-webkit-airplay", "deny");

        void video.play().catch(() => {
          // Browsers can still block autoplay in some user settings.
        });
      });
    };

    async function loadVideo() {
      try {
        const response = await fetch(EVENT_HORIZON_VIDEO_URL, { cache: "force-cache" });

        if (!response.ok) {
          throw new Error("Unable to load event horizon video");
        }

        const videoBlob = await response.blob();

        if (cancelled) {
          return;
        }

        objectUrl = URL.createObjectURL(videoBlob);
        setVideoSrc(objectUrl);
        playVideo();
      } catch {
        if (!cancelled) {
          setVideoSrc(EVENT_HORIZON_VIDEO_URL);
          playVideo();
        }
      }
    }

    void loadVideo();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  useEffect(() => {
    const preventDefault = (event: Event) => event.preventDefault();
    const preventInspectionShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const blocksDeveloperToolShortcut =
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.metaKey && event.altKey && ["i", "j", "c"].includes(key)) ||
        ((event.ctrlKey || event.metaKey) && ["s", "u"].includes(key));

      if (blocksDeveloperToolShortcut) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("dragstart", preventDefault);
    document.addEventListener("selectstart", preventDefault);
    document.addEventListener("keydown", preventInspectionShortcuts);

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
      document.removeEventListener("keydown", preventInspectionShortcuts);
    };
  }, []);

  return (
    <main className="black-hole-page" aria-label="事件视界沉浸探索">
      <a
        href="/"
        className="black-hole-return-button"
        aria-label="返回星空档案馆"
        onClick={(event) => transitionLink(event, "/", "archive")}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        <span>返回星空档案馆</span>
      </a>
      <video
        ref={videoRef}
        className="black-hole-video"
        src={videoSrc}
        aria-label="事件视界视频"
        autoPlay
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        loop
        muted
        playsInline
        preload="auto"
      />
    </main>
  );
}

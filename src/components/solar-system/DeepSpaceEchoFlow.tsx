import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

export const DEEP_SPACE_ECHO_SIGNAL = "STARVISTA-0919";

type EchoPhase =
  | "prompt"
  | "declined"
  | "input"
  | "mismatch"
  | "timeout"
  | "aligned"
  | "letter"
  | "arrived";
type EchoCardPhase =
  | "arrive"
  | "reveal"
  | "settled"
  | "veil"
  | "recompose"
  | "dismiss";

interface DeepSpaceEchoFlowProps {
  onHandled: () => void;
  onClose: () => void;
}

interface EchoCardCopy {
  kicker: string;
  title: string;
  body: string[];
  prompt?: string;
  primaryAction?: string;
  secondaryAction?: string;
}

const echoInteractionTimeout = 15000;
const passiveCardDuration = 2600;
const openingLetterDelay = 1100;
const cardArrivalDuration = 360;
const cardContentRevealDuration = 560;
const cardContentVeilDuration = 220;
const cardRecomposeDuration = 300;
const cardDismissDuration = 460;
const closingLead = 420;

const deepSpaceEchoCopy: Record<Exclude<EchoPhase, "letter">, EchoCardCopy> = {
  prompt: {
    kicker: "Deep Space Echo",
    title: "深空传来一段未署名的回响",
    body: [
      "当地球掠过被标记的坐标，一段微弱讯息穿过星尘与轨道，停在了你的面前。",
      "它像一封沉睡已久的信，正在等待被听见。",
    ],
    prompt: "是否接收这段来自深空的回响？",
    primaryAction: "接收回响",
    secondaryAction: "返还星海",
  },
  declined: {
    kicker: "Echo Returned",
    title: "回响归于沉寂",
    body: [
      "你没有接收它。",
      "那段讯息短暂闪烁后，重新隐入群星背后。",
      "星轨继续流转，仿佛什么都不曾发生。",
    ],
  },
  input: {
    kicker: "Resonance Signal",
    title: "请输入共鸣信号",
    body: [
      "这封信被封存在深空之中，唯有正确的信号，才能唤醒它的名字。",
      "若你确曾收到那段星间凭证，",
      "请让它与深空对齐。",
    ],
    primaryAction: "尝试共鸣",
    secondaryAction: "放弃共鸣",
  },
  mismatch: {
    kicker: "Signal Drift",
    title: "星频未能重合",
    body: [
      "你送出的信号未能抵达那片被封存的星域。",
      "回响短暂颤动，又重新闭合。",
      "深空仍旧沉默。",
    ],
    primaryAction: "再次共鸣",
    secondaryAction: "放弃共鸣",
  },
  timeout: {
    kicker: "Echo Fading",
    title: "回响沉入更远的夜",
    body: [
      "你沉默了太久。",
      "那段悬停在星尘之间的讯息失去了最后一丝光，缓缓坠入更深的宇宙。",
    ],
  },
  aligned: {
    kicker: "Signal Aligned",
    title: "共鸣已经对齐",
    body: [
      "信号穿过寂静，抵达了它应抵达的地方。",
      "那封被藏在时间深处的信，正在缓缓展开。",
    ],
    primaryAction: "聆听回响",
  },
  arrived: {
    kicker: "Echo Arrived",
    title: "回响已经抵达",
    body: ["愿它在你心里停留片刻。"],
  },
};

const letterParagraphs = [
  "当你读到这封信时，说明你已经抵达了一个被我悄悄标记的时间坐标。",
  "在这片太阳系里，行星按照自己的轨道运行，光从太阳出发，穿过漫长的距离，落在每一颗星球的表面。大多数时候，它们只是安静地旋转，像现实中的许多日子一样，缓慢、重复，却又真实存在。",
  "我做这个网站，并不只是为了展示宇宙的浩瀚、星云的壮丽，或是行星在轨道上的运行。更像是想在喧闹的世界之外，留下一个可以短暂停靠的地方。",
  "一个人可以在这里看见星星，看见地球，看见太阳，也看见自己内心里某些不常被说出口的东西。",
  "‘深空的回响’不是普通的彩蛋。",
  "它是一封被藏起来的信。",
  "不是所有人都会遇见它，也不是所有人都能打开它。\n因为有些话，并不适合写在最显眼的地方。\n它们更适合藏在深处，等某个真正听得见的人靠近。",
  "谢谢你来到这里。\n谢谢你愿意把一小段时间交给这片星空。\n也谢谢你接收了这段来自深空的回响。",
  "也许现实中的我们总会有疲惫、孤独、迷茫，甚至有些话不知道该对谁说。但我仍然希望，当你看向这片星空时，能够短暂地感到平静。",
  "宇宙很大，大到我们每个人都显得渺小。\n可也正因为如此，那些愿意被记住的瞬间，才显得格外珍贵。",
  "愿你在未来的某一天，仍然能保留一点对星空的好奇。\n愿你在独自前行的时候，也能相信自己并不是毫无回响。\n愿你在漫长而普通的生活里，偶尔想起：\n即使深空寂静，也仍有一些微弱的光，曾经为你亮起。",
  "这封信不需要回复。\n你读到它的这一刻，回响就已经抵达。",
  "—— 来自 StarVista 的建站者",
];

function normalizeSignal(value: string) {
  return value.trim().toUpperCase();
}

export function DeepSpaceEchoFlow({ onHandled, onClose }: DeepSpaceEchoFlowProps) {
  const [phase, setPhase] = useState<EchoPhase>("prompt");
  const [signal, setSignal] = useState("");
  const [echoCardPhase, setEchoCardPhase] = useState<EchoCardPhase>("arrive");
  const [isEchoCardTransitioning, setIsEchoCardTransitioning] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpeningLetter, setIsOpeningLetter] = useState(false);
  const handledRef = useRef(false);
  const phaseRef = useRef<EchoPhase>("prompt");
  const isEchoCardTransitioningRef = useRef(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRefs = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach((timer) => window.clearTimeout(timer));
    timerRefs.current = [];
  }, []);

  const scheduleTimer = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timerRefs.current = timerRefs.current.filter((current) => current !== timer);
      callback();
    }, delay);

    timerRefs.current.push(timer);
    return timer;
  }, []);

  const waitForEchoCard = useCallback(
    (delay: number) =>
      new Promise<void>((resolve) => {
        scheduleTimer(resolve, delay);
      }),
    [scheduleTimer],
  );

  const markHandled = useCallback(() => {
    if (handledRef.current) {
      return;
    }

    handledRef.current = true;
    onHandled();
  }, [onHandled]);

  const enterEchoCard = useCallback(async () => {
    setEchoCardPhase("arrive");

    await waitForEchoCard(cardArrivalDuration);

    setEchoCardPhase("reveal");

    await waitForEchoCard(cardContentRevealDuration);

    setEchoCardPhase("settled");
    setIsEchoCardTransitioning(false);
    isEchoCardTransitioningRef.current = false;
  }, [waitForEchoCard]);

  const transitionTo = useCallback(
    async (nextPhase: EchoPhase) => {
      if (isEchoCardTransitioningRef.current || phaseRef.current === nextPhase) {
        return;
      }

      isEchoCardTransitioningRef.current = true;
      setIsEchoCardTransitioning(true);
      setEchoCardPhase("veil");

      await waitForEchoCard(cardContentVeilDuration);

      phaseRef.current = nextPhase;
      setPhase(nextPhase);

      if (overlayRef.current) {
        overlayRef.current.scrollTop = 0;
      }

      setEchoCardPhase("recompose");

      await waitForEchoCard(cardRecomposeDuration);

      setEchoCardPhase("reveal");

      await waitForEchoCard(cardContentRevealDuration);

      setEchoCardPhase("settled");
      setIsEchoCardTransitioning(false);
      isEchoCardTransitioningRef.current = false;
    },
    [waitForEchoCard],
  );

  const declineEcho = useCallback(() => {
    setSignal("");
    void transitionTo("declined");
  }, [transitionTo]);

  const timeoutEcho = useCallback(() => {
    setSignal("");
    void transitionTo("timeout");
  }, [transitionTo]);

  useEffect(() => {
    void enterEchoCard();

    return clearTimers;
  }, [clearTimers, enterEchoCard]);

  useEffect(() => {
    if (
      echoCardPhase !== "settled" ||
      (phase !== "prompt" && phase !== "input")
    ) {
      return undefined;
    }

    const timer = window.setTimeout(timeoutEcho, echoInteractionTimeout);

    return () => window.clearTimeout(timer);
  }, [echoCardPhase, phase, signal, timeoutEcho]);

  useEffect(() => {
    if (
      echoCardPhase !== "settled" ||
      (phase !== "declined" && phase !== "timeout" && phase !== "arrived")
    ) {
      return undefined;
    }

    markHandled();

    scheduleTimer(() => {
      isEchoCardTransitioningRef.current = true;
      setIsEchoCardTransitioning(true);
      setEchoCardPhase("veil");
    }, passiveCardDuration);
    scheduleTimer(() => {
      setEchoCardPhase("dismiss");
    }, passiveCardDuration + cardContentVeilDuration);
    scheduleTimer(() => {
      setIsClosing(true);
    }, passiveCardDuration + cardContentVeilDuration + cardDismissDuration);
    scheduleTimer(() => {
      onClose();
    }, passiveCardDuration + cardContentVeilDuration + cardDismissDuration + closingLead);
  }, [echoCardPhase, markHandled, onClose, phase, scheduleTimer]);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = 0;
    }

    if (phase === "input" && echoCardPhase === "settled") {
      inputRef.current?.focus();
    }
  }, [echoCardPhase, phase]);

  const handleSignalSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEchoCardTransitioningRef.current || echoCardPhase !== "settled") {
      return;
    }

    if (normalizeSignal(signal) !== normalizeSignal(DEEP_SPACE_ECHO_SIGNAL)) {
      setSignal("");
      void transitionTo("mismatch");
      return;
    }

    setSignal("");
    void transitionTo("aligned");
  };

  const retrySignal = () => {
    setSignal("");
    void transitionTo("input");
  };

  const openLetter = () => {
    if (isOpeningLetter || isEchoCardTransitioningRef.current) {
      return;
    }

    markHandled();
    setIsOpeningLetter(true);

    scheduleTimer(() => {
      setIsOpeningLetter(false);
      void transitionTo("letter");
    }, openingLetterDelay);
  };

  const closeLetter = () => {
    if (isEchoCardTransitioningRef.current || echoCardPhase !== "settled") {
      return;
    }

    markHandled();
    void transitionTo("arrived");
  };

  const activeCard = phase === "letter" ? null : deepSpaceEchoCopy[phase];
  const isLetterPhase = phase === "letter";
  const isEchoCardInteractive =
    echoCardPhase === "settled" &&
    !isEchoCardTransitioning &&
    !isClosing &&
    !isOpeningLetter;

  return (
    <div
      ref={overlayRef}
      className={`solar-deep-echo-overlay ${
        isClosing ? "solar-deep-echo-overlay-exiting" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="deep-space-echo-title"
    >
      <div className="solar-deep-echo-dust" aria-hidden="true" />

      <section
        className={`solar-deep-echo-surface ${
          isLetterPhase
            ? "solar-deep-echo-letter"
            : `solar-deep-echo-panel solar-deep-echo-panel-${phase}`
        } solar-deep-echo-motion-${echoCardPhase} ${
          isOpeningLetter ? "solar-deep-echo-panel-opening" : ""
        }`}
        aria-labelledby="deep-space-echo-title"
      >
        <div className="solar-deep-echo-card-chrome" aria-hidden="true" />
        <div className="solar-deep-echo-card-content">
          {activeCard ? (
            <>
              <div className="solar-deep-echo-kicker">{activeCard.kicker}</div>
              <h2 id="deep-space-echo-title">{activeCard.title}</h2>
              <div className="solar-deep-echo-copy">
                {activeCard.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              {activeCard.prompt ? (
                <p className="solar-deep-echo-question">{activeCard.prompt}</p>
              ) : null}

              {phase === "input" ? (
                <form className="solar-deep-echo-form" onSubmit={handleSignalSubmit}>
                  <label className="sr-only" htmlFor="deep-space-echo-signal">
                    共鸣信号
                  </label>
                  <input
                    ref={inputRef}
                    id="deep-space-echo-signal"
                    value={signal}
                    onChange={(event) => setSignal(event.target.value)}
                    placeholder="输入共鸣信号"
                    autoComplete="off"
                    disabled={!isEchoCardInteractive}
                    spellCheck={false}
                  />
                  <div className="solar-deep-echo-actions">
                    <button
                      type="submit"
                      className="solar-deep-echo-primary"
                      disabled={!isEchoCardInteractive}
                    >
                      {activeCard.primaryAction}
                    </button>
                    <button
                      type="button"
                      disabled={!isEchoCardInteractive}
                      onClick={declineEcho}
                    >
                      {activeCard.secondaryAction}
                    </button>
                  </div>
                </form>
              ) : null}

              {phase === "prompt" ? (
                <div className="solar-deep-echo-actions">
                  <button
                    type="button"
                    className="solar-deep-echo-primary"
                    disabled={!isEchoCardInteractive}
                    onClick={() => {
                      void transitionTo("input");
                    }}
                  >
                    {activeCard.primaryAction}
                  </button>
                  <button
                    type="button"
                    disabled={!isEchoCardInteractive}
                    onClick={declineEcho}
                  >
                    {activeCard.secondaryAction}
                  </button>
                </div>
              ) : null}

              {phase === "mismatch" ? (
                <div className="solar-deep-echo-actions">
                  <button
                    type="button"
                    className="solar-deep-echo-primary"
                    disabled={!isEchoCardInteractive}
                    onClick={retrySignal}
                  >
                    {activeCard.primaryAction}
                  </button>
                  <button
                    type="button"
                    disabled={!isEchoCardInteractive}
                    onClick={declineEcho}
                  >
                    {activeCard.secondaryAction}
                  </button>
                </div>
              ) : null}

              {phase === "aligned" ? (
                <div className="solar-deep-echo-actions">
                  <button
                    type="button"
                    className="solar-deep-echo-primary"
                    disabled={isOpeningLetter || !isEchoCardInteractive}
                    onClick={openLetter}
                  >
                    {activeCard.primaryAction}
                  </button>
                </div>
              ) : null}
            </>
          ) : null}

          {phase === "letter" ? (
            <>
              <div className="solar-deep-echo-letter-header">
                <div className="solar-deep-echo-kicker">Letter From Deep Space</div>
                <h2 id="deep-space-echo-title">深空的回响</h2>
              </div>
              <div className="solar-deep-echo-letter-body">
                {letterParagraphs.map((paragraph) => {
                  const lines = paragraph.split("\n");

                  return (
                    <p key={paragraph}>
                      {lines.map((line, index) => (
                        <span key={`${line}-${index}`}>
                          {line}
                          {index < lines.length - 1 ? <br /> : null}
                        </span>
                      ))}
                    </p>
                  );
                })}
              </div>
              <button
                type="button"
                className="solar-deep-echo-letter-close"
                disabled={!isEchoCardInteractive}
                onClick={closeLetter}
              >
                收起回响
              </button>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

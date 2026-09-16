import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01<>/\\[]{}*#";

/**
 * Reveals text via a scramble/decrypt animation the first time it
 * enters the viewport. Purely cosmetic — falls back to plain text.
 */
export default function DecryptText({
  text,
  className = "",
  speed = 28,
  delay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (done.current) return;
      done.current = true;
      let frame = 0;
      const total = text.length;
      const timer = window.setInterval(() => {
        const revealed = Math.floor(frame / 2);
        let out = "";
        for (let i = 0; i < total; i++) {
          if (i < revealed) out += text[i];
          else if (text[i] === " ") out += " ";
          else out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setDisplay(out);
        frame++;
        if (revealed >= total) {
          window.clearInterval(timer);
          setDisplay(text);
        }
      }, speed);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.setTimeout(run, delay);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, speed, delay]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

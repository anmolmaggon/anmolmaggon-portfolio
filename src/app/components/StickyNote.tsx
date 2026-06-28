import { useEffect, useState } from "react";

type Note = { id: string; text: string; from: string; at: string };

const STORAGE_KEY = "anmol-portfolio-thoughts";

export function StickyNote() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [from, setFrom] = useState("");
  const [sent, setSent] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCount((JSON.parse(raw) as Note[]).length);
    } catch {}
  }, []);

  const submit = () => {
    if (!text.trim()) return;
    const note: Note = {
      id: crypto.randomUUID(),
      text: text.trim(),
      from: from.trim() || "Anonymous",
      at: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: Note[] = raw ? JSON.parse(raw) : [];
      list.unshift(note);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setCount(list.length);
    } catch {}
    setSent(true);
    setText("");
    setFrom("");
    setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 1600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] font-[Nyght_Serif]">
      {open && (
        <div
          className="mb-3 w-[320px] md:w-[360px] origin-bottom-right animate-[notePop_0.25s_ease-out] rounded-card shadow-2xl p-5"
          style={{ backgroundColor: "#FFF59D", color: "#1a1a1a", transform: "rotate(-1.5deg)" }}
        >
          <div className="flex items-baseline justify-between mb-3">
            <p className="italic" style={{ fontWeight: 500 }}>
              Drop a thought
            </p>
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="text-lg leading-none opacity-60 hover:opacity-100"
            >
              ×
            </button>
          </div>
          <p className="text-label italic opacity-70 mb-4">
            Mind-blowing things especially welcome. I'm a sucker for them.
          </p>
          {sent ? (
            <p className="italic py-6 text-center" style={{ fontWeight: 500 }}>
              Got it. Thank you ✦
            </p>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="A film, a paper, a tiny detail you can't stop thinking about…"
                rows={4}
                className="w-full bg-transparent outline-none resize-none border-b border-ink-faint pb-2 text-meta placeholder:italic placeholder:opacity-50"
                style={{ fontWeight: 400 }}
              />
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full bg-transparent outline-none border-b border-ink-ghost mt-3 pb-1 text-meta italic placeholder:opacity-50"
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-caption italic opacity-60 numeral">
                  {count > 0 ? `${count} dropped so far` : "Be the first"}
                </span>
                <button
                  onClick={submit}
                  disabled={!text.trim()}
                  className="italic text-meta disabled:opacity-40 relative after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                  style={{ fontWeight: 500 }}
                >
                  Send →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close thoughts" : "Open thoughts"}
        className="group relative h-14 w-14 md:h-16 md:w-16 rounded-full shadow-2xl transition-transform duration-300 hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#FFF59D", transform: open ? "rotate(0deg)" : "rotate(-6deg)" }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-xl" style={{ color: "#1a1a1a" }}>
          {open ? "×" : "✦"}
        </span>
        <span
          className="absolute -top-1 -left-2 h-3 w-8 rounded-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.08)", transform: "rotate(-12deg)" }}
          aria-hidden
        />
      </button>

      <style>{`
        @keyframes notePop {
          0% { opacity: 0; transform: rotate(-1.5deg) translateY(8px) scale(0.96); }
          100% { opacity: 1; transform: rotate(-1.5deg) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

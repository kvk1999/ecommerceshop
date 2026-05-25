import { useMemo, useRef, useState, useEffect } from "react";

function normalize(s) {
  return (s || "").toString().trim();
}

export default function ChatbotHelp() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollerRef = useRef(null);

  const quickReplies = useMemo(
    () => ["Track Order", "Suggest Gadgets", "My Profile"],
    []
  );

  const welcomeText = "Welcome to ShopSphere! How can I help you today?";

  const [messages, setMessages] = useState(() => [
    { id: "welcome", from: "bot", text: welcomeText },
  ]);

  useEffect(() => {
    if (!open) return;
    setMessages([{ id: "welcome", from: "bot", text: welcomeText }]);
    window.setTimeout(() => {
      if (!scrollerRef.current) return;
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function submit(text) {
    const question = normalize(text);
    if (!question) return;

    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), from: "user", text: question },
    ]);

    setBusy(true);

    window.setTimeout(() => {
      const botText =
        question === "Track Order"
          ? "Sure—please share your order ID and the email (or phone) used at checkout."
          : question === "Suggest Gadgets"
          ? "Great choice! Tell me your budget and the gadget category you like (audio, smartwatches, etc.)."
          : question === "My Profile"
          ? "I can help with your account details. What would you like to update?"
          : "Got it. How can I help you today?";

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), from: "bot", text: botText },
      ]);
      setBusy(false);

      window.setTimeout(() => {
        if (!scrollerRef.current) return;
        scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
      }, 0);
    }, 400);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open ShopSphere AI Support"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-2xl"
      >
        <span className="text-2xl">💬</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  ShopSphere AI Support
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div
              ref={scrollerRef}
              className="max-h-[60vh] space-y-3 overflow-auto px-4 py-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.from === "user" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  <div
                    className={
                      m.from === "user"
                        ? "max-w-[80%] whitespace-pre-wrap rounded-2xl bg-cyan-400/15 px-4 py-3 text-sm text-white border border-cyan-400/25"
                        : "max-w-[80%] whitespace-pre-wrap rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 border border-white/10"
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Quick replies (shown when chat is open) */}
              <div className="flex flex-wrap gap-2 pt-1">
                {quickReplies.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => submit(r)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10"
                  >
                    {r}
                  </button>
                ))}
              </div>

              {busy && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200 border border-white/10">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/40"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


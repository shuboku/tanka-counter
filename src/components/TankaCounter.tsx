import React, { useState, useRef, useEffect } from "react";
import "./TankaCounter.css";

/* ── 定数 ── */
const STEP  = [5, 7, 5, 7, 7];
const TOTAL = 31;

/* ── 音数カウント ── */
const SMALL  = /[ぁぃぅぇぉゃゅょゎ]/;
const XTU    = /[っ]/;
const CHOON  = /ー/;
const IGNORE = /[「」"'（）\\s、。…〜！？・]/;

function countMora(text: string): number {
  let c = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (IGNORE.test(ch)) continue;

    if (XTU.test(ch) || CHOON.test(ch)) { c++; continue; }
    if (i + 1 < text.length && SMALL.test(text[i + 1])) { c++; i++; continue; }
    if (SMALL.test(ch)) continue;
    c++;
  }
  return c;
}
function splitTanka(text: string): string[] {
  const parts: string[] = [];
  let idx = 0;
  for (const need of STEP) {
    let got = 0, end = idx;
    while (got < need && end < text.length) {
      const ch = text[end];
      if (!IGNORE.test(ch)) {
        if (XTU.test(ch) || CHOON.test(ch)) { got++; end++; continue; }
        if (end + 1 < text.length && SMALL.test(text[end + 1])) { got++; end += 2; continue; }
        if (SMALL.test(ch)) { end++; continue; }
        got++;
      }
      end++;
    }
    parts.push(text.slice(idx, end));
    idx = end;
  }
  return parts;
}

/* ── メインコンポーネント ── */
const TankaCounter: React.FC = () => {
  const [raw, setRaw] = useState("");
  const areaRef       = useRef<HTMLTextAreaElement>(null);
  const stickyRef     = useRef<HTMLDivElement>(null);

  /* true = dark */
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    localStorage.getItem("tanka-theme") !== "light"
  );

  /* ルートにテーマクラスを付与 */
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove("theme-dark", "theme-light");
    body.classList.remove("theme-dark", "theme-light");
    const c = darkMode ? "theme-dark" : "theme-light";
    root.classList.add(c);
    body.classList.add(c);
    localStorage.setItem("tanka-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* モバイル時スクロール */
  useEffect(() => {
    if (window.innerWidth <= 640) {
      stickyRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [raw]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setRaw(e.target.value.replace(/／/g, ""));
  const clear = () => { setRaw(""); areaRef.current?.focus(); };

  const mora  = countMora(raw);
  const parts = splitTanka(raw);

  /* 句バッジ生成 */
  let cum = 0;
  const segmentBadges = STEP.map((need, i) => {
    cum += need;
    const done = mora >= cum;
    return (
      <span key={i} className={`badge segment ${done ? "ok" : ""}`}>
        {need}音
      </span>
    );
  });

  return (
    <div className="tanka-card">
      <h1>短歌音数カウンター</h1>

      {/*── 記号だけの切替ボタン ──*/}
      <button
        type="button"
        className="mode-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label={darkMode ? "ライトモードへ切替" : "ダークモードへ切替"}
      >
        {darkMode ? "☀︎" : "☾"}
      </button>

      <p className="sub">ひらがなで入力すると 5-7-5-7-7 に区切ります。</p>

      <div ref={stickyRef} className="sticky-meta">
        <div className="segments">{segmentBadges}</div>
        <p className="total-count">{mora} 音 / 標準 {TOTAL} 音</p>
      </div>

      <div className="preview">
        {parts.map((p, i) => (
          <React.Fragment key={i}>{p}／</React.Fragment>
        ))}
      </div>

      <label className="lbl">短歌を入力</label>
      <textarea
        ref={areaRef}
        value={raw}
        onChange={onChange}
        placeholder="ひらがなで短歌を入力…"
      />

      <button onClick={clear}>入力をクリア</button>

      <label className="lbl">清書欄</label>
      <textarea
        className="clean"
        placeholder="ここに漢字・カタカナを含む清書を入力"
      />
    </div>
  );
};

export default TankaCounter;

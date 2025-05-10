```tsx
// TankaCounter.tsx
import React, { useState, useRef } from "react";

/* ───────── 5-7-5-7-7 ───────── */
const STEP  = [5, 7, 5, 7, 7];
const TOTAL = 31;

/* ひらがな簡易カウンタ ------------------------------ */
const SMALL  = /[ぁぃぅぇぉゃゅょゎァィゥェォャュョヮ]/;
const XTU    = /[っッ]/;
const CHOON  = /ー/;
const IGNORE = /[「」"'（）\s、。…〜！？・]/;

const countMora = (t: string) => {
  let n = 0;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (IGNORE.test(c)) continue;
    if (XTU.test(c) || CHOON.test(c)) { n++; continue; }
    if (i + 1 < t.length && SMALL.test(t[i + 1])) { n++; i++; continue; }
    if (SMALL.test(c)) continue;
    n++;
  }
  return n;
};

/* 左から STEP ごとに区切る -------------------------- */
const split = (t: string) => {
  const out: string[] = [];
  let cur = 0;
  for (const need of STEP) {
    let got = 0, end = cur;
    while (got < need && end < t.length) {
      const c = t[end];
      if (!IGNORE.test(c)) {
        if (XTU.test(c) || CHOON.test(c)) { got++; end++; continue; }
        if (end + 1 < t.length && SMALL.test(t[end + 1])) { got++; end += 2; continue; }
        if (SMALL.test(c)) { end++; continue; }
        got++;
      }
      end++;
    }
    out.push(t.slice(cur, end));
    cur = end;
  }
  if (cur < t.length) out.push(t.slice(cur));
  return out;
};

const TankaCounter: React.FC = () => {
  const [src, setSrc] = useState("");
  const [mora, setMora] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const ref = useRef<HTMLTextAreaElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setSrc(v);

    const m = countMora(v);
    setMora(m);

    const raw = split(v);
    setLines(
      raw.map((s, i) => s.trim() ? s + "／" : "／")
    );
  };

  const clear = () => {
    setSrc(""); setLines([]); setMora(0);
    ref.current?.focus();
  };

  // 表示用のテキストを組み立て
  const overlayText = lines.join("\n");

  return (
    <div className="card">
      <h1>短歌音数カウンター</h1>
      <p className="sub">ひらがなで入力すると 5-7-5-7-7 に区切ります。</p>

      <label className="lbl">短歌を入力</label>
      <div className="overlay-container">
        <pre className="overlay-text">{overlayText}</pre>
        <textarea
          ref={ref}
          value={src}
          placeholder="ひらがなで短歌を入力…"
          onChange={onChange}
        />
      </div>

      <div className="info">
        {mora} 音{mora > 0 && mora !== TOTAL && <span className="std">(標準 {TOTAL} 音)</span>}
      </div>

      <button onClick={clear}>入力をクリア</button>

      {lines.length > 0 && (
        <>
          <h2>結果</h2>
          <div className="result">
            {lines.map((l,i)=> l && <span key={i}>{l}</span>)}
          </div>
          <div className="badges">
            {STEP.map((n,i)=>(
              <span key={i} className={mora >= STEP.slice(0,i+1).reduce((a,b)=>a+b, 0) ? "badge over" : "badge"}>
                {n}音
              </span>
            ))}
          </div>
          <h2 className="ks">清書欄</h2>
          <textarea
            value={""}
            onChange={() => {}}
            placeholder="漢字・カタカナを含む清書をここに入力…"
            style={{ height: "6rem" }}
          />
        </>
      )}
    </div>
  );
};

export default TankaCounter;
```

```css
/* App.css に追記 */
.overlay-container {
  position: relative;
}

.overlay-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0.75rem;
  pointer-events: none;
  white-space: pre-wrap;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.3);
}

.overlay-container textarea {
  position: relative;
  width: 100%;
  min-height: 6rem;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  line-height: 1.6;
  color: #fff;
}
```
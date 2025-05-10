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

/* ====================================================
                       Component
   ==================================================== */
const TankaCounter: React.FC = () => {
  const [src,   setSrc]   = useState("");
  const [dst,   setDst]   = useState("");            // ← 清書欄
  const [mora,  setMora]  = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [flip,  setFlip]  = useState<boolean[]>(Array(5).fill(false));
  const ref = useRef<HTMLTextAreaElement>(null);

  /* 入力処理 ---------------------------------------- */
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setSrc(v);

    const m = countMora(v);
    setMora(m);

    /* 区切りと表示用スラッシュ */
    const raw = split(v);
    let start = false;
    setLines(
      raw.map(s => {
        if (!start && s.trim() === "") return "";
        start = true;
        return s.trim() ? s + "／" : "／";
      })
    );

    /* バッジ反転 */
    let acc = 0;
    setFlip(
      STEP.map(st => {
        acc += st;
        return m >= acc;
      })
    );
  };

  const clear = () => {
    setSrc(""); setDst(""); setLines([]); setMora(0); setFlip(Array(5).fill(false));
    ref.current?.focus();
  };

  /* JSX --------------------------------------------- */
  return (
    <div className="card">

      <h1>短歌音数カウンター</h1>
      <p className="sub">ひらがなで入力すると 5-7-5-7-7 に区切ります。</p>

      <label className="lbl">短歌を入力</label>
      <textarea
        ref={ref}
        value={src}
        placeholder="ひらがなで短歌を入力…"
        onChange={onChange}
      />

      <div className="info">
        {mora} 音
        {mora > 0 && mora !== TOTAL &&
          <span className="std">(標準 {TOTAL} 音)</span>}
      </div>

      <button onClick={clear}>入力をクリア</button>

      {/* ------------- 結果 ------------- */}
      {lines.length > 0 && (
        <>
          <h2>結果</h2>
          <div className="result">
            {lines.map((l,i)=> l && <span key={i}>{l}</span>)}
          </div>

          <div className="badges">
            {STEP.map((n,i)=>(
              <span key={i} className={flip[i]?"badge over":"badge"}>
                {n}音
              </span>
            ))}
          </div>

          {/* ------------- 清書欄 ------------- */}
          <h2 style={{marginTop:"2.5rem"}}>清書欄</h2>
          <textarea
            value={dst}
            onChange={e=>setDst(e.target.value)}
            placeholder="漢字・カタカナを含む清書をここに入力…"
            style={{height:"6rem"}}
          />
        </>
      )}
    </div>
  );
};

export default TankaCounter;
const fs = require('fs');

let code = fs.readFileSync('src/app/components/CaseStudyModal.tsx', 'utf8');

// Fix type
code = code.replace(
  /watching\?: \{ metrics: string\[\] \};/,
  `watching?: { metrics: { value: string; label: string }[]; caption?: string };`
);

// Fix JSX
code = code.replace(
  /\{study\.watching\.metrics\.map\(\(m\) => \([\s\S]*?<\/li>\n                \)\)}/,
  `{study.watching.metrics.map((m) => (
                  <div key={m.label} className="py-5 border-t border-black/15">
                    <p
                      className="font-[Nyght_Serif]"
                      style={{ fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1, fontWeight: 400, letterSpacing: "-0.02em" }}
                    >
                      {m.value}
                    </p>
                    <p className="mt-3 font-sans text-black/70 text-[14px]">{m.label}</p>
                  </div>
                ))}`
);

// Fix wrapper
code = code.replace(
  /<ul>\n                \{study\.watching\.metrics\.map\(\(m\) => \([\s\S]*?<\/div>\n                \)\)}\n              <\/ul>/,
  `<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-5">
                {study.watching.metrics.map((m) => (
                  <div key={m.label} className="py-5 border-t border-black/15">
                    <p
                      className="font-[Nyght_Serif]"
                      style={{ fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1, fontWeight: 400, letterSpacing: "-0.02em" }}
                    >
                      {m.value}
                    </p>
                    <p className="mt-3 font-sans text-black/70 text-[14px]">{m.label}</p>
                  </div>
                ))}
              </div>
              {study.watching.caption && (
                <p className="font-sans italic text-[14px] text-black/50">{study.watching.caption}</p>
              )}`
);

fs.writeFileSync('src/app/components/CaseStudyModal.tsx', code);

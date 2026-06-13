const fs = require('fs');
let code = fs.readFileSync('src/app/components/CaseStudyModal.tsx', 'utf8');

// Inject earlySignal JSX before watching
code = code.replace(
  /          \{\/\* What we're watching/,
  `          {/* Early Signal */}
          {study.earlySignal && (
            <div className="mb-24 border-l-2 border-black/20 pl-6 md:pl-10">
              <p className="font-sans font-medium text-[13px] text-black/50 uppercase tracking-wider mb-6">Early Signal</p>
              <p
                className="font-[Nyght_Serif] italic text-black/90 max-w-3xl"
                style={{ fontSize: "clamp(24px, 3vw, 40px)", lineHeight: 1.2, letterSpacing: "-0.01em" }}
              >
                "{study.earlySignal}"
              </p>
            </div>
          )}

          {/* What we're watching`
);

// Inject heading/label to shots
code = code.replace(
  /shots: \{ src: string; caption: string; wide\?: boolean \}?\[\];/,
  `shots: { src: string; caption: string; wide?: boolean; heading?: string; label?: string }[];`
);

// Inject heading/label to shots map
code = code.replace(
  /\{study\.shots\.map\(\(shot, i\) => \([\s\S]*?className="w-full h-full object-cover"/,
  `{study.shots.map((shot, i) => (
              <div key={shot.src} className={\`mb-4 md:mb-6 \${shot.wide ? 'md:col-span-2' : ''}\`}>
                {(shot.heading || shot.label) && (
                  <div className="mb-4 md:mb-5">
                    {shot.heading && (
                      <h4 className="font-[Nyght_Serif] text-black text-xl md:text-2xl mb-1">{shot.heading}</h4>
                    )}
                    {shot.label && (
                      <p className="font-sans text-[11px] text-black/40 uppercase tracking-wider">{shot.label}</p>
                    )}
                  </div>
                )}
                <div className="relative w-full aspect-[4/3] bg-black/5 overflow-hidden">
                  <ImageWithFallback
                    src={shot.src}
                    alt={shot.caption}
                    className="w-full h-full object-cover"`
);

// remove the original <div key... line that I skipped in the replace
code = code.replace(
  /\{study\.shots\.map\(\(shot, i\) => \([\s\S]*?<ImageWithFallback\n\s*src=\{shot\.src\}\n\s*alt=\{shot\.caption\}\n\s*className="w-full h-full object-cover"/,
  `{study.shots.map((shot, i) => (
              <div key={shot.src} className={\`mb-4 md:mb-6 \${shot.wide ? 'col-span-1 md:col-span-2' : 'col-span-1'}\`}>
                {(shot.heading || shot.label) && (
                  <div className="mb-4 md:mb-5">
                    {shot.heading && (
                      <h4 className="font-[Nyght_Serif] text-black text-xl md:text-2xl mb-1">{shot.heading}</h4>
                    )}
                    {shot.label && (
                      <p className="font-sans font-medium text-[11px] text-black/50 uppercase tracking-wider">{shot.label}</p>
                    )}
                  </div>
                )}
                <div className="relative w-full aspect-[4/3] bg-black/5 overflow-hidden">
                  <ImageWithFallback
                    src={shot.src}
                    alt={shot.caption}
                    className="w-full h-full object-cover"`
);

fs.writeFileSync('src/app/components/CaseStudyModal.tsx', code);

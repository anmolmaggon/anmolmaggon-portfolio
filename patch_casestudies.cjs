const fs = require('fs');
let code = fs.readFileSync('src/app/components/CaseStudies.tsx', 'utf8');

// Replace the arrow and h3 block
code = code.replace(
  /<div className="relative flex items-start md:items-center">([\s\S]*?)<div className="hidden md:block overflow-hidden/,
  `<div className="relative flex items-start md:items-center">
                  <div className="flex-1 min-w-0 transition-transform duration-500 ease-out md:group-hover:translate-x-[96px]">
                    <h3
                      className="font-[Nyght_Serif] transition-colors duration-500 text-black md:text-black/25 group-hover:text-black text-fluid-h1 leading-[0.95] font-normal tracking-[-0.025em] flex items-start md:items-center md:block"
                    >
                      <span
                        aria-hidden
                        className="font-[Nyght_Serif] inline-block mr-3 md:mr-0 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 md:opacity-0 md:-translate-x-2 transition-all duration-500 ease-out md:group-hover:opacity-100 md:group-hover:translate-x-0 text-fluid-h3 font-normal"
                      >
                        →
                      </span>
                      {s.title}
                    </h3>

                    <div className="hidden md:block overflow-hidden`
);

// Remove the pl-10 from the mobile preview text
code = code.replace(
  /<p className="font-sans text-black\/60 pl-10" style={{ fontSize: 14 }}>/,
  `<p className="font-sans text-black/60" style={{ fontSize: 14 }}>`
);

fs.writeFileSync('src/app/components/CaseStudies.tsx', code);

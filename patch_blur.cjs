const fs = require('fs');
let code = fs.readFileSync('src/app/components/OperatingPrinciples.tsx', 'utf8');
code = code.replace(
  /animate={{ filter: inverted \? "invert\(1\)" : "invert\(0\)" }}/,
  'animate={{ filter: "invert(0)" }}'
);
fs.writeFileSync('src/app/components/OperatingPrinciples.tsx', code);

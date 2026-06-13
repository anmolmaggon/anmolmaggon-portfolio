const fs = require('fs');
let code = fs.readFileSync('src/app/components/TechStackJar.tsx', 'utf8');
code = code.replace(
  /const groupPositionY = isMobile \? -0\.45 : -0\.08;/,
  'const groupPositionY = -0.08;'
);
fs.writeFileSync('src/app/components/TechStackJar.tsx', code);

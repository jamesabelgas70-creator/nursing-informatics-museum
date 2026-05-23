import fs from "fs";
import path from "path";

const base = "C:/Users/nashd/Downloads/drive-download-20260522T233007Z-3-001";
const dest = "C:/Users/nashd/OneDrive/Documents/Nursing Informatics/public/assets/timeline";

for (const decade of ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s"]) {
  const src = path.join(base, decade);
  const target = path.join(dest, decade);
  fs.mkdirSync(target, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const cleanName = file.replace("1..png", "1.png");
    fs.copyFileSync(path.join(src, file), path.join(target, cleanName));
    console.log(`copied ${decade}/${cleanName}`);
  }
}
console.log("All images copied.");

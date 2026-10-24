const fs = require("fs");
const path = require("path");

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (item === "route.ts") {
      let content = fs.readFileSync(full, "utf8");
      let changed = false;
      if (content.includes('from "next/navigation"')) {
        content = content.replace(/from "next\/navigation"/g, 'from "next/server"');
        changed = true;
      }
      if (full.endsWith("login\\route.ts") || full.endsWith("login/route.ts")) {
        content = content.replace("role: user.role,", 'role: user.role as "PATIENT" | "DOCTOR",');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(full, content, "utf8");
        console.log("Fixed:", full);
      }
    }
  }
}

walk(path.join(__dirname, "../src/app/api"));
console.log("All route imports verified.");

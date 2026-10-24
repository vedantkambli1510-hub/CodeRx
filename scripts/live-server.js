const { spawn } = require("child_process");
const path = require("path");
const os = require("os");

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const localIp = getLocalIp();

console.log("\n==================================================");
console.log("       🚀 TRIAGEAI RESILIENT LIVE SERVER          ");
console.log("==================================================");
console.log(`📡 Local Network (Wi-Fi): http://${localIp}:3000`);
console.log(`💻 Local Machine:         http://localhost:3000`);
console.log("==================================================\n");

// 1. Start Next.js on 0.0.0.0:3000
const nextProc = spawn("npx", ["next", "dev", "-H", "0.0.0.0", "-p", "3000"], {
  shell: true,
  stdio: ["inherit", "pipe", "pipe"],
  env: { ...process.env, PORT: "3000" },
});

nextProc.stdout.on("data", (data) => {
  const line = data.toString();
  if (line.includes("Ready") || line.includes("started") || line.includes("Compiled")) {
    process.stdout.write(line);
  }
});

nextProc.stderr.on("data", (data) => {
  process.stderr.write(data);
});

// 2. Start Cloudflare Tunnel with auto-restart on disconnect
let cloudflaredProc = null;

function startCloudflared() {
  console.log("\n🌐 Connecting to Cloudflare High-Speed Edge Tunnel...");
  cloudflaredProc = spawn(".\\cloudflared.exe", ["tunnel", "--url", "http://127.0.0.1:3000"], {
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });

  cloudflaredProc.stderr.on("data", (data) => {
    const text = data.toString();
    const urlMatch = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
    if (urlMatch) {
      console.log("\n==================================================");
      console.log("       ✅ PUBLIC SECURE HTTPS LINK READY          ");
      console.log("==================================================");
      console.log(`🔗 Public URL: ${urlMatch[0]}`);
      console.log(`📱 Mobile Link: ${urlMatch[0]}/patient`);
      console.log(`👨‍⚕️ Doctor Link: ${urlMatch[0]}/doctor`);
      console.log("==================================================\n");
    }
  });

  cloudflaredProc.on("close", (code) => {
    console.log(`⚠️ Cloudflare edge tunnel closed (code ${code}). Reconnecting in 3s...`);
    setTimeout(startCloudflared, 3000);
  });
}

// Wait 2 seconds for Next.js to bind port 3000 before launching tunnel
setTimeout(startCloudflared, 2500);

function cleanup() {
  console.log("\n🛑 Shutting down live server...");
  if (nextProc) nextProc.kill();
  if (cloudflaredProc) cloudflaredProc.kill();
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

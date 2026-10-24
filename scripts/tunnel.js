const localtunnel = require("localtunnel");

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ port: 3000 });
    console.log("TUNNEL_READY_URL:", tunnel.url);

    tunnel.on("close", () => {
      console.log("Tunnel connection closed. Reconnecting in 3s...");
      setTimeout(startTunnel, 3000);
    });

    tunnel.on("error", (err) => {
      console.error("Tunnel encountered error:", err.message);
      tunnel.close();
    });
  } catch (err) {
    console.error("Failed to establish tunnel, retrying...", err.message);
    setTimeout(startTunnel, 5000);
  }
}

// Keep event loop active
setInterval(() => {}, 60000);

startTunnel();

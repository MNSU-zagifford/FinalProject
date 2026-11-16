// ========================================================
// CIS 483 / 583 - MNSU CampusEco
// Phase 3: Task 3.2 - Node.js Server & Telemetry Feed
// Author: Pratik Niroula
// ========================================================

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PUBLIC_DIR = __dirname;

// In-memory array of packages for testing the Node.js API
let packages = [
  { tracking: "PKG10234", destination: "Julia Sears Residence", size: "Medium", weight: 4.5, priority: "Normal", status: "Loaded" },
  { tracking: "PKG39281", destination: "Centennial Student Union", size: "Small", weight: 1.2, priority: "Urgent", status: "En Route" },
  { tracking: "PKG57321", destination: "Memorial Library", size: "Large", weight: 12.0, priority: "Normal", status: "Received" },
  { tracking: "PKG84920", destination: "Armstrong Hall", size: "Medium", weight: 3.8, priority: "Normal", status: "Delivered" },
  { tracking: "PKG12345", destination: "Preska Residence Hall", size: "Small", weight: 2.0, priority: "Normal", status: "Received" }
];

let cart = {
  id: "cart04",
  name: "EcoCart 04",
  battery: 82,
  status: "On Delivery",
  latitude: 44.1472,
  longitude: -93.9989,
  speedMph: 9.0
};

// MIME types for serving static files
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

// Create local server
const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = reqUrl.pathname;

  // Allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // --- API 0: Unified System State Endpoint (Prevents 404s in app.js) ---
  if (pathname === "/api/state") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "success",
      packages,
      vehicles: [cart],
      events: [
        { id: 1, packageId: "PKG10234", text: "Checked in at Perimeter Hub", time: "08:30 AM" },
        { id: 2, packageId: "PKG10234", text: "Loaded onto EcoCart 04", time: "09:15 AM" }
      ]
    }));
    return;
  }

  // --- API 1: Packages Endpoint ---
  if (pathname === "/api/packages") {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "success", packages }));
      return;
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", () => {
        try {
          const newPkg = JSON.parse(body);
          if (!newPkg.tracking || !newPkg.destination) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Missing required fields: tracking and destination" }));
            return;
          }
          newPkg.status = newPkg.status || "Received";
          newPkg.priority = newPkg.priority || "Normal";
          newPkg.weight = parseFloat(newPkg.weight) || 1.0;
          packages.unshift(newPkg);
          console.log(`[Server] New package added: ${newPkg.tracking} -> ${newPkg.destination}`);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "success", package: newPkg }));
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON format" }));
        }
      });
      return;
    }
  }

  // --- API 2: Vehicles Endpoint ---
  if (pathname === "/api/vehicles") {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "success", vehicle: cart }));
      return;
    }
  }

  // --- API 3: Telemetry Stream (Task 3.2 Requirement) ---
  if (pathname === "/api/telemetry") {
    // Simulate slight movement around MNSU campus
    cart.latitude += (Math.random() - 0.5) * 0.0003;
    cart.longitude += (Math.random() - 0.5) * 0.0003;

    const telemetry = {
      timestamp: new Date().toLocaleTimeString(),
      vehicle: cart.name,
      battery: `${cart.battery}%`,
      gps: {
        lat: cart.latitude.toFixed(6),
        lng: cart.longitude.toFixed(6)
      },
      speed: `${(Math.random() * 4 + 7).toFixed(1)} mph`,
      destination: "Centennial Student Union"
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(telemetry, null, 2));
    return;
  }

  // --- Static File Server with Path Traversal Protection ---
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
  let filePath = path.join(PUBLIC_DIR, safePath === "/" ? "index.html" : safePath);

  // Security Check: Verify filePath stays inside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("403 Forbidden: Directory traversal blocked");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Page Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "text/plain";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`MNSU CampusEco Server running at http://localhost:${PORT}`);
  console.log(`Telemetry stream available at http://localhost:${PORT}/api/telemetry`);
});

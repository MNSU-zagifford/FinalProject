// ========================================================
// CIS 483 / 583: Web Applications & User Interface Design
// Project: MNSU CampusEco - Smart Logistics System
// Authors: Pratik Niroula & Zachary Gifford
// ========================================================

// Task 2.1: Model constructors for core system entities
function Package(tracking, destination, size, weight, priority, status) {
  this.tracking = tracking;
  this.destination = destination;
  this.size = size || "Medium";
  this.weight = Number(weight) || 1.0;
  this.priority = priority || "Normal";
  this.status = status || "Received";
}

function Vehicle(id, name, battery, status) {
  this.id = id;
  this.name = name;
  this.battery = Number(battery) || 100;
  this.status = status || "Available";
}

function EcoCourier(id, name, vehicleId) {
  this.id = id;
  this.name = name;
  this.vehicleId = vehicleId || "cart04";
}

// Main CampusEco application module
const CampusEco = (() => {
  const statuses = ["Received", "Loaded", "En Route", "Delivered"];
  const $ = window.jQuery;

  // Starter sample packages so tables are not blank on first run
  const defaultPackages = [
    new Package("PKG10234", "Julia Sears Residence", "Medium", 4.5, "Normal", "Loaded"),
    new Package("PKG39281", "Centennial Student Union", "Small", 1.2, "Urgent", "En Route"),
    new Package("PKG57321", "Memorial Library", "Large", 12.0, "Normal", "Received"),
    new Package("PKG84920", "Armstrong Hall", "Medium", 3.8, "Normal", "Delivered")
  ];

  const defaultVehicle = new Vehicle("cart04", "EcoCart 04", 82, "On Delivery");

  // State object: tracks live packages, vehicles, and audit events
  const state = {
    packages: defaultPackages,
    vehicles: [defaultVehicle],
    events: [
      { at: new Date().toISOString(), kind: "Status", tracking: "PKG10234", detail: "Loaded into EcoCart 04" },
      { at: new Date().toISOString(), kind: "Registration", tracking: "PKG57321", detail: "Checked in at Central Hub" }
    ],
    selectedTracking: "PKG10234"
  };

  // Helper to escape HTML characters and prevent XSS
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  // Display status or error notifications in the UI
  const message = (area, text, error = false) => {
    const el = $("#" + area + "-message");
    if (!el.length) return;
    el.text(text).toggleClass("error", error).show();
    setTimeout(() => el.fadeOut(600), 3500);
  };

  // Helper for JSON request payloads
  const json = (method, body) => ({ method, body: JSON.stringify(body) });

  // Asynchronous request handler: queries the API with fallback to local state
  async function request(url, options = {}) {
    // If running in browser over HTTP, attempt live API request
    if (window.location.protocol.startsWith("http")) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: { "Content-Type": "application/json", ...options.headers }
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn("API request failed, utilizing local state:", err.message);
      }
    }

    // Local fallback: simulate API response using local memory
    if (url.includes("/api/state") || url.includes("/api/packages")) {
      return { packages: state.packages, vehicles: state.vehicles, events: state.events };
    }
    return { status: "success" };
  }

  // Refresh data and update views
  async function refresh() {
    try {
      const data = await request("/api/state");
      if (data && data.packages && data.packages.length) {
        state.packages = data.packages;
        if (data.vehicles) state.vehicles = data.vehicles;
        if (data.events) state.events = data.events;
      }
    } catch (e) {
      console.log("Using cached state:", e.message);
    }
    renderHub();
    renderCrew();
  }

  // Safe wrapper for async actions with user feedback
  async function safe(area, fn) {
    try {
      await fn();
    } catch (e) {
      message(area, e.message, true);
    }
  }

  // ------------------------------------------------------
  // 1. Central Hub View
  // ------------------------------------------------------
  function renderHub() {
    if (!$("#hub-rows").length) return;

    // 1. Update the 3 summary metric cards
    $("#total-packages").text(state.packages.length);
    $("#transit-packages").text(state.packages.filter(p => p.status === "Loaded" || p.status === "En Route").length);
    $("#delivered-packages").text(state.packages.filter(p => p.status === "Delivered").length);

    // 2. Filter rows using the search box
    const term = ($("#package-search").val() || "").toLowerCase();
    const filtered = state.packages.filter(p =>
      (p.tracking + " " + p.destination).toLowerCase().includes(term)
    );

    // 3. Render the table rows
    if (filtered.length === 0) {
      $("#hub-rows").html('<tr><td colspan="5" style="text-align:center;">No packages found</td></tr>');
    } else {
      $("#hub-rows").html(filtered.map(p => `
        <tr>
          <td><strong>${escapeHtml(p.tracking)}</strong></td>
          <td>${escapeHtml(p.destination)}</td>
          <td>${escapeHtml(p.priority)}</td>
          <td><span class="status-tag">${escapeHtml(p.status)}</span></td>
          <td>
            <select class="status-select" data-tracking="${escapeHtml(p.tracking)}">
              ${statuses.map(st => `<option ${st === p.status ? "selected" : ""} value="${st}">${st}</option>`).join("")}
            </select>
          </td>
        </tr>
      `).join(""));
    }

    // 4. Update the recent events list
    if ($("#event-list").length) {
      $("#event-list").html(state.events.slice(0, 6).map(e => `
        <li>${escapeHtml(e.kind)}: ${escapeHtml(e.tracking || "Vehicle")} (${escapeHtml(e.detail)})</li>
      `).join("") || "<li>No events recorded yet</li>");
    }
  }

  // ------------------------------------------------------
  // 2. Eco-Transit Crew View
  // ------------------------------------------------------
  function renderCrew() {
    const tableBody = $("#route-rows, #driver-route-rows");
    if (!tableBody.length) return;

    const cart = state.vehicles.find(v => v.id === "cart04") || state.vehicles[0] || defaultVehicle;

    // 1. Update vehicle cards
    $("#battery-display, #driver-battery-display").text((cart.battery ?? 82) + "%");
    $("#assigned-vehicle, #driver-vehicle-name").text(cart.name || "EcoCart 04");

    const activeList = state.packages.filter(p => p.status !== "Delivered");
    $("#delivery-count, #driver-deliveries-count").text(activeList.length);

    // 2. Render route table rows
    if (activeList.length === 0) {
      tableBody.html('<tr><td colspan="4" style="text-align:center;">All deliveries completed for today</td></tr>');
    } else {
      tableBody.html(activeList.map(p => `
        <tr>
          <td><strong>${escapeHtml(p.tracking)}</strong></td>
          <td>${escapeHtml(p.destination)}</td>
          <td>${escapeHtml(p.priority)}</td>
          <td>
            ${escapeHtml(p.status)}
            <button class="advance-package small-button" data-tracking="${escapeHtml(p.tracking)}">Next Step</button>
          </td>
        </tr>
      `).join(""));
    }
  }

  // ------------------------------------------------------
  // 3. Package Tracking View
  // ------------------------------------------------------
  function showTracking(p) {
    state.selectedTracking = p.tracking;
    const step = statuses.indexOf(p.status);

    $("#track-id-display").text(p.tracking);
    $("#track-dest-display").text(p.destination);

    // Highlight 4 tracking steps
    $(".tracking-step").each((i, el) => {
      $(el).toggleClass("step-complete", i <= step);
    });

    if ($("#delivery-location").length && p.location) {
      $("#delivery-location").val(p.location);
    }
  }

  // ------------------------------------------------------
  // Event Listeners (DOM Ready)
  // ------------------------------------------------------
  function init() {
    // Initial render
    refresh();

    // 1. Central Hub: Register Form Submit
    $("#register-form").on("submit", e => {
      e.preventDefault();
      safe("hub", async () => {
        const tracking = $("#new-tracking").val().trim().toUpperCase();
        const destination = $("#new-destination").val().trim();
        const size = $("#new-size").val();
        const weight = Number($("#new-weight").val()) || 1.0;
        const priority = $("#new-priority").val();

        if (state.packages.some(p => p.tracking === tracking)) {
          throw new Error("Tracking number already exists");
        }

        const newPkg = new Package(tracking, destination, size, weight, priority, "Received");
        state.packages.unshift(newPkg);

        state.events.unshift({
          at: new Date().toISOString(),
          kind: "Registration",
          tracking: tracking,
          detail: `Destination: ${destination}`
        });

        $("#register-form")[0].reset();
        renderHub();
        message("hub", `Registered ${newPkg.tracking} successfully`);
      });
    });

    // 2. Central Hub: Package Search Filter
    $("#package-search").on("input keyup", renderHub);

    // 3. Central Hub: Dropdown Status Change
    $("#hub-rows").on("change", ".status-select", function () {
      const tracking = this.dataset.tracking;
      const status = this.value;
      safe("hub", async () => {
        const item = state.packages.find(p => p.tracking === tracking);
        if (item) {
          item.status = status;
          state.events.unshift({
            at: new Date().toISOString(),
            kind: "Status",
            tracking: tracking,
            detail: `Updated to ${status}`
          });
          renderHub();
          message("hub", `${tracking} updated to ${status}`);
        }
      });
    });

    // 4. Eco-Transit: Claim Next Delivery
    $("#claim-delivery, #claim-delivery-btn").on("click", () => {
      safe("crew", async () => {
        const nextPkg = state.packages.find(p => p.status === "Received");
        if (!nextPkg) {
          throw new Error("No pending packages available to claim");
        }
        nextPkg.status = "Loaded";
        renderCrew();
        message("crew", `Claimed ${nextPkg.tracking} into EcoCart`);
      });
    });

    // 5. Eco-Transit: Advance Single Package to Next Step
    $(document).on("click", ".advance-package", function () {
      const id = this.dataset.tracking;
      safe("crew", async () => {
        const p = state.packages.find(x => x.tracking === id);
        if (!p) return;
        const nextIndex = statuses.indexOf(p.status) + 1;
        if (nextIndex < statuses.length) {
          p.status = statuses[nextIndex];
          renderCrew();
          message("crew", `${id} is now ${p.status}`);
        }
      });
    });

    // 6. Eco-Transit: Battery Report Form
    $("#battery-form").on("submit", e => {
      e.preventDefault();
      safe("crew", async () => {
        const batteryVal = Number($("#battery").val());
        const statusVal = $("#vehicle-status").val();
        const cartSelect = $("#vehicle").val();

        const cart = state.vehicles.find(v => v.id === "cart04") || defaultVehicle;
        cart.battery = batteryVal;
        if (statusVal) cart.status = statusVal;
        if (cartSelect === "cart07") cart.name = "EcoCart 07";
        else if (cartSelect === "cart11") cart.name = "EcoCart 11";
        else cart.name = "EcoCart 04";

        renderCrew();
        message("crew", `Battery report saved: ${batteryVal}%`);
      });
    });

    // 7. Recipient: Track Package
    $("#tracking-form").on("submit", e => {
      e.preventDefault();
      safe("recipient", async () => {
        const id = $("#tracking-number").val().trim().toUpperCase();
        const p = state.packages.find(x => x.tracking === id);
        if (!p) {
          throw new Error(`Tracking number "${id}" not found`);
        }
        showTracking(p);
        message("recipient", "Tracking details loaded");
      });
    });

    // 8. Recipient: Delivery Preferences
    $("#preferences-form").on("submit", e => {
      e.preventDefault();
      safe("recipient", async () => {
        const loc = $("#delivery-location option:selected").text().trim();
        message("recipient", `Preferences saved: Priority drop-off at ${loc}`);
      });
    });
  }

  // Register AngularJS module if loaded
  if (window.angular) {
    angular.module("campusEcoLive", []).controller("LiveController", ["$scope", function ($scope) {
      $scope.note = "All priority packages sorted for the afternoon route.";
      $scope.view = "active";
    }]);
  }

  // Launch when jQuery is ready
  if ($) {
    $(init);
  }

  return { state, refresh, request, renderHub, renderCrew, showTracking };
})();

/**
 * Indeed Candidate Shortcuts v1.2
 * Keyboard shortcuts for rapid candidate review on employers.indeed.com
 *
 * Home-row layout (left hand, QWERTY):
 *   A = Accept / Shortlist (✓)
 *   S = Skip / Undecided (?)
 *   D = Decline / Reject (✕)
 *   F = Forward / Next candidate →
 *   G = Go back / Previous candidate ←
 */

(function () {
  "use strict";

  // ── Selectors (from actual Indeed DOM) ─────────────────────────────

  const SELECTORS = {
    shortlist: 'button[data-testid="ApplicantSentiment-yes"]',
    undecided: 'button[data-testid="ApplicantSentiment-maybe"]',
    reject: 'button[data-testid="ApplicantSentiment-no"]',
    next: 'button#nextPreBlock-next, button[aria-label="Next candidate"]',
    prev: 'button#nextPreBlock-prev, button[aria-label="Previous candidate"]',
  };

  // Fallback selectors (aria-labels) in case Indeed changes testids
  const FALLBACK = {
    shortlist: 'button[aria-label="Add to Shortlist"]',
    undecided: 'button[aria-label="Add to Undecided"]',
    reject: 'button[aria-label="Reject"]',
    next: 'button[aria-label="Next candidate"]',
    prev: 'button[aria-label="Previous candidate"]',
  };

  // ── Button Finder ──────────────────────────────────────────────────

  function getButton(action) {
    return (
      document.querySelector(SELECTORS[action]) ||
      document.querySelector(FALLBACK[action]) ||
      null
    );
  }

  // ── Toast Notification ─────────────────────────────────────────────

  let toastTimer = null;

  function showToast(message, type) {
    let container = document.getElementById("indeed-shortcuts-toast");
    if (!container) {
      container = document.createElement("div");
      container.id = "indeed-shortcuts-toast";
      document.body.appendChild(container);
    }
    container.textContent = message;
    container.className = "indeed-shortcuts-toast show " + (type || "info");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      container.className = "indeed-shortcuts-toast";
    }, 1200);
  }

  // ── Click Utility ──────────────────────────────────────────────────

  function safeClick(action, label) {
    const el = getButton(action);
    if (!el) {
      showToast("Not found: " + label, "error");
      console.warn("[Indeed Shortcuts] Button not found:", action);
      return false;
    }
    if (el.disabled || el.getAttribute("aria-disabled") === "true") {
      showToast(label + " (disabled)", "error");
      return false;
    }
    el.click();
    showToast(label, "success");
    return true;
  }

  // ── Keyboard Handler ───────────────────────────────────────────────

  function handleKeydown(e) {
    // Don't fire when typing in inputs, textareas, or contenteditable
    const tag = (e.target.tagName || "").toLowerCase();
    if (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      e.target.isContentEditable
    ) {
      return;
    }

    // Don't fire with modifier keys (allow normal browser shortcuts)
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    switch (e.key.toLowerCase()) {
      case "a":
        e.preventDefault();
        safeClick("shortlist", "Shortlisted ✓");
        break;

      case "s":
        e.preventDefault();
        safeClick("undecided", "Undecided ?");
        break;

      case "d":
        e.preventDefault();
        safeClick("reject", "Rejected ✕");
        break;

      case "f":
        e.preventDefault();
        safeClick("next", "Next →");
        break;

      case "g":
        e.preventDefault();
        safeClick("prev", "← Previous");
        break;

      default:
        break;
    }
  }

  // ── Init ───────────────────────────────────────────────────────────

  document.addEventListener("keydown", handleKeydown, true);

  const VERSION = "1.2";

  console.log(
    `[Indeed Shortcuts v${VERSION}] Active — A=Shortlist, S=Undecided, D=Reject, F=Next, G=Prev`
  );

  // Show version toast briefly on load so you can confirm the reload worked
  setTimeout(() => showToast(`Indeed Shortcuts v${VERSION} loaded`, "info"), 500);
})();

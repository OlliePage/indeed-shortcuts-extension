/**
 * Indeed Candidate Shortcuts v1.3
 * Keyboard shortcuts for rapid candidate review on employers.indeed.com
 *
 * Home-row layout (left hand, QWERTY):
 *   A = Accept / Shortlist (✓)
 *   S = Skip / Undecided (?)
 *   D = Decline / Reject (✕)
 *   F = Forward / Next candidate →
 *   G = Go back / Previous candidate ←
 *   C = CV / Download candidate's CV ↓
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

  // ── Download CV Utility ───────────────────────────────────────────

  function downloadCV() {
    // Try 1: Inline download link (visible on the resume panel)
    const inlineLink = document.querySelector(
      'a[data-testid="download-resume-inline"]'
    );
    if (inlineLink) {
      inlineLink.click();
      showToast("Downloading CV ↓", "success");
      return;
    }

    // Try 2: Download link already visible in the More Actions dropdown
    const menuLink = document.querySelector(
      'a[data-testid="download-resume-moreActions"]'
    );
    if (menuLink) {
      menuLink.click();
      showToast("Downloading CV ↓", "success");
      return;
    }

    // Try 3: Open the More Actions menu, then click the download link
    const moreBtn =
      document.querySelector('button#rightSectionActionsOverflow') ||
      document.querySelector('button[aria-label="More actions"]');
    if (!moreBtn) {
      showToast("Not found: Download CV", "error");
      console.warn("[Indeed Shortcuts] More Actions button not found");
      return;
    }

    moreBtn.click();

    // Wait briefly for the dropdown menu to render, then click Download CV
    setTimeout(() => {
      const link = document.querySelector(
        'a[data-testid="download-resume-moreActions"]'
      );
      if (link) {
        link.click();
        showToast("Downloading CV ↓", "success");
      } else {
        showToast("Not found: Download CV", "error");
        console.warn(
          "[Indeed Shortcuts] Download CV link not found in menu"
        );
      }
    }, 300);
  }

  // ── Click Utility ──────────────────────────────────────────────────

  function safeClick(action, label, type) {
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
    showToast(label, type || "success");
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
        safeClick("shortlist", "Shortlisted ✓", "success");
        break;

      case "s":
        e.preventDefault();
        safeClick("undecided", "Undecided ?", "warning");
        break;

      case "d":
        e.preventDefault();
        safeClick("reject", "Rejected ✕", "error");
        break;

      case "f":
        e.preventDefault();
        safeClick("next", "Next →", "info");
        break;

      case "g":
        e.preventDefault();
        safeClick("prev", "← Previous", "info");
        break;

      case "c":
        e.preventDefault();
        downloadCV();
        break;

      default:
        break;
    }
  }

  // ── Init ───────────────────────────────────────────────────────────

  document.addEventListener("keydown", handleKeydown, true);

  const VERSION = "1.3";

  console.log(
    `[Indeed Shortcuts v${VERSION}] Active — A=Shortlist, S=Undecided, D=Reject, F=Next, G=Prev, C=Download CV`
  );

  // Show version toast briefly on load so you can confirm the reload worked
  setTimeout(() => showToast(`Indeed Shortcuts v${VERSION} loaded`, "info"), 500);
})();

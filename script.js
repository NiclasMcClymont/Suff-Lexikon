/**
 * Lädt synonyme.txt (eine Zeile = ein Spruch), mischt sie, und gibt pro Klick
 * den nächsten aus – ohne Wiederholungen, bis alles durch ist.
 */

const synonymEl = document.getElementById("synonym");
const nextBtn = document.getElementById("next");

let deck = [];      // gemischte Liste
let cursor = 0;     // aktueller Index

function shuffleInPlace(arr) {
  // Fisher–Yates
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickNext() {
  if (!deck.length) {
    synonymEl.textContent = "(Keine Synonyme gefunden – synonyme.txt fehlt?)";
    return;
  }

  // Wenn wir durch sind: neu mischen, erneut durchlaufen
  if (cursor >= deck.length) {
    shuffleInPlace(deck);
    cursor = 0;
  }

  synonymEl.textContent = deck[cursor];
  cursor++;
}

async function loadSynonyms() {
  try {
    const res = await fetch("synonyme.txt", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);

    const text = await res.text();

    const lines = text
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)
      .filter(s => !s.startsWith("#")); // Kommentare erlauben

    deck = shuffleInPlace(lines);
    cursor = 0;

    pickNext();
  } catch (e) {
    synonymEl.textContent = "Konnte synonyme.txt nicht laden. (Lokal geöffnet? Starte einen Mini-Server)";
    console.error(e);
  }
}

nextBtn.addEventListener("click", pickNext);

// Tastatur: Leertaste / Enter = nächstes
window.addEventListener("keydown", (ev) => {
  if (ev.code === "Space" || ev.code === "Enter") {
    ev.preventDefault();
    pickNext();
  }
});

loadSynonyms();
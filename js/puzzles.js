// Tier 1 = easiest (green), 4 = hardest (red)
// Each tier has multiple authored groups; a puzzle is composed at runtime by
// picking one group per tier (avoiding word collisions across the four picks).

const GROUPS_BY_TIER = {
  1: [
    { category: "צבעי הקשת", words: ["אדום", "כחול", "ירוק", "צהוב"] },
    { category: "פירות הדר", words: ["לימון", "תפוז", "אשכולית", "מנדרינה"] },
    { category: "כלי נגינה", words: ["גיטרה", "פסנתר", "חליל", "תוף"] },
    { category: "חיות בית", words: ["כלב", "חתול", "אוגר", "תוכי"] },
    { category: "פרחים", words: ["שושן", "כלנית", "רקפת", "נרקיס"] },
    { category: "כלי תחבורה", words: ["אוטובוס", "רכבת", "אופניים", "מטוס"] },
    { category: "ירקות", words: ["מלפפון", "עגבנייה", "סלק", "פלפל"] },
    { category: "ספורט מים", words: ["שחייה", "גלישה", "צלילה", "חתירה"] },
    { category: "כלי כתיבה", words: ["עיפרון", "עט", "טוש", "מחק"] },
    { category: "פירות יער", words: ["תות", "פטל", "אוכמנייה", "דובדבן"] }
  ],

  2: [
    { category: "ימי השבוע", words: ["ראשון", "שני", "שלישי", "רביעי"] },
    { category: "ערים בישראל", words: ["חיפה", "אילת", "טבריה", "צפת"] },
    { category: "ארצות באירופה", words: ["צרפת", "ספרד", "איטליה", "יוון"] },
    { category: "כוכבי לכת", words: ["מאדים", "נוגה", "צדק", "שבתאי"] },
    { category: "סוגי קפה", words: ["הפוך", "שחור", "נמס", "אספרסו"] },
    { category: "סוגי לחם", words: ["פיתה", "בגט", "חלה", "לחמנייה"] },
    { category: "מקצועות רפואה", words: ["רופא", "אחות", "פרמדיק", "רוקח"] },
    { category: "בעלי כנפיים", words: ["יונה", "נשר", "עורב", "ברווז"] },
    { category: "כלי מטבח", words: ["סיר", "מחבת", "סכין", "כף"] },
    { category: "ארצות באסיה", words: ["סין", "יפן", "הודו", "תאילנד"] }
  ],

  3: [
    { category: "להקות ישראליות", words: ["משינה", "אתניקס", "טיפקס", "מנגו"] },
    { category: "חברי הביטלס", words: ["ג'ון", "פול", "ג'ורג'", "רינגו"] },
    { category: "ראשי ממשלה לשעבר", words: ["בגין", "רבין", "פרס", "שמיר"] },
    { category: "חגים יהודיים", words: ["סוכות", "פסח", "פורים", "שבועות"] },
    { category: "תבלינים", words: ["כורכום", "כמון", "פפריקה", "זעתר"] },
    { category: "סוגי גבינה", words: ["צפתית", "פטה", "קממבר", "מוצרלה"] },
    { category: "סוגי גשם", words: ["טפטוף", "ממטר", "מבול", "זרזיף"] },
    { category: "פעולות בטלפון", words: ["חיוג", "ניתוק", "המתנה", "העברה"] },
    { category: "חודשים בלוח העברי", words: ["ניסן", "אייר", "סיוון", "תמוז"] },
    { category: "מטבעות בעולם", words: ["שקל", "דולר", "יורו", "ין"] },
    { category: "מילים שלפניהן 'ים'", words: ["תיכון", "כספי", "סוף", "אגאי"] }
  ],

  4: [
    { category: "מילים שאחריהן 'לבן'", words: ["יין", "גבן", "דגל", "רעש"] },
    { category: "מילים שלפניהן 'בית'", words: ["ספר", "חולים", "כנסת", "קפה"] },
    { category: "יכולים להיות גם שמות פרטיים", words: ["שחר", "טל", "ליאור", "נועם"] },
    { category: "דברים שמסתובבים", words: ["גלגל", "סביבון", "כדור", "תקליט"] },
    { category: "דברים עם זנב", words: ["דג", "שביט", "עפיפון", "סוס"] },
    { category: "דברים שמקפלים", words: ["כביסה", "מפה", "מטרייה", "כסא"] },
    { category: "דברים שמדליקים", words: ["נר", "אש", "סיגריה", "מנורה"] },
    { category: "מילים שלפניהן 'אבן'", words: ["שואבת", "בוחן", "פינה", "חצץ"] },
    { category: "מילים שאחריהן 'שמש'", words: ["זריחת", "שעון", "שקיעת", "מכת"] },
    { category: "סוגי מבטים", words: ["חטוף", "מאוהב", "קר", "מזלזל"] }
  ]
};

const TIER_NAMES = { 1: "ירוק", 2: "צהוב", 3: "כתום", 4: "אדום" };

function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Compose a fresh puzzle: one group per tier, no word collisions across tiers.
// `avoidGroups` is an optional Set of recently used groups (by reference) we'd
// prefer to skip to reduce immediate repetition.
function composePuzzle(avoidGroups) {
  const avoid = avoidGroups instanceof Set ? avoidGroups : new Set();
  for (let attempt = 0; attempt < 30; attempt++) {
    const used = new Set();
    const picked = [];
    let ok = true;
    for (const tier of [1, 2, 3, 4]) {
      const candidates = shuffleArr(GROUPS_BY_TIER[tier]).filter(g =>
        !g.words.some(w => used.has(w))
      );
      if (candidates.length === 0) { ok = false; break; }
      const fresh = candidates.find(g => !avoid.has(g)) || candidates[0];
      fresh.words.forEach(w => used.add(w));
      picked.push({ ...fresh, difficulty: tier, _ref: fresh });
    }
    if (ok) return picked;
  }
  // Should not reach here; fall back to a plain composition
  return [1, 2, 3, 4].map(tier => {
    const g = GROUPS_BY_TIER[tier][0];
    return { ...g, difficulty: tier, _ref: g };
  });
}

// Difficulty curve: how many wrong guesses are allowed at a given level.
// Starts forgiving and tightens as the player advances.
function attemptsForLevel(level) {
  if (level <= 2) return 6;
  if (level <= 5) return 5;
  if (level <= 9) return 4;
  return 3;
}

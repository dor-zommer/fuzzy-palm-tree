// Tier 1 = easiest (green), 4 = hardest (red)
// Each tier has multiple authored groups; a puzzle is composed at runtime by
// picking one group per tier-slot (avoiding word collisions across the four
// picks). At higher levels the slots are drawn from harder pools, so the
// "green" slot might in fact be a tier-2 group, etc.

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
    { category: "פירות יער", words: ["תות", "פטל", "אוכמנייה", "דובדבן"] },
    { category: "חיות חווה", words: ["פרה", "תרנגול", "כבשה", "עז"] },
    { category: "חיות יער", words: ["דוב", "צבי", "שועל", "זאב"] },
    { category: "סוגי בגד", words: ["חולצה", "מכנסיים", "חצאית", "שמלה"] },
    { category: "ריהוט בית", words: ["שולחן", "ספה", "מיטה", "ארון"] },
    { category: "סוגי כדור", words: ["כדורסל", "כדורגל", "טניס", "כדורעף"] },
    { category: "אגוזים", words: ["בוטן", "פיסטוק", "קשיו", "שקד"] },
    { category: "צבעי האדמה", words: ["חום", "בז'", "חרדל", "כתום"] },
    { category: "מיני דגים", words: ["סלמון", "טונה", "דניס", "בורי"] },
    { category: "מקצועות בנייה", words: ["שרברב", "חשמלאי", "צבע", "נגר"] }
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
    { category: "ארצות באסיה", words: ["סין", "יפן", "הודו", "תאילנד"] },
    { category: "ערים באירופה", words: ["פריז", "רומא", "ברלין", "מדריד"] },
    { category: "סוגי עוגה", words: ["שיש", "גבינה", "גזר", "שוקולד"] },
    { category: "תבלינים חריפים", words: ["צ'ילי", "חרדל", "ג'ינג'ר", "חזרת"] },
    { category: "ימים מיוחדים", words: ["זיכרון", "עצמאות", "ירושלים", "שואה"] },
    { category: "סוגי ריקוד", words: ["סלסה", "טנגו", "ואלס", "באלט"] },
    { category: "מטבעות בעולם", words: ["שקל", "דולר", "יורו", "ין"] },
    { category: "סופי שבוע באנגלית", words: ["סאטרדיי", "פריידיי", "מאנדיי", "סאנדיי"] },
    { category: "חודשים לועזיים", words: ["ינואר", "מרץ", "יולי", "אוקטובר"] },
    { category: "ערים בארה\"ב", words: ["שיקגו", "בוסטון", "סיאטל", "דאלאס"] },
    { category: "מקצועות בית הספר", words: ["מתמטיקה", "ספרות", "היסטוריה", "גאוגרפיה"] },
    { category: "מותגי רכב", words: ["טויוטה", "פורד", "מאזדה", "סובארו"] },
    { category: "אביזרי לבוש", words: ["צעיף", "כובע", "כפפה", "חגורה"] }
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
    { category: "מילים שלפניהן 'ים'", words: ["תיכון", "כספי", "סוף", "אגאי"] },
    { category: "שבטי ישראל", words: ["ראובן", "שמעון", "לוי", "יהודה"] },
    { category: "עצי פרי", words: ["זית", "רימון", "תמר", "תאנה"] },
    { category: "הרים בארץ", words: ["כרמל", "חרמון", "תבור", "גלבוע"] },
    { category: "נשיאי ארה\"ב", words: ["וושינגטון", "לינקולן", "קנדי", "אובמה"] },
    { category: "שפות תכנות", words: ["פייתון", "ג'אווה", "רובי", "גו"] },
    { category: "כינויים לכסף (סלנג)", words: ["בייגלה", "שטרות", "מזומן", "ביצים"] },
    { category: "מילים שלפניהן 'גן'", words: ["ילדים", "חיות", "עדן", "ירק"] },
    { category: "סוגי תה", words: ["ירוק", "שחור", "צמחים", "צ'אי"] },
    { category: "מוצרי חלב", words: ["יוגורט", "חמאה", "שמנת", "לבן"] },
    { category: "אמצעי תשלום", words: ["צ'ק", "מזומן", "אשראי", "העברה"] },
    { category: "כינויים לחבר טוב", words: ["אחי", "ברו", "בעלל'ה", "אחלה"] },
    { category: "סוגי בד", words: ["כותנה", "משי", "צמר", "פשתן"] },
    { category: "ספרי תנ\"ך", words: ["בראשית", "שמות", "ויקרא", "במדבר"] },
    { category: "כיווני רוח", words: ["צפון", "דרום", "מזרח", "מערב"] },
    { category: "חברות תעופה", words: ["אלעל", "דלתא", "לופטהנזה", "איזיג'ט"] },
    { category: "סוגי בריכת שחייה", words: ["אולימפית", "עירונית", "ביתית", "מלוחה"] },
    { category: "כותבי דרמה", words: ["שייקספיר", "מולייר", "צ'כוב", "איבסן"] }
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
    { category: "סוגי מבטים", words: ["חטוף", "מאוהב", "קר", "מזלזל"] },
    { category: "מילים שאחריהן 'חלב'", words: ["כוס", "מוצרי", "שיני", "פרת"] },
    { category: "מילים שאחריהן 'שחור'", words: ["יום", "שוק", "חור", "סוס"] },
    { category: "מילים שלפניהן 'יד'", words: ["ימין", "רחבה", "חופשית", "קמוצה"] },
    { category: "דברים שיורדים", words: ["גשם", "שלג", "מסך", "מחיר"] },
    { category: "דברים שעולים", words: ["שמש", "מחיר", "כיתה", "בצק"] },
    { category: "כלים עם 'ראש'", words: ["מקלחת", "מסמר", "פטיש", "מטה"] },
    { category: "דברים בעלי קליפה", words: ["בננה", "ביצה", "אגוז", "צב"] },
    { category: "דברים שצורבים", words: ["שמש", "פלפל", "אהבה", "ויסקי"] },
    { category: "דברים שמתפוצצים", words: ["בלון", "פצצה", "לב", "וולקן"] },
    { category: "מילים שאחריהן 'זהב'", words: ["מטיל", "לב", "אצבע", "מדליית"] },
    { category: "מילים שאחריהן 'דם'", words: ["לחץ", "ספיגת", "תורם", "אחי"] },
    { category: "מילים שאחריהן 'אש'", words: ["חיל", "ניצוץ", "כיבוי", "להבת"] },
    { category: "מילים שלפניהן 'איש'", words: ["צבא", "עסקים", "מקצוע", "חינוך"] },
    { category: "ביטויים עם 'עין'", words: ["טובה", "רעה", "פקוחה", "צרה"] },
    { category: "דברים בעלי שורש", words: ["עץ", "מילה", "בעיה", "שן"] },
    { category: "דברים שהם גם פעלים", words: ["סבון", "צבע", "אבק", "קור"] },
    { category: "מילים שלפניהן 'דרך'", words: ["ארץ", "ביצוע", "אגב", "כלל"] },
    { category: "צבעים שהם גם רגשות", words: ["אדום", "ירוק", "שחור", "ורוד"] }
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

// Which difficulty pool feeds each color slot at a given level.
// Slots are [green, yellow, orange, red]. As level rises the green and yellow
// slots are pulled from harder pools, so the whole board gets tougher.
function tiersForLevel(level) {
  if (level <= 2) return [1, 2, 3, 4];
  if (level <= 5) return [1, 2, 3, 4];
  if (level <= 9) return [2, 2, 3, 4];
  if (level <= 14) return [2, 3, 3, 4];
  if (level <= 19) return [2, 3, 4, 4];
  return [3, 3, 4, 4];
}

// Compose a fresh puzzle: one group per slot, no word collisions across
// slots. Each slot draws from the pool dictated by tiersForLevel.
// `avoidGroups` is an optional Set of recently used groups (by reference) we'd
// prefer to skip to reduce immediate repetition.
function composePuzzle(level, avoidGroups) {
  const avoid = avoidGroups instanceof Set ? avoidGroups : new Set();
  const slotTiers = tiersForLevel(level);

  for (let attempt = 0; attempt < 60; attempt++) {
    const used = new Set();
    const picked = [];
    const pickedRefs = new Set();
    let ok = true;

    for (let slot = 0; slot < 4; slot++) {
      const pool = GROUPS_BY_TIER[slotTiers[slot]];
      const candidates = shuffleArr(pool).filter(g =>
        !pickedRefs.has(g) && !g.words.some(w => used.has(w))
      );
      if (candidates.length === 0) { ok = false; break; }
      const fresh = candidates.find(g => !avoid.has(g)) || candidates[0];
      fresh.words.forEach(w => used.add(w));
      pickedRefs.add(fresh);
      // Display difficulty stays slot+1 (green→red), so colors remain stable
      // while the underlying content gets harder with level.
      picked.push({ ...fresh, difficulty: slot + 1, _ref: fresh });
    }
    if (ok) return picked;
  }

  // Last-resort fallback: pick anything to avoid a hard crash.
  const used = new Set();
  return [0, 1, 2, 3].map(slot => {
    const pool = GROUPS_BY_TIER[slotTiers[slot]];
    const g = pool.find(group => !group.words.some(w => used.has(w))) || pool[0];
    g.words.forEach(w => used.add(w));
    return { ...g, difficulty: slot + 1, _ref: g };
  });
}

// Difficulty curve: how many wrong guesses are allowed at a given level.
// Tighter than the original — the board gets harder *and* you get fewer
// chances as you climb.
function attemptsForLevel(level) {
  if (level <= 2) return 5;
  if (level <= 5) return 4;
  if (level <= 9) return 4;
  if (level <= 14) return 3;
  return 3;
}

// How many hint reveals the player gets per level. Hints disappear at expert
// levels so you can't lean on them.
function hintsForLevel(level) {
  if (level <= 2) return 2;
  if (level <= 9) return 1;
  return 0;
}

// Whether to tell the player when they were "one word away" from a group.
// Removed at higher levels — that feedback is a substantial crutch.
function showOneAwayForLevel(level) {
  return level <= 5;
}

// Difficulty 1 = easiest (green), 4 = hardest (red)
const PUZZLES = {
  easy: [
    {
      author: "המשחק",
      groups: [
        { difficulty: 1, category: "צבעי הקשת", words: ["אדום", "כחול", "ירוק", "צהוב"] },
        { difficulty: 2, category: "פירות הדר", words: ["לימון", "תפוז", "אשכולית", "מנדרינה"] },
        { difficulty: 3, category: "כלי נגינה", words: ["גיטרה", "פסנתר", "חליל", "תוף"] },
        { difficulty: 4, category: "ימי השבוע", words: ["ראשון", "שני", "שלישי", "רביעי"] }
      ]
    },
    {
      author: "המשחק",
      groups: [
        { difficulty: 1, category: "חיות בית", words: ["כלב", "חתול", "אוגר", "תוכי"] },
        { difficulty: 2, category: "פרחים", words: ["שושן", "כלנית", "רקפת", "נרקיס"] },
        { difficulty: 3, category: "ירקות", words: ["מלפפון", "עגבנייה", "גזר", "פלפל"] },
        { difficulty: 4, category: "חודשי השנה", words: ["ניסן", "אייר", "סיוון", "תמוז"] }
      ]
    },
    {
      author: "המשחק",
      groups: [
        { difficulty: 1, category: "כלי תחבורה", words: ["אוטובוס", "רכבת", "אופניים", "מטוס"] },
        { difficulty: 2, category: "כלי כתיבה", words: ["עיפרון", "עט", "טוש", "מחק"] },
        { difficulty: 3, category: "ערים בישראל", words: ["חיפה", "אילת", "טבריה", "צפת"] },
        { difficulty: 4, category: "ספורט מים", words: ["שחייה", "גלישה", "צלילה", "חתירה"] }
      ]
    }
  ],

  medium: [
    {
      author: "המשחק",
      groups: [
        { difficulty: 1, category: "ארצות באירופה", words: ["צרפת", "ספרד", "איטליה", "יוון"] },
        { difficulty: 2, category: "כוכבי לכת", words: ["מאדים", "נוגה", "צדק", "שבתאי"] },
        { difficulty: 3, category: "ראשי ממשלה לשעבר", words: ["בגין", "רבין", "פרס", "שמיר"] },
        { difficulty: 4, category: "מילים שאחריהן 'לבן'", words: ["יין", "גבן", "דגל", "רעש"] }
      ]
    },
    {
      author: "המשחק",
      groups: [
        { difficulty: 1, category: "בעלי כנפיים", words: ["יונה", "נשר", "עורב", "ברווז"] },
        { difficulty: 2, category: "להקות ישראליות", words: ["משינה", "אתניקס", "טיפקס", "מנגו"] },
        { difficulty: 3, category: "סוגי קפה", words: ["הפוך", "שחור", "נמס", "אספרסו"] },
        { difficulty: 4, category: "סוגי לחם", words: ["פיתה", "בגט", "חלה", "לחמנייה"] }
      ]
    },
    {
      author: "המשחק",
      groups: [
        { difficulty: 1, category: "חברי הביטלס", words: ["ג'ון", "פול", "ג'ורג'", "רינגו"] },
        { difficulty: 2, category: "מקצועות רפואה", words: ["רופא", "אחות", "פרמדיק", "רוקח"] },
        { difficulty: 3, category: "ימים בלוח העברי", words: ["שבת", "פסח", "סוכות", "פורים"] },
        { difficulty: 4, category: "דברים שמקפלים", words: ["כביסה", "מפה", "מטרייה", "כסא"] }
      ]
    }
  ],

  hard: [
    {
      author: "המשחק",
      groups: [
        { difficulty: 1, category: "סוגי גשם", words: ["טפטוף", "ממטר", "מבול", "זרזיף"] },
        { difficulty: 2, category: "חלקי פנים", words: ["אף", "אוזן", "סנטר", "מצח"] },
        { difficulty: 3, category: "דברים שמסתובבים", words: ["גלגל", "סביבון", "כוכב", "תקליט"] },
        { difficulty: 4, category: "מילים שלפניהן 'בית'", words: ["ספר", "חולים", "כנסת", "קפה"] }
      ]
    },
    {
      author: "המשחק",
      groups: [
        { difficulty: 1, category: "תבלינים", words: ["כורכום", "כמון", "פפריקה", "זעתר"] },
        { difficulty: 2, category: "סוגי נעליים", words: ["סנדל", "מגף", "כפכף", "נעל"] },
        { difficulty: 3, category: "חלקי חליפה", words: ["עניבה", "ז'קט", "מכנס", "חולצה"] },
        { difficulty: 4, category: "יכולים להיות גם שמות פרטיים", words: ["שחר", "אביב", "שני", "נועם"] }
      ]
    },
    {
      author: "המשחק",
      groups: [
        { difficulty: 1, category: "מטבעות", words: ["שקל", "דולר", "יורו", "ין"] },
        { difficulty: 2, category: "פעולות בטלפון", words: ["חיוג", "ניתוק", "המתנה", "העברה"] },
        { difficulty: 3, category: "סוגי גבינה", words: ["צפתית", "פטה", "קממבר", "מוצרלה"] },
        { difficulty: 4, category: "דברים עם זנב", words: ["דג", "מטוס", "שביט", "עפיפון"] }
      ]
    }
  ]
};

const DIFFICULTY_NAMES = {
  easy: "קל",
  medium: "בינוני",
  hard: "קשה"
};

const ATTEMPTS_BY_DIFF = {
  easy: 4,
  medium: 5,
  hard: 6
};

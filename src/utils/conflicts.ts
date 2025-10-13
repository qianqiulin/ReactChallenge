// src/utils/conflicts.ts
// Clean, short helpers for conflict detection

type Course = {
  term: string;
  number: string;
  meets: string; // "" or like "MWF 9:00-9:50" or "TuTh 14:00-15:20"
  title: string;
};
type CoursesMap = Record<string, Course>;

type Meeting = {
  days: Set<string>; // e.g., {"M","W","F"} or {"Tu","Th"}
  start: number;     // minutes since 0:00
  end: number;       // minutes since 0:00
};

// Parse "MWF 9:00-9:50" -> { days:Set(...), start, end } ; "" -> null
export function parseMeeting(meets: string): Meeting | null {
  if (!meets || typeof meets !== 'string' || !meets.trim()) return null;
  const [dayStr, timeStr] = meets.trim().split(/\s+/, 2);
  if (!dayStr || !timeStr) return null;

  const days = parseDays(dayStr);
  const [startStr, endStr] = timeStr.split('-');
  if (!startStr || !endStr) return null;

  const start = parseHHMM(startStr);
  const end = parseHHMM(endStr);
  if (start == null || end == null || !(start < end)) return null;

  return { days, start, end };
}

// Turns "MWF" or "TuTh" into a Set of tokens {"M","W","F"} or {"Tu","Th"}
export function parseDays(dayStr: string): Set<string> {
  // Match two-letter tokens first so "TuTh" is parsed correctly.
  const tokens = dayStr.match(/(Tu|Th|Sa|Su|M|W|F)/g) ?? [];
  return new Set(tokens);
}

// "9:00" -> 540, "14:20" -> 860
export function parseHHMM(hhmm: string): number | null {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]), mm = Number(m[2]);
  if (h < 0 || h > 23 || mm < 0 || mm > 59) return null;
  return h * 60 + mm;
}

export function daysOverlap(a: Set<string>, b: Set<string>): boolean {
  for (const d of a) if (b.has(d)) return true;
  return false;
}

export function timesOverlap(a: {start:number; end:number}, b: {start:number; end:number}): boolean {
  // Overlap for half-open intervals [start, end)
  return a.start < b.end && b.start < a.end;
}

export function sameTerm(a: Course, b: Course): boolean {
  return a.term === b.term;
}

// Core conflict rule from the spec
export function coursesConflict(a: Course, b: Course): boolean {
  if (!sameTerm(a, b)) return false;

  const am = parseMeeting(a.meets);
  const bm = parseMeeting(b.meets);
  // Classes with empty meeting string never conflict
  if (!am || !bm) return false;

  return daysOverlap(am.days, bm.days) && timesOverlap(am, bm);
}

// Is course `id` selectable given the current `selected` set?
// (A selected course is always "selectable" so you can unselect it.)
export function isCourseSelectable(
  id: string,
  courses: CoursesMap,
  selected: Set<string>
): boolean {
  if (selected.has(id)) return true;

  const candidate = courses[id];
  if (!candidate) return false;

  for (const sid of selected) {
    const sCourse = courses[sid];
    if (sCourse && coursesConflict(candidate, sCourse)) return false;
  }
  return true;
}

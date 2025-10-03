// src/hooks/useCourses.ts
import { useEffect, useState } from 'react';

export type Course = {
  term: 'Fall' | 'Winter' | 'Spring' | string;
  number: string;
  meets: string;
  title: string;
};

export type CoursesMap = Record<string, Course>;

const DATA_URL =
  'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';

export function useCourses() {
  const [courses, setCourses] = useState<CoursesMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Accept either an object map or an array and normalize to a map.
        let normalized: CoursesMap;
        if (Array.isArray(data)) {
          normalized = Object.fromEntries(
            data.map((c: any, idx: number) => [
              // use a generated ID if none; prefer something stable if present
              c.id ?? `${c.term?.[0] ?? 'X'}${c.number ?? idx}`,
              {
                term: c.term,
                number: String(c.number ?? ''),
                meets: String(c.meets ?? ''),
                title: String(c.title ?? ''),
              } as Course,
            ])
          );
        } else if (data && typeof data === 'object') {
          normalized = {};
          for (const [id, c] of Object.entries<any>(data)) {
            normalized[id] = {
              term: c.term,
              number: String(c.number ?? ''),
              meets: String(c.meets ?? ''),
              title: String(c.title ?? ''),
            };
          }
        } else {
          throw new Error('Unexpected data shape');
        }

        if (alive) {
          setCourses(normalized);
          setError(null);
        }
      } catch (e: any) {
        if (alive) setError(e?.message ?? 'Failed to load courses');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { courses, loading, error };
}

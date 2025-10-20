import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from './firebase';

type Course = { term: string; number: string; meets: string; title: string; };
export type CoursesMap = Record<string, Course>;

export function useCourses() {
  const [courses, setCourses] = useState<CoursesMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const r = ref(db, 'courses'); // if your data is under /courses
    const unsub = onValue(
      r,
      (snap) => {
        const val = snap.val();
        setCourses(val ?? null);
        setLoading(false);
      },
      (err) => {
        setError(err?.message ?? 'Failed to load courses');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { courses, loading, error };
}

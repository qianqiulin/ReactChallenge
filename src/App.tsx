// src/App.tsx
import { useEffect, useState } from 'react';
import Banner from './components/Banner';
import CourseList from './components/CourseList';
import TermSelector from './components/TermSelector';

type Course = {
  term: 'Fall' | 'Winter' | 'Spring' | string;
  number: string;
  meets: string;
  title: string;
};
type CoursesMap = Record<string, Course>;

const DATA_URL =
  'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';

export default function App() {
  const [courses, setCourses] = useState<CoursesMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<'Fall' | 'Winter' | 'Spring'>('Fall');

  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(DATA_URL, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        // ✅ The endpoint returns { title, courses: {...} }
        if (data && typeof data === 'object' && data.courses) {
          setCourses(data.courses as CoursesMap);
        } else {
          throw new Error('Unexpected data shape: missing "courses"');
        }
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          setError(e?.message ?? 'Failed to load courses');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, []);

  return (
    <main>
      <Banner title="CS Courses for 2018–2019" />
      <TermSelector 
        selectedTerm={selectedTerm} 
        onTermChange={setSelectedTerm} 
      />

      {loading && <p style={{ padding: 16 }}>Loading courses…</p>}

      {error && (
        <p style={{ padding: 16, color: 'crimson' }}>
          Failed to load courses: {error}
        </p>
      )}

      {courses && <CourseList courses={courses} selectedTerm={selectedTerm}/>}
    </main>
  );
}

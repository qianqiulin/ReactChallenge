// src/App.tsx
import { useEffect, useMemo,useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Banner from './components/Banner';
import CourseList from './components/CourseList';
import TermSelector from './components/TermSelector';
import CoursePlanModal from './components/CoursePlanModal';
import CourseForm from './components/CourseForm';


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

  // NEW: selected courses (by id/key of the map)
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPlanOpen, setPlanOpen] = useState(false);


  const toggleCourse = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const updateCourse = (id: string, patch: Partial<Course>) => {
  setCourses(prev => {
    if (!prev || !prev[id]) return prev;
    return {
      ...prev,
      [id]: { ...prev[id], ...patch }
    };
  });
};

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(DATA_URL, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && typeof data === 'object' && data.courses) {
          setCourses(data.courses as CoursesMap);
        } else {
          throw new Error('Unexpected data shape: missing "courses"');
        }
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError(e?.message ?? 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);
  const selectedCount = selected.size;
  const headerRightLabel = useMemo(
    () => (selectedCount === 0 ? 'Course Plan' : `Course Plan (${selectedCount})`),
    [selectedCount]
  );

  const MainPage = (
    <main>
      <Banner title="CS Courses for 2018–2019" />

      {/* Header row: Term selector (left) + Course Plan button (right) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 16px'
      }}>
        <TermSelector selectedTerm={selectedTerm} onTermChange={setSelectedTerm} />

        <button
          onClick={() => setPlanOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isPlanOpen}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#111827',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
          }}
        >
          {headerRightLabel}
        </button>
      </div>

      {loading && <p style={{ padding: 16 }}>Loading courses…</p>}
      {error && <p style={{ padding: 16, color: 'crimson' }}>Failed to load courses: {error}</p>}

      {courses && (
        <>
          <CourseList
            courses={courses}
            selectedTerm={selectedTerm}
            selected={selected}
            onToggle={toggleCourse}
          />

          {/* (Optional) Keep this simple list on the page if you still want it */}
          <section style={{ padding: '16px 16px 32px' }}>
            <h3>Selected classes ({selected.size})</h3>
            {selected.size === 0 ? (
              <p>Click a course card to select it.</p>
            ) : (
              <ul>
                {Array.from(selected).map(id => {
                  const c = courses[id];
                  return <li key={id}>{id} — {c?.title}</li>;
                })}
              </ul>
            )}
          </section>
        </>
      )}

      {/* Course Plan Modal */}
      <CoursePlanModal
        isOpen={isPlanOpen}
        onClose={() => setPlanOpen(false)}
        courses={courses}
        selected={selected}
      />
    </main>
  );
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={MainPage} />
      {/* pass the updater down */}
      <Route
        path="/courses/:id/edit"
        element={<CourseForm courses={courses} onSave={updateCourse} />}
      />
    </Routes>
  </BrowserRouter>
);
}

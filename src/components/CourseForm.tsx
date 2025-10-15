import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { FormEvent } from 'react';

type Course = {
  term: string;
  number: string;
  meets: string;
  title: string;
};
type CoursesMap = Record<string, Course>;

type Props = {
  courses: CoursesMap | null;
};

export default function CourseForm({ courses }: Props) {
  const { id } = useParams();              // /courses/:id/edit
  const navigate = useNavigate();

  const course = useMemo(() => (id && courses ? courses[id] : null), [id, courses]);

  // local form state (prefilled from course, if available)
  const [title, setTitle] = useState('');
  const [meets, setMeets] = useState('');

  useEffect(() => {
    if (course) {
      setTitle(course.title ?? '');
      setMeets(course.meets ?? '');
    }
  }, [course]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault(); // no-op per spec
    // intentionally do nothing
  };

  if (!id) {
    return (
      <main style={{ padding: 16 }}>
        <h2>Edit Course</h2>
        <p>Missing course id.</p>
        <button onClick={() => navigate('/')} style={btnStyle}>Back</button>
      </main>
    );
  }

  if (!courses) {
    return (
      <main style={{ padding: 16 }}>
        <h2>Edit Course</h2>
        <p>Loading course data…</p>
      </main>
    );
  }

  if (!course) {
    return (
      <main style={{ padding: 16 }}>
        <h2>Edit Course</h2>
        <p>Course <code>{id}</code> not found.</p>
        <button onClick={() => navigate('/')} style={btnStyle}>Back</button>
      </main>
    );
  }

  return (
    <main style={{ padding: 16, maxWidth: 640, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 12 }}>Edit Course: {id}</h2>
      <form onSubmit={onSubmit} style={formStyle}>
        <label style={labelStyle}>
          <span style={labelText}>Title</span>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Data Structures"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          <span style={labelText}>Meeting Times</span>
          <input
            value={meets}
            onChange={e => setMeets(e.target.value)}
            placeholder='e.g., MWF 9:00-9:50 or TuTh 14:00-15:20'
            style={inputStyle}
          />
        </label>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          {/* No Submit per spec */}
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ ...btnStyle, background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

const formStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12
};
const labelStyle: React.CSSProperties = {
  display: 'grid',
  gap: 6
};
const labelText: React.CSSProperties = {
  fontSize: 13,
  color: '#374151',
  fontWeight: 600
};
const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  fontSize: 14
};
const btnStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  border: 'none',
  background: '#111827',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 600
};

import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseZ, type CourseFormData } from '../utils/courseSchema';

type Course = { term: string; number: string; meets: string; title: string; };
type CoursesMap = Record<string, Course>;

type Props = {
  courses: CoursesMap | null;
  onSave: (id: string, patch: Partial<Course>) => void; // NEW
};

export default function CourseForm({ courses, onSave }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = useMemo(() => (id && courses ? courses[id] : null), [id, courses]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
    trigger
  } = useForm<CourseFormData>({
    resolver: zodResolver(CourseZ),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { title: '', term: 'Fall', number: '', meets: '' }
  });

  useEffect(() => {
    if (course) {
      setValue('title', course.title ?? '');
      setValue('term', (course.term as any) ?? 'Fall');
      setValue('number', course.number ?? '');
      setValue('meets', course.meets ?? '');
      void trigger();
    }
  }, [course, setValue, trigger]);

  const onValid = (data: CourseFormData) => {
    if (!id) return;
    // Actually update the course in App state
    onSave(id, {
      title: data.title,
      term: data.term,
      number: data.number,
      meets: data.meets
    });
    navigate('/'); // go back to list
  };

  const onInvalid = () => {
    // errors already shown inline
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

      <form onSubmit={handleSubmit(onValid, onInvalid)} style={formStyle} noValidate>
        {/* Title */}
        <label style={labelStyle}>
          <span style={labelText}>Title</span>
          <input {...register('title')} placeholder="e.g., Data Structures" style={inputStyle} />
          {errors.title && <FieldError msg={errors.title.message!} />}
        </label>

        {/* Term */}
        <label style={labelStyle}>
          <span style={labelText}>Term</span>
          <select {...register('term')} style={{ ...inputStyle, height: 40 }}>
            <option>Fall</option>
            <option>Winter</option>
            <option>Spring</option>
            <option>Summer</option>
          </select>
          {errors.term && <FieldError msg={errors.term.message!} />}
        </label>

        {/* Course Number */}
        <label style={labelStyle}>
          <span style={labelText}>Course Number</span>
          <input {...register('number')} placeholder="e.g., 213 or 213-2" style={inputStyle} />
          {errors.number && <FieldError msg={errors.number.message!} />}
        </label>

        {/* Meeting Times */}
        <label style={labelStyle}>
          <span style={labelText}>Meeting Times</span>
          <input
            {...register('meets')}
            placeholder='e.g., MWF 12:00-13:20 or TuTh 14:00-15:20 (or leave empty)'
            style={inputStyle}
          />
          {errors.meets && <FieldError msg={errors.meets.message!} />}
        </label>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ ...btnStyle, background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb' }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            style={{
              ...btnStyle,
              opacity: !isValid || isSubmitting ? 0.6 : 1,
              cursor: !isValid || isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </form>
    </main>
  );
}

function FieldError({ msg }: { msg: string }) {
  return <span style={{ color: '#b91c1c', fontSize: 12, marginTop: 4 }}>{msg}</span>;
}

const formStyle: React.CSSProperties = { display: 'grid', gap: 12 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6 };
const labelText: React.CSSProperties = { fontSize: 13, color: '#374151', fontWeight: 600 };
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

// src/components/CourseForm.tsx
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseZ, type CourseFormData } from '../utils/courseSchema';

type Course = { term: string; number: string; meets: string; title: string; };
type CoursesMap = Record<string, Course>;

type Props = {
  courses: CoursesMap | null;
  onSave: (id: string, patch: Partial<Course>) => Promise<unknown> | void;
};

// simple stable stringify for shallow objects
const stable = (o: unknown) => JSON.stringify(o, Object.keys(o as any).sort());

export default function CourseForm({ courses, onSave }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = useMemo(() => (id && courses ? courses[id] : null), [id, courses]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
    trigger
  } = useForm<CourseFormData>({
    resolver: zodResolver(CourseZ),
    mode: 'onChange',          // validate as the user types
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldUnregister: false,
    defaultValues: { title: '', term: 'Fall', number: '', meets: '' }
  });

  // Prefill and set pristine baseline
  useEffect(() => {
    if (course) {
      reset(
        {
          title: course.title ?? '',
          term: (course.term as any) ?? 'Fall',
          number: course.number ?? '',
          meets: course.meets ?? ''
        },
        { keepDirty: false, keepTouched: false }
      );
      void trigger(); // compute initial validity
    }
  }, [course, reset, trigger]);

  // Custom "dirty" detector: compare current values vs original course
  const current = watch();
  const baseline = useMemo(() => {
    if (!course) return null;
    // normalize by trimming strings to avoid trailing-space mismatches
    return {
      title: (course.title ?? '').trim(),
      term: (course.term ?? '').trim(),
      number: (course.number ?? '').trim(),
      meets: (course.meets ?? '').trim()
    };
  }, [course]);

  const isChanged = useMemo(() => {
    if (!baseline) return false;
    const normalized = {
      title: (current.title ?? '').trim(),
      term: (current.term ?? '').trim(),
      number: (current.number ?? '').trim(),
      meets: (current.meets ?? '').trim()
    };
    return stable(normalized) !== stable(baseline);
  }, [baseline, current]);

  // Submit handler: only submit if valid AND changed
  const onValid = async (data: CourseFormData) => {
    if (!id) return;
    if (!isChanged) return; // block no-op submits

    await onSave(id, {
      title: data.title.trim(),
      term: data.term.trim(),
      number: data.number.trim(),
      meets: data.meets.trim()
    });
    navigate('/'); // back to list
  };

  const onInvalid = () => {
    // errors are already shown inline
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
            disabled={!isValid || isSubmitting || !isChanged}
            style={{
              ...btnStyle,
              opacity: (!isValid || isSubmitting || !isChanged) ? 0.6 : 1,
              cursor: (!isValid || isSubmitting || !isChanged) ? 'not-allowed' : 'pointer'
            }}
          >
            Save
          </button>
        </div>

        {/* Tiny debug row (optional): uncomment if you want to see why it's disabled */}
        {/* <pre style={{marginTop:8,fontSize:12,opacity:.7}}>
          {JSON.stringify({ isValid, isSubmitting, isChanged, current }, null, 2)}
        </pre> */}
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

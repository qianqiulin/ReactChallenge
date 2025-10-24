// src/components/CourseList.tsx
import { Link } from 'react-router-dom';
import { isCourseSelectable } from '../utils/conflicts';

type Course = {
  term: 'Fall' | 'Winter' | 'Spring' | string;
  number: string;
  meets: string;
  title: string;
};
type CoursesMap = Record<string, Course>;

type Props = {
  courses: CoursesMap;
  selectedTerm: 'Fall' | 'Winter' | 'Spring';
  selected: Set<string>;
  onToggle: (id: string) => void;
  canEdit?: boolean; // 👈 NEW
};

export default function CourseList({ courses, selectedTerm, selected, onToggle, canEdit = false }: Props) {
  const entries = Object.entries(courses)
    .filter(([_, c]) => c.term === selectedTerm);

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'
        }}
      >
        {entries.map(([id, course]) => {
          const isSelected = selected.has(id);
          const selectable = isCourseSelectable(id, courses, selected);
          const disabled = !selectable && !isSelected;

          return (
            <button
              key={id}
              onClick={() => {
                if (disabled) return; // block selecting when conflicted
                onToggle(id);
              }}
              role="switch"
              aria-checked={isSelected}
              aria-disabled={disabled}
              title={
                disabled
                  ? 'Time conflict with a selected course'
                  : isSelected
                    ? 'Unselect'
                    : 'Select'
              }
              style={{
                textAlign: 'left',
                padding: '14px 16px 38px',
                borderRadius: 8,
                border: `2px solid ${isSelected ? '#22c55e' : '#e5e7eb'}`,
                background: isSelected ? '#ecfdf5' : '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.45 : 1,
                position: 'relative',
                transition: 'all .15s'
              }}
            >
              {isSelected && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '2px solid #22c55e',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              )}
              {disabled && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '2px solid #9ca3af',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                    color: '#6b7280'
                  }}
                  title="Time conflict"
                >
                  ×
                </span>
              )}
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
                {course.term}
              </div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                {id} — {course.title}
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>
                {course.number} · {course.meets || 'TBA'}
              </div>

              {/* Footer row with the Edit link */}
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  bottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {canEdit ? (
                  <Link
                    to={`/courses/${id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: 12,
                      textDecoration: 'underline',
                      color: disabled ? '#9ca3af' : '#2563eb',
                      pointerEvents: disabled ? 'none' : 'auto'
                    }}
                    aria-label={`Edit course ${id}`}
                  >
                    Edit
                  </Link>
                ) : (
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>
                    View only
                  </span>
                )}

                {isSelected && (
                  <span style={{ fontSize: 12, color: '#065f46', fontWeight: 600 }}>
                    Selected
                  </span>
                )}
                {disabled && (
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>
                    Conflicts with your plan
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {entries.length === 0 && (
        <p style={{ paddingTop: 16 }}>No courses found for {selectedTerm}.</p>
      )}
    </div>
  );
}

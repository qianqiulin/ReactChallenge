// src/components/CourseList.tsx
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
};

export default function CourseList({ courses, selectedTerm, selected, onToggle }: Props) {
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
                padding: '14px 16px',
                borderRadius: 8,
                border: `2px solid ${
                  isSelected ? '#22c55e' : disabled ? '#e5e7eb' : '#e5e7eb'
                }`,
                background: isSelected ? '#ecfdf5' : '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.45 : 1,
                position: 'relative',
                transition: 'all .15s',
                pointerEvents: disabled ? 'auto' : 'auto' // keep hover/title
              }}
            >
              {/* Selected badge */}
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

              {/* Conflict badge for disabled cards */}
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

              {isSelected && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#065f46', fontWeight: 600 }}>
                  Selected
                </div>
              )}
              {disabled && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280', fontWeight: 600 }}>
                  Conflicts with your plan
                </div>
              )}
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

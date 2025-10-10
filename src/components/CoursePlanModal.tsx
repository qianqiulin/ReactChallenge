import Modal from './Modal';

type Course = {
  term: 'Fall' | 'Winter' | 'Spring' | string;
  number: string;
  meets: string;
  title: string;
};
type CoursesMap = Record<string, Course>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  courses: CoursesMap | null;
  selected: Set<string>;
};

export default function CoursePlanModal({ isOpen, onClose, courses, selected }: Props) {
  const items = courses
    ? Array.from(selected).map(id => ({ id, ...courses[id] }))
    : [];

  const titleId = 'course-plan-title';

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId={titleId}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h2 id={titleId} style={{ margin: 0, fontSize: 18 }}>Your Course Plan</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: 22,
            lineHeight: 1,
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </header>

      <div style={{ maxHeight: '60vh', overflow: 'auto', padding: 16 }}>
        {items.length === 0 ? (
          <div>
            <p style={{ marginTop: 0 }}>
              No courses selected yet.
            </p>
            <ul style={{ marginTop: 8, paddingLeft: 18 }}>
              <li>Choose a term with the selector.</li>
              <li>Click any course card to add it to your plan.</li>
              <li>Open this Course Plan again to review your selections.</li>
            </ul>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '8px 6px', borderBottom: '1px solid #e5e7eb' }}>ID</th>
                <th style={{ padding: '8px 6px', borderBottom: '1px solid #e5e7eb' }}>Title</th>
                <th style={{ padding: '8px 6px', borderBottom: '1px solid #e5e7eb' }}>Meets</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ id, title, meets }) => (
                <tr key={id}>
                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap' }}>{id}</td>
                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>{title}</td>
                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6' }}>{meets || 'TBA'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer style={{ padding: 12, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 14px',
            background: '#111827',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </footer>
    </Modal>
  );
}

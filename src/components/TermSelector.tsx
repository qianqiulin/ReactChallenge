type TermSelectorProps = {
  selectedTerm: 'Fall' | 'Winter' | 'Spring';
  onTermChange: (term: 'Fall' | 'Winter' | 'Spring') => void;
};

export default function TermSelector({ selectedTerm, onTermChange }: TermSelectorProps) {
  const terms: Array<'Fall' | 'Winter' | 'Spring'> = ['Fall', 'Winter', 'Spring'];

  return (
    <div style={{ padding: '16px', display: 'flex', gap: '8px' }}>
      {terms.map((term) => (
        <button
          key={term}
          onClick={() => onTermChange(term)}
          style={{
            padding: '8px 16px',
            backgroundColor: selectedTerm === term ? '#4c1d95' : '#e5e7eb',
            color: selectedTerm === term ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: selectedTerm === term ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          {term}
        </button>
      ))}
    </div>
  );
}
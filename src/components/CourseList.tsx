// src/components/CourseList.tsx
import type { CoursesMap, Course } from '../hooks/useCourses';

type CourseListProps = { courses: CoursesMap };

export default function CourseList({ courses }: CourseListProps) {
  const entries = Object.entries(courses);

  // Group by term
  const byTerm = new Map<string, Array<[string, Course]>>();
  for (const e of entries) {
    const term = e[1].term || 'Other';
    if (!byTerm.has(term)) byTerm.set(term, []);
    byTerm.get(term)!.push(e);
  }

  // Sort terms in desired order
  const termOrder = ['Fall', 'Winter', 'Spring'];
  const terms = Array.from(byTerm.keys()).sort((a, b) => {
    const ia = termOrder.indexOf(a);
    const ib = termOrder.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <section className="p-4">
      {terms.map((term) => {
        const list = byTerm.get(term)!;
        // sort each term’s courses by number (numeric when possible)
        list.sort(([, a], [, b]) => Number(a.number) - Number(b.number));

        return (
          <div key={term} className="mb-8">
            <h2 className="mb-3 text-xl font-semibold">{term}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map(([id, c]) => (
                <div
                  key={id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-lg font-semibold">CS {c.number}</div>
                  <div className="mt-1 text-sm text-gray-600">{c.title}</div>
                  <div className="mt-3 text-sm font-medium text-gray-800">
                    {c.meets}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

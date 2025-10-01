type Course = {
    term: string;
    number: string;
    meets: string;
    title: string;
  };
  type Courses = Record<string, Course>;
  type CourseListProps = { courses: Courses };
  
  export default function CourseList({ courses }: CourseListProps) {
    const entries = Object.entries(courses);
  
    return (
      <section className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {entries.map(([id, c]) => (
            <div
              key={id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="text-lg font-semibold">
                {c.term} CS {c.number}
              </div>
              <div className="mt-1 text-sm text-gray-600">{c.title}</div>
              <div className="mt-3 text-sm font-medium text-gray-800">
                {c.meets}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
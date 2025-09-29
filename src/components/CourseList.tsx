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
    <section>
    <ul>
        {entries.map(([id, c]) => (
        <li key={id}>
            <strong>{id}</strong> — {c.term} {c.number}: {c.title} ({c.meets})
        </li>
        ))}
    </ul>
    </section>
    );
    }
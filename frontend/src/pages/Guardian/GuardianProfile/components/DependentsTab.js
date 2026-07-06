import { FaIdBadge } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as Styled from '../styled';

export default function DependentsTab({ guardian }) {
  const students = guardian.students || [];

  return (
    <>
      {students.length > 0 ? (
        students.map((student) => (
          <Styled.DependentCard key={student.id}>
            {student.avatar_url ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/images/students/${student.avatar_url}`}
                alt={student.name}
              />
            ) : (
              <FaIdBadge size={64} color="#334155" />
            )}
            <div className="dep-info">
              <h4>
                {student.name} {student.last_name}
              </h4>
              <span>RN: {student.registration_number}</span>
              <Link to={`/student/${student.id}`}>View Student Profile</Link>
            </div>
          </Styled.DependentCard>
        ))
      ) : (
        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
          No students linked to this guardian.
        </p>
      )}
    </>
  );
}

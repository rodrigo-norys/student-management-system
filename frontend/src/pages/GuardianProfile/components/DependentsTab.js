import { FaUserGraduate, FaIdBadge } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { TabContent, DependentCard } from '../styled';
import * as colors from '../../../config/colors.js';

export default function DependentsTab({ guardian }) {
  if (!guardian) return null;
  const students = guardian.students || [];

  return (
    <TabContent>
      <h2><FaUserGraduate /> Linked Students (Dependents)</h2>
      {students.length > 0 ? (
        students.map(student => (
          <DependentCard key={student.id}>
            {student.avatar_url ? (
              <img src={`${process.env.REACT_APP_API_URL}/images/students/${student.avatar_url}`} alt={student.name} />
            ) : (
              <FaIdBadge size={50} color="#9aa0ac" />
            )}
            <div className="dep-info">
              <h4>{student.name} {student.last_name}</h4>
              <span>RN: {student.registration_number}</span>
              <br />
              <Link to={`/student/${student.id}`} style={{ color: colors.primaryColor, fontSize: '12px' }}>
                View Student Profile
              </Link>
            </div>
          </DependentCard>
        ))
      ) : (
        <p className="no-data">No students linked to this guardian.</p>
      )}
    </TabContent>
  );
}

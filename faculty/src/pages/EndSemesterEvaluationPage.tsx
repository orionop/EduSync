import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EndSemesterEvaluation from '../components/EndSemesterEvaluation';
import SectionDashboard from '../components/SectionDashboard';

interface UserInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  institution: string;
  accountType: string;
  photoUrl?: string;
}

const EndSemesterEvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('eduSyncUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo({
        ...parsedUser,
        email: 'jane.smith@university.edu',
        phone: '+1 (555) 123-4567',
        institution: 'EdVantage University',
        accountType: 'Faculty',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
      });
    }
  }, []);

  // TODO: Implement logout functionality in future
  // @ts-expect-error - Will be used in future implementation
  const handleLogout = () => {
    localStorage.removeItem('eduSyncUser');
    navigate('/');
  };

  return (
    <SectionDashboard
      title="End Semester Evaluation"
      userInfo={userInfo}
    >
      <div className="max-w-7xl mx-auto">
        <EndSemesterEvaluation />
      </div>
    </SectionDashboard>
  );
};

export default EndSemesterEvaluationPage; 
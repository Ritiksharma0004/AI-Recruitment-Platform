import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateDashboard from './dashboards/CandidateDashboard';
import RecruiterDashboard from './dashboards/RecruiterDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import { Loader } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) return null;

  const role = user?.role || user?.user?.role || 'CANDIDATE';

  if (role === 'ADMIN') {
    return <AdminDashboard user={user} />;
  } else if (role === 'RECRUITER') {
    return <RecruiterDashboard user={user} />;
  } else {
    return <CandidateDashboard user={user} />;
  }
};

export default Dashboard;

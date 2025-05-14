// src/pages/ProblemsPage.jsx
import ProblemList from '../features/problems/ProblemList';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


const ProblemsPage = () => {
  const { user } = useAuth();

  return (
    
    <div>
      
      <h1 className="text-2xl font-bold p-4">All Problems</h1>
      {user?.role === 'admin' && (
        <Link to="/add-problem" className="btn">
          Add Problem
        </Link>
      )}

      <ProblemList />
    </div>
  );
};

export default ProblemsPage;

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const HomePage = () => {

  const { user } = useAuth();

  return (
     <div className="flex flex-col items-center mt-20">
      <h1 className="text-4xl font-bold mb-6">Welcome to Online Judge !</h1>

      {!user ? (
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </Link>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded">
            Register
          </Link>
        </div>
      ) : (
        <Link
          to="/problems"
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Go to Problems
        </Link>
      )}
    </div>
  );
};

export default HomePage;

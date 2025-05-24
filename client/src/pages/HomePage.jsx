import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-4xl font-bold mb-6">Welcome to Algorun Judge !</h1>

      {!user ? (
        <div className="space-x-4 justify-content-center">
          <Link
            to="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Register
          </Link>
          <div />
          <div className="space-x-4 my-8 mx-1 justify-content-center">
            <Link
              to="/problems"
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Browse Problemset
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-x-4 justify-content-center">
          
          <Link
            to="/problems"
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Browse Problemset
          </Link>
          <Link
            to="/submissions"
            className="bg-blue-800 text-white px-4 py-2 rounded"
          >
            My Submissions
          </Link>
          <div className="space-x-4 my-8 mx-30 justify-content-center">
            <Link
              to="/user/dashboard"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

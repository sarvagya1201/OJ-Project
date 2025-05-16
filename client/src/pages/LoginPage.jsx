// LoginPage.jsx
import Login from '../features/auth/login';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div>
      <h2 className="text-center text-xl mt-4">Login</h2>
      <Login />
      <p className="text-sm mt-4 text-center text-gray-700 dark:text-gray-300">
        New user?{" "}
        <Link
          to="/register"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

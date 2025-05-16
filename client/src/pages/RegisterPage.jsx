// RegisterPage.jsx
import Register from "../features/auth/register";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div>
      <h2 className="text-center text-xl mt-4">Register</h2>
      <Register />
      <p className="text-sm mt-4 text-center text-gray-700 dark:text-gray-300">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Register here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

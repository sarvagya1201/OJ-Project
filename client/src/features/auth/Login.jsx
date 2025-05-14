// import { useState } from 'react';
// import { login } from '../../services/authService';

// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await login(form);
//       alert('Login successful: ' + data.token);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Login</h2>
//       <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;

import { useState } from "react";
import { loginUser, getCurrentUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const result = await loginUser(formData);
  //     console.log("Logged in:", result);
  //     navigate("/");
  //   } catch (err) {
  //     console.error(err.response?.data?.message || "Login failed");
  //     alert(err.response?.data?.message || "Login failed");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login credentials (sets cookie)
      await loginUser(formData);

      // Now fetch the user data using /auth/me
      const res = await getCurrentUser();
      setUser(res.user); // Save user to context

      navigate("/problems"); // or wherever you want to redirect
    } catch (err) {
      console.error(err.response?.data?.message || "Login failed");
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-sm mx-auto mt-10"
    >
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="border p-2"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="border p-2"
        required
      />
      <button type="submit" className="bg-green-500 text-white p-2">
        Login
      </button>
    </form>
  );
};

export default Login;

// import { useState } from 'react';
// import { register } from '../../services/authService';

// const Register = () => {
//   const [form, setForm] = useState({ name: '', email: '', password: '' });

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await register(form);
//       alert('Registered successfully: ' + data.token);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Register</h2>
//       <input name="name" placeholder="Name" onChange={handleChange} required /><br />
//       <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
//       <button type="submit">Register</button>
//     </form>
//   );
// };

// export default Register;
import { useState } from 'react';
import { registerUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(formData);
      console.log('Registered:', result);
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data?.message || 'Registration failed');
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <input type="text" name="name" placeholder="Name" onChange={handleChange} className="border p-2" required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2" required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2" required />
      <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
    </form>
  );
};

export default Register;

import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Auth from '../utils/auth';
import { login } from "../utils/authAPI";

// This component is responsible for rendering the login form
const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  // This function will handle the submission of the form and sends an error message if the login fails
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting login form');
      const token = await login(loginData);
      console.log('Token received:', token ? 'Yes' : 'No')
      if (!token){
        throw new Error('No token received');
      }
      Auth.login(token);
      console.log('Login successful, redirecting to /board');
      navigate('/board');
    } catch (err) {
      console.error('Failed to login', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label >Username</label>
        <input 
          type='text'
          name='username'
          value={loginData.username || ''}
          onChange={handleChange}
        />
      <label>Password</label>
        <input 
          type='password'
          name='password'
          value={loginData.password || ''}
          onChange={handleChange}
        />
        <button type='submit'>Submit Form</button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
    
  )
};

export default Login;
import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Auth from '../utils/auth';
import { login } from "../utils/authAPI";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting login form');
      const { token, userId } = await login(formData);
      console.log('Token received:', token ? 'Yes' : 'No');

      if (!token || !userId) {
        throw new Error('No token or user ID received');
      }

      // Log the user in
      Auth.login(token);

      // Store userId in localStorage or pass it directly as state
      localStorage.setItem('userId', userId); // Store userId in localStorage

      // Navigate to Form and pass userId as state
      console.log('Login successful, redirecting to /Form');
      navigate('/Form', { state: { userId } }); // Updated to `/Form` with a capital F

    } catch (err) {
      console.error('Failed to login', err);
      setError('Invalid username or password');
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      console.log('Submitting signup form');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      await response.json();
      console.log('Signup successful, please log in');
      setFormData({ username: '', password: '', confirmPassword: '' });
      setError('Account created! Please log in.');

    } catch (err: any) {
      console.error('Failed to signup', err);
      setError('Failed to create account. Please try again.');
    }
  };

  // This function will toggle the form between login and signup
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ username: '', password: '', confirmPassword: '' });
  };

  return (
    <main>
    <div>
      <form className='form' onSubmit={isLogin ? handleLogin : handleSignup}>
        <h2 className="shadow-text">Questionable Intelligence</h2>
        <img src="https://github.com/pauletters/Questionable-Intelligence/blob/main/public/images/icon.jpg?raw=true" alt="QI_logo" style={{ width: '150px', borderRadius: '50%' }} />
        <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
        <label>Username</label>
        <input 
          type='text'
          name='username'
          value={formData.username || ''}
          onChange={handleChange}
          required
          minLength={3}
        />
      <label>Password</label>
        <input 
          type='password'
          name='password'
          value={formData.password || ''}
          onChange={handleChange}
          required
          minLength={isLogin ? undefined : 8}
        />
        {!isLogin && (
          <>
            <label>Confirm Password</label>
            <input 
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword || ''}
              onChange={handleChange}
              required
            />
          </>
        )}
        <button type='submit'>{isLogin ? 'Login' : 'Create Account'}</button>

        <button type='button' onClick={toggleForm} className='toggle-button'>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
    </main>
  )
};

export default Login;
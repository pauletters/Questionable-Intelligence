import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Auth from '../utils/auth';
import { login } from "../utils/authAPI";


// This component is responsible for rendering the login form
const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

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

  // This function will handle the submission of the form and sends an error message if the login fails
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting login form');
      const token = await login(formData);
      console.log('Token received:', token ? 'Yes' : 'No')
      if (!token){
        throw new Error('No token received');
      }
      Auth.login(token);
      console.log('Login successful, redirecting to /board');
      navigate('/form');
    } catch (err) {
      console.error('Failed to login', err);
      setError('Invalid username or password');
    }
  };

  // This function handles the creation of a new account and sends an error message if the account creation fails
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
          'Accept' : 'application/json'
        },
        // The credentials: 'include' option sends the cookie along with the request.
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      await response.json();

    console.log('Signup successful, logging in');
    setFormData({ username: '', password: '', confirmPassword: '' });
    setIsLogin(true);
    setError('Account created! Please log in.');

  } catch (err: any) {
    console.error('Failed to signup', err);
    if (err.message.includes('Validation error')) {
    setError('Failed to create account. Please try again.');
  }
}
};

// This function will toggle the form between login and signup
const toggleForm = () => {
  setIsLogin(!isLogin);
  setError(null);
  setFormData({ username: '', password: '', confirmPassword: '' });
};

  return (
    <div className='container'>
      <form className='form' onSubmit={isLogin ? handleLogin : handleSignup}>
        <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
        <label >Username</label>
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
    
  )
};

export default Login;
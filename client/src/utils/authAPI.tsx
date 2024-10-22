import { UserLogin } from "../users/UserLogin";

// Login function that sends a POST request to the /api/auth/login endpoint.
// It returns the token if the request is successful.
const login = async (userInfo: UserLogin) => {
  console.log('Attempting login with:', { 
    username: userInfo.username, 
    passwordLength: userInfo.password ? userInfo.password.length : 'null' 
  });
  try {
    const response = await fetch('/utils/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login failed:', errorData);
      if (response.status === 401) {
        throw new Error('Invalid credentials');
    }
    throw new Error('Login Failed');
  }

    const data = await response.json();
    console.log('Login successful, token received');
    return data.token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export { login };

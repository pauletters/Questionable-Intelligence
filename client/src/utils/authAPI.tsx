import { UserLogin } from "../users/UserLogin";
import { jwtDecode } from 'jwt-decode';  // Import jwt-decode to decode the JWT

// Define the structure of the token payload
interface TokenPayload {
  id: string;  // Assuming the payload has an 'id' field for userId
  username: string;
}

// Define the structure of the API response
interface LoginResponse {
  token: string; // JWT token returned by the API
}

// Login function that sends a POST request to the /api/auth/login endpoint.
// It returns the token and userId if the request is successful.
export const login = async (userInfo: UserLogin) => {
  console.log('Attempting login with:', {
    username: userInfo.username,
    passwordLength: userInfo.password ? userInfo.password.length : 'null'
  });

  try {
    // Send a POST request to the login endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    console.log('Response status:', response.status);

    // If the response is not successful, handle the error
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login failed:', errorData);
      if (response.status === 401) {
        throw new Error('Invalid credentials');
      }
      throw new Error('Login Failed');
    }

    // Parse the response as a LoginResponse object
    const data: LoginResponse = await response.json();
    const token = data.token;
    console.log('Login successful, token received:', token);

    // Decode the JWT token to extract the userId and username
    const decoded: TokenPayload = jwtDecode(token);
    console.log('Decoded token payload:', decoded);

    // Return the token and the extracted userId
    return {
      token: token,  // The JWT token itself
      userId: decoded.id,  // Extracted userId from the token payload
    };

  } catch (error) {
    console.error('Login error:', error);
    throw error;  // Re-throw the error to handle it in the calling function
  }
};

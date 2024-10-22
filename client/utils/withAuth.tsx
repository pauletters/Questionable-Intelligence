import React from 'react';
import Auth from './auth'; 

// This interface will define the props that will be passed to the wrapped component
export interface WithAuthProps {
    checkAuth: () => boolean;
}

// This function will wrap a component with authentication. It is used to check if the user is authenticated before 
// rendering the component
export const withAuth = <P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>
) => {
        const WithAuth: React.FC<Omit<P, keyof WithAuthProps>> = (props) => {
        const checkAuth = () => {
        return Auth.checkAuthAndRedirect();
    };
  
      return <WrappedComponent {...props as P} checkAuth={checkAuth} />;
    };

    return WithAuth;
  };
  
  export default withAuth;
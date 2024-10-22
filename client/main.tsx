import ReactDOM from 'react-dom/client';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.tsx';
import HallOfShame from './src/pages/HallOfShame.tsx';
import ErrorPage from './src/pages/ErrorPage.tsx';
import LeaderBoard from './src/pages/Leaderboard.tsx';
import LoginPage from './src/pages/LoginPage.tsx';
import UserAccount from './src/pages/UserAccount.tsx';
import QuestionPage from './src/pages/QuestionPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LoginPage />
      }, 
      {
        path: '/LeaderBoard',
        element: <LeaderBoard />
      },
      {
        path: '/HallOfShame',
        element: <HallOfShame />
      },
      {
        path: '/UserAccount',
        element: <UserAccount />
      },
      {
        path: '/QuestionPage',
        element: <QuestionPage />
      }
    ]
  }
])

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}

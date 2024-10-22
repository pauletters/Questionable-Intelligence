import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.tsx';
import HallOfShame from './pages/HallOfShame.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import LeaderBoard from './pages/LeaderBoard.tsx';
import LoginPage from './pages/LoginPage.tsx';
import UserAccount from './pages/UserAccount.tsx';
import QuestionPage from './pages/QuestionPage.tsx';

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
        path: '/leaderboard',
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

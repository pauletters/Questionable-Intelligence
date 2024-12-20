import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.tsx';
import HallOfShame from './pages/HallOfShame.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import LeaderBoard from './pages/LeaderBoard.tsx';
import LoginPage from './pages/LoginPage.tsx';
import UserAccount from './pages/UserAccount.tsx';
import Quiz from './components/quiz.tsx';
import Form from './pages/Form.tsx';
import Results from './pages/Results.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
        path: '/Quiz',
        element: <Quiz />
      },
      {
        path: '/Form',
        element: <Form />
      },
      {
        path: '/Results',
        element: <Results />
      },
      {
        path: '*',
        element: <ErrorPage />
      }
    ]
  }
])

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}

import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';

function App() {

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App

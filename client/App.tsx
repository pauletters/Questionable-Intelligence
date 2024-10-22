import { Outlet } from 'react-router-dom';
import React from 'react';
import Navbar from './src/components/Navbar.tsx';

function App() {

  return (
    <div className='container'>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App

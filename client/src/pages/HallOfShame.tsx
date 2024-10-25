import React from 'react';

interface HallOfShameProps {
  name: string;
  score: number;
}


const HallOfShame: React.FC = () => {
  return (
    <div className='page-layout'>
      <h1>Hall of Shame</h1>
      <p>Here are the worst of the worst</p>
    </div>
  );
}

export default HallOfShame;
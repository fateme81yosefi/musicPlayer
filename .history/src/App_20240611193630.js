import React, { useState, useRef } from 'react';

const App = () => {


  return (
    <div>
      <audio  src="/Ali-Khodabandeh-Kharabesh-Mikonam-128.mp3" />
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

export default App;

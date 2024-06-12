import React, { useState, useRef } from 'react';
import { Data } from "./Data/Data"


const App = () => {



  return (
    <div>
      {Data.map((d, index) => {

        <audio src={d.src} controls autoPlay />

      })}
    </div>
  );
}

export default App;

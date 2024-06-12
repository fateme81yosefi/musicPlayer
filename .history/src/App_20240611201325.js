import React, { useState, useRef } from 'react';
import { Data } from "./Data/Data"


const App = () => {



  return (
    <div>
       Data.map((d,index)=>{
        console.log(d.src)
      })
    </div>
  );
}

export default App;

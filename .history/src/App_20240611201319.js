import React, { useState, useRef } from 'react';
import {Data} from "./Data/Data"


const App = () => {



  return (
    <div>
       Data.map((d,index)=>{
  console.log(d.src)
 })
      <audio  src="/Ali Sofla - Delbar Toei (320).mp3"  controls autoPlay/>
    </div>
  );
}

export default App;

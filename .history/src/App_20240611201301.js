import React, { useState, useRef } from 'react';
import {Data} from "./Data/Data"


const App = () => {

 Data.map((d,index)=>{
  console.log(d.src)
 })
  return (
    <div>
      <audio  src="/Ali Sofla - Delbar Toei (320).mp3"  controls autoPlay/>
    </div>
  );
}

export default App;

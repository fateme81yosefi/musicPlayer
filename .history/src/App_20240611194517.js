import React, { useState, useRef } from 'react';


const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public');

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  files.forEach(function (file) {
    if (file.endsWith('.mp3')) {
      console.log(file);

    }
  });
});



const App = () => {


  return (
    <div>
      <audio  src="/Ali Sofla - Delbar Toei (320).mp3"  controls autoPlay/>
    </div>
  );
}

export default App;

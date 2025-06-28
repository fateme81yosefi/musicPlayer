import React from 'react';
import FileUploader from './Components/FileUploader/FileUploader';
import MainPage from './Components/MainPage/MainPage';
import Modal from 'react-modal';


const App = () => {


Modal.setAppElement('#root'); // یا '#app' بسته به ID عنصر ریشه شما
  return (
    <div>
      <MainPage />
    </div>
  );
}

export default App;

import MainPage from './Components/MainPage/MainPage';
import Modal from 'react-modal';

const App = () => {
Modal.setAppElement('#root');
  return (
    <div>
      
      <MainPage />
    </div>
  );
}

export default App;

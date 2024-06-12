import FileUploader from "../../Data/FileUploader/FileUploader";
import "./MainPage.css"
import Modal from 'react-modal';
import React , {useState,useEffect} from "react";

const MainPage = () => {
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        // در زمان بارگیری کامپوننت، دسته‌بندی‌ها را از localStorage بخوانید
        const storedCategories = JSON.parse(localStorage.getItem('categories'));
        if (storedCategories) {
          setCategories(storedCategories);
        }
      }, []);

    const handleAddCategory = () => {
        if (category) {
          const updatedCategories = [...categories, category];
          setCategories(updatedCategories);
          setCategory('');
    
          localStorage.setItem('categories', JSON.stringify(updatedCategories));
        }
      };
    return (
        <div className="container">
            <Modal
                isOpen={showModal}
                contentLabel="Create Playlist"
                className="modalCategory"
            >
                <h2>Create Playlist</h2>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <button onClick={handleAddCategory}>Confirm</button>
            </Modal>

            <div className="leftMenue">
                <div className="top">
                    <div className="imageProfile">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s" />
                        <div className="name">Fateme</div>

                    </div>
                    <div className="categories">
                        <h4>categories:</h4>
                     {
                        categories.map((item, index)=><h6 key={index}>{item}</h6>)
                     }
                    </div>
                    <div className="artist">
                        <h4>Artist:</h4>
                        <span>ali</span>
                        <hr />
                        <span>reza</span>
                        <hr />
                        <span>amir</span>
                        <hr />
                    </div>
                </div>
                <button onClick={()=>setShowModal(true)}>Create PlayList</button>
            </div>
            <div className="rightPage">
                <input placeholder="search..." />

                <FileUploader />

                <div className="currentlyPlay">

                    <img src="/song_cover.png" alt="کاور آهنگ" />
                    <div className="containName">
                        <span className="musicName">Armin Zarei - Daram Havato (320)</span>
                        <audio id="player" src="/Armin Zarei - Daram Havato (320).mp3" controls ></audio>

                    </div>
                </div>
                <div>
                </div>
            </div>
        </div>
    )
}
export default MainPage;
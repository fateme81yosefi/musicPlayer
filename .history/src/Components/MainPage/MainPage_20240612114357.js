import FileUploader from "../../Data/FileUploader/FileUploader";
import "./MainPage.css"
import Modal from 'react-modal';
import React , {useState} from "react";

const MainPage = () => {
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleAddCategory = () => {
          setCategories([...categories, category]);
          setCategory('');
          console.log(categories)
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
                        <span>pop</span>
                        <hr />
                        <span>Rock</span>
                        <hr />
                        <span>fav</span>
                        <hr />
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
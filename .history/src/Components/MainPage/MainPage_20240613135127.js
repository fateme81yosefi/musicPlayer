import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import FileUploader from "../../Data/FileUploader/FileUploader";
import "./MainPage.css";

const MainPage = () => {
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [currentMusic, setCurrentMusic] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');


    useEffect(() => {
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

    const handlePlay = (file) => {
        setCurrentMusic(file);
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
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s" alt="Profile" />
                        <div className="name">Fateme</div>
                    </div>
                    <div className="categories">
                        <h4>categories:</h4>
                        {
                            categories.map((item, index) => <h6 key={index} className='category' onClick={()=>{setSelectedCategory(se)}}>{item}</h6>)
                        }
                    </div>
                </div>
                <button className='create' onClick={() => setShowModal(true)}>Create PlayList</button>
            </div>
            <div className="rightPage">
                <input className='inputSearch' placeholder="search..." onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FileUploader handlePlay={handlePlay} query={searchQuery} selectedCategory={selectedCategory} />
                <div className="currentlyPlay">
                    <img src="/song_cover.png" alt="کاور آهنگ" />
                    <div className="containName">
                        <span className="musicName">{currentMusic.name}</span>
                        <audio id="player" src={currentMusic.data} controls ></audio>
                    </div>
                </div>
                <div>
                </div>
            </div>
        </div>
    )
};

export default MainPage;
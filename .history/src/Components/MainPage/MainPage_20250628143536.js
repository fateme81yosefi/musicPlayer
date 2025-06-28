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
            setShowModal(false)
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
                    placeholder='Enter Your Playlist Name'
                    onChange={(e) => setCategory(e.target.value)}
                />
                <button onClick={handleAddCategory}>Confirm</button>
            </Modal>

            <div className="leftMenue">
                <div className="top">
                    <div className="imageProfile">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s" alt="Profile" />
                        <div className="name">Fateme yoosefi</div>
                    </div>
                    <div className="categories">
                        <div className='playlist'>My PlayLists</div>
                        <div className='category' onClick={() => { setSelectedCategory('') }}>All</div>
                        {
                            categories.map((item, index) => <div key={index} className='category' onClick={() => { setSelectedCategory(item) }}>{item}</div>)
                        }
                    </div>
                </div>
                <button className='create' onClick={() => setShowModal(true)}>Create PlayList</button>
            </div>
            <div className="rightPage">
                <input className='inputSearch' placeholder="search..." onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FileUploader handlePlay={handlePlay} query={searchQuery} selectedCategory={selectedCategory} />
                <div className="w-full max-w-md mx-auto p-4 bg-gradient-to-br from-[#5409DA] via-[#4E71FF] to-[#BBFBFF] rounded-3xl shadow-xl flex items-center space-x-4 animate-fade-in">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white animate-spin-slow">
                        <img src="/song_cover.png" alt="کاور آهنگ" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 text-white">


                              <ئ currentMusic={currentMusic} />

                        <h3 className="text-lg font-bold mb-2">{currentMusic.name}</h3>
                        <audio
                            id="player"
                            src={currentMusic.data}
                            controls
                            className="w-full accent-white"
                        ></audio>
                    </div>
                </div>


            </div>
        </div>
    )
};

export default MainPage;
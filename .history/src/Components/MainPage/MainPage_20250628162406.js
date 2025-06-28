import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import FileUploader from "../FileUploader/FileUploader";
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import "./MainPage.css";
import MusicLibrary from '../Audios/MusicLibrary';

const MainPage = () => {
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [currentMusic, setCurrentMusic] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // ✅ این خط اضافه شد
const [showUploaderModal, setShowUploaderModal] = useState(false);

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
            setShowModal(false);
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
                        <div className='category' onClick={() => setSelectedCategory('')}>All</div>
                        {
                            categories.map((item, index) => (
                                <div key={index} className='category' onClick={() => setSelectedCategory(item)}>{item}</div>
                            ))
                        }
                    </div>
                </div>
                <button className='create' onClick={() => setShowModal(true)}>Create PlayList</button>
            </div>

            <div className="rightPage">
            
                {/* <FileUploader />  */}


                <div className='row'>



                    <div className="fullWidth w-full  mx-auto p-4 bg-gradient-to-br from-[#5409DA] via-[#4E71FF] to-[#BBFBFF] rounded-3xl shadow-xl flex items-center space-x-4 animate-fade-in">
                        <div className="text-white">
                            <MusicPlayer currentMusic={currentMusic} />
                        </div>
                    </div>
                 <MusicLibrary
                        query={searchQuery}
                        selectedCategory={selectedCategory}
                        handlePlay={handlePlay}
                    />
                </div>
            </div>
        </div>
    );
};

export default MainPage;

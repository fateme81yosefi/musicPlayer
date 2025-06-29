import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import FileUploader from "../FileUploader/FileUploader";
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import "./MainPage.css";
import MusicLibrary from '../Audios/MusicLibrary';
import { openDB } from 'idb';

const DB_NAME = 'AudioFilesDB';
const DB_VERSION = 1;
const STORE_NAME = 'audioFiles';

const MainPage = () => {
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [currentMusic, setCurrentMusic] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUploaderModal, setShowUploaderModal] = useState(false);
    const [audioFiles, setAudioFiles] = useState([]);
    const [coverImage, setCoverImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const initDBPlaylist = async () => {
        return openDB('PlaylistDB', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('playlists')) {
                    const store = db.createObjectStore('playlists', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    store.createIndex('name', 'name', { unique: false });
                }
            },
        });
    };

    const addPlaylist = async (playlist) => {
        const db = await initDBPlaylist();
        await db.add('playlists', playlist);
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAddCategory = async () => {
        if (category) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result;
                const newPlaylist = {
                    name: category,
                    cover: base64Image,
                };
                await addPlaylist(newPlaylist);

                setCategories([...categories, category]);
                setCategory('');
                setCoverImage(null);
                setPreviewUrl('');
                setShowModal(false);
            };

            if (coverImage) {
                reader.readAsDataURL(coverImage);
            } else {
                await addPlaylist({ name: category, cover: null });
                setCategories([...categories, category]);
                setCategory('');
                setShowModal(false);
            }
        }
    };
    const initDB = async () => {
        const db = await openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'name' });
                    store.createIndex('category', 'category');
                    store.createIndex('isFav', 'isFav');
                }
            }
        });
        return db;
    };

    const getAllPlaylists = async () => {
        const db = await initDBPlaylist();
        return await db.getAll('playlists');
    };

    useEffect(() => {
        const fetchPlaylists = async () => {
            const playlists = await getAllPlaylists();
            setCategories(playlists);
        };

        fetchPlaylists();
    }, []);


    const handlePlay = (file) => {
        setCurrentMusic(file);
    };
    const deleteAllFiles = async () => {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await store.clear();
        await tx.done;
        setAudioFiles([]);
    };


    return (
        <div className="container">
            <Modal
                isOpen={showModal}
                contentLabel="Create Playlist"
                className="modalCategory"
            >

                <h2 className='modalTitle'>Create Playlist</h2>
                <input
                    type="text"
                    value={category}
                    placeholder="Enter Your Playlist Name"
                    onChange={(e) => setCategory(e.target.value)}
                    className='specInput'
                />
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {previewUrl && <img src={previewUrl} alt="Cover Preview" className="w-32 h-32 object-cover mt-2" />}

                <div className="btnGroupModal">

                    <button className='confirmBtn marginer' onClick={handleAddCategory}>Confirm</button>
                    <button className='closeBtn marginer' onClick={() => setShowModal(false)}>
                        Close
                    </button>
                </div>
            </Modal>

            <div className="leftMenue">
                <div className="top">
                    <div className="imageProfile">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s" alt="Profile" />
                        <div className="name">Fateme yoosefi</div>
                    </div>
                    <div className='dashboardSidebar'><svg xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-2 h-2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M3.75 3.75h6.5v6.5h-6.5v-6.5zm0 10h6.5v6.5h-6.5v-6.5zm10 0h6.5v6.5h-6.5v-6.5zm0-10h6.5v6.5h-6.5v-6.5z" />
                    </svg>
                        Dashboard
                        </div>

                    <div className="categories">
                        <div className='playlist'>My PlayLists</div>
                        <div className='category' onClick={() => setSelectedCategory('')}>All</div>
                        {
                            categories.map((item, index) => (
                                <div key={index} className='category' onClick={() => setSelectedCategory(item)}>{item.name}</div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className="rightPage">

                <button className='uploadBtn marginer' onClick={deleteAllFiles}>Delete All Musics</button>

                <button className="uploadBtn marginer" onClick={() => setShowUploaderModal(true)}>
                    Upload New Music
                </button>
                <button className='uploadBtn marginer' onClick={() => setShowModal(true)}>Create PlayList</button>

                <Modal
                    isOpen={showUploaderModal}
                    onRequestClose={() => setShowUploaderModal(false)}
                    contentLabel="Upload Music"
                    className="modalUploader"
                >
                    <FileUploader
                        audioFiles={audioFiles}
                        setAudioFiles={setAudioFiles}
                        onClose={() => setShowUploaderModal(false)}
                    />

                </Modal>
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

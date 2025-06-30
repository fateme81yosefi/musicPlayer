import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import FileUploader from "../FileUploader/FileUploader";
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import "./MainPage.css";
import MusicLibrary from '../Audios/MusicLibrary';
import { addPlaylist } from "../../db/playlistDB";
import { deletePlaylist } from "../../db/playlistDB"
import { getAllPlaylists } from "../../db/playlistDB";
import { deleteAllAudioFiles, updateFileCategory ,getStoredFiles} from '../../db/audioDB';

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


    const handleAddCategory = async () => {
        if (!category) return;

        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64Image = reader.result;
            const playlist = {
                id: crypto.randomUUID(),
                name: category,
                cover: base64Image,
            };

            await addPlaylist(playlist);
            setCategories((prev) => [...prev, playlist]);

            setCategory('');
            setCoverImage(null);
            setPreviewUrl('');
            setShowModal(false);
        };

        if (coverImage) {
            reader.readAsDataURL(coverImage);
        } else {
            const playlist = {
                id: crypto.randomUUID(),
                name: category,
                cover: null,
            };

            await addPlaylist(playlist);
            setCategories((prev) => [...prev, playlist]);

            setCategory('');
            setShowModal(false);
        }
    };


    const deleteCategoryFromDB = async (id) => {
        await deletePlaylist(id);
        setCategories((prev) => prev.filter((cat) => cat.id !== id));

        if (selectedCategory === id) {
            setSelectedCategory('');
        }
    };

    const deleteAllFiles = async () => {
        await deleteAllAudioFiles();
        setAudioFiles([]);
        setCurrentMusic(null);
    };

    const clearAllPlaylists = async () => {
        const allPlaylists = await getAllPlaylists();
        for (const playlist of allPlaylists) {
            await deletePlaylist(playlist.id);
        }
        setCategories([]);
        setSelectedCategory('');
    };

    // تغییر عکس کاور پلی‌لیست
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // پخش موزیک انتخاب شده
    const handlePlay = (file) => {
        const fileUrl = file.data instanceof ArrayBuffer
            ? URL.createObjectURL(new Blob([file.data], { type: file.type }))
            : file.data;

        setCurrentMusic({
            ...file,
            data: fileUrl,
        });
    };

    // تغییر دسته‌بندی موزیک
    const handleCategoryChange = async (file, newCategory) => {
        await updateFileCategory(file.id, newCategory);

        // بارگذاری مجدد لیست موزیک‌ها
        const updatedAudioFiles = await getStoredFiles();
        const filesWithUrl = updatedAudioFiles.map((file) => ({
            ...file,
            data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
        }));

        setAudioFiles(filesWithUrl);

        // اگر موزیک فعلی در حال پخش بود، آپدیتش کن
        if (currentMusic?.id === file.id) {
            const updatedMusic = filesWithUrl.find(f => f.id === file.id);
            if (updatedMusic) {
                setCurrentMusic(updatedMusic);
            }
        }
    };



    useEffect(() => {
        const fetchPlaylists = async () => {
            const data = await getAllPlaylists();
            setCategories(data || []);
        };

        fetchPlaylists();
    }, []);




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
                {previewUrl && <img src={previewUrl} alt="Cover Preview" className="previewCover" />}

                <div className="btnGroupModal">

                    <button className='confirmBtn marginer' onClick={handleAddCategory}>Confirm</button>
                    <button className='closeBtn marginer' onClick={() => setShowModal(false)}>
                        Close
                    </button>
                </div>
            </Modal>

            <div className="leftMenue">
                <div className="top">

                    <div className='dashboardSidebar'><svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={"80px"}
                        height={"80px"}
                        fill="currentColor"
                        className="marginer">
                        <path fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 3a3 3 0 110 6 3 3 0 010-6zM7.5 17.25a4.5 4.5 0 019 0v.75a.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75v-.75z"
                            clipRule="evenodd" />
                    </svg>

                        Fateme Yoosefi
                    </div>

                    <div className='dashboardSidebar items'><svg xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.2"
                        width={"40px"}
                        height={"40px"}
                        stroke="currentColor"
                        className="marginer">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M3.75 3.75h6.5v6.5h-6.5v-6.5zm0 10h6.5v6.5h-6.5v-6.5zm10 0h6.5v6.5h-6.5v-6.5zm0-10h6.5v6.5h-6.5v-6.5z" />
                    </svg>
                        Dashboard
                    </div>

                    <div className="dashboardSidebar items">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width={"40px"}
                            height={"40px"}
                            className="text-gray-700 marginer">
                            <path d="M3 6.75C3 6.34 3.34 6 3.75 6h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zm0 5.25c0-.41.34-.75.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 5.25c0-.41.34-.75.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM17 9.25v6.19a2.25 2.25 0 10.75 1.56V10.5h2.25a.75.75 0 000-1.5H17z" />
                        </svg>
                        My PlayLists
                        {/* <div className='category' onClick={() => setSelectedCategory('')}>All</div>
                        {
                            categories.map((item, index) => (
                                <div key={index} className='category' onClick={() => setSelectedCategory(item)}>{item.name}</div>
                            ))
                        } */}
                    </div>
                    <div className="dashboardSidebar items">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width={"40px"}
                            height={"40px"}
                            className="text-gray-700 marginer">
                            <path d="M3 10h1v4H3v-4zm3-3h1v10H6V7zm3 5h1v4H9v-4zm3-8h1v16h-1V4zm3 3h1v10h-1V7zm3 2h1v6h-1V9zm3 1h1v4h-1v-4z" />
                        </svg>


                        My Musics
                        {/* <div className='category' onClick={() => setSelectedCategory('')}>All</div>
                        {
                            categories.map((item, index) => (
                                <div key={index} className='category' onClick={() => setSelectedCategory(item)}>{item.name}</div>
                            ))
                        } */}
                    </div>
                </div>
            </div>

            <div className="rightPage">

                <div className='fullWidth headerBtnContainer'>
                    <div className=''>
                        <button className='uploadBtnHeader marginer' onClick={deleteAllFiles}>Delete All Musics</button>

                        <button className="uploadBtnHeader marginer" onClick={() => setShowUploaderModal(true)}>
                            Upload New Music
                        </button>
                        <button className='uploadBtnHeader marginer' onClick={() => setShowModal(true)}>Create PlayList</button>
                        <button className='uploadBtnHeader marginer' onClick={() => clearAllPlaylists()}>Delete All PlayLists</button>

                    </div>
                    <input
                        className="inputSearch"
                        placeholder="search..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
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


                <div className='containCateg'>
                    {
                        categories.map((item, index) => (
                            <div className='categ' key={index}>
                                <img onClick={() => setSelectedCategory(item.name)} src={item.cover} alt='cover' />

                                <div className='catName'>
                                    {item.name}
                                </div>
                                <button onClick={() => deleteCategoryFromDB(item.id)}>حذف</button>

                            </div>
                        ))
                    }
                </div>

                <div className='row'>


                    {currentMusic?.data && (
                        <div className="fullWidth w-full bg-gradient-to-br from-[#5409DA] via-[#4E71FF] to-[#BBFBFF] rounded-3xl shadow-xl flex items-center space-x-4 animate-fade-in">
                            <div className="text-white">
                                <MusicPlayer currentMusic={currentMusic} />
                            </div>
                        </div>
                    )}

                    <MusicLibrary
                        categories={categories}
                        query={searchQuery}
                        selectedCategory={selectedCategory}
                        audioFiles={audioFiles}
                        setAudioFiles={setAudioFiles}
                        handlePlay={handlePlay}
                        onCategoryChange={handleCategoryChange}
                    />

                </div>
            </div>
        </div>
    );
};

export default MainPage;

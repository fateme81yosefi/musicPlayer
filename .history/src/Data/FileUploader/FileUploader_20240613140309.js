import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { openDB } from 'idb';
import "./FileUploader.css";

const DB_NAME = 'AudioFilesDB';
const DB_VERSION = 1;
const STORE_NAME = 'audioFiles';

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

const getStoredFiles = async (db) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return await store.getAll();
};

const storeFile = async (db, file) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.put(file);
    await tx.done;
};


const FileUploader = ({ handlePlay, query, selectedCategory }) => {
    const [audioFiles, setAudioFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('');


    const deleteAllFiles = async () => {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await store.clear();
        await tx.done;
        window.location.reload()
    };

    useEffect(() => {
        const storedCategories = JSON.parse(localStorage.getItem('categories'));
        if (storedCategories) {
            setCategories(storedCategories);
        }

    }, []);


    useEffect(() => {
      console.log(selectedCategory)
      setCurrentCategory(selectedCategory)
    }, [selectedCategory])
    

    useEffect(() => {
        if (query !== "") {
            setAudioFiles(audioFiles.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())));
        } else {
            const fetchStoredFiles = async () => {
                const db = await initDB();
                const storedFiles = await getStoredFiles(db);
                setAudioFiles(storedFiles.map(file => ({
                    ...file,
                    data: URL.createObjectURL(new Blob([file.data], { type: file.type }))
                })));
            };

            fetchStoredFiles();
        }
    }, [query]);

    useEffect(() => {
        const fetchStoredFiles = async () => {
            const db = await initDB();
            const storedFiles = await getStoredFiles(db);
            setAudioFiles(storedFiles.map(file => ({
                ...file,
                data: URL.createObjectURL(new Blob([file.data], { type: file.type }))
            })));
        };

        fetchStoredFiles();
    }, []);

    const onDrop = async (acceptedFiles) => {
        const mp3Files = acceptedFiles.filter((file) => file.name.endsWith('.mp3'));

        const db = await initDB();

        for (const file of mp3Files) {
            const fileData = await file.arrayBuffer();
            await storeFile(db, { name: file.name, type: file.type, data: fileData, category: '' });
        }

        const storedFiles = await getStoredFiles(db);
        setAudioFiles(storedFiles.map(file => ({
            ...file,
            data: URL.createObjectURL(new Blob([file.data], { type: file.type }))
        })));
    };

    const handleCategoryChange = async (file, category) => {
        const updatedFile = { ...file, category };

        const db = await initDB();
        await storeFile(db, updatedFile);

        const storedFiles = await getStoredFiles(db);
        setAudioFiles(storedFiles.map(f => ({
            ...f,
            data: URL.createObjectURL(new Blob([f.data], { type: f.type }))
        })));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className='containSingle'>

            <button onClick={deleteAllFiles}>Delete All Files</button>
            {audioFiles.map((file, index) => (
                <div className='singleSelectedAudio' key={index}>
                    <div className='row'>
                        <div className='containDetails'>
                            <img className='cover' alt="cover" src='/song_cover.png' />
                            <span className='name'>{file.name}</span>
                        </div>
                        <div>
                            <select
                                value={file.category}
                                onChange={(e) => handleCategoryChange(file, e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                            <button className='btnPlay' onClick={() => handlePlay(file)}>

                                <img className='play' alt='icon' src='/play-button.svg' />
                            </button>
                        </div>
                    </div>
                    <audio className='selectedAudio' src={file.data} key={index} controls={currentCategory === "" || file.category === currentCategory} />

                </div>
            ))}

            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className='chooseFile'>
                    <img alt='drag file' src='/images.png' />
                    <p>choose file</p>
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
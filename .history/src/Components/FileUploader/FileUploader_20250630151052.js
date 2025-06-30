import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { openDB } from 'idb';
import './FileUploader.css';

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

const generateRandomId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const storeFile = async (db, file) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const fileWithId = {
        ...file,
        id: file.id || generateRandomId(),  
    };

    await store.put(fileWithId);
    await tx.done;
    return fileWithId.id;
};


const FileUploader = ({ audioFiles, setAudioFiles, selectedCategory = '', onClose }) => {
    const [tempFiles, setTempFiles] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const storedCategories = JSON.parse(localStorage.getItem('categories'));
        if (storedCategories) {
            setCategories(storedCategories);
        }
    }, []);

    useEffect(() => {
        const fetchStoredFiles = async () => {
            const db = await initDB();
            const storedFiles = await getStoredFiles(db);
            const filesWithURL = storedFiles.map(file => ({
                ...file,
                data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
            }));
            setAudioFiles(filesWithURL);
        };
        fetchStoredFiles();
    }, [setAudioFiles]);

    const onDrop = async (acceptedFiles) => {
        const mp3Files = acceptedFiles.filter(file => file.name.toLowerCase().endsWith('.mp3'));

        const processedFiles = await Promise.all(mp3Files.map(async (file) => {
            const data = await file.arrayBuffer();
            return {
                name: file.name,
                type: file.type,
                data,
                category: selectedCategory || '',
                cover: null,
                coverUrl: null,
            };
        }));

        setTempFiles(prev => [...prev, ...processedFiles]);
    };

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
    });

    const handleCoverUpload = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const updatedTempFiles = [...tempFiles];
            updatedTempFiles[index].cover = reader.result;
            setTempFiles(updatedTempFiles);
        };

        reader.readAsDataURL(file);
    };

    const handleConfirm = async () => {
        if (tempFiles.length === 0) return;

        const db = await initDB();
        for (const file of tempFiles) {
            await storeFile(db, file);
        }

        const storedFiles = await getStoredFiles(db);
        const filesWithURL = storedFiles.map(file => ({
            ...file,
            data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
        }));

        setAudioFiles(filesWithURL);
        setTempFiles([]);
        onClose();
    };

    return (
        <div className='containSingle'>
            <div className='uploadHeader'>
                <button className='uploadBtn' onClick={open}>Upload MP3</button>


                {tempFiles.length > 0 && (
                    <div className='tempFilesList'>
                        {tempFiles.map((file, i) => (
                            <div className="tempItem" key={i}>
                                <div className="tempDetails">
                                    <img
                                        src={file.cover || "/song_cover.png"}
                                        alt="cover"
                                        className="coverPreview"
                                    />
                                    <div className='info'>
                                        <p className="name">{file.name}</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleCoverUpload(e, i)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="btnGroup">
                            <button className='confirmBtn' onClick={handleConfirm}>
                                Add
                            </button>
                            <button className='closeBtn' onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
};

export default FileUploader;

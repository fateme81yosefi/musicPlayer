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
                db.createObjectStore(STORE_NAME, { keyPath: 'name' });
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

const FileUploader = ({ handlePlay ,query }) => {
    const [audioFiles, setAudioFiles] = useState([]);


    if(query!==""){
        setAudioFiles(audioFiles.fi)


        const filterBySearch = productList.filter((item) => {
            if (item.toLowerCase()
                .includes(searchVal.toLowerCase())) { return item; }
        })
        setProducts(filterBySearch);
    }

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
        const mp3Files = acceptedFiles.filter((file) =>
            file.name.endsWith('.mp3')
        );

        const db = await initDB();

        for (const file of mp3Files) {
            const fileData = await file.arrayBuffer();
            await storeFile(db, { name: file.name, type: file.type, data: fileData });
        }

        const storedFiles = await getStoredFiles(db);
        setAudioFiles(storedFiles.map(file => ({
            ...file,
            data: URL.createObjectURL(new Blob([file.data], { type: file.type }))
        })));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className='containSingle'>
            {audioFiles.map((file, index) => (
                <div className='singleSelectedAudio' key={index}>
                    <div className='row'>
                        <div className='containDetails'>
                            <img className='cover' alt="cover" src='/song_cover.png' />
                            <span className='name'>{file.name}</span>
                        </div>
                        <button className='btnPlay' onClick={() => handlePlay(file)}><img className='play' alt='icon' src='/play-button.svg' /></button>
                    </div>
                    <audio className='selectedAudio' src={file.data} key={index} controls />
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

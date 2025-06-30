import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUploader.css';
import {
    getStoredFiles,
    storeFile
} from '../../db/audioDB';
import { getPlaylists } from '../../db/playlistDB'; // ← اگه جدا نوشتی برای پلی‌لیست‌ها

const FileUploader = ({ audioFiles, setAudioFiles, selectedCategory = '', onClose }) => {
    const [tempFiles, setTempFiles] = useState([]);
    const [categories, setCategories] = useState([]);



    const fetchAndSetAudioFiles = async () => {
        const rawFiles = await getStoredFiles();
        const filesWithUrl = rawFiles.map(file => ({
            ...file,
            data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
        }));
        setAudioFiles(filesWithUrl);
    };

    useEffect(() => {
        const fetchStoredCategories = async () => {
            const playlists = await getPlaylists(); // ✔ تابع از playlistDB
            setCategories(playlists);
        };
        fetchStoredCategories();
    }, []);
    

    useEffect(() => {
        const fetchStoredFiles = async () => {
            const storedFiles = await getStoredFiles();
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
                type: file.type || "audio/mpeg", // ← این خط اضافه بشه
                data,
                category: selectedCategory || '',
                cover: null,
                coverUrl: null,
            };
        }));


        setTempFiles(prev => [...prev, ...processedFiles]);
    };

    const { open } = useDropzone({
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

        for (const file of tempFiles) {
            await storeFile(file); 
            await fetchAndSetAudioFiles()
        }

        const storedFiles = await getStoredFiles();
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
                            <button className='confirmBtn' onClick={handleConfirm}>Add</button>
                            <button className='closeBtn' onClick={onClose}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;

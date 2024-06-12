import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import "./FileUploader.css";

// Helper function to convert file to base64 string
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Helper function to convert base64 string to Blob URL
const base64ToBlobUrl = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new ArrayBuffer(byteString.length);
    const data = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
        data[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([buffer], { type: mimeString });
    return URL.createObjectURL(blob);
};

const FileUploader = ({ handlePlay }) => {
    const [audioFiles, setAudioFiles] = useState([]);

    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem('audioFiles')) || [];
        setAudioFiles(storedFiles.map(file => ({
            name: file.name,
            type: file.type,
            data: base64ToBlobUrl(file.data)
        })));
    }, []);

    const onDrop = async (acceptedFiles) => {
        const mp3Files = acceptedFiles.filter((file) =>
            file.name.endsWith('.mp3')
        );

        const filesToStore = await Promise.all(mp3Files.map(async file => ({
            name: file.name,
            type: file.type,
            data: await fileToBase64(file)
        })));

        const updatedFiles = [...audioFiles, ...filesToStore.map(file => ({
            ...file,
            data: base64ToBlobUrl(file.data)
        }))];
        setAudioFiles(updatedFiles);

        localStorage.setItem('audioFiles', JSON.stringify(filesToStore));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        audioFiles.length !== 0 ? (
            audioFiles.map((file, index) => (
                <div className='singleSelectedAudio' key={index}>
                    <div className='row'>
                        <span>{file.name}</span>
                        <button onClick={() => handlePlay(file)}>Play</button>
                    </div>
                    <audio className='selectedAudio' src={file.data} key={index} controls />
                </div>
            ))
        ) : (
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className='chooseFile'>
                    <img alt='drag file' src='/images.png' />
                    <p>Choose file</p>
                </div>
            </div>
        )
    );
};

export default FileUploader;

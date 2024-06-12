import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import "./FileUploader.css"

const FileUploader = () => {
    const [audioFiles, setAudioFiles] = useState([]);

    useEffect(() => {
        // Retrieve audio files from localStorage
        const storedFiles = JSON.parse(localStorage.getItem('audioFiles')) || [];
        setAudioFiles(storedFiles.map(file => new File([file.data], file.name, { type: file.type })));
    }, []);

    const onDrop = (acceptedFiles) => {
        const mp3Files = acceptedFiles.filter((file) =>
            file.name.endsWith('.mp3')
        );

        // Convert files to JSON-compatible objects
        const filesToStore = mp3Files.map(file => ({
            name: file.name,
            type: file.type,
            data: URL.createObjectURL(file)
        }));

        const updatedFiles = [...audioFiles, ...filesToStore];
        setAudioFiles(updatedFiles);

        // Save files to localStorage
        localStorage.setItem('audioFiles', JSON.stringify(updatedFiles));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        audioFiles.length !== 0 ? (
            audioFiles.map((file, index) => (
                <div className='singleSelectedAudio' key={index}>
                    <div className='row'>
                        <span>{file.name}</span>
                        <button>play</button>
                    </div>
                    <audio className='selectedAudio' src={file.data} key={index} controls />
                </div>
            ))
        ) : (
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className='chooseFile'>
                    <img alt='drag file' src='/images.png' />
                    <p>choose file</p>
                </div>
            </div>
        )
    );
};

export default FileUploader;

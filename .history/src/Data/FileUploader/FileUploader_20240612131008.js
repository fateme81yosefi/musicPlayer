import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import "./FileUploader.css";

const FileUploader = ({ handlePlay }) => {
    const [audioFiles, setAudioFiles] = useState([]);

    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem('audioFiles')) || [];
        setAudioFiles(storedFiles.map(file => ({
            name: file.name,
            type: file.type,
            data: file.data
        })));
    }, []);

    const onDrop = (acceptedFiles) => {
        const mp3Files = acceptedFiles.filter((file) =>
            file.name.endsWith('.mp3')
        );

        const filesToStore = mp3Files.map(file => ({
            name: file.name,
            type: file.type,
            data: URL.createObjectURL(file)
        }));

        const updatedFiles = [...audioFiles, ...filesToStore];
        setAudioFiles(updatedFiles);
        localStorage.setItem('audioFiles', JSON.stringify(updatedFiles));
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
                    <audio className='selectedAudio' type={file.} src={file.data} key={index} controls />
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

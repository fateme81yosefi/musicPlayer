import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import "./FileUploader.css"

const FileUploader = () => {
    const [audioFiles, setAudioFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        const mp3Files = acceptedFiles.filter((file) =>
            file.name.endsWith('.mp3')
        );

        setAudioFiles(mp3Files);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    console.log(audioFiles)
    console.log(audioFiles)
    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />

            {audioFiles ?
                audioFiles.map((file, index) => (
                    <audio src={URL.createObjectURL(file)} key={index} controls />

                ):
                <div className='chooseFile'>
                    <img alt='drag file' src='/images.png' />
                    <p>choose file</p>
                </div>
            
         )}
        </div>
    );
};

export default FileUploader;

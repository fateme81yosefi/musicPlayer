import React, { useState, useEffect } from 'react';
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


    useEffect(() => {
        const storedAudioFiles = JSON.parse(localStorage.getItem('audioFiles'));
        setAudioFiles(storedAudioFiles ? storedAudioFiles : [])
    }, [])
    const handleAddAudioFile = (file) => {
        const updatedAudioFiles = [...audioFiles, file];
        setAudioFiles(updatedAudioFiles);
      
        localStorage.setItem('audioFiles', JSON.stringify(updatedAudioFiles));
      };
    useEffect(() => {


        audioFiles.map((item, index) => {

            const blob = new Blob(item, { type: 'audio/mpeg' });
            handleAddAudioFile(blob);
        })

    }, [audioFiles]);



    return (


        audioFiles.length !== 0 ?
            (audioFiles.map((file, index) => (
                <div className='singleSelectedAudio' key={index}>
                    <div className='row'>
                        <span>{file.name}</span>
                        <button>play</button>
                    </div>
                    <audio className='selectedAudio' src={URL.createObjectURL(file)} key={index} controls />

                </div>
            ))
            )
            :
            (<div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className='chooseFile'>
                    <img alt='drag file' src='/images.png' />
                    <p>choose file</p>
                </div>


            </div >)



    );
};

export default FileUploader;

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
       console.log(audioFiles)
    }, []);

    
    useEffect(() => {
  
    }, [audioFiles]);



    return (


        audioFiles.length !== 0 ?


            (audioFiles.map((file, index) => (
                <div className='singleSelectedAudio'>
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

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


        </div >
    );
};

export default FileUploader;

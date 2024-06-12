import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = () => {
  const [audioFiles, setAudioFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    // فیلتر کردن فایل های با پسوند .mp3
    const mp3Files = acceptedFiles.filter((file) =>
      file.name.endsWith('.mp3')
    );

    setAudioFiles(mp3Files);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
console.log(getAlbumArt(audioFiles[0]))
  console.log(audioFiles)
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Please Select Your Music...</p>
      {audioFiles.map((file, index) => (
        <audio src={URL.createObjectURL(file)} key={index} controls/>
        
      ))}
    </div>
  );
};

export default FileUploader;

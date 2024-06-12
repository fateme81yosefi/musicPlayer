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

  console.log(audioFiles)
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>فایل های صوتی را اینجا رها کنید یا کلیک کنید تا آپلود کنید.</p>
      {audioFiles.map((file, index) => (
        <div key={index}>{file.name}</div>
        <audio src={audioFiles[0].}/>
      ))}
    </div>
  );
};

export default FileUploader;


import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = ({ audioFiles, setAudioFiles, onClose }) => {
  const [newFiles, setNewFiles] = useState([]);

  const onDrop = async (acceptedFiles) => {
    // فقط فایل‌های mp3 را قبول کن
    const mp3Files = acceptedFiles.filter((file) => file.type === "audio/mpeg");

    // فایل‌ها را به آرایه newFiles اضافه می‌کنیم
    const processedFiles = await Promise.all(
      mp3Files.map(async (file) => {
        const data = await file.arrayBuffer();
        return {
          name: file.name,
          type: file.type,
          data,
          category: "",
          cover: null, // کاور پیش‌فرض اگر خواستی اضافه کن
        };
      })
    );

    setNewFiles((prev) => [...prev, ...processedFiles]);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const handleConfirm = () => {
    // فایل‌های جدید را به لیست اصلی اضافه کن
    setAudioFiles([...audioFiles, ...newFiles]);
    setNewFiles([]);
    onClose();
  };

  return (
    <div className="file-uploader-container">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>فایل‌های صوتی خود را بکشید و رها کنید یا از دکمه زیر انتخاب کنید</p>
        <button type="button" onClick={open}>
          انتخاب فایل‌ها
        </button>
      </div>

      {newFiles.length > 0 && (
        <div className="new-files-list">
          <h4>فایل‌های آماده برای آپلود:</h4>
          <ul>
            {newFiles.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="confirm-upload-btn"
        onClick={handleConfirm}
        disabled={newFiles.length === 0}
      >
        تایید و افزودن به لیست
      </button>
    </div>
  );
};

export default FileUploader;

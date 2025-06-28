import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { openDB } from 'idb';
import "./FileUploader.css";

const DB_NAME = 'AudioFilesDB';
const DB_VERSION = 1;
const STORE_NAME = 'audioFiles';

const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'name' });
        store.createIndex('category', 'category');
        store.createIndex('isFav', 'isFav');
      }
    }
  });
  return db;
};

const getStoredFiles = async (db) => {
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return await store.getAll();
};

const storeFile = async (db, file) => {
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put(file);
  await tx.done;
};

const FileUploader = ({ audioFiles, setAudioFiles, query, selectedCategory, onClose }) => {
  const [tempFiles, setTempFiles] = useState([]); // فایل‌های جدید که هنوز ذخیره نشدن
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories'));
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, []);

  // بارگذاری فایل‌های ذخیره شده از IndexedDB (فقط وقتی query خالی باشه)
  useEffect(() => {
    if (query !== "") return; // وقتی سرچ هست، لود نکن
    const fetchStoredFiles = async () => {
      const db = await initDB();
      const storedFiles = await getStoredFiles(db);
      const filesWithURL = storedFiles.map(file => ({
        ...file,
        data: URL.createObjectURL(new Blob([file.data], { type: file.type }))
      }));
      setAudioFiles(filesWithURL);
    };
    fetchStoredFiles();
  }, [query, setAudioFiles]);

  const onDrop = async (acceptedFiles) => {
    const mp3Files = acceptedFiles.filter(file => file.name.endsWith('.mp3'));
    const processedFiles = await Promise.all(mp3Files.map(async (file) => {
      const data = await file.arrayBuffer();
      return {
        name: file.name,
        type: file.type,
        data,
        category: '',
        cover: null,
      };
    }));
    setTempFiles(prev => [...prev, ...processedFiles]);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  // دکمه تایید که فایل‌های موقت رو ذخیره نهایی کنه توی IndexedDB و به لیست اصلی اضافه کنه
  const handleConfirm = async () => {
    if (tempFiles.length === 0) return;
    const db = await initDB();
    for (const file of tempFiles) {
      await storeFile(db, file);
    }
    // بعد از ذخیره، فایل‌ها رو دوباره از DB بخون و لیست اصلی رو آپدیت کن
    const storedFiles = await getStoredFiles(db);
    const filesWithURL = storedFiles.map(file => ({
      ...file,
      data: URL.createObjectURL(new Blob([file.data], { type: file.type }))
    }));
    setAudioFiles(filesWithURL);
    setTempFiles([]);
    onClose(); // بستن مودال
  };


  return (
    <>

      <div className='containSingle'>
        <div className='fullWidth'>
          {/* نمایش فایل‌های اصلی (از DB یا state والد) */}
          {audioFiles
            .filter(file => selectedCategory === "" || file.category === selectedCategory)
            .map((file, index) => (
              <div className='singleSelectedAudio' key={index}>
                <div className='row'>
                  <div className='containDetails'>
                    <img className='cover' alt="cover" src={file.cover || '/song_cover.png'} />
                    <span className='name'>{file.name}</span>
                  </div>
                  <div className='row'>
                    <select
                      value={file.category}
                      onChange={(e) => {
                        const updatedFile = { ...file, category: e.target.value };
                        (async () => {
                          const db = await initDB();
                          await storeFile(db, updatedFile);
                          const storedFiles = await getStoredFiles(db);
                          const filesWithURL = storedFiles.map(f => ({
                            ...f,
                            data: URL.createObjectURL(new Blob([f.data], { type: f.type }))
                          }));
                          setAudioFiles(filesWithURL);
                        })();
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, idx) => (
                        <option key={idx} value={category}>{category}</option>
                      ))}
                    </select>
                    <button className='btnPlay' onClick={() => { /* اینجا handlePlay باید پاس داده بشه از والد */ }}>
                      <img className='play' alt='icon' src='/play-button.svg' />
                    </button>
                  </div>
                </div>
                <audio className='selectedAudio' src={file.data} controls />
              </div>
            ))}
        </div>

        <div className='fullWidth' {...getRootProps()}>
          <input {...getInputProps()} />
          <div className='chooseFile'>
            <img alt='drag file' src='/images.png' />
            <p> Choose Your Musics...</p>
          </div>
        </div>

        {/* نمایش فایل‌های موقتی که هنوز ذخیره نهایی نشدن */}
        {tempFiles.length > 0 && (
          <div className='tempFilesList'>
            <h4>فایل‌های آماده برای آپلود:</h4>
            <ul>
              {tempFiles.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
            <button className='confirmBtn' onClick={handleConfirm}>تایید و افزودن به لیست</button>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUploader;

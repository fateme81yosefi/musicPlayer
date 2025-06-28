import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { openDB } from 'idb';
import './FileUploader.css';

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

const FileUploader = ({ handlePlay, query, selectedCategory, setAudioFiles }) => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories'));
    if (storedCategories) setCategories(storedCategories);
  }, []);

  useEffect(() => {
    setCurrentCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (query !== '') {
      setAudioFiles(prev =>
        prev.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      fetchStoredFiles();
    }
  }, [query]);

  const fetchStoredFiles = async () => {
    const db = await initDB();
    const storedFiles = await getStoredFiles(db);
    const updatedFiles = storedFiles.map(file => ({
      ...file,
      data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
      coverUrl: file.cover
        ? URL.createObjectURL(new Blob([file.cover], { type: file.coverType }))
        : '/song_cover.png'
    }));
    setAudioFiles(updatedFiles);
  };

  const onDrop = async (acceptedFiles) => {
    const db = await initDB();

    for (const file of acceptedFiles) {
      if (file.name.endsWith('.mp3')) {
        const fileData = await file.arrayBuffer();
        const coverData = coverImage ? await coverImage.arrayBuffer() : null;

        await storeFile(db, {
          name: file.name,
          type: file.type,
          data: fileData,
          category: '',
          cover: coverData,
          coverType: coverImage?.type || null
        });
      }
    }

    fetchStoredFiles();
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (

    
    <div className="containUploader">
      <input type="file" accept="image/*" onChange={handleCoverUpload} />
      <div {...getRootProps()} className="chooseFile">
        <input {...getInputProps()} />
        <p>Drop or choose your music (.mp3)</p>
      </div>
    </div>
  );
};

export default FileUploader;

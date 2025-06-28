import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { openDB } from "idb";
import "./FileUploader.css";
import AudioList from "../Audios/AudioList";
import MusicPlayer from "../MusicPlayer/MusicPlayer";

const DB_NAME = "AudioFilesDB";
const DB_VERSION = 1;
const STORE_NAME = "audioFiles";

const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "name" });
        store.createIndex("category", "category");
        store.createIndex("isFav", "isFav");
      }
    },
  });
  return db;
};

const getStoredFiles = async (db) => {
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  return await store.getAll();
};

const storeFile = async (db, file) => {
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.put(file);
  await tx.done;
};

const FileUploader = ({ handlePlay, query, selectedCategory }) => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");

  const deleteAllFiles = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await store.clear();
    await tx.done;
    window.location.reload();
  };

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem("categories"));
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, []);

  useEffect(() => {
    setCurrentCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (query !== "") {
      setAudioFiles((prev) =>
        prev.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      );
    } else {
      const fetchStoredFiles = async () => {
        const db = await initDB();
        const storedFiles = await getStoredFiles(db);
        setAudioFiles(
          storedFiles.map((file) => ({
            ...file,
            data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
          }))
        );
      };

      fetchStoredFiles();
    }
  }, [query]);

  useEffect(() => {
    const fetchStoredFiles = async () => {
      const db = await initDB();
      const storedFiles = await getStoredFiles(db);
      setAudioFiles(
        storedFiles.map((file) => ({
          ...file,
          data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
        }))
      );
    };

    fetchStoredFiles();
  }, []);

  const onDrop = async (acceptedFiles) => {
    const mp3Files = acceptedFiles.filter((file) => file.name.endsWith(".mp3"));

    const db = await initDB();

    for (const file of mp3Files) {
      const fileData = await file.arrayBuffer();
      await storeFile(db, { name: file.name, type: file.type, data: fileData, category: "" });
    }

    const storedFiles = await getStoredFiles(db);
    setAudioFiles(
      storedFiles.map((file) => ({
        ...file,
        data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
      }))
    );
  };

  const handleCategoryChange = async (file, category) => {
    const updatedFile = { ...file, category };

    const db = await initDB();
    await storeFile(db, updatedFile);

    const storedFiles = await getStoredFiles(db);
    setAudioFiles(
      storedFiles.map((f) => ({
        ...f,
        data: URL.createObjectURL(new Blob([f.data], { type: f.type })),
      }))
    );
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <button className="deleteAll" onClick={deleteAllFiles}>
        Delete All Musics
      </button>

      <div className="containSingle">
        <AudioList
          audioFiles={audioFiles}
          categories={categories}
          currentCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
          onPlay={handlePlay}
        />

      <MusicPlayer/>
      </div>
    </>
  );
};

export default FileUploader;

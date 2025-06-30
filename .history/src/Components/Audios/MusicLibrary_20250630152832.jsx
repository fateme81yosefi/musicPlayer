import React, { useEffect, useState } from "react";
import { openDB } from "idb";
import AudioList from "./AudioList";

const DB_NAME = "AudioFilesDB";
const DB_VERSION = 1;
const STORE_NAME = "audioFiles";

export default function MusicLibrary({
  query,
  selectedCategory,
  handlePlay,
  categories,
}) {
  const [audioFiles, setAudioFiles] = useState([]);

  const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("category", "category");
        }
      },
    });
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

  const handleCategoryChange = async (file, newCategory) => {
    const db = await initDB();
    const updatedFile = {
      ...file,
      category: newCategory, // newCategory must be an object like { id, name, cover }
    };

    await storeFile(db, updatedFile);

    const storedFiles = await getStoredFiles(db);
    const filesWithURL = storedFiles.map((file) => ({
      ...file,
      data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
    }));
    setAudioFiles(filesWithURL);
  };

  const fetchFiles = async () => {
    const db = await initDB();
    const storedFiles = await getStoredFiles(db);
    const filesWithURL = storedFiles.map((file) => ({
      ...file,
      data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
    }));

    let filteredFiles = filesWithURL;

    if (selectedCategory) {
      filteredFiles = filteredFiles.filter(
        (file) => file.category?.name === selectedCategory
      );
    }

    if (query) {
      filteredFiles = filteredFiles.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setAudioFiles(filteredFiles);
  };

  useEffect(() => {
    fetchFiles();
  }, [query, selectedCategory]);

  return (
    <AudioList
      audioFiles={audioFiles}
      setAudioFiles={setAudioFiles}
      categories={categories}
      currentCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      onPlay={handlePlay}
    />
  );
}

import React, { useEffect, useState } from "react";
import { openDB } from "idb";
import AudioList from "./AudioList";

const DB_NAME = "AudioFilesDB";
const DB_VERSION = 1;
const STORE_NAME = "audioFiles";

const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION);
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

export default function MusicLibrary({
  query,
  selectedCategory,
  handlePlay,
  categories,
}) {

  const [audioFiles, setAudioFiles] = useState([]);



  const handleCategoryChange = async (file, category) => {
    const db = await initDB();
    const updatedFile = { ...file, category };
    await storeFile(db, updatedFile);

    const storedFiles = await getStoredFiles(db);
    const files = storedFiles.map((file) => ({
      ...file,
      data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
    }));
    setAudioFiles(files);
  };

  return (
    <AudioList
      audioFiles={audioFiles}
      categories={categories}
      setAudioFiles={setAudioFiles}
      currentCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      onPlay={handlePlay}
    />
  );
}

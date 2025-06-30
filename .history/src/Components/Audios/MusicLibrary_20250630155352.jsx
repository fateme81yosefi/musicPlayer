import React, { useEffect, useState } from "react";
import AudioList from "./AudioList";
import { initDB, getStoredFiles, storeFile } from "../db/audioDB";

export default function MusicLibrary({
  query,
  selectedCategory,
  handlePlay,
  categories,
}) {
  const [audioFiles, setAudioFiles] = useState([]);

  const handleCategoryChange = async (file, newCategory) => {
    const db = await initDB();

    const updatedFile = {
      ...file,
      category: newCategory, // ← باید شیٔی مثل { id, name, cover } باشه
    };

    await storeFile(db, updatedFile);

    // به‌روزرسانی لیست
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

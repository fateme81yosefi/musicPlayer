import React, { useEffect, useState } from "react";
import AudioList from "./AudioList";
import { getStoredFiles, storeFile } from "../../db/audioDB";

export default function MusicLibrary({
  query,
  selectedCategory,
  handlePlay,
  categories,
  onCategoryChange,
  on
}) {
  const [audioFiles, setAudioFiles] = useState([]);

  const handleCategoryChange = async (file, newCategory) => {
    const updatedFile = {
      ...file,
      category: newCategory, // ← باید شی مثل { id, name, cover } باشه
    };

    await storeFile(updatedFile); // ❌ حذف db از ورودی

    const storedFiles = await getStoredFiles();
    const filesWithURL = storedFiles.map((file) => ({
      ...file,
      data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
    }));
    setAudioFiles(filesWithURL);
  };

  const fetchFiles = async () => {
    const storedFiles = await getStoredFiles();

    const filesWithURL = storedFiles.map((file) => ({
      ...file,
      data:
        typeof file.data === "string"
          ? file.data // اگر از قبل URL بوده
          : URL.createObjectURL(
              new Blob([file.data], { type: file.type || "audio/mpeg" })
            ),
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
      onCategoryChange={onCategoryChange}
      onPlay={handlePlay}
      onDelete={handleDelete}
    />
  );
}

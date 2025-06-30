import React, { useEffect, useState } from "react";
import AudioList from "./AudioList";
import { getStoredFiles, storeFile } from "../../db/audioDB";

export default function MusicLibrary({
  query,
  selectedCategory,
  handlePlay,
  categories,
  onCategoryChange,
}) {
  const [audioFiles, setAudioFiles] = useState([]);

  const handleCategoryChange = async (file, newCategory) => {
    const updatedFile = {
      ...file,
      category: newCategory,
    };

    await storeFile(updatedFile);

    const storedFiles = await getStoredFiles();
    const filesWithURL = storedFiles.map((file) => ({
      ...file,
      data:
        typeof file.data === "string"
          ? file.data
          : URL.createObjectURL(
              new Blob([file.data], { type: file.type || "audio/mpeg" })
            ),
    }));

    setAudioFiles(filesWithURL);
    // 🔁 به موزیک پلیر اطلاع بده موزیک فعال به‌روز شده
    if (file.id) {
      const updated = filesWithURL.find((f) => f.id === file.id);
      if (updated) onCategoryChange(updated, newCategory);
    }
  };

  const fetchFiles = async () => {
    const storedFiles = await getStoredFiles();

    const filesWithURL = storedFiles.map((file) => ({
      ...file,
      data:
        typeof file.data === "string"
          ? file.data
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


    useEffect(() => {
    fetchFiles();
  }, [audioFiles]);



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

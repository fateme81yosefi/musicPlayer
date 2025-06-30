import React, { useEffect, useState } from "react";
import { openDB } from "idb";
import AudioList from "./AudioList";



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

  useEffect(() => {
    const fetchFiles = async () => {
      const db = await initDB();
      const storedFiles = await getStoredFiles(db);
      const files = storedFiles.map((file) => ({
        ...file,
        data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
      }));

      if (query) {
        setAudioFiles(
          files.filter((f) =>
            f.name.toLowerCase().includes(query.toLowerCase())
          )
        );
      } else {
        setAudioFiles(files);
      }
    };

    fetchFiles();
  }, [query]);

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

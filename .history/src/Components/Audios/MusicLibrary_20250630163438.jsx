import React, { useState, useEffect } from "react";
import AudioList from "./AudioList";
import { initDB, getStoredFiles, storeFile } from "../../db/audioDB";

export default function MusicLibrary({
  query,
  selectedCategory,
  handlePlay,
  categories,
}) {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentMusic, setCurrentMusic] = useState(null);  // اضافه کنید

  // بارگذاری فایل‌ها و فیلتر کردن
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

  // وقتی روی play کلیک شد
  const onPlay = (file) => {
    setCurrentMusic(file);
  };

  // وقتی دسته‌بندی تغییر کرد
  const handleCategoryChange = async (file, newCategory) => {
    const db = await initDB();
    const updatedFile = { ...file, category: newCategory };
    await storeFile(updatedFile);
    await fetchFiles();

    // اگر آهنگ در حال پخش تغییر کرد، currentMusic رو آپدیت کن
    if (currentMusic?.id === file.id) {
      // نسخه جدید فایل رو پیدا کن
      const updated = audioFiles.find((f) => f.id === file.id);
      if (updated) setCurrentMusic(updated);
    }
  };

  // وقتی آهنگی حذف شد
  const handleDelete = async (fileId) => {
    const db = await initDB();
    const tx = db.transaction("audioFiles", "readwrite");
    await tx.objectStore("audioFiles").delete(fileId);
    await tx.done;

    await fetchFiles();

    // اگر آهنگ حذف شده در حال پخش است، currentMusic رو پاک کن
    if (currentMusic?.id === fileId) {
      setCurrentMusic(null);
    }
  };

  return (
    <>
      <AudioList
        audioFiles={audioFiles}
        setAudioFiles={setAudioFiles}
        categories={categories}
        currentCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onPlay={onPlay}
        currentMusic={currentMusic}
        setCurrentMusic={setCurrentMusic}
        onDelete={handleDelete}
      />
      {currentMusic && (
        <MusicPlayer currentMusic={currentMusic} />
      )}
    </>
  );
}

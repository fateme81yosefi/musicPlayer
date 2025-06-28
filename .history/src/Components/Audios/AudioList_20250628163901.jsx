import React, { useState } from "react";
import { openDB } from 'idb';

const DB_NAME = 'AudioFilesDB';
const DB_VERSION = 1;
const STORE_NAME = 'audioFiles';


const AudioList = ({
  audioFiles,
  categories, 
   setAudioFiles,    

  currentCategory,
  onCategoryChange,
  onPlay,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
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

  const deleteAllFiles = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.clear();
    await tx.done;
    // setAudioFiles([]);
  };
  return (
    <div className="fullWidth containList">
      <input
        className="inputSearch"
        placeholder="search..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className='deleteAll' onClick={deleteAllFiles}>Delete All Musics</button>

      {audioFiles
        .filter(
          (file) =>
            (currentCategory === "" || file.category === currentCategory) &&
            file.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((file) => (
          <div className="singleSelectedAudio" key={file.name}>
            <div className="row">
              <div className="containDetails">
                <img
                  className="coverMusicList"
                  alt="cover"
                  src={file.coverUrl || "/song_cover.png"} // ← تضمین نمایش کاور دیفالت
                />
                <span className="name">{file.name}</span>
              </div>
              <div className="row">
                <select
                  value={file.category}
                  onChange={(e) => onCategoryChange(file, e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button className="btnPlay" onClick={() => onPlay(file)}>
                  <img className="play" alt="icon" src="/play-button.svg" />
                </button>
              </div>
            </div>
            <audio className="selectedAudio" src={file.data} controls />
          </div>
        ))}
    </div>
  );
};

export default AudioList;

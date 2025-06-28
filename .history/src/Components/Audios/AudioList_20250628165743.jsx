import React, { useState } from "react";


const AudioList = ({
  audioFiles,
  categories, 
   setAudioFiles,    
  currentCategory,
  onCategoryChange,
  onPlay,
}) => {
  const [searchQuery, setSearchQuery] = useState("");


  return (
    <div className="fullWidth containList">
      <input
        className="inputSearch"
        placeholder="search..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

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

import React from "react";

const AudioList = ({ audioFiles, categories, currentCategory, onCategoryChange, onPlay }) => {
  return (
    <div className="fullWidth">
      {audioFiles
        .filter(file => currentCategory === "" || file.category === currentCategory)
        .map((file, index) => (
          <div className="singleSelectedAudio" key={index}>
            <div className="row">
              <div className="containDetails">
                <img className="cover" alt="cover" src="/song_cover.png" />
                <span className="name">{file.name}</span>
              </div>
              <div className="row">
                <select
                  value={file.category}
                  onChange={(e) => onCategoryChange(file, e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category, idx) => (
                    <option key={idx} value={category}>{category}</option>
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

const AudioList = ({
  audioFiles,
  categories,
  currentCategory,
  onCategoryChange,
  onPlay,
}) => {
  return (
    <div className="fullWidth containList">
      {audioFiles
        .filter(
          (file) => currentCategory === "" || file.category === currentCategory
        )
        .map((file) => (
          <div className="singleSelectedAudio" key={file.name}>
            <div className="row">
              <div className="containDetails">
                <img
                  className="coverMusicList"
                  alt="cover"
                  src={file.cover || "/song_cover.png"}
                />
                <span className="musicDetails">{file.name}</span>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="black"
                    width={"80px"}
                    height={"80px"}
                  
                    className="text-indigo-500 marginer" >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 3a3 3 0 110 6 3 3 0 010-6zM7.5 17.25a4.5 4.5 0 019 0v.75a.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75v-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
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

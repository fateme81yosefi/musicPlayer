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
              <div className="row aligner" >
                <select
                  value={file.category}
                  onChange={(e) => onCategoryChange(file, e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button className="btnPlay" onClick={() => onPlay(file)}>
                

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={"30px"}
                    height={"30px"}
                    className="marginer text-green-500 iconColor"
                  >
                    <path d="M5 3.87v16.26c0 .83.9 1.34 1.62.89l13.03-8.13a1 1 0 000-1.64L6.62 3.12A1 1 0 005 3.87z" />
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

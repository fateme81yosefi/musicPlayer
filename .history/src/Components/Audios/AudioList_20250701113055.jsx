import { deleteMusicById, getStoredFiles } from "../../db/audioDB";

const AudioList = ({
  audioFiles,
  setAudioFiles,
  categories,
  currentCategory,
  onCategoryChange,
  onPlay,
}) => {

  const handleDelete = async (fileId) => {
    const success = await deleteMusicById(fileId);
    if (!success) {
      console.error("Can't delete music, id not found:", fileId);
      return;
    }
    const updatedFiles = await getStoredFiles();

    const filesWithUrl = updatedFiles.map((file) => ({
      ...file,
      data:
        file.data instanceof ArrayBuffer
          ? URL.createObjectURL(new Blob([file.data], { type: file.type }))
          : file.data,
    }));

    setAudioFiles(filesWithUrl);
  };

  return (
    <div className=" containList overflowScroller">
      {audioFiles
        .filter(
          (file) => !currentCategory || file.category?.name === currentCategory
        )
        .map((file) => (
          <div className="singleSelectedAudio" key={file.id || file.name}>
            <div className="row">
              <div className="containDetails">
                <img
                  className="coverMusicList"
                  alt="cover"
                  src={file.cover || "/song_cover.png"}
                />
                <span className="musicDetails">{file.name}</span>
              </div>

              <div className="row aligner">
                <button
                  onClick={() => handleDelete(file.id)}
                  className="deleteBtn"
                >
                  delete
                </button>
                <select
                  value={file.category?.id }
                  onChange={(e) => {
                    const selectedCategoryId = e.target.value;
                    onCategoryChange(file, selectedCategoryId);
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <button className="btnPlay" onClick={() => onPlay(file)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30px"
                    height="30px"
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

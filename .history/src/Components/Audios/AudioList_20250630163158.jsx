import {
  updateFileCategory,
  storeFileو
  deleteMusicById,
  getStoredFiles,
} from "../../db/audioDB";

const AudioList = ({
  audioFiles,
  setAudioFiles,
  categories,
  currentCategory,
  onCategoryChange,
  onPlay,
}) => {
  // بازخوانی فایل‌ها از IndexedDB
  const fetchAudioFiles = async () => {
    const filesFromDB = await getStoredFiles();
    const filesWithUrl = filesFromDB.map((file) => ({
      ...file,
      data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
    }));
    setAudioFiles(filesWithUrl);
  };

  // حذف موزیک
  const handleDelete = async (fileId) => {
    await deleteMusicById(fileId);
    await fetchAudioFiles(); // بازخوانی بعد از حذف
  };

  const handleCategoryChange = async (file, newCategory) => {
    const updatedFile = {
      ...file,
      category: newCategory,
    };

    await storeFile(updatedFile); // ذخیره فایل آپدیت شده

    // آپدیت currentMusic اگر موزیک فعلی است
    if (currentMusic?.id === updatedFile.id) {
      setCurrentMusic(updatedFile);
    }

    // بروزرسانی لیست موزیک ها
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
  };

  return (
    <div className="fullWidth containList">
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
                  className="delete-btn"
                >
                  حذف
                </button>

                <select
                  value={file.category?.name || ""}
                  onChange={(e) => handleCategoryChange(file, e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat.name}>
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

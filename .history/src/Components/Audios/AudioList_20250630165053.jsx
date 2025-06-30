import {
  updateFileCategory,
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
const handleDelete = async (fileId) => {
  // اول آدرس blob موزیک حذف شده را آزاد کن
  const fileToDelete = audioFiles.find(f => f.id === fileId);
  if (fileToDelete && fileToDelete.data) {
    URL.revokeObjectURL(fileToDelete.data);
  }

  await deleteMusicById(fileId);

  // سپس لیست فایل‌ها را دوباره از DB بخوان و آدرس‌های جدید Blob بساز
  const updatedAudioFiles = await getStoredFiles();
  const filesWithUrl = updatedAudioFiles.map((file) => ({
    ...file,
    data: URL.createObjectURL(new Blob([file.data], { type: file.type })),
  }));

  setAudioFiles(filesWithUrl);

  // اگر موزیک در حال پخش حذف شد، currentMusic را پاک کن
  if (currentMusic?.id === fileId) {
    setCurrentMusic(null);
  }
};


  const handleCategoryChange = async (file, categoryName) => {
    const selectedCategory = categories.find((c) => c.name === categoryName);
    if (!selectedCategory) return;

    if (file.id) {
      await updateFileCategory(file.id, selectedCategory);
      const updatedFiles = await getStoredFiles();
      const withURLs = updatedFiles.map((f) => ({
        ...f,
        data: URL.createObjectURL(new Blob([f.data], { type: f.type })),
      }));
      setAudioFiles(withURLs);

      // در صورتی که موزیک در حال پخش است، بعد از آپدیت، مسیر جدید را تنظیم کن
      const updatedPlayingFile = withURLs.find((f) => f.id === file.id);
      if (updatedPlayingFile) onPlay(updatedPlayingFile);
    }

    // تغییر در UI
    onCategoryChange(file, selectedCategory);
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

const FileUploader = ({ audioFiles, setAudioFiles, onClose }) => {
  const [newFiles, setNewFiles] = useState([]);

  const onDrop = async (acceptedFiles) => {
    // فایل‌ها رو به newFiles اضافه کن (با پردازش و تبدیل)
    const processedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        const data = await file.arrayBuffer();
        return {
          name: file.name,
          type: file.type,
          data,
          category: '',
          cover: null,
        };
      })
    );
    setNewFiles([...newFiles, ...processedFiles]);
  };

  const handleConfirm = () => {
    // فایل‌های جدید رو به لیست اصلی اضافه کن
    setAudioFiles([...audioFiles, ...newFiles]);
    setNewFiles([]);
    onClose();  // مودال رو ببند
  };

  return (
    <div>
      {/* Dropzone و نمایش فایل‌های newFiles */}
      <DropzoneArea onDrop={onDrop} />
      <div>
        {newFiles.map((file, i) => (
          <div key={i}>{file.name}</div>
        ))}
      </div>
      <button onClick={handleConfirm}>تایید و افزودن به لیست</button>
    </div>
  );
};

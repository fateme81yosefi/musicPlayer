import { useRef, useState, useEffect } from "react";
import "./MusicPlayer.css";

export default function MusicPlayer({ currentMusic }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(percent || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="player">
      <div className={`cover ${isPlaying ? "spin pulse" : ""}`}>
        <img src="/song_cover.png" alt="کاور آهنگ" />
      </div>

      <div className="info">
        <h2 className="title">{currentMusic.name}</h2>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <button className="play-btn" onClick={togglePlay}>
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <audio ref={audioRef} src={currentMusic.data} preload="metadata" />
      </div>
    </div>
  );
}

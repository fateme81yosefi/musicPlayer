import { useRef, useState, useEffect } from "react";
import "./MusicPlayer.css";

export default function MusicPlayer({ playlist }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const currentMusic = playlist[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);
    audio.addEventListener("ended", handleNext);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
      audio.removeEventListener("ended", handleNext);
    };
  }, [currentIndex]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const percent = (e.nativeEvent.offsetX / bar.offsetWidth);
    const audio = audioRef.current;
    audio.currentTime = percent * duration;
    setProgress(percent * 100);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleSelectTrack = (index) => {
    setIsPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <div className="player">
      <div className={`cover ${isPlaying ? "spin pulse" : ""}`}>
        <img src={currentMusic.cover} alt="کاور" />
      </div>

      <h2 className="title">{currentMusic.name}</h2>

      <div className="time">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration - currentTime)}</span>
      </div>

      <div className="progress-container" onClick={handleSeek}>
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="controls">
        <button onClick={handlePrev}>⏮</button>
        <button onClick={togglePlay}>{isPlaying ? "❚❚" : "▶"}</button>
        <button onClick={handleNext}>⏭</button>
      </div>

      <audio ref={audioRef} src={currentMusic.src} preload="metadata" autoPlay />

      <div className="playlist">
        {playlist.map((track, index) => (
          <div
            key={index}
            className={`track ${index === currentIndex ? "active" : ""}`}
            onClick={() => handleSelectTrack(index)}
          >
            <img src={track.cover} alt="" />
            <span>{track.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

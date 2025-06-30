import { useRef, useState, useEffect } from "react";
import "./MusicPlayer.css";
import SpeakerIcon from "../icons/speaker";

export default function MusicPlayer({ currentMusic }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(percent || 0);
      setCurrentTime(audio.currentTime);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentMusic?.data) {
      audio.load();
      setProgress(0);
      setIsPlaying(false);
    }
  }, [currentMusic]);

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
    const percent = e.nativeEvent.offsetX / bar.offsetWidth;
    const audio = audioRef.current;
    audio.currentTime = percent * audio.duration;
    setProgress(percent * 100);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    audioRef.current.playbackRate = rate;
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + seconds), duration);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const coverSrc = currentMusic?.cover || "/song_cover.png";

  return (
    <div
      className="player fullWidth"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${coverSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={`cover ${isPlaying ? "spin pulse" : ""}`}>
        {isPlaying && (
          <div className="equalizer">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
            <div className="bar bar4"></div>
            <div className="bar bar5"></div>
          </div>
        )}
      </div>

      <h2 className="title">{currentMusic?.name || "بدون عنوان"}</h2>

      <div className="info">
        <div className="time-row">
          <span>{formatTime(currentTime)}</span>
          <div className="progress-container" onClick={handleSeek}>
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="controls-row">
          <button onClick={() => skipTime(-10)}>⏮ 10s</button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button onClick={() => skipTime(10)}>10s ⏭</button>

          <label className="volume-label">
            <SpeakerIcon color="#ffffff" size={25} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </label>
        </div>

        <div className="speed-buttons">
          {[0.5, 1, 1.5, 2].map((rate) => (
            <button
              key={rate}
              className={playbackRate === rate ? "active" : ""}
              onClick={() => changePlaybackRate(rate)}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentMusic?.data}
        preload="metadata"
      />
    </div>
  );
}

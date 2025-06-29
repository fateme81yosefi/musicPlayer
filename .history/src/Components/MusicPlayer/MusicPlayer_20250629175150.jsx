import { useRef, useState, useEffect } from "react";
import "./MusicPlayer.css";
import SpeakerIcon from "../icons/speaker";

export default function MusicPlayer({ currentMusic }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(percent || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
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

  const coverSrc = currentMusic?.cover || "/song_cover.png";

  return (
    <div
      className="player fullWidth"
      style={{
        backgroundImage: `url(${coverSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {" "}
      <div className={`cover ${isPlaying ? "spin pulse" : ""}`}>
        {/* <img src={coverSrc} alt="کاور آهنگ" /> */}

        {isPlaying && <div className="equalizer"><div class="equalizer">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div> 
        }
      </div>
      <h2 className="title">{currentMusic?.name || "بدون عنوان"}</h2>
      <div className="info">
        <div className="controls-row">
          <div className="progress-container" onClick={handleSeek}>
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

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
      <button className="play-btn" onClick={togglePlay}>
        {isPlaying ? "❚❚" : "▶"}
      </button>
      <audio
        ref={audioRef}
        src={currentMusic?.data}
        preload="metadata"
        volume={volume}
        playbackRate={playbackRate}
      />
    </div>
  );
}

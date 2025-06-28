import { useRef, useState, useEffect } from "react";
import "./MusicPlayer.css";

export default function MusicPlayer({ currentMusic }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
const analyserRef = useRef(null);
const audioContextRef = useRef(null);
const sourceRef = useRef(null);

useEffect(() => {
  const audio = audioRef.current;

  // فقط یک‌بار AudioContext بساز
  if (!audioContextRef.current) {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }

  const context = audioContextRef.current;

  // فقط یک‌بار MediaElementSource بساز
  if (!sourceRef.current) {
    sourceRef.current = context.createMediaElementSource(audio);
  }

  const analyser = context.createAnalyser();
  analyserRef.current = analyser;

  sourceRef.current.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 64;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");
  canvas.width = 300;
  canvas.height = 60;

  const draw = () => {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / bufferLength;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      const x = i * barWidth;
      ctx.fillStyle = "white";
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
    }
  };

  draw();

  return () => {
    // حواست باشه فقط analyser رو قطع کن، نه source!
    analyser.disconnect();
  };
}, []);

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

  return (
    <div className="player">
      <div className={`cover ${isPlaying ? "spin pulse" : ""}`}>
        <img src="/song_cover.png" alt="کاور آهنگ" />
        <canvas id="visualizer" className="visualizer"></canvas>

      </div>

      <div className="info">
        <h2 className="title">{currentMusic.name}</h2>

        <div className="progress-container" onClick={handleSeek}>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <button className="play-btn" onClick={togglePlay}>
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <div className="controls">
          <label>
            Volume
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </label>

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
          src={currentMusic.data}
          preload="metadata"
          volume={volume}
          playbackRate={playbackRate}
        />
      </div>
    </div>
  );
}

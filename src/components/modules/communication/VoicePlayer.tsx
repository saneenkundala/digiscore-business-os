import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoicePlayerProps {
  audioUrl?: string;
  duration?: number; // in seconds
  isOwnMessage?: boolean;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  audioUrl,
  duration = 15,
  isOwnMessage = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate pseudorandom bars for voice waveform
  const waveformHeights = [
    30, 60, 45, 80, 65, 95, 40, 70, 85, 50, 90, 75, 60, 100, 70, 45, 80, 55, 90, 65, 40, 60, 30
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Fallback simulated playback if audio file fails to load
        setIsPlaying(true);
        let sec = 0;
        const interval = setInterval(() => {
          sec += 1;
          setCurrentTime(sec);
          if (sec >= duration) {
            clearInterval(interval);
            setIsPlaying(false);
            setCurrentTime(0);
          }
        }, 1000);
      });
      setIsPlaying(true);
    }
  };

  const cycleSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-2xl max-w-sm ${
        isOwnMessage
          ? 'bg-purple-950/40 border border-purple-500/30 text-white'
          : 'bg-slate-950/70 border border-slate-800 text-slate-200'
      }`}
    >
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg transition-transform active:scale-95 ${
          isOwnMessage
            ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:opacity-95'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95'
        }`}
        title={isPlaying ? 'Pause' : 'Play voice message'}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
      </button>

      {/* Waveform Visualization */}
      <div className="flex-1 flex flex-col gap-1 min-w-[140px]">
        <div className="flex items-center gap-1 h-8 cursor-pointer" onClick={togglePlay}>
          {waveformHeights.map((height, i) => {
            const barProgress = (i / waveformHeights.length) * 100;
            const isPlayed = barProgress <= progressPercent;

            return (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlayed
                    ? isOwnMessage
                      ? 'bg-fuchsia-300'
                      : 'bg-purple-400'
                    : isOwnMessage
                    ? 'bg-purple-400/30'
                    : 'bg-slate-700'
                } ${isPlaying ? 'animate-pulse' : ''}`}
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 40}ms`
                }}
              />
            );
          })}
        </div>

        {/* Timestamp and audio status */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>{isPlaying ? formatSeconds(currentTime) : formatSeconds(duration)}</span>
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3 h-3 text-slate-500" />
            <button
              type="button"
              onClick={cycleSpeed}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              {playbackRate}x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

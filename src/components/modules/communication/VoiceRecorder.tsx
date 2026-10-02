import React, { useState, useEffect, useRef } from 'react';
import { Mic, Trash2, Send, StopCircle } from 'lucide-react';

interface VoiceRecorderProps {
  onSend: (audioUrl: string, duration: number) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, onCancel }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer counter
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Start real browser audio recording
  useEffect(() => {
    audioChunksRef.current = [];

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream;
          try {
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (e) => {
              if (e.data.size > 0) {
                audioChunksRef.current.push(e.data);
              }
            };

            recorder.start();
          } catch (err) {
            console.warn('MediaRecorder init error, using simulated audio fallback', err);
          }
        })
        .catch((err) => {
          console.warn('Microphone permission denied or unavailable, using simulation', err);
        });
    }

    return () => {
      // Cleanup stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleFinishAndSend = () => {
    setIsRecording(false);
    const finalDuration = Math.max(1, seconds);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          onSend(base64Audio, finalDuration);
        };

        // Stop mic tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorderRef.current.stop();
    } else {
      // Fallback sample audio url
      const fallbackUrl = 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg';
      onSend(fallbackUrl, finalDuration);
    }
  };

  const handleCancel = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    onCancel();
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex items-center justify-between w-full p-2.5 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-xl animate-in fade-in">
      {/* Left: Recording Indicator & Timer */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping inline-block" />
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>REC</span>
          </span>
        </div>

        <span className="font-mono text-sm font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          {formatTimer(seconds)}
        </span>

        {/* Dynamic Waveform Simulation */}
        <div className="hidden sm:flex items-center gap-1 h-6">
          {[40, 75, 90, 60, 100, 50, 80, 45, 95, 70, 85, 30].map((h, i) => (
            <span
              key={i}
              className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDuration: `${0.4 + (i % 5) * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Cancel Button */}
        <button
          type="button"
          onClick={handleCancel}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          title="Discard recording"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Send Voice Note Button */}
        <button
          type="button"
          onClick={handleFinishAndSend}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send Voice</span>
        </button>
      </div>
    </div>
  );
};

"use client";

import { useEffect, useRef, useState } from "react";

export default function MicButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      // Cleanup blob URLs on unmount
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // 🔜 send blob to Whisper / Web Speech later
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-10">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-6 py-3 rounded-full font-semibold text-white transition 
        ${isRecording ? "bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {audioUrl && (
        <audio
          controls
          src={audioUrl}
          className="mt-4 w-64 border rounded shadow"
        />
      )}
    </div>
  );
}

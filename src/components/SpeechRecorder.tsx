"use client";

import { useEffect, useState } from "react";

export default function SpeechRecorder() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // ✅ prevent SSR issues
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "⚠️ SpeechRecognition API not supported in this browser. Try Chrome or Edge."
      );
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.continuous = false;      // stop after a pause
    recog.interimResults = true;   // show partial text
    recog.maxAlternatives = 1;

    recog.onresult = (event: any) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text.trim());
    };

    recog.onerror = (event: any) => {
      console.error(event);
      setError(event.error || "Speech recognition error");
    };

    recog.onend = () => setIsListening(false);

    setRecognition(recog);
  }, []);

  const startListening = () => {
    if (!recognition) {
      setError("SpeechRecognition not initialized.");
      return;
    }
    setTranscript("");
    setError(null);
    recognition.start(); // must be called from a user gesture
    setIsListening(true);
  };

  const stopListening = () => {
    recognition?.stop();
    setIsListening(false);
  };

  // ✅ visible fallback so the page never looks blank
  if (error && !isListening && !transcript) {
    return (
      <div className="flex flex-col items-center gap-3 mt-10">
        <button
          onClick={startListening}
          className="px-6 py-3 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700"
          disabled
        >
          Start Listening
        </button>
        <p className="text-red-400 text-center max-w-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-6 py-3 rounded-full font-semibold text-white transition ${
          isListening ? "bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {transcript && (
        <div className="bg-gray-800 text-white p-4 rounded-lg w-80 shadow">
          <p className="text-sm whitespace-pre-wrap">{transcript}</p>
        </div>
      )}
    </div>
  );
}

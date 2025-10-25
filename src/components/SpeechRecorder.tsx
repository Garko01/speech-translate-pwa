"use client";
import React, { useState, useRef } from "react";

export default function SpeechRecorder() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [sourceLang, setSourceLang] = useState("en-US");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const LT_API = "https://libretranslate.de/translate";

  const toggleListening = async () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition: SpeechRecognition = new SpeechRecognitionClass();

      recognition.lang = sourceLang;
      recognition.continuous = true; // ✅ enables live streaming
      recognition.interimResults = true; // ✅ show partial results

      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        let interimText = "";
        let finalText = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcript + " ";
          } else {
            interimText += transcript;
          }
        }

        // Combine interim + final
        setText(finalText + interimText);

        // Only translate finalized speech
        if (finalText.trim() !== "") {
          const targetLang = sourceLang === "en-US" ? "zh" : "en";
          try {
            const response = await fetch(LT_API, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                q: finalText.trim(),
                source: sourceLang === "en-US" ? "en" : "zh",
                target: targetLang,
                format: "text",
              }),
            });
            const data = await response.json();
            setTranslated(data.translatedText || "[Translation failed]");
          } catch (err) {
            console.error("LibreTranslate error:", err);
            setTranslated("[Translation error]");
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) =>
        console.error("Recognition error:", event.error);

      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <select
        className="p-2 rounded text-black"
        value={sourceLang}
        onChange={(e) => setSourceLang(e.target.value)}
      >
        <option value="en-US">English → Mandarin</option>
        <option value="zh-CN">Mandarin → English</option>
      </select>

      <button
        onClick={toggleListening}
        className={`px-6 py-3 rounded-full font-semibold transition ${
          listening ? "bg-red-500" : "bg-blue-600"
        }`}
      >
        {listening ? "Stop Listening" : "Start Listening"}
      </button>

      <div className="bg-gray-800 p-4 rounded w-80 mt-2 text-left min-h-[6rem]">
        <p><strong>🎙 Live:</strong> {text || "Listening..."}</p>
      </div>

      {translated && (
        <div className="bg-gray-700 p-4 rounded w-80 text-left">
          <p><strong>🌐 Translated:</strong> {translated}</p>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState, useRef } from "react";

export default function SpeechRecorder() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [sourceLang, setSourceLang] = useState("en-US");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // 🌐 Translation helper with fallbacks
  async function translateText(text: string, source: string, target: string): Promise<string> {
    if (!text.trim()) return "";

    // 1️⃣ LibreTranslate (primary)
    try {
      const libre = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, source, target, format: "text" }),
      });
      if (libre.ok) {
        const data = await libre.json();
        if (data.translatedText) return data.translatedText;
      }
    } catch (err) {
      console.warn("LibreTranslate failed:", err);
    }

    // 2️⃣ MyMemory (fallback)
    try {
      const memory = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
      );
      const data = await memory.json();
      if (data?.responseData?.translatedText) return data.responseData.translatedText;
    } catch (err) {
      console.warn("MyMemory fallback failed:", err);
    }

    // 3️⃣ Google unofficial API (final fallback)
    try {
      const google = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(
          text
        )}`
      );
      const result = await google.json();
      if (Array.isArray(result)) {
        return result[0].map((r: any) => r[0]).join("");
      }
    } catch (err) {
      console.warn("Google fallback failed:", err);
    }

    return "[Translation error]";
  }

  // 🎤 Main toggle for speech recognition
  const toggleListening = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition: SpeechRecognition = new SpeechRecognitionClass();

    recognition.lang = sourceLang;
    recognition.continuous = true;
    recognition.interimResults = true;

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

      // 🧠 Combine interim + final text
      setText(finalText + interimText);

      // 🌏 Translate finalized segments only
      if (finalText.trim() !== "") {
        const source = sourceLang === "en-US" ? "en" : "zh";
        const target = sourceLang === "en-US" ? "zh" : "en";
        const translatedText = await translateText(finalText.trim(), source, target);
        setTranslated(translatedText);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  // 🎨 UI
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
        <p>
          <strong>🎙 Live:</strong> {text || (listening ? "Listening..." : "Click start to speak")}
        </p>
      </div>

      {translated && (
        <div className="bg-gray-700 p-4 rounded w-80 text-left">
          <p>
            <strong>🌐 Translated:</strong> {translated}
          </p>
        </div>
      )}
    </div>
  );
}

import Image from "next/image";

import MicButton from "@/components/MicButton";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-2xl font-bold mb-6">
        🎙️ Speech-to-Text Translator PWA
      </h1>
      <MicButton />
    </main>
  );
}

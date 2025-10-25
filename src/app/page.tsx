// import MicButton from "@/components/MicButton";

// export default function Home() {
//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
//       <h1 className="text-2xl font-bold mb-6">
//         🎧 Speech-to-Text Translator PWA
//       </h1>
//       <MicButton /> {/* ✅ Use this, since SpeechRecorder isn't created yet */}
//     </main>
//   );
// }

import SpeechRecorder from "@/components/SpeechRecorder";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-2xl font-bold mb-6">
        🎧 Speech-to-Text Translator PWA
      </h1>
      <SpeechRecorder />
    </main>
  );
}

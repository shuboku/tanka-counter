import React from "react";
import TankaCounter from "@/components/TankaCounter";

const Home: React.FC = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center py-8 px-4 font-sans">
      <header className="mb-6 text-center space-y-2">
        <h1 className="text-3xl font-bold">短歌音数カウンター</h1>
        <p className="text-sm text-muted-foreground">
          ひらがなで入力すると、音節ごとに
          <span className="font-semibold">5-7-5-7-7</span> に
          <span className="underline">自動で分けられます</span>。
        </p>
      </header>

      {/* 本体 */}
      <TankaCounter />
    </div>
  );
};

export default Home;
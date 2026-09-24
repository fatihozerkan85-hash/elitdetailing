"use client";

import { useState } from "react";
import Home from "@/pages/Home";
import SplashScreen from "@/components/SplashScreen";

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : null}
      <Home />
    </>
  );
}

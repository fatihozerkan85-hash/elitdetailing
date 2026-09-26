"use client";

import { useCallback, useState } from "react";
import Home from "@/views/Home";
import SplashScreen from "@/components/SplashScreen";

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);
  const onSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash ? <SplashScreen onComplete={onSplashComplete} /> : null}
      <Home />
    </>
  );
}

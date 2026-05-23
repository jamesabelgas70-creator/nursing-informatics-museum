"use client";

import { useState, useEffect } from "react";
import AudioController from "@/components/AudioController";
import GalleryExperience from "@/components/GalleryExperience";
import ScrollRuntime from "@/components/ScrollRuntime";
import CreditsSection from "@/sections/CreditsSection";
import EndingScene from "@/sections/EndingScene";
import FutureSection from "@/sections/FutureSection";
import HeroSection from "@/sections/HeroSection";
import LoadingScreen from "@/sections/LoadingScreen";
import MainTimeline from "@/sections/MainTimeline";
import PioneerHall from "@/sections/PioneerHall";
import TimelineActivation from "@/sections/TimelineActivation";

export default function Home() {
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    const handler = () => setGalleryOpen(true);
    window.addEventListener("open-gallery", handler);
    return () => window.removeEventListener("open-gallery", handler);
  }, []);

  return (
    <>
      {galleryOpen && (
        <GalleryExperience onExit={() => setGalleryOpen(false)} />
      )}

      <ScrollRuntime />
      <LoadingScreen />
      <AudioController />
      <main style={{ display: galleryOpen ? "none" : undefined }}>
        <HeroSection />
        <PioneerHall />
        <TimelineActivation />
        <MainTimeline />
        <FutureSection />
        <CreditsSection />
        <EndingScene />
      </main>
    </>
  );
}

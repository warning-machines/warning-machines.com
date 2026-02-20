"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WarningGraphic } from "@/components/WarningGraphic";

export function IntroAnimation() {
  const [visible, setVisible] = useState(false);

  function play() {
    setVisible(true);
    setTimeout(() => setVisible(false), 3500);
  }

  useEffect(() => {
    if (!sessionStorage.getItem("intro_shown")) {
      play();
    }

    const handler = () => play();
    window.addEventListener("replay-intro", handler);
    return () => window.removeEventListener("replay-intro", handler);
  }, []);

  return (
    <AnimatePresence onExitComplete={() => sessionStorage.setItem("intro_shown", "1")}>
      {visible && (
        <motion.div
          key="intro"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
        >
          <WarningGraphic width={700} height={228} animationSpeed={0.8} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

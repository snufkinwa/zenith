import { useState, useEffect } from "react";
import styles from "./page.module.css";
import HeroSection from "@/container/landing-page/hero-section";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.maincontainer}>
        <HeroSection />
      </div>
    </main>
  );
}

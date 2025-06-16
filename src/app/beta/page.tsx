"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import BetaPage from "@/container/beta-page";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.maincontainer}>
      <BetaPage />
      </div>
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import CodeEnvironment from "@/components/codeenviroment/CodeEnvironment";
import problemsData from "@public/data/problems.json";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.maincontainer}>
        <CodeEnvironment problems={problemsData} />
      </div>
    </main>
  );
}
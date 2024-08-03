'use client';

import { useState } from "react";
import Link from "next/link";
import styles from './UI.module.css';
import Logo from './logo';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.branding}>
          <Logo />
          </div>

          <div className={styles.navLinks}>
            <div className={styles.avatarContainer}>
              <button className={styles.avatar} onClick={() => setIsOpen(!isOpen)}>
                {/* Replace with actual user initials or image */}
                US
              </button>
              {isOpen && (
                <div className={styles.dropdown}>
                  <Link href="/dashboard">Dashboard</Link>
                  <Link href="/profile">Profile</Link>
                  <button onClick={() => {/* Add logout logic */}}>Logout</button>
                </div>
              )}
            </div>
          </div>
      </div>
    </header>
  );
}
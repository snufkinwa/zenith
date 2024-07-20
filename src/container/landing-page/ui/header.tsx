'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from './UI.module.css';
import Logo from './logo';

export default function Header() {
//   const [top, setTop] = useState<boolean>(true);

//   // detect whether user has scrolled the page down by 10px
//   const scrollHandler = () => {
//     window.scrollY > 10 ? setTop(false) : setTop(true);
//   };

//   useEffect(() => {
//     scrollHandler();
//     window.addEventListener("scroll", scrollHandler);
//     return () => window.removeEventListener("scroll", scrollHandler);
//   }, [top]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerInner}>

          <div className={styles.branding}>
          <Logo /> 
          </div>

          <ul className={styles.navLinks}>
            <li>
              <Link href="/signin" className={styles.btnLogin}>
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className={styles.btnRegister}>
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
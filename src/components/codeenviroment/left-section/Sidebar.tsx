import React, { useState, useRef, useEffect } from "react";
import { FaRegStickyNote } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { HiOutlineSparkles } from "react-icons/hi2";
import styles from "../CodeEnvironment.module.css";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("");
  const [isFloatingContentVisible, setIsFloatingContentVisible] =
    useState(false);
  const floatingContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        floatingContentRef.current &&
        !floatingContentRef.current.contains(event.target as Node)
      ) {
        setIsFloatingContentVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTabClick = (tabName: string) => {
    if (activeTab === tabName && isFloatingContentVisible) {
      setIsFloatingContentVisible(false);
    } else {
      setActiveTab(tabName);
      setIsFloatingContentVisible(true);
    }
  };

  return (
    <div className={styles.sidebarContainer}>

      <div className={styles.sidebar}>
        <IconContext.Provider value={{ size: "36px" }}>
        <div
          className={`${styles.tab} ${
            activeTab === "summary" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("summary")}
        >
          <HiOutlineSparkles />
        </div>
        </IconContext.Provider>
        <IconContext.Provider value={{ size: "28px" }}>
        <div
          className={`${styles.tab} ${
            activeTab === "notes" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("notes")}
        >
          <FaRegStickyNote />
        </div>
        </IconContext.Provider>
      </div>
      {isFloatingContentVisible && (
        <div className={styles.floatingContent} ref={floatingContentRef}>
          {activeTab === "summary" && (
            <div className={styles.tabContent}>Summary Content</div>
          )}
          {activeTab === "notes" && (
            <div className={styles.tabContent}>
              <textarea
                className={styles.notes}
                placeholder="Write your notes here..."
              ></textarea>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;

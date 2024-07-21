'use client';

import { useState, useEffect, FormEvent } from 'react';
import styles from './Waitlist.module.css';
import { db } from '@config/firebase/utils';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { BsTwitterX } from "react-icons/bs";
import { SiDiscord } from "react-icons/si";
import { SiLinkedin } from "react-icons/si";

import Logo from '@/container/landing-page/ui/logo';
import LeftCurlyBracket from './left-curly';
import RightCurlyBracket from './right-curly';
import { motion, AnimatePresence } from 'framer-motion';

const Waitlist: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);

  useEffect(() => {
    if (message) {
      setIsMessageVisible(true);
      const timer = setTimeout(() => {
        setIsMessageVisible(false);
        setMessage(''); 
      }, 5000); 

      return () => clearTimeout(timer);
    }
  }, [message]);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'waitlist'), {
        email,
        timestamp: serverTimestamp(),
      });
      setMessage('Successfully added to the waitlist!');
      setEmail('');
    } catch (error) {
      console.error('Error adding to waitlist: ', error);
      setMessage('Failed to join the waitlist. Please try again.');
    }
  };

  const bracketVariants = {
    open: { 
      x: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: [0.42, 0, 0.58, 1] 
      } 
    },
    closed: (isLeft: boolean) => ({
      x: isLeft ? '50%' : '-50%',
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.42, 0, 0.58, 1] 
      }
    })
  };
  
  const formVariants = {
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        delay: 0.3, 
        duration: 0.8, 
        ease: [0.42, 0, 0.58, 1] 
      } 
    },
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      transition: { 
        duration: 0.8, 
        ease: [0.42, 0, 0.58, 1] 
      } 
    }
  };
  
  
  

  return (
    <div className={styles.container}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <Logo />
          </div>
          <h1 className={styles.heroTitle}>Future-Proof Your Coding Skills</h1>
          <p className={styles.heroSubtitle}>
            <span>Harness the power of AI and metrics to elevate your coding skills.</span>
            <span>Join our waitlist and prepare for the future of software engineering.</span>
          </p>
          <div className={styles.heroForm}>
            <motion.div
              layout
              variants={bracketVariants}
              custom={true}
              animate={isMessageVisible ? 'closed' : 'open'}
            >
              <LeftCurlyBracket />
            </motion.div>
            <AnimatePresence mode="wait">
              {isMessageVisible ? (
                <motion.p
                  key="message"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className={styles.message}
                >
                  {message}
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  onSubmit={handleSubmit}
                  className={styles.heroFormInner}
                >
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit">Join Waitlist</button>
                </motion.form>
              )}
            </AnimatePresence>
            <motion.div
              variants={bracketVariants}
              custom={false}
              animate={isMessageVisible ? 'closed' : 'open'}
            >
              <RightCurlyBracket />
            </motion.div>
          </div>
          <div className={styles.avatars}>
            <li><img src="https://randomuser.me/api/portraits/men/62.jpg" /></li>
            <li><img src="https://xsgames.co/randomusers/assets/avatars/female/60.jpg" /></li>
            <li><img src="https://xsgames.co/randomusers/assets/avatars/male/76.jpg" /></li>
            <div className={styles.avatarsText}>
              <span>Coding challenges reimagined.</span>
              <span>Join our beta!</span>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.socialIcons}>
              <a href="/"><BsTwitterX size={18} /></a>
              <a href="/"><SiDiscord size={18} /></a>
              <a href="/"><SiLinkedin size={18} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Waitlist;

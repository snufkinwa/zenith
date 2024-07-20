'use client';

import { useState, FormEvent } from 'react';
import styles from './Waitlist.module.css';
import { db } from '@config/firebase/utils';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { BsTwitterX } from "react-icons/bs";
import { SiDiscord } from "react-icons/si";
import { SiLinkedin } from "react-icons/si";

import Logo from '@/container/landing-page/ui/logo';
import LeftCurlyBracket from './left-curly';
import RightCurlyBracket from './right-curly';

const Waitlist: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

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
          <LeftCurlyBracket />
          <div className={styles.heroFormInner}>
          <input    type="email" 
                placeholder="Your Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required  />
          <button onClick={handleSubmit}>Join Waitlist</button>
          </div>
          <RightCurlyBracket />
        </div>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.avatars}>
          <li><img src="https://randomuser.me/api/portraits/men/62.jpg" /></li>
          <li><img src="https://xsgames.co/randomusers/assets/avatars/female/60.jpg" /></li>
          <li><img src="https://xsgames.co/randomusers/assets/avatars/male/76.jpg" /></li>
          <div className={styles.avatarsText}>
          <span>Coding challenges reimagined.</span>
          <span>Join our beta!</span>
          </div>
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
  );
}

export default Waitlist;
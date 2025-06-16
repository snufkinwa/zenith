"use client"

import Login from "@/components/login";
import styles from "./loginpage.module.css";
import { login, signup, signInWithProvider } from './actions';

export default function LoginPage() {
    return (
        <main className={styles.main}>
            <Login login={login} signup={signup} signInWithProvider={signInWithProvider} />
        </main>
    );
}
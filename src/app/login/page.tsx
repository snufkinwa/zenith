"use client"

import Login from "@/components/login";
import { login, signup, signInWithProvider } from './actions';

export default function LoginPage() {
    return (
        <main className="h-full w-full flex items-center justify-center bg-gray-50">
            <Login login={login} signup={signup} signInWithProvider={signInWithProvider} />
        </main>
    );
}
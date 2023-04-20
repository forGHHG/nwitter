import React, { useState } from "react";
import { authService } from "fbase";
import { browserSessionPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword } from "firebase/auth";

import 'css/authForm.css';

export const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [newAccount, setNewAccount] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            if (newAccount) {
                // 계정 만들기
                await createUserWithEmailAndPassword(authService, email, password);
            } else {
                // 로그인
                await setPersistence(authService, browserSessionPersistence);
                await signInWithEmailAndPassword(authService, email, password);
            }
        } catch (error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    className="authInput"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    className="authInput"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="submit"
                    className="authInput authSubmit"
                    value={newAccount ? "계정 만들기" : "로그인"}
                />
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "로그인" : "계정 만들기"}
            </span>
        </>
    );
};

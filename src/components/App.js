import React, { useEffect, useState } from "react";
import { updateCurrentUser, updateProfile } from "firebase/auth";
import AppRouter from "./AppRouter";
import { authService } from "fbase";

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        // 로그인 되어있는지 확인
        authService.onAuthStateChanged(async (user) => {
            if (user) {
                if (user.displayName === null) {
                    await updateProfile(user, { displayName: "익명" });
                }
                setIsLoggedIn(true);
                setUserObj(user);
                // setUserObj({
                //     displayName: user.displayName,
                //     uid: user.uid,
                // updateProfile: (args) => user.updateProfile(args),
                // });
            } else {
                setUserObj(null);
                setIsLoggedIn(false);
            }
            setInit(true);
        });
    }, []);

    /* 프로필 업데이트 */
    const refreshUser = async () => {
        await updateCurrentUser(authService, authService.currentUser);
        setUserObj(authService.currentUser);

        // const user = authService.currentUser;
        // setUserObj({
        //     displayName: user.displayName,
        //     uid: user.uid,
        // updateProfile: (args) => user.updateProfile(args),
        // });
    };

    return (
        <>
            {init ? (
                <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} refreshUser={refreshUser} />
            ) : (
                "Initializing..."
            )}
        </>
    );
}

export default App;

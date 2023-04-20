import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { authService, dbService } from "fbase";
import { Nweet } from "components/Nweet";
import { NweetFactory } from "components/NweetFactory";
import { onAuthStateChanged } from "firebase/auth";

export const Home = ({ userObj }) => {
    const [nweets, setNweets] = useState([]);

    /* Nweets 가져오기 */
    useEffect(() => {
        const q = query(collection(dbService, "nweets"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArr);
        });

        onAuthStateChanged(authService, (user) => {
            if (user === null) {
                unsubscribe();
            };
        });

    }, []);

    return (
        <div className="container">
            <NweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};

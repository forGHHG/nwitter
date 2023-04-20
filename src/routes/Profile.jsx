import React, { useEffect, useRef, useState } from "react";
import { faEraser, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nweet } from "components/Nweet";
import { authService, dbService, storageService } from "fbase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

import "css/profile.css";

const defaultUserImg = "https://forGHHG.github.io/nwitter/userImg/defaultUser.png";

export const Profile = ({ userObj, refreshUser }) => {
    const navigaion = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();

    /* 로그아웃 */
    const onLogOutClick = () => {
        authService.signOut();
        navigaion("/");
    };

    /* 프로필 사진 변경 */
    const onProfilePhotoChange = (e) => {
        const {
            target: { files },
        } = e;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                target: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    /* 첨부파일 초기화 */
    const onClearAttachment = () => {
        setAttachment("");
        fileInput.current.value = null;
    };

    /* 프로필 업데이트 */
    const onSubmit = async (e) => {
        e.preventDefault();

        let attachmentUrl = "";
        try {
            if (attachment !== "") {
                const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
                const response = await uploadString(attachmentRef, attachment, "data_url");
                // attachmentUrl = await getDownloadURL(ref(storageService, attachmentRef));
                attachmentUrl = await getDownloadURL(response.ref);
            }

            onClearAttachment();
        } catch (error) {
            console.error("Error adding document: ", error);
        }

        if (userObj.displayName !== newDisplayName || userObj.photoURL !== attachmentUrl) {
            await updateProfile(userObj, { displayName: newDisplayName, photoURL: attachmentUrl });
            refreshUser();
        }
    };

    /* 내 Nweet 가져오기 */
    useEffect(() => {
        const q = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", `${userObj.uid}`),
            orderBy("createdAt", "desc")
        );
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
            <div>
                <img
                    className="profileImg"
                    src={userObj.photoURL ? userObj.photoURL : defaultUserImg}
                    alt="프로필 사진"
                />
                <div>
                    <label htmlFor="attach-file" className="factoryInput__label">
                        <span>프로필 사진 변경하기</span>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </label>
                    {attachment && (
                        <div className="profile__clear" onClick={onClearAttachment}>
                            <span>취소</span>
                            <FontAwesomeIcon icon={faEraser} />
                        </div>
                    )}
                </div>

                <input
                    ref={fileInput}
                    id="attach-file"
                    type="file"
                    accept="image/*"
                    onChange={onProfilePhotoChange}
                    style={{
                        opacity: 0,
                    }}
                />
                {attachment && (
                    <div className="profile__attachment">
                        <img
                            src={attachment}
                            style={{
                                backgroundImage: attachment,
                            }}
                            alt="preview"
                        />
                    </div>
                )}
            </div>
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    type="text"
                    placeholder="이름을 바꿔보세요"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="formInput"
                />
                <input
                    type="submit"
                    value="프로필 업데이트"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                로그아웃
            </span>

            <div style={{ marginTop: 30, color: "white" }}>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={true} />
                ))}
            </div>
        </div>
    );
};

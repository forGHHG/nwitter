import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useRef, useState } from "react";
import { v4 } from "uuid";

import "css/nweetFactory.css";

const defaultUserImg = "https://forGHHG.github.io/nwitter/userImg/defaultUser.png";

export const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();

    /* Nweet 등록 */
    const onSubmit = async (e) => {
        e.preventDefault();
        if (nweet === "") {
            return;
        }

        let attachmentUrl = "";
        try {
            if (attachment !== "") {
                const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
                const response = await uploadString(attachmentRef, attachment, "data_url");
                // attachmentUrl = await getDownloadURL(ref(storageService, attachmentRef));
                attachmentUrl = await getDownloadURL(response.ref);
            }
            const nweetObj = {
                text: nweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
                attachmentUrl,
                photoURL: userObj.photoURL ? userObj.photoURL : defaultUserImg,
                userName: userObj.displayName,
            };
            await addDoc(collection(dbService, "nweets"), nweetObj);
            // console.log("Document written with ID: ", docRef.id);

            setNweet("");
            onClearAttachment();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    /* 첨부파일 미리보기 */
    const onFileChange = (e) => {
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

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    type="text"
                    value={nweet}
                    placeholder="무엇을 생각하고 있나요?"
                    maxLength={120}
                    className="factoryInput__input"
                    onChange={(e) => setNweet(e.target.value)}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>이미지 첨부하기</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                ref={fileInput}
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                        alt="preview"
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>지우기</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

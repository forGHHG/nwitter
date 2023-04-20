import React, { useState } from "react";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import "css/nweet.css";

export const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const nweetRef = doc(dbService, "nweets", nweetObj.id);

    const toDate = new Date(nweetObj.createdAt);
    const createdAt = `${toDate.getFullYear()}/${(toDate.getMonth() + 1).toString().padStart(2, 0)}/${toDate
        .getDate()
        .toString()
        .padStart(2, 0)} 
        ${toDate.getHours().toString().padStart(2, 0)}:${toDate.getMinutes().toString().padStart(2, 0)}`;

    /* Nweet 삭제 */
    const onDeleteClick = async () => {
        const ok = window.confirm("이 nweet을 삭제하겠습니까?");

        if (ok) {
            // nweet 삭제
            await deleteDoc(nweetRef);
            // 첨부파일 삭제
            if (nweetObj.attachmentUrl !== "") {
                await deleteObject(ref(storageService, nweetObj.attachmentUrl));
            }
        }
    };

    const toggleEditing = () => {
        setEditing((prev) => !prev);
    };

    /* Nweet 업데이트 */
    const onSubmit = async (e) => {
        e.preventDefault();

        await updateDoc(nweetRef, { text: newNweet });
        setEditing(false);
    };

    return (
        <div className={"nweet" + (isOwner ? " nweetOwner" : "")}>
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input
                            type="text"
                            placeholder="내용을 수정해보세요"
                            value={newNweet}
                            required
                            onChange={(e) => setNewNweet(e.target.value)}
                            className="formInput"
                        />
                        <input type="submit" value="업데이트" className="formBtn" />
                    </form>
                    <button onClick={toggleEditing} className="formBtn cancelBtn">
                        취소
                    </button>
                </>
            ) : (
                <>
                    {nweetObj.photoURL && <img src={nweetObj.photoURL} className="userPhoto" alt="nweet_Img" />}
                    <h6 className="nweetUserName">{nweetObj.userName}</h6>
                    <span style={{ position: "absolute", left: "150px", fontWeight: "100" }}>{createdAt}</span>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && (
                        <img src={nweetObj.attachmentUrl} className="attachment" alt="nweet_Img" />
                    )}
                    {isOwner && (
                        <div className="nweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

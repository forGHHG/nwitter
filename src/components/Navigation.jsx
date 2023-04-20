import React from "react";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const Navigation = ({ userObj }) => (
    <nav>
        <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <li>
                <Link to="/" style={{ marginRight: 10 }}>
                    <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
                </Link>
            </li>
            <li>
                <Link
                    to="/profile"
                    style={{
                        marginLeft: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: 12,
                    }}
                >
                    <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
                    <span style={{ marginTop: 10 }}>
                        {userObj.displayName ? `${userObj.displayName}의 프로필` : "프로필"}
                    </span>
                </Link>
            </li>
        </ul>
    </nav>
);

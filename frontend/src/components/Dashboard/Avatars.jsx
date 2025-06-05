import React, { useState, useEffect, useContext } from "react";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"; // Import LoadingIndicator component
import "./Avatars.css"; // Import the CSS file for styling
import { HeygenContext } from "../../context/HeygenContext";

const Avatars = () => {
  const [avatarNames, setAvatarNames] = useState([]); // State for avatar names
  // const [message, setMessage] = useState(null);
  const { avatars, loading, message, setMessage } = useContext(HeygenContext)

  useEffect(() => {
    try {
      if(loading) {
        setMessage("Loading HeyGen Avatars")
      }
      else  {
        const parsed = JSON.parse(avatars);
        const names =
          parsed.data && parsed.data.avatars
            ? parsed.data.avatars.map((avatar) => avatar.avatar_name)
            : [];
        setAvatarNames(names);
        setMessage(null);
      }
    } catch (parseError) {
      setMessage("Error: Failed to parse JSON data");
      setAvatarNames([]);
    }
  }, [avatars]);
  

  return (
    <div className="avatars-container">
      <h1>Available Avatars</h1>

      {message && <div>{message}</div>}

      {loading ? (
        <LoadingIndicator />
      ) : (
        <div>
          {avatarNames.length > 0 ? (
            <ul>
              {avatarNames.map((name, index) => (
                <li key={index}>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div>No avatars available.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Avatars;
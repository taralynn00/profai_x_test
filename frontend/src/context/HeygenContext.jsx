import { createContext, useEffect, useState} from 'react';
import axios from "axios";
import { ACCESS_TOKEN } from '../constants';
import { isTokenExpired, refreshToken } from '../util/auth.js'
import setAuthToken from '../util/setAuthToken';


export const HeygenContext = createContext();

export const HeygenProvider = ({children}) => {
    const [avatars, setAvatars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const fetchCSRFToken = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get_csrf_token/', {
        withCredentials: true,
      });
      return response.data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw new Error('Failed to fetch CSRF token');
    }
    };

    const fetchAvatars = async () => {
    console.log("Starting fetch operation...");
    setLoading(true);

    try {
      const csrfToken = await fetchCSRFToken();
      let accessToken = localStorage.getItem(ACCESS_TOKEN);

      if (!accessToken || isTokenExpired(accessToken)) {
        accessToken = await refreshToken();
      }

      if (!accessToken) {
        setMessage("User not authenticated. Please log in.");
        return;
      }

      // Set the authorization token for all requests
      setAuthToken(`Bearer ${accessToken}`);

      const response = await axios.get("http://localhost:8000/api/get_avatars/", 
        {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const data = response.data;
      console.log("Fetch successful:", data);
      setAvatars(JSON.stringify(data, null, 2));
    } catch (error) {
      setMessage("Error loading Heygen Avatars");
      console.error("Error fetching avatars:", error);
    } finally {
      setLoading(false);
      console.log("Fetch operation completed");
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    <HeygenContext.Provider value={{ avatars, loading, message, setMessage }}>
        {children}
    </HeygenContext.Provider>
  );
}
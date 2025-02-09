import React, { useEffect, useState, useCallback, memo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute } from "../utils/APIRoutes.js";
import ChatContainer from "../components/ChatContainer.jsx";
import Contacts from "../components/Contacts.jsx";
import Welcome from "../components/Welcome.jsx";

// Memoize child components
const MemoizedContacts = memo(Contacts);
const MemoizedChatContainer = memo(ChatContainer);
const MemoizedWelcome = memo(Welcome);

// Move styled component outside of the component
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
  }

  .chat-loading {
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: larger;
    font-weight: bolder;
  }

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    .container {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  // Use useCallback for functions passed as props
  const handleChatChange = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  // Separate user initialization logic
  useEffect(() => {
    const storedData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    
    if (!storedData) {
      navigate("/login");
      return;
    }

    try {
      const { user } = JSON.parse(storedData);
      if (user) {
        setCurrentUser(user);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  // Optimize contacts fetching
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchContacts = async () => {
      if (!currentUser?._id) return;

      try {
        const { data } = await axios.get(
          `${allUsersRoute}/${currentUser._id}`,
          { signal: controller.signal }
        );
        
        if (isMounted) {
          setContacts(data);
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentUser?._id]);

  // Memoize the loading component
  const loadingComponent = <div className="chat-loading">Loading...</div>;

  return (
    <Container>
      <div className="container">
        {contacts.length > 0 ? (
          <MemoizedContacts 
            contacts={contacts} 
            changeChat={handleChatChange} 
          />
        ) : loadingComponent}
        
        {currentChat === undefined ? (
          <MemoizedWelcome />
        ) : (
          <MemoizedChatContainer 
            currentChat={currentChat} 
            currentUser={currentUser} 
          />
        )}
      </div>
    </Container>
  );
}

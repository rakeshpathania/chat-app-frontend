import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute } from "../utils/APIRoutes.js";
import ChatContainer from "../components/ChatContainer.jsx";
import Contacts from "../components/Contacts.jsx";
import Welcome from "../components/Welcome.jsx";

export default function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      let user = JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      )?.user;

      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        try {
          const {data} = await axios.get(`${allUsersRoute}/${currentUser?._id}`);
          setContacts(data);
        } catch (error) {
          console.log("Error fetching contacts:", error);
        }
      }
    };
  
    fetchContacts();
  }, [currentUser]);
  

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };


  return (
    <>
      <Container>
        <div className="container">
          {contacts.length > 0 ?(
            <Contacts contacts={contacts} changeChat={handleChatChange} />
          ): (<div className="chat-loading"> Loading... </div>)}
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} currentUser={currentUser} />
          )}
        </div>
      </Container>
    </>
  );
}

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

  .chat-loading{
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: larger;
    font-weight: bolder;
  }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
}`

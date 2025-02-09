import React, { useState, useCallback, memo } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

const MemoizedPicker = memo(({ onEmojiClick }) => (
  <Picker onEmojiClick={onEmojiClick} />
));

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
  }, []);

  const handleEmojiClick = useCallback((event, emojiObject) => {
    setMsg(prevMsg => prevMsg + emojiObject.emoji);
  }, []);

  const handleInputChange = useCallback((e) => {
    setMsg(e.target.value);
  }, []);

  const sendChat = useCallback((event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg.trim());
      setMsg("");
      setShowEmojiPicker(false);
    }
  }, [msg, handleSendMsg]);

  const handleClickOutside = useCallback((e) => {
    if (!e.target.closest('.emoji')) {
      setShowEmojiPicker(false);
    }
  }, []);

  React.useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showEmojiPicker, handleClickOutside]);

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker-wrapper">
              <MemoizedPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={handleInputChange}
          value={msg}
          autoComplete="off"
        />
        <button 
          type="submit"
          disabled={!msg.trim()}
          className={!msg.trim() ? 'disabled' : ''}
        >
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
 display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  position: relative;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;
      
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: #ffff00;
        }
      }

      .emoji-picker-wrapper {
        position: absolute;
        bottom: 50px;  /* Changed from top: -350px to bottom: 50px */
        left: 0;
        z-index: 100;
      }

      .emoji-picker-react {
        position: absolute;
        bottom: 50px;  /* Changed from top: -350px to bottom: 50px */
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;

        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;

          &-thumb {
            background-color: #9a86f3;
          }
        }

        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }

        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
          color: white;
        }

        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    transition: background-color 0.3s ease;

    &:focus-within {
      background-color: #ffffff45;
    }

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      font-size: 1.2rem;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover:not(.disabled) {
        background-color: #7b5dfa;
      }

      &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #666;
      }

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        
        svg {
          font-size: 1rem;
        }
      }

      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;

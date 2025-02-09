import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes.js";
import { PacmanLoader } from 'react-spinners';

// Memoize static components
const MemoizedLoader = memo(({ size, color }) => (
  <div className="loader">
    <p><PacmanLoader size={size} color={color} loading={true} /></p>
  </div>
));

const TOAST_CONFIG = {
  position: "bottom-right",
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const INITIAL_VALUES = {
  username: "",
  password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(INITIAL_VALUES);

  // Check authentication status
  useEffect(() => {
    const authToken = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (authToken) {
      navigate("/chat");
    }
  }, [navigate]);

  // Memoized handlers
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const { username, password } = values;
    
    if (!username.trim()) {
      toast.error("Username is required.", TOAST_CONFIG);
      return false;
    }
    
    if (!password.trim()) {
      toast.error("Password is required.", TOAST_CONFIG);
      return false;
    }
    
    return true;
  }, [values]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      if (data.status_code === "0") {
        toast.error(data.message, TOAST_CONFIG);
        return;
      }

      if (data.status_code === "1") {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.data)
        );
        navigate("/chat");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during login",
        TOAST_CONFIG
      );
    } finally {
      setLoading(false);
    }
  }, [values, validateForm, navigate]);

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit} noValidate>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={values.username}
            disabled={loading}
            minLength={3}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={values.password}
            disabled={loading}
            required
          />
          
          {loading ? (
            <MemoizedLoader size={15} color="white" />
          ) : (
            <button type="submit">Log In</button>
          )}
          
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer limit={3} />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
      width: auto;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
    width: 100%;
    max-width: 400px;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #997af0;
      outline: none;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: background-color 0.3s ease;

    &:hover:not(:disabled) {
      background-color: #3c0acc;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 48px;
    p {
      margin: 0;
    }
  }

  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease;

      &:hover {
        color: #997af0;
      }
    }
  }

  @media (max-width: 768px) {
    form {
      padding: 2rem;
      margin: 0 1rem;
    }
  }
`;

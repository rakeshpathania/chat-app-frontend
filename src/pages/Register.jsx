import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes.js";
import { PacmanLoader } from "react-spinners";

// Memoized loader component
const LoaderComponent = memo(({ size, color }) => (
  <div className="loader">
    <p>
      <PacmanLoader size={size} color={color} loading={true} />
    </p>
  </div>
));

const TOAST_OPTIONS = {
  position: "bottom-right",
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const INITIAL_FORM_STATE = {
  username: "",
  email: "",
  password: "",
  confirm_password: "",
};

const VALIDATION_RULES = {
  username: (value) =>
    value.length >= 3 || "Username should be greater than 3 characters.",
  email: (value) =>
    /\S+@\S+\.\S+/.test(value) || "Please enter a valid email address.",
  password: (value) => {
    // Check if password is provided
    if (!value) {
      return "Password is required.";
    }

    // Check length requirements (8-18 characters)
    if (value.length < 8 || value.length > 18) {
      return "Password must be between 8 and 18 characters.";
    }

    // Check for uppercase letter
    if (!/(?=.*?[A-Z])/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }

    // Check for lowercase letter
    if (!/(?=.*?[a-z])/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }

    // Check for number
    if (!/(?=.*?[0-9])/.test(value)) {
      return "Password must contain at least one number.";
    }

    // Check for special character
    if (!/(?=.*?[#?!@$%^&*-])/.test(value)) {
      return "Password must contain at least one special character (#?!@$%^&*-).";
    }

    return true;
  },
  confirm_password: (value, formValues) =>
    value === formValues.password || "Passwords do not match.",
};

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const authToken = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (authToken) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validateField = useCallback(
    (name, value) => {
      const validator = VALIDATION_RULES[name];
      if (validator) {
        const result = validator(value, values);
        return typeof result === "string" ? result : "";
      }
      return "";
    },
    [values]
  );

  const handleValidation = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(values).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!handleValidation()) {
      Object.values(errors).forEach((error) => {
        if (error) toast.error(error, TOAST_OPTIONS);
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(registerRoute, values);
      const { data } = response;

      if (data.status_code === "0") {
        toast.error(data.message, TOAST_OPTIONS);
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
        error.response?.data?.message ||
          "Registration failed. Please try again.",
        TOAST_OPTIONS
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit} noValidate>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>

          {Object.keys(INITIAL_FORM_STATE).map((field) => (
            <div key={field} className="input-group">
              <input
                type={
                  field.includes("password")
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                placeholder={
                  field.charAt(0).toUpperCase() +
                  field.slice(1).replace("_", " ")
                }
                name={field}
                value={values[field]}
                onChange={handleChange}
                disabled={loading}
                className={errors[field] ? "error" : ""}
                required
              />
              {errors[field] && (
                <span className="error-message">{errors[field]}</span>
              )}
            </div>
          ))}

          {loading ? (
            <LoaderComponent size={15} color="white" />
          ) : (
            <button type="submit" disabled={loading}>
              Create Account
            </button>
          )}

          <span className="link-text">
            Already have an account? <Link to="/login">Login</Link>
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
    gap: 1.5rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem;
    max-width: 400px;
    width: 90%;
  }

  .input-group {
    position: relative;
    width: 100%;
  }

  input {
    width: 100%;
    padding: 1rem;
    background-color: transparent;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #997af0;
      outline: none;
    }

    &.error {
      border-color: #ff4444;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .error-message {
    color: #ff4444;
    font-size: 0.8rem;
    position: absolute;
    bottom: -1.2rem;
    left: 0;
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem;
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

  .link-text {
    color: white;
    text-align: center;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  @media (max-width: 768px) {
    form {
      padding: 2rem;
    }
  }
`;

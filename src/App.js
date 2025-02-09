import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Chat from './pages/Chat.jsx';
import Login from './pages/Login.jsx';
import Register from "./pages/Register.jsx";
import SetAvatar from './pages/SetAvatar.jsx';
export default function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/register" element= {<Register />}></Route>
        <Route path="/login" element= {<Login />}></Route>
        <Route path="/setAvatar" element= {<SetAvatar />}></Route>
       <Route path="/chat" element= {<Chat />}></Route>

    </Routes>
    </BrowserRouter>
  )
}

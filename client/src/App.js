import React from "react";
import { useContext, useEffect } from "react";
import "./App.css";
import { UserContext } from "./context/UserContext";
import axios from "axios";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";
import Home from "./Pages/Home/Home";

function App() {
  const [userData, setUserData] = useContext(UserContext);

  const checkLoggedIn = async () => {
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      // token not in local storage then  set auth token empty
      localStorage.setItem("auth-token", "");
      token = "";
    } else {
      // if token exists in local storage then use auth to verify token and get user info
      const userRes = await axios.get("http://localhost:4000/api/users", {
        headers: { "x-auth-token": token },
      });

      // set the global state with user info
      setUserData({
        token,
        user: {
          id: userRes.data.data.user_id,
          display_name: userRes.data.data.user_name,
        },
      });
    }
  };

  const logout = () => {
    // set global state to undefined will logout the user
    setUserData({
      token: undefined,
      user: undefined,
    });
    // resetting localStorage
    localStorage.setItem("auth-token", "");
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);
  return (
    <Router>
      <div>
        <Routes>
          <Route path="signUp" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Home logout={logout} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

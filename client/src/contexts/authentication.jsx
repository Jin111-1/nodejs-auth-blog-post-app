import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });
  const navigate = useNavigate();
  
  const login = async (data) => {
    try {
      const response = await axios.post("http://localhost:4000/login", data)
      localStorage.setItem("token", response.data.token)
      navigate("/")
    } catch (error) {
      setState({
        ...state,
        error: error.message,
        message: "Login failed",
      });
    }
  }

  const register = async (data) => {
    try {
      const response = await axios.post("http://localhost:4000/register", data);
      navigate("/login");
    } catch (error) {
      setState({
        ...state,
        error: error.message,
      });
    }
  };

  const logout = () => {
  try {
    localStorage.removeItem("token");
    setState({
      ...state,
      user: null,
    });
    navigate("/login");
  }catch (error) {
    setState({
      ...state,
      error: error.message,
    });
  }}

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };

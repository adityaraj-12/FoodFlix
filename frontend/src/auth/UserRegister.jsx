
import React, { useState } from "react";
import "../assets/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserRegister() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fullName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    console.log(e.target);

    const response = await axios.post("http://localhost:3000/api/auth/user/register", {
      fullName,
      email,
      password
    }, {
      withCredentials: true
    })

    navigate("/");
  }


  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-title">User Register</div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-group">
            <input className="auth-input" type="text" placeholder="Name" required />
          </div>
          <div className="auth-group">
            <input className="auth-input" type="email" placeholder="Email" required />
          </div>
          <div className="auth-group">
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="auth-group">
            <input
              className="auth-input"
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={!passwordsMatch ? { borderColor: "#e53e3e" } : {}}
            />
            {!passwordsMatch && (
              <div className="auth-error">
                Passwords do not match
              </div>
            )}
          </div>
          <button className="auth-btn" type="submit">Register</button>
        </form>
        <p>Already have an account?<a className="auth-link" href="/user/login"> Login</a></p>
      </div>
    </div>
  );
}

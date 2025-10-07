import "../assets/auth.css";

import React, { useState } from "react";
import "../assets/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PartnerRegister() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bussinessName = e.target[0].value;
    const name = e.target[1].value;
    const phone = e.target[2].value;
    const email = e.target[3].value;
    const address = e.target[4].value;
    const password = e.target[5].value;
    const confirmPassword = e.target[6].value;
    
    const response = await axios.post("http://localhost:3000/api/auth/food-partner/register", {
      bussinessName,
      email,
      password,
      name,
      phone,
      address
    }, {
      withCredentials: true
    })
    console.log(response);

    Navigate("/create-food");
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-title">Food Partner Register</div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-group">
            <input className="auth-input" type="text" placeholder="Business Name" required />
          </div>
          <div className="auth-group">
            <input className="auth-input" type="text" placeholder="Contact Name" required />
          </div>
          <div className="auth-group">
            <input className="auth-input" type="tel" placeholder="Phone Number" required />
          </div>
          <div className="auth-group">
            <input className="auth-input" type="email" placeholder="Email" required />
          </div>
          <div className="auth-group">
            <input className="auth-input" type="text" placeholder="Address" required />
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
        <p>Already have an account?<a className="auth-link" href="/food-partner/login"> Login</a></p>
      </div>
    </div>
  );
}

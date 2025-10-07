import "../assets/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PartnerLogin() {

  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    const response = await axios.post("http://localhost:3000/api/auth/food-partner/login", {
      email,
      password
    }, {
      withCredentials: true
    })

    Navigate("/create-food");
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        <p>Switch to User <a className="auth-link" href="/user/login"> Login</a></p>
        </div>
        <div className="auth-title">Food Partner Login</div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-group">
            <input className="auth-input" type="email" placeholder="Email" required />
          </div>
          <div className="auth-group">
            <input className="auth-input" type="password" placeholder="Password" required />
          </div>
          <button className="auth-btn" type="submit">Login</button>
        </form>
        <p>Not a Food Partner?<a className="auth-link" href="/food-partner/register"> Register</a></p>
      </div>
    </div>
  );
}

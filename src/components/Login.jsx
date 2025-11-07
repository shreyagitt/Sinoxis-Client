import React from "react";
import "./Login.css"; 

const Login = () => {
  return (
    <div className="login-page">
      <img src="/image/logo.webp" alt="Sinoxis Logo" className="login-logo" />

      <div className="login-card">
        <h3 className="login-title">Login</h3>
        <p className="login-subtitle">
          Enter your credentials to access your account.
        </p>

        <form>
          <div className="form-group">
            <label htmlFor="Email">Email or Username</label>
            <input
              type="text"
              id="Email"
              placeholder="Enter email or username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              id="Password"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="checkbox-container">
            <label className="checkbox-label">
              <input type="checkbox" id="RememberMe" /> Remember me
            </label>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import "./Login.css";

type LoginProps = {
  onLogin: (password: string) => void; //Validate password and update state in parent component
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onLogin(password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            className="login-input"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

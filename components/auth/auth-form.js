import { useEffect, useRef, useState } from "react";
import classes from "./auth-form.module.css";
import { SIGNUP_ERROR, SIGNUP_SUCCESS } from "../../constants/auth";

const handleSignup = async (email, password) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || SIGNUP_ERROR);
  }

  return data;
};

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const clickSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (isLogin) {
      //login api
    } else {
      try {
        const data = await handleSignup(email, password);
        if (data) {
          alert(SIGNUP_SUCCESS);
          emailRef.current.value = "";
          passwordRef.current.value = "";
        }
      } catch (e) {
        setAuthError(e.message);
      }
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={clickSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" ref={passwordRef} required />
        </div>
        <div className={classes.actions}>
          <button onClick={clickSubmit}>{isLogin ? "Login" : "Create Account"}</button>
          <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
      {authError && <p>{authError}</p>}
    </section>
  );
}

export default AuthForm;

import { useRef, useState } from "react";
import classes from "./profile-form.module.css";
import { CHANGE_PWD_ERROR } from "../../constants/user";

const changePassword = async (password, newPassword) => {
  const response = await fetch("/api/user/change-password", {
    method: "PATCH",
    body: JSON.stringify({
      oldPassword: password,
      newPassword,
    }),
    headers: {
      "Content-Type": "application/jsons",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || CHANGE_PWD_ERROR);
  }

  return data;
};

function ProfileForm() {
  const passwordRef = useRef();
  const newPasswordRef = useRef();

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const password = passwordRef.current.value;
    const newPassword = newPasswordRef.current.value;

    try {
      const data = await changePassword(password, newPassword);

      if (data) {
        passwordRef.current.value = "";
        newPasswordRef.current.value = "";
        alert("비밀번호 변경 완료");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" ref={newPasswordRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="old-password">Old Password</label>
          <input type="password" id="old-password" ref={passwordRef} />
        </div>
        <div className={classes.action}>
          <button onClick={handleSubmit}>Change Password</button>
        </div>
      </form>
      {error && <p>{error}</p>}
    </>
  );
}

export default ProfileForm;

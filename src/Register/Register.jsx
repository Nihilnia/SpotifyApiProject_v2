import "./register.css";
import Modal from "../Modal/Modal";
import { useEffect } from "react";

export default function Register(props) {
  document.body.classList.remove("body--login");
  document.body.classList.add("body--register");

  const {
    handleInputChange,
    handleUserEnter,
    handlePaging,
    modal,
    setModal,
    handleTraffic,
  } = props;

  useEffect(() => {
    handleTraffic("unregisteredUser", "Register");
  }, []);

  return (
    <>
      {modal.isShow && <Modal modal={modal} setModal={setModal} />}
      <div className="background--register">
        <div className="shape--register"></div>
        <div className="shape--register"></div>
      </div>
      <form className="form--register" onSubmit={(e) => handleUserEnter(e)}>
        <h3>Register</h3>

        <label htmlFor="username" className="label--register">
          Username
        </label>
        <input
          className="input--register"
          placeholder="Username"
          type="text"
          name="userName"
          onChange={handleInputChange}
        />

        <label htmlFor="password" className="label--register">
          Password
        </label>
        <input
          className="input--register"
          placeholder="Password"
          type="password"
          name="passWord"
          onChange={handleInputChange}
        />

        <button
          className="button--register"
          onClick={(e) => handleUserEnter(e)}
        >
          Register
        </button>
        <a
          style={{
            color: "#0096FF",
            textDecoration: "underline",
            textAlign: "center",
            display: "block",
          }}
          onClick={(e) => {
            handlePaging(e, "Login");
          }}
        >
          Back to login!
        </a>
      </form>
    </>
  );
}

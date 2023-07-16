import "./Modal.css";
import userNotFound from "./userNotFound.png";
import userNameTaken from "./userNameTaken.png";
import wrongPass from "./wrongPass.png";
import confetti from "./confetti.png";

export default function Modal(props) {
  const { modal, setModal } = props;

  let svgToShow = null;
  let informationToShow = null;
  let gestureToShow = null;
  switch (modal.information) {
    case "User not found":
      svgToShow = userNotFound;
      informationToShow = "User not found.";
      gestureToShow = "Try again";
      break;

    case "This username is taken":
      svgToShow = userNameTaken;
      informationToShow = "This username is taken";
      gestureToShow = "Try again";
      break;

    case "Password is wrong":
      svgToShow = wrongPass;
      informationToShow = "Password is wrong";
      gestureToShow = "Try again";
      break;

    case "Successfuly registered.":
      svgToShow = confetti;
      informationToShow = "Successfuly registered.";
      gestureToShow = "Nice!";
      break;
  }

  return (
    <>
      {modal.isShow && (
        <div className="modal--container">
          <div className="cookiesContent" id="cookiesPopup">
            <button className="close" onClick={() => setModal((prev) => !prev)}>
              ✖
            </button>
            <img src={svgToShow} alt="cookies-img" />
            <p>
              {informationToShow} <br />
              <i>"{modal.userName}"</i>
            </p>
            <button
              className="accept"
              onClick={() => setModal((prev) => !prev)}
            >
              {gestureToShow}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

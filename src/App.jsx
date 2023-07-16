import { useEffect, useState } from "react";

import { userzCollection, db } from "./Firebase";
import { onSnapshot, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore";

import Login from "./Login/Login";
import Register from "./Register/Register";
import Dashboard from "./Dashboard/Dashboard";
import FollowingArtists from "./FollowingArtists/FollowingArtists";
import FollowingSongs from "./FollowingSongs/FollowingSongs";
import FollowingPlaylists from "./FollowingPlaylists/FollowingPlaylists";
import Profile from "./Profile/Profile";

export default function App() {
  const [userInput, setUserInput] = useState({
    userName: "",
    passWord: "",
  });

  const [page, setPage] = useState("Login");
  const [modal, setModal] = useState({
    isShow: false,
    userName: "",
    information: "defaultInformation",
  });

  const [profileIntel, setProfileIntel] = useState();

  const handleInputChange = (e) => {
    // console.log("Change happening..");
    // console.log(e.target);

    const { name, value } = e.target;

    setUserInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const [loggedUser, setLoggedUser] = useState(null);
  const [fromPage, setFromPage] = useState("Login");

  const handleUserEnter = (e) => {
    console.log("asd");
    console.log(e.click);
    e.preventDefault();

    console.log("User pressed the enter..");
    // console.log(e.target);

    console.log(`
      —Given user input—
      Username: ${userInput.userName}
      Password: ${userInput.passWord}
      `);

    let findUser = dbUserz.filter((f) => f.userName == userInput.userName);
    // console.log(dbUserz);
    switch (page) {
      case "Register":
        if (findUser.length < 1) {
          //?Register the user
          const registerUser = async () => {
            //? Getting the reference of the process.
            const newUserRef = await addDoc(userzCollection, userInput);
          };

          registerUser();
          setModal(() => {
            return {
              isShow: true,
              userName: userInput.userName,
              information: `Successfuly registered.`,
            };
          });
        } else {
          setModal(() => {
            return {
              isShow: true,
              userName: userInput.userName,
              information: `This username is taken`,
            };
          });
        }
        break;

      case "Login":
        //? Login control
        if (findUser.length > 0) {
          if (findUser[0].passWord == userInput.passWord) {
            // console.log("welcome mf.");
            setLoggedUser(() => {
              return findUser[0];
            });
            setPage("Dashboard");
          } else {
            // console.log("Password is wrong mf.");
            setModal(() => {
              return {
                isShow: true,
                userName: userInput.userName,
                information: `Password is wrong`,
              };
            });
          }
        } else {
          // console.log("There is no user like that. Wrong mf.");
          setModal(() => {
            return {
              isShow: true,
              userName: userInput.userName,
              information: "User not found",
            };
          });
        }
        break;
    }
  };

  const handlePaging = (e, pageName, from) => {
    setPage(pageName);
    setModal(() => {
      return {
        isShow: false,
        userName: "",
        information: "",
      };
    });
    setFromPage(pageName);
  };

  const [dbUserz, setDBUserz] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(userzCollection, (snapshot) => {
      snapshot.docs.length == 0
        ? console.log("%cDatabase is empty now..", "color: orange")
        : console.log("%cDatabase is ready..", "color: orange");

      console.log(
        `At total there are ${snapshot.docs.length} userz in the database..`
      );
      //? oldschool controllin to database changes

      //! READING:
      const userzArr = snapshot.docs.map((doc) => {
        //?Map returns array.. key point!
        return { id: doc.id, ...doc.data() };
      });

      setDBUserz(userzArr);
    });

    return unsubscribe;
    //? When onSnapshot is done with it' s shit its make it over to watch
    //? for encounter the memory leak
  }, []);

  // console.log("DB USERZ");
  // console.log(dbUserz);

  // console.log(`
  // Temp data:
  // Username: ${userInput.userName}
  // Password: ${userInput.passWord}
  // `);

  // console.log(`Logged user:`);
  // console.log(loggedUser);

  return (
    <>
      {page == "Login" && (
        <Login
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          modal={modal}
          setModal={setModal}
        />
      )}
      {page == "Register" && (
        <Register
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          modal={modal}
          setModal={setModal}
          setUserInput={setUserInput}
        />
      )}
      {page == "Dashboard" && (
        <Dashboard
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          loggedUser={loggedUser}
          fromPage={fromPage}
        />
      )}
      {page == "Followin' Artists" && (
        <FollowingArtists
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          loggedUser={loggedUser}
        />
      )}
      {page == "Followin' Songs" && (
        <FollowingSongs
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          loggedUser={loggedUser}
        />
      )}
      {page == "Followin' Playlists" && (
        <FollowingPlaylists
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          loggedUser={loggedUser}
        />
      )}
      {page == "Profile" && (
        <Profile handlePaging={handlePaging} loggedUser={loggedUser} />
      )}
    </>
  );
}

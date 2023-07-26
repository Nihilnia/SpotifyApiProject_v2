import { useEffect, useState } from "react";

import { userzCollection, countEmCollection, db } from "./Firebase";
import { onSnapshot, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore";

import Login from "./Login/Login";
import Register from "./Register/Register";
import Dashboard from "./Dashboard/Dashboard";
import FollowingArtists from "./FollowingArtists/FollowingArtists";
import FollowingSongs from "./FollowingSongs/FollowingSongs";
import FollowingPlaylists from "./FollowingPlaylists/FollowingPlaylists";
import Profile from "./Profile/Profile";

export default function App() {
  //!_countEm
  const ddate = new Date();
  const yyyy = ddate.getFullYear();
  let mm = ddate.getMonth() + 1;
  let dd = ddate.getDate();

  let formatDate = `${dd}/ ${mm}/ ${yyyy}`;

  // console.log(formatDate);

  const generateRandNumb = (max) => {
    return Math.floor(Math.random() * max);
  };

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
    e.preventDefault();

    console.log("User tried to login.");
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
        if (userInput.userName.length >= 3 && userInput.passWord.length >= 3) {
          if (findUser.length < 1) {
            //?Register the user
            const registerUser = async () => {
              //? Getting the reference of the process.
              const newUserRef = await addDoc(userzCollection, {
                userName: userInput.userName,
                passWord: userInput.passWord,
                time: ddate,
                date: formatDate,
              });
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
        } else {
          setModal(() => {
            return {
              isShow: true,
              userName: userInput.userName,
              information: `Username and password must be at least 3 characters long.`,
            };
          });
        }
        break;

      case "Login":
        //? Login control
        if (userInput.userName.length >= 3 && userInput.passWord.length >= 3) {
          if (findUser.length > 0) {
            if (findUser[0].passWord == userInput.passWord) {
              // console.log("welcome mf.");
              console.log(
                `%cUsername and password mathched. Welcome ${findUser[0].userName}.`,
                "color: orange"
              );
              setLoggedUser(() => {
                return findUser[0];
              });
              setPage("Dashboard");
            } else {
              // console.log("Password is wrong mf.");
              console.log(
                `%cPassword is wrong for user: ${findUser[0].userName}.`,
                "color: orange"
              );
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
        } else {
          setModal(() => {
            return {
              isShow: true,
              userName: userInput.userName,
              information: `Username and password must be at least 3 characters long.`,
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
      handleTraffic("unregisteredUser", page);
      snapshot.docs.length == 0
        ? console.log("%cDatabase is empty now..", "color: orange")
        : console.log("%cDatabase is ready..", "color: orange");

      // console.log(
      //   `At total there are ${snapshot.docs.length} users in the database..`
      // );
      // console.log(generateRandNumb(1000));

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

  const handleTraffic = (whoIsIt, fPage) => {
    const doCount = async () => {
      const newCountRef = await addDoc(countEmCollection, {
        time: ddate,
        date: formatDate,
        page: fPage != null ? fPage : page,
        randNum: generateRandNumb(1000),
        user: whoIsIt,
      });
    };

    doCount();
  };

  return (
    <>
      {page == "Login" && (
        <Login
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          modal={modal}
          setModal={setModal}
          handleTraffic={handleTraffic}
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
          handleTraffic={handleTraffic}
        />
      )}
      {page == "Dashboard" && (
        <Dashboard
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          loggedUser={loggedUser}
          fromPage={fromPage}
          handleTraffic={handleTraffic}
        />
      )}
      {page == "Followin' Artists" && (
        <FollowingArtists
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          loggedUser={loggedUser}
          handleTraffic={handleTraffic}
        />
      )}
      {page == "Followin' Songs" && (
        <FollowingSongs
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          loggedUser={loggedUser}
          handleTraffic={handleTraffic}
        />
      )}
      {page == "Followin' Playlists" && (
        <FollowingPlaylists
          handleInputChange={handleInputChange}
          handleUserEnter={handleUserEnter}
          handlePaging={handlePaging}
          loggedUser={loggedUser}
          handleTraffic={handleTraffic}
        />
      )}
    </>
  );
}

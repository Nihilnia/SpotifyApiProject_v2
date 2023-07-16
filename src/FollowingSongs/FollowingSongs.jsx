import { useEffect, useState } from "react";
import {
  db,
  followingSongzCollection,
  nihilGitHubCollection,
} from "../Firebase";
import { onSnapshot, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore";

// import "./FollowingArtists.css";
import "../ArtistCard/ArtistCard2.css";
import ProfileV2 from "../Profile/ProfileV2";

import defArtistPic from "../ArtistCard/defArtist.png";

export default function FollowingSongs(props) {
  // console.log("asd");
  document.body.classList.remove("body--login");
  document.body.classList.add("gradient-background");
  document.body.classList.add("body--newTodo");
  document
    .querySelector(".loading--after")
    .classList.add("visibilityHidden", "visibilityVisible");

  const { loggedUser, handlePaging } = props;
  // console.log(loggedUser);

  const [allFollowingSongz, setAllFollowingSongz] = useState(null);

  //Profile popUp
  const [isProfile, setIsProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(followingSongzCollection, (snapshot) => {
      snapshot.docs.length == 0
        ? console.log("%cDatabase is empty now..", "color: orange")
        : console.log("%cDatabase is ready..", "color: orange");

      //! READING:
      const userzFollowingSongz = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      // console.log("SONGSZZZZZ");
      // console.log(userzFollowingSongz);

      setAllFollowingSongz(userzFollowingSongz);
    });

    return unsubscribe;
    //? When onSnapshot is done with it' s shit its make it over to watch
    //? for encounter the memory leak
  }, []);

  const handleNihilGitHub = (e, incomingIntel) => {
    console.log(`User requested to follow the artist:`);
    console.log(incomingIntel);
    const saveTheIntel = async () => {
      const followRef = await addDoc(nihilGitHubCollection, incomingIntel); //? Getting the reference of the process.
    };

    saveTheIntel();
  };

  const handleUnfollowSong = async (e, id) => {
    const docRef = doc(db, "followingSongz", id); //? Selectin' the doc we want to delete
    await deleteDoc(docRef); //? Give the reference to delete
  };

  // console.log("AAAAAAAAAAAAAAAAAA");
  // console.log(allFollowingSongz);

  let followingSongz = allFollowingSongz?.filter(
    (f) => f.userID == loggedUser.id
  );

  // console.log(followingSongz);

  {
    /* songAlbumName
    "defAlbum"

    songArtistz
    "defArtistz"

    songID
    "333"

    songName
    "defSong"

    songPic
    "defPic"

    songPopularity
    "444"

    songReleaseDate
    "defDate"

    userID
    "666"

    userName
    "defUser" */
  }

  let toRender = followingSongz?.map((song) => {
    return (
      <article
        key={song.id}
        style={{ width: "260px", marginBottom: "25px", marginTop: "5px" }}
        className="card card--1 makeItBlack"
      >
        <div
          className="card__info-hover"
          style={{ zIndex: "1", position: "absolute" }}
        >
          <div
            className="coverArt"
            onClick={() => {
              window.open(
                song.songPic != undefined ? song.songPic : "",
                "_blank"
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="#ad7d52"
              className="card__likebi bi-image"
              viewBox="0 0 16 16"
            >
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
            </svg>
            <span className="coverArt">Cover art</span>
          </div>
          <div className="card__clock-info">
            <div>
              <svg
                style={{ float: "left" }}
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                className="bi bi-clock-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
              </svg>
              <span className="coverArt">
                {song.songDuration > 0
                  ? `${new Date(song.songDuration).getMinutes()}:${new Date(
                      song.songDuration
                    ).getSeconds()} Minutes`
                  : `Unknown`}
              </span>
            </div>
          </div>
        </div>
        <div
          className="card__img"
          style={{
            backgroundImage: `url(${
              song.songPic != undefined ? song.songPic : ""
            })`,
          }}
        ></div>
        <a href="#" className="card_link">
          <div
            className="card__img--hover"
            style={{
              backgroundImage: `url(${
                song.songPic != undefined ? song.songPic : ""
              })`,
            }}
          ></div>
        </a>
        <div className="card__info">
          <span className="card__category">
            {" "}
            {song.songName.length > 21
              ? song.songName.slice(0, 18) + "..."
              : song.songName}
          </span>
          <span className="card__category"> {song.songArtistz["name"]}</span>
          <h3 className="card__title">{song.songArtistz["name"]}</h3>
          <span className="card__by">
            Album:{" "}
            <a href="#" className="card__author" title="author">
              {song.songAlbumName != undefined
                ? song.songAlbumName.length > 27
                  ? song.songAlbumName.slice(0, 25) + "..."
                  : song.songAlbumName
                : "Unknown"}
            </a>
          </span>
          <br />
          <span className="card__by">
            Release Date:{" "}
            <a href="#" className="card__author" title="author">
              {`${song.songReleaseData}`}
            </a>
            {/* //Already following */}
            <>
              <br />
              <div
                onClick={(e) => {
                  handleUnfollowSong(e, song.id);
                }}
              >
                <svg
                  style={{
                    marginTop: "2px",
                    color: "#C88413",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-star-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                <span style={{ marginLeft: "2px" }}>Following</span>
              </div>
            </>
          </span>
        </div>
      </article>
    );
  });

  var prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("navBar").style.top = "20px";
    } else {
      document.getElementById("navBar").style.top = "-50px";
    }
    prevScrollpos = currentScrollPos;
  };
  return (
    <>
      {isProfile && (
        <ProfileV2 loggedUser={loggedUser} toggleProfile={setIsProfile} />
      )}
      <div className="loading--after visibilityHidden">
        <div className="navbar--back"></div>
        <nav className="childNav" id="navBar">
          <a onClick={(e) => handlePaging(e, "Dashboard")}>
            {/* <img src="../src/assets/homePage.svg" className="navBar--icon" /> */}
            Dashboard&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-house-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
              <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
            </svg>
          </a>
          &nbsp;|&nbsp;
          <a onClick={(e) => handlePaging(e, "Followin' Artists")}>
            Your Artists&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-file-earmark-music-fill"
              viewBox="0 0 16 16"
            >
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14c-.5 0-.974-.134-1.338-.377-.36-.24-.662-.628-.662-1.123s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25A1 1 0 0 1 11 6.64z" />
            </svg>
          </a>
          &nbsp;|&nbsp;
          <a onClick={(e) => handlePaging(e, "Followin' Songs")}>
            Your Songs&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-file-earmark-music-fill"
              viewBox="0 0 16 16"
            >
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14c-.5 0-.974-.134-1.338-.377-.36-.24-.662-.628-.662-1.123s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25A1 1 0 0 1 11 6.64z" />
            </svg>
          </a>
          &nbsp;|&nbsp;
          {/* <a>
          Completed&nbsp;&nbsp;<i className="fa-solid fa-check fa-lg"></i>
        </a>
        &nbsp;|&nbsp; */}
          <a onClick={(e) => handlePaging(e, "Followin' Playlists")}>
            Your Playlists&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-file-earmark-music-fill"
              viewBox="0 0 16 16"
            >
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14c-.5 0-.974-.134-1.338-.377-.36-.24-.662-.628-.662-1.123s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25A1 1 0 0 1 11 6.64z" />
            </svg>
          </a>
          &nbsp;|&nbsp;
          <a
            onClick={(e) => {
              setIsProfile((prev) => !prev);
            }}
          >
            Profile&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-person-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            </svg>
          </a>
          &nbsp;|&nbsp;
          <a href="/">
            Logout&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-up-right-square-fill"
              viewBox="0 0 16 16"
            >
              <path d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12zM5.904 10.803 10 6.707v2.768a.5.5 0 0 0 1 0V5.5a.5.5 0 0 0-.5-.5H6.525a.5.5 0 1 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 .707.707z" />
            </svg>
          </a>
        </nav>
        <h2 className="user--header">
          You' re followin {followingSongz?.length} songs
        </h2>
        <div className="grid-container" style={{ marginTop: "20px" }}>
          {toRender}
        </div>
        <div
          id="footer"
          style={{
            textAlign: "center",
            marginTop: "5px",
            marginBottom: "7px",
          }}
        >
          <span className="madeBy">
            Made with passion by&nbsp;
            <a
              onClick={(e) => {
                handleNihilGitHub(e, {
                  userID: loggedUser.id,
                  userName: loggedUser.userName,
                });
                window.open("https://github.com/Nihilnia", "_blank");
              }}
            >
              Nihil
            </a>
            &nbsp;
            <svg
              onClick={(e) => {
                handleNihilGitHub(e, {
                  userID: loggedUser.id,
                  userName: loggedUser.userName,
                });
                window.open("https://github.com/Nihilnia", "_blank");
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
}

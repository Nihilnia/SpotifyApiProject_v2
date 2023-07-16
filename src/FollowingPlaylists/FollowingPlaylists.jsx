import { useEffect, useState } from "react";
import {
  db,
  followingPlaylistzCollection,
  nihilGitHubCollection,
} from "../Firebase";
import { onSnapshot, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore";
import ProfileV2 from "../Profile/ProfileV2";
// import "./FollowingArtists.css";
import "../ArtistCard/ArtistCard2.css";

import defArtistPic from "../ArtistCard/defArtist.png";

export default function FollowingPlaylists(props) {
  // console.log("asd");
  document.body.classList.remove("body--login");
  document.body.classList.add("gradient-background");
  document.body.classList.add("body--newTodo");
  document
    .querySelector(".loading--after")
    .classList.add("visibilityHidden", "visibilityVisible");

  const { loggedUser, handlePaging } = props;
  // console.log(loggedUser);

  const [allFollowingPlaylistz, setAllFollowingPlaylistz] = useState(null);

  //Profile popUp
  const [isProfile, setIsProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(followingPlaylistzCollection, (snapshot) => {
      snapshot.docs.length == 0
        ? console.log("%cDatabase is empty now..", "color: orange")
        : console.log("%cDatabase is ready..", "color: orange");

      //! READING:
      const userzFollowingPlaylistz = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      // console.log("SONGSZZZZZ");
      // console.log(userzFollowingPlaylistz);

      setAllFollowingPlaylistz(userzFollowingPlaylistz);
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

  const handleUnfollowPlaylist = async (e, id) => {
    const docRef = doc(db, "followingPlaylistz", id); //? Selectin' the doc we want to delete
    await deleteDoc(docRef); //? Give the reference to delete
  };

  // console.log("AAAAAAAAAAAAAAAAAA");
  // console.log(allFollowingPlaylistz);

  let followingPlaylistz = allFollowingPlaylistz?.filter(
    (f) => f.userID == loggedUser.id
  );

  // console.log(followingPlaylistz);

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

  let toRender = followingPlaylistz?.map((playlist) => {
    return (
      <article
        key={playlist.id}
        style={{ width: "260px", marginBottom: "25px", marginTop: "5px" }}
        className="card card--1 makeItBlack"
        // onClick={() => {
        //   window.open(song.artistSpotifyLink, "_blank");
        // }}
      >
        <div
          className="card__info-hover"
          style={{ zIndex: "1", position: "absolute" }}
        >
          <div
            className="coverArt"
            onClick={() => {
              window.open(
                playlist.playlistPic != undefined
                  ? playlist.playlistPic
                  : defPlaylistPic,
                "_blank"
              );
              // console.log(playlist.images[0].url);
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
                width="14"
                height="14"
                fill="#ad7d52"
                className="bi bi-music-note-beamed"
                viewBox="0 0 16 16"
              >
                <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z" />
                <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z" />
                <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
              </svg>
              <span className="coverArt">
                {playlist.playlistTrackCount > 0
                  ? playlist.playlistTrackCount
                  : 0}
                &nbsp;Tracks
              </span>
            </div>
          </div>
        </div>
        <div
          className="card__img"
          style={{
            backgroundImage: `url(${
              playlist.playlistPic != undefined ? playlist.playlistPic : ""
            })`,
          }}
        ></div>
        <a href="#" className="card_link">
          <div
            className="card__img--hover"
            style={{
              backgroundImage: `url(${
                playlist.playlistPic != undefined ? playlist.playlistPic : ""
              })`,
            }}
          ></div>
        </a>
        <div className="card__info">
          <span className="card__category">
            {" "}
            {playlist.playlistName.length > 20
              ? playlist.playlistName.slice(0, 17) + "..."
              : playlist.playlistName}
          </span>
          <br />
          <br />
          <span className=" " style={{ color: "#808080" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-blockquote-left"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm5 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm-5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm.79-5.373c.112-.078.26-.17.444-.275L3.524 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282c.024-.203.065-.37.123-.498a1.38 1.38 0 0 1 .252-.37 1.94 1.94 0 0 1 .346-.298zm2.167 0c.113-.078.262-.17.445-.275L5.692 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282a1.75 1.75 0 0 1 .118-.492c.058-.13.144-.254.257-.375a1.94 1.94 0 0 1 .346-.3z" />
            </svg>
            &nbsp;
            {/* Description: too long */}
            Description:&nbsp;
            <br />
            {playlist.playlistDescription.length > 0
              ? playlist.playlistDescription.length > 20
                ? playlist.playlistDescription.slice(0, 19) + ".."
                : playlist.playlistDescription
              : "Not provided."}
          </span>
          <br />
          <h3 className="card__title">
            Tracks:{" "}
            {playlist.playlistTrackCount > 0 ? playlist.playlistTrackCount : 0}
          </h3>
          <span className="card__by">
            Owner:{" "}
            <a href="#" className="card__author" title="author">
              {playlist.playlistOwner}
            </a>
          </span>
          <br />
          <span className="card__by">
            {/* //Already following */}
            <>
              <br />
              <div
                onClick={(e) => {
                  handleUnfollowPlaylist(e, playlist.id);
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
          You' re followin {followingPlaylistz?.length} playlists
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

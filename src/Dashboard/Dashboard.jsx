import { useEffect, useState } from "react";
import {
  db,
  followingArtistzCollection,
  followingSongzCollection,
  followingPlaylistzCollection,
  nihilGitHubCollection,
} from "../Firebase";
import { onSnapshot, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore";
import { Spotify } from "react-spotify-embed";

// import Profile from "../Profile/Profile";
import "../Dashboard/Dashboard.css";
import "../ArtistCard/ArtistCard2.css";

import defPP from "../Profile/defPP.jpg";
import defArtistPic from "../ArtistCard/defArtist.png";
import defTrackPic from "../ArtistCard/defTrack.png";
import defPlaylistPic from "../ArtistCard/defPlaylist.png";
import ProfileV2 from "../Profile/ProfileV2";

const clientID = "4417abaf1e184e449cf0d5a9feab5e49";
const clientSecret = "e319dae8583c44dc85b3cc12989ae5fa";

export default function Dashboard(props) {
  document.body.classList.remove("body--login");
  document.body.classList.add("gradient-background");
  document.body.classList.add("body--newTodo");

  const { loggedUser, fromPage, handlePaging } = props;

  const [accessToken, setAccessToken] = useState("");
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  //User' s collections
  const [userSongz, setUserSongz] = useState([]);
  const [userArtistz, setUserArtistz] = useState([]);
  const [userPlaylistz, setUserPlaylistz] = useState([]);

  //Profile popUp
  const [isProfile, setIsProfile] = useState(false);

  const [userChoice, setUserChoice] = useState({
    userName: loggedUser.userName,
    Page: "Dashboard",
    intel: "",
  });

  const [followingArtistz, setFollowingArtistz] = useState();

  useEffect(() => {
    const authParamz = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientID}&client_secret=${clientSecret}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParamz)
      .then((resp) => resp.json())
      .then((data) => setAccessToken(data.access_token));

    //! USER' Z INTELZ
    const unsubscribe = onSnapshot(followingArtistzCollection, (snapshot) => {
      const userzFollowingArtistz = snapshot.docs.map((doc) => {
        //?Map returns array.. key point!
        return { id: doc.id, ...doc.data() };
      });

      setUserArtistz(
        userzFollowingArtistz.filter((f) => f.userID == loggedUser.id)
      );
    });

    const unsubscribe2 = onSnapshot(followingSongzCollection, (snapshot) => {
      const userzFollowingSongz = snapshot.docs.map((doc) => {
        //?Map returns array.. key point!
        return { id: doc.id, ...doc.data() };
      });

      setUserSongz(
        userzFollowingSongz.filter((f) => f.userID == loggedUser.id)
      );
    });

    const unsubscribe3 = onSnapshot(
      followingPlaylistzCollection,
      (snapshot) => {
        const userzFollowingPlaylistz = snapshot.docs.map((doc) => {
          //?Map returns array.. key point!
          return { id: doc.id, ...doc.data() };
        });

        setUserPlaylistz(
          userzFollowingPlaylistz.filter((f) => f.userID == loggedUser.id)
        );
      }
    );

    return unsubscribe, unsubscribe2, unsubscribe3;
  }, []);

  // console.log(artists);
  // console.log("User' following those artists");
  // console.log(userArtistz);
  // console.log("User' following those songs");
  // console.log(userSongz);
  // console.log("User' following those playlist");
  // console.log(userPlaylistz);

  const handleSpotifySearch = async (e, searchArtist) => {
    const artistParamz = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    //? GETTIN' ARTISTS
    await fetch(
      `https://api.spotify.com/v1/search?q=${searchArtist}&type=artist&limit=5`,
      artistParamz
    )
      .then((response) => response.json())
      .then((data) =>
        setArtists(() => {
          return data.artists.items;
        })
      );

    //? GET THE SONGS
    await fetch(
      `https://api.spotify.com/v1/search?q=${searchArtist}&type=track&limit=5`,
      artistParamz
    )
      .then((response) => response.json())
      .then((data) => {
        setTracks(() => {
          console.log(data.tracks.items);
          return data.tracks.items;
        });
      });

    //? TRY FOR USERS?
    // await fetch(
    //   `https://api.spotify.com/v1/users/${searchArtist}`,
    //   artistParamz
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   });

    await fetch(
      `https://api.spotify.com/v1/search?q=${searchArtist}&type=playlist&limit=3`,
      artistParamz
    )
      .then((response) => response.json())
      .then((data) =>
        setPlaylists(() => {
          return data.playlists.items;
        })
      );
    //? When onSnapshot is done with it' s shit its make it over to watch
    //? for encounter the memory leak
  };

  // console.log(document.querySelector("#root"));

  const handleFollowArtist = (e, incomingIntel) => {
    console.log(`User requested to follow the artist:`);
    console.log(incomingIntel);
    const followTheArtist = async () => {
      const followRef = await addDoc(followingArtistzCollection, incomingIntel); //? Getting the reference of the process.
    };

    followTheArtist();
  };

  const handleUnfollowArtist = async (e, id) => {
    console.log("Incomin'");
    console.log(id);
    console.log("collection");
    console.log(followingArtistzCollection);
    const docRef = doc(db, "followingArtistz", id);
    await deleteDoc(docRef);
  };

  const handleUnfollowSong = async (e, id) => {
    console.log(
      `User: ${loggedUser.userName} requested to follow the song with ID`
    );
    console.log(id);
    const docRef = doc(db, "followingSongz", id);
    await deleteDoc(docRef);
  };

  const handleUnfollowPlaylist = async (e, id) => {
    console.log(
      `User: ${loggedUser.userName} requested to follow the playlist with ID`
    );
    console.log(id);
    const docRef = doc(db, "followingPlaylistz", id);
    await deleteDoc(docRef);
  };

  const handleFollowSong = (e, incomingIntel) => {
    console.log(`User requested to follow the artist:`);
    console.log(incomingIntel);
    const followTheSong = async () => {
      const followRef = await addDoc(followingSongzCollection, incomingIntel); //? Getting the reference of the process.
    };

    followTheSong();
  };

  const handleFollowPlaylist = (e, incomingIntel) => {
    console.log(`User requested to follow the artist:`);
    console.log(incomingIntel);
    const followThePlaylist = async () => {
      const followRef = await addDoc(
        followingPlaylistzCollection,
        incomingIntel
      ); //? Getting the reference of the process.
    };

    followThePlaylist();
  };

  const handleNihilGitHub = (e, incomingIntel) => {
    console.log(`User requested to follow the artist:`);
    console.log(incomingIntel);
    const saveTheIntel = async () => {
      const followRef = await addDoc(nihilGitHubCollection, incomingIntel); //? Getting the reference of the process.
    };

    saveTheIntel();
  };

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

  // console.log(`
  // ############# ITEMZ
  // `);

  // console.log(artists);
  // console.log(tracks);
  // console.log(playlists);

  //? Render Tracks
  let toRenderTracks = tracks.map((track) => {
    let isFollowing = userSongz.filter((f) => f.songID == track.id);

    const findIntel = userSongz.filter((f) => f.songID == track.id);

    // album.images[0].url
    // name
    // duration_ms
    // popularity
    // external_urls["spotify"]
    return (
      <article
        key={track.id}
        style={{ height: "241.8px !important" }}
        className={`card card--1 sTrack ${
          isFollowing.length > 0 ? "makeItBlack" : ""
        }`}
        // onClick={() => {
        //   window.open(track.external_urls["spotify"], "_blank");
        // }}
      >
        <div
          className="card__info-hover"
          style={{ zIndex: "1", position: "absolute" }}
        >
          <div
            className="coverArt"
            onClick={() => {
              window.open(track.album.images[0].url, "_blank");
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
                {track.duration_ms > 0
                  ? `${new Date(track.duration_ms).getMinutes()}:${new Date(
                      track.duration_ms
                    ).getSeconds()} Minutes`
                  : `Unknown`}
              </span>
            </div>
          </div>
        </div>
        <div
          className="card__img"
          style={{ backgroundImage: `url(${track.album.images[0].url})` }}
        ></div>
        <a className="card_link">
          <div
            className="card__img--hover"
            style={{ backgroundImage: `url(${track.album.images[0].url})` }}
          ></div>
        </a>
        <div
          className="card__info"
          style={isFollowing.length > 0 ? { backgroundColor: "#FFA726" } : {}}
        >
          <span className="card__category">
            {" "}
            {track.name.length > 21
              ? track.name.slice(0, 18) + "..."
              : track.name}
          </span>
          <h3 className="card__title"></h3>
          <span className="card__by">
            Artist:{" "}
            <a className="card__author" title="author">
              {track.artists[0]["name"]}
            </a>
            {/* songAlbumName
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
                "defUser" */}
            {/* <button
                onClick={(e) =>
                  handleFollowSong(e, {
                    userID: loggedUser.id,
                    userName: loggedUser.userName,
                    songReleaseDate: track.album.release_date,
                    songPopularity: track.popularity,
                    songPic: track.album.images[0].url,
                    songName: track.name,
                    songID: track.id,
                    songArtistz: track.album.artists,
                    songAlbumName: track.album.name,
                    songDuration: track.duration_ms
                  })
                }
              >
                Follow mf
              </button> */}
            <br />
            Release Date:{" "}
            <a className="card__author" title="author">
              {track.album.release_date}
            </a>
            {/* CHECKIN' IF THE USER ALREADY FOLLOWIN' */}
            {isFollowing.length > 0 ? (
              //Already following
              <>
                <br />
                <div
                  onClick={(e) => {
                    handleUnfollowSong(e, findIntel[0].id);
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
            ) : (
              //Not following
              <>
                <br />
                <div
                  onClick={(e) =>
                    handleFollowSong(e, {
                      userID: loggedUser.id,
                      userName: loggedUser.userName,
                      songReleaseData: track.album.release_date,
                      songPopularity: track.popularity,
                      songPic: track.album.images[0].url,
                      songName: track.name,
                      songID: track.id,
                      songArtistz: track.album.artists,
                      songAlbumName: track.album.name,
                      songDuration: track.duration_ms,
                    })
                  }
                >
                  <svg
                    style={{
                      marginTop: "4px",
                      color: "#C88413",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-star"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                  </svg>
                  <span style={{ marginLeft: "2px" }}>Follow</span>
                </div>
              </>
            )}
          </span>
        </div>
      </article>
    );
  });

  //? Render Tracks (iFrame)
  let toRenderTracksIFrame = tracks.map((track) => {
    return (
      <article
        key={track.id + "track"}
        className="card card--1"
        // onClick={() => {
        //   window.open(artist.external_urls["spotify"], "_blank");
        // }}
      >
        <Spotify wide link={track.external_urls["spotify"]} />
      </article>
    );
  });

  //? Render Artists
  let toRenderArtists = artists.map((artist) => {
    let isFollowing = userArtistz.filter((f) => f.artistID == artist.id);

    //Get the id of the collection
    let findIntel = userArtistz.filter((f) => f.artistID == artist.id);

    let adjustGenrez = "";
    if (artist.genres.length > 0) {
      for (let f = 0; f < artist.genres.length; f++) {
        adjustGenrez += artist.genres[f] + " ";
      }
    } else {
      adjustGenrez = "Unknown";
    }

    return (
      <article
        key={artist.id}
        className="card card--1"
        style={{ width: "251px !important", height: "383px !important" }}
        // onClick={() => {
        //   window.open(artist.external_urls["spotify"], "_blank");
        // }}
      >
        <div
          className="card__info-hover"
          style={{ zIndex: "1", position: "absolute" }}
        >
          <div
            className="coverArt"
            onClick={() => {
              window.open(artist.images[0].url, "_blank");
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
                className="bi bi-person-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
              <span className="coverArt">
                {artist.followers["total"] > 0
                  ? artist.followers["total"].toLocaleString("de-DE")
                  : 0}
                &nbsp;Followers
              </span>
            </div>
          </div>
        </div>
        <div
          className="card__img"
          style={{
            backgroundImage: `url(${
              artist.images[0] != undefined
                ? artist.images[0].url
                : defArtistPic
            })`,
          }}
        ></div>
        <a className="card_link">
          <div
            className="card__img--hover"
            style={{
              backgroundImage: `url(${
                artist.images[0] != undefined
                  ? artist.images[0].url
                  : defArtistPic
              })`,
            }}
          ></div>
        </a>
        {/* Toggle if following */}
        <div
          className="card__info"
          style={isFollowing.length > 0 ? { backgroundColor: "#FFA726" } : {}}
        >
          <span className="card__category">
            {" "}
            {artist.name.length > 21
              ? artist.name.slice(0, 18) + "..."
              : artist.name}
          </span>
          <h3 className="card__title"></h3>
          <span className="card__by">
            Genres:{" "}
            <a className="card__author" title="author">
              {artist.genres.length > 0
                ? adjustGenrez.length > 20
                  ? adjustGenrez.slice(0, 17) + "..."
                  : adjustGenrez
                : "Unknown"}
            </a>
          </span>
          <br />
          <span className="card__by">
            Popularity:{" "}
            <a className="card__author" title="author">
              {`${artist.popularity}/ 100`}
            </a>
            {/* CHECKIN' IF THE USER ALREADY FOLLOWIN' */}
            {isFollowing.length > 0 ? (
              //Already following
              <>
                <br />
                <div
                  onClick={(e) => {
                    console.log("User requested to unfollow the artist:");
                    console.log(findIntel);
                    console.log(artist);
                    handleUnfollowArtist(e, findIntel[0].id);
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
            ) : (
              //Not following
              <>
                <br />
                <div
                  onClick={(e) =>
                    handleFollowArtist(e, {
                      userID: loggedUser.id,
                      userName: loggedUser.userName,
                      artistID: artist.id,
                      artistName: artist.name,
                      artistPic: artist.images[0].url,
                      artistPopularity: artist.popularity,
                      artistSpotifyLink: artist.external_urls["spotify"],
                      artistGenrez: artist.genres,
                      artistFollowerCount: artist.followers["total"],
                    })
                  }
                >
                  <svg
                    style={{
                      marginTop: "4px",
                      color: "#C88413",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-star"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                  </svg>
                  <span style={{ marginLeft: "2px" }}>Follow</span>
                </div>
              </>
            )}
          </span>
        </div>
      </article>
    );
  });

  //? Render Playlists
  let toRenderPlaylists = playlists.map((playlist) => {
    let isFollowing = userPlaylistz.filter((f) => f.playlistID == playlist.id);

    let findIntel = userPlaylistz.filter((f) => f.playlistID == playlist.id);

    // description
    // images
    // name
    // owner.display_name
    // tracks.total
    return (
      <article
        key={playlist.id}
        className="card card--1"
        // onClick={() => {
        //   window.open(playlist.external_urls["spotify"], "_blank");
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
                playlist.images[0].url != undefined
                  ? playlist.images[0].url
                  : defPlaylistPic,
                "_blank"
              );
              console.log(playlist.images[0].url);
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
                {playlist.tracks.total > 0 ? playlist.tracks.total : 0}
                &nbsp;Total Tracks
              </span>
            </div>
          </div>
        </div>
        <div
          className="card__img"
          style={{
            backgroundImage: `url(${
              playlist.images[0].url != undefined
                ? playlist.images[0].url
                : defPlaylistPic
            })`,
          }}
        ></div>
        <a href="#" className="card_link">
          <div
            className="card__img--hover"
            style={{
              backgroundImage: `url(${playlist.images[0].url})`,
              padding: "16px",
            }}
          ></div>
        </a>
        <div
          className="card__info"
          style={isFollowing.length > 0 ? { backgroundColor: "#FFA726" } : {}}
        >
          <span className="card__category">
            {" "}
            {playlist.name.length > 25
              ? playlist.name.slice(0, 25) + "..."
              : playlist.name}
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
            {playlist.description.length > 0
              ? playlist.description.length > 45
                ? playlist.description.slice(0, 35) + ".."
                : playlist.description
              : "Not provided."}
          </span>
          <br />
          <h3 className="card__title">
            Tracks:
            <span style={{ color: "#AD7D52", marginLeft: "3px" }}>
              {playlist.tracks.total > 0 ? playlist.tracks.total : 0}
            </span>
          </h3>
          <span className="card__by">
            Owner:{" "}
            <a href="#" className="card__author" title="author">
              {playlist.owner.display_name}
            </a>
          </span>
          <span className="card__by">
            {/* CHECKIN' IF THE USER ALREADY FOLLOWIN' */}
            {isFollowing.length > 0 ? (
              //Already following
              <>
                <br />
                <div
                  onClick={(e) => {
                    handleUnfollowPlaylist(e, findIntel[0].id);
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
            ) : (
              //Not following
              <>
                <br />
                <div
                  onClick={(e) =>
                    handleFollowPlaylist(e, {
                      userID: loggedUser.id,
                      userName: loggedUser.userName,
                      playlistID: playlist.id,
                      playlistName: playlist.name,
                      playlistDescription: playlist.description,
                      playlistOwner: playlist.owner["display_name"],
                      playlistPic: playlist.images[0].url,
                      playlistTrackCount: playlist.tracks.total,
                      playlistUrl: playlist.external_urls["spotify"],
                    })
                  }
                >
                  <svg
                    style={{
                      marginTop: "4px",
                      color: "#C88413",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-star"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                  </svg>
                  <span style={{ marginLeft: "2px" }}>Follow</span>
                </div>
              </>
            )}
          </span>

          <br />

          {/* playlistDescription
              "defDescription"

              playlistOwner
              "defOwner"

              playlistPic
              "defPic"

              playlistTrackCount
              "333"

              playlistUrl
              "defUrl"

              userID
              "444"

              userName
              "defUser" */}
        </div>
      </article>
    );
  });

  //? Render Playlists (iFrame)
  let toRenderPlaylistIFrame = playlists.map((playlist) => {
    return (
      <article
        key={playlist.id + "playlist"}
        style={{ width: "466px !important", height: "440px !important" }}
        className="card card--1 sPlaylist"
        // onClick={() => {
        //   window.open(artist.external_urls["spotify"], "_blank");
        // }}
      >
        <Spotify
          link={playlist.external_urls["spotify"]}
          style={{ width: "444px", height: "420px" }}
        />
      </article>
    );
  });

  return (
    <>
      <div className="loading--container">
        <div className="loading--loading-bar">
          <div className="loading--loading-bar--progress">
            <span className="loading--first"></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span className="loading--last"></span>
          </div>
        </div>
      </div>
      {fromPage == "Login"
        ? setTimeout(() => {
            document
              .querySelector(".loading--container")
              .classList.add("loading--hide");
            document
              .querySelector(".loading--after")
              .classList.add("visibilityHidden", "visibilityVisible");
          }, 3000)
        : setTimeout(() => {
            document
              .querySelector(".loading--container")
              .classList.add("loading--hide");
            document
              .querySelector(".loading--after")
              .classList.add("visibilityHidden", "visibilityVisible");
          }, 0)}
      {/* PROFILE SEGMENT HERE */}

      {isProfile && (
        <ProfileV2
          loggedUser={loggedUser}
          user={loggedUser}
          toggleProfile={setIsProfile}
        />
      )}

      <div className="loading--after visibilityHidden">
        {/* Profile popUp */}

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
              className="bi bi-spotify"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" />
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
              className="bi bi-person-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            </svg>
          </a>
          &nbsp;|&nbsp;
          <a onClick={(e) => handlePaging(e, "Followin' Songs")}>
            Your Tracks&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-music-note"
              viewBox="0 0 16 16"
            >
              <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
              <path fillRule="evenodd" d="M9 3v10H8V3h1z" />
              <path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z" />
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
              className="bi bi-music-note-list"
              viewBox="0 0 16 16"
            >
              <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
              <path fillRule="evenodd" d="M12 3v10h-1V3h1z" />
              <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z" />
              <path
                fillRule="evenodd"
                d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"
              />
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
        <h2 className="user--header" style={{ marginTop: "-30px" }}>
          Welcome {loggedUser.userName}
        </h2>
        <div className="searchForm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              let inpValue = document.querySelector("#artistName").value;
              handleSpotifySearch(e, inpValue);
            }}
          >
            <input
              type="text"
              name="artistName"
              id="artistName"
              className="searchBox"
              placeholder="Artist/ Song/ Playlist"
            />

            {/* <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Search for artists</label>
          </div> */}
          </form>
        </div>

        {toRenderTracks.length > 0 && (
          <>
            <h2 className="sHeader">— Tracks —</h2>
            <section className="cards">{toRenderTracksIFrame}</section>
            <section className="cards">{toRenderTracks}</section>
          </>
        )}
        {toRenderArtists.length > 0 && (
          <>
            <h2 className="sHeader">— Artists —</h2>
            <section className="cards">{toRenderArtists}</section>
          </>
        )}
        {toRenderPlaylists.length > 0 && (
          <>
            <h2 className="sHeader">— Playlists —</h2>
            <section className="cards sPlaylist">
              {toRenderPlaylistIFrame}
            </section>
            <section className="cards">{toRenderPlaylists}</section>
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
          </>
        )}
      </div>
    </>
  );
}

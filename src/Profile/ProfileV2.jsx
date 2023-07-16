import { useEffect, useState } from "react";
import {
  db,
  followingArtistzCollection,
  followingSongzCollection,
  followingPlaylistzCollection,
} from "../Firebase";
import { onSnapshot, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore";

import defPP from "../Profile/Gloria_2.gif";

export default function ProfileV2(props) {
  const { loggedUser, toggleProfile } = props;

  //User' s collections
  const [userSongz, setUserSongz] = useState([]);
  const [userArtistz, setUserArtistz] = useState([]);
  const [userPlaylistz, setUserPlaylistz] = useState([]);

  useEffect(() => {
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

  return (
    <>
      {/* <h2>Somethings...</h2>
      User: {loggedUser.userName}
      Songz: {userFollowCountz.folowingSongz}
      Artists: {userFollowCountz.followingArtistz}
      Playlist: {userFollowCountz.followingPlaylistz} */}
      <div
        onClick={(e) => {
          toggleProfile((prev) => !prev);
        }}
        className="profileContainer"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.01)",
          width: "1890px",
          height: "1060px",
          position: "absolute",
          zIndex: "2",
          marginLeft: "10px",
        }}
      >
        <div
          className="frame"
          style={{
            position: "absolute",
            top: "234px",
            left: "690px",
            margin: "auto",
            zIndex: "1",
            borderRadius: "12px",
          }}
        >
          <div
            className="center"
            style={{
              borderRadius: "12px",
            }}
          >
            <div className="profile">
              <div className="image">
                <div className="circle-1"></div>
                <div className="circle-2"></div>
                <img
                  src={defPP}
                  width="175"
                  height="175"
                  alt={loggedUser.userName}
                />
              </div>
              <div className="name">{loggedUser.userName}</div>
              <div className="job">_プロジェクト</div>

              <div className="actions">
                <button className="btn">Logout</button>
                <button className="btn">Message</button>
              </div>
            </div>

            <div className="stats">
              <div className="box">
                <span className="value">{userArtistz.length}</span>
                <span className="parameter">Following Artists</span>
              </div>
              <div className="box">
                <span className="value">{userSongz.length}</span>
                <span className="parameter">Following Songs</span>
              </div>
              <div className="box">
                <span className="value">{userPlaylistz.length}</span>
                <span className="parameter">Following Playlists</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

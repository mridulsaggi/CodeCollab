import React, { useEffect, useRef, useState } from "react";
import Clients from "./Clients";
import Editor2 from "./Editor.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { initSocket } from "../socket";
import ACTIONS from "../ActionsList";
const Room = () => {
  const [clients, setclients] = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomid } = useParams();
  const [language, setLanguage] = useState("javascript");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        navigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomid,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setclients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setclients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyroomid() {
    try {
      await navigator.clipboard.writeText(roomid);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }
  function leaveroom() {
    navigate("/");
  }
  return (
    <>
      <div className="editorpage min-h-screen grid grid-cols-[13rem,1fr]">
        <div className="relative sidebar bg-slate-400 ">
          <h1 className="font-bold text-[black] text-center text-2xl my-[1rem]">
            Connected users
          </h1>
          <div className="grid grid-cols-2">
            {clients.map((elem) => (
              <Clients key={elem.id} username={elem.username} />
            ))}
          </div>
          <div className="w-[100%] absolute bottom-[2rem] flex items-center flex-col justify-between">
            <button
              className="h-[3rem] w-[10rem] rounded-lg bg-[red] font-bold"
              onClick={leaveroom}
            >
              Leave Room
            </button>
            <button
              className="h-[3rem] w-[10rem] rounded-lg my-[1rem] bg-[#4aed88] font-bold"
              onClick={copyroomid}
            >
              Copy Room id
            </button>
          </div>
        </div>
        <div className="editor bg-slate-800 p-[2rem]">           
          {/* <Editorcontainer /> */}
          <Editor2
            socketRef={socketRef}
            roomid={roomid}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Room;

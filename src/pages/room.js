import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidfunction } from "uuid";
const Joinform = () => {
  const [roomid, setroomid] = useState("");
  const [username, setusername] = useState("");
  const navigate = useNavigate();

  const createroom = (e) => {
    e.preventDefault();
    const uid = uuidfunction();
    setroomid(uid);
    toast.success("created new room");
  }
  const keyhandler=(e)=>{
    if(e.code==='Enter') joinroom();
  }
  const joinroom = () => {
    if (!username || !roomid) {
      toast.error("Username and roomid required");
      return;
    }
    console.log("join room called");
    toast.success("Joined room successfully:)")
    navigate(`/editor/${roomid}`, {
      state: { username },
    });
  };

  return (
    <>
      <div className="formwrapper flex min-h-screen w-full items-center justify-center">
        <form
          className="text-black font-bold relative form flex flex-col bg-[#34255d] w-[40%] h-[15rem] items-center justify-center"
          onSubmit={joinroom}
        >
          <input
            className="w-[70%] my-[1rem] h-[2rem] rounded-md "
            value={roomid}
            onChange={(e) => setroomid(e.target.value)}
            type="text"
            onKeyUp={keyhandler}
            placeholder="ENTER ROOM ID :)"
          />
          <input
            className="w-[70%] my-[1rem] h-[2rem] rounded-md "
            value={username}
            onKeyUp={keyhandler}
            onChange={(e) => setusername(e.target.value)}
            type="text"
            placeholder="ENTER USERNAME :)"
          />
          <button className=" bg-[#4aed88] h-[2rem] mb-[1rem] mr-[2rem] text-center w-[5rem] ml-auto">
            JOIN
          </button>
          <p className="absolute bottom-2 text-bold">
            Do not have room id? Create{" "}
            <span className="text-white cursor-pointer" onClick={createroom}>
              New room
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Joinform;

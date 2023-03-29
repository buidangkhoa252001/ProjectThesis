import React, { useContext, useEffect } from "react";
import { FcEndCall } from "react-icons/fc";
import { BsChatDots,BsPeople,BsCameraVideo,BsCameraVideoOff,BsMic,BsMicMute} from "react-icons/bs";
import { FiShare } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import VideoPlay from "../components/VideoPlay";
import { RoomContext } from "../context/RoomContext";

export default function Meeting() {
  const {id} = useParams()
  const {socket} = useSelector(state=>state.socket)
  const {peer} = useSelector(state=>state.peer)
      const { stream,peers,shareScreen } = useContext(RoomContext);
  const enterRoom = ({roomId})=>{
    console.log({roomId})
  }
 
  return <div className="  border-[2px] border-gray-400  h-[570px] ">
        <div className=" border-gray-400 w-[100%] h-[60px]">
         <div className="mb-1 px-4  flex flex-row justify-between bg-slate-300 border-gray-400  border-b-[2px] cursor-pointer w-[100%]">
            <div className="flex">
                      <div className="w-[46px] h-[46px]" >
                      <img className=" w-[100%] h-[100%] rounded-[50%]" src="https://res.cloudinary.com/khoa252001/image/upload/v1668777257/socialmedia/duck_orrdvy.jpg" />
                  </div>   
                  <div className="ml-3 flex justify-start items-start flex-col">
                      <div className="font-medium text-blue-400">Meeting</div>
                      <div className="font-medium text-blue-400">welcome</div>
                  </div>
            </div>
            <div className="flex">
                 <div className="flex flex-col px-4 justify-center items-center ">
                   <BsChatDots className="text-2xl mr-1"/> 
                    <div className="text-sm">
                     Chat
                    </div>   
                </div>
                 <div className="flex flex-col px-4 justify-center items-center ">
                   <BsPeople className="text-2xl mr-1"/> 
                    <div className="text-sm">
                     People
                    </div>   
                </div>
                 <div className="flex flex-col px-4 justify-center items-center ">
                   <BsCameraVideo className="text-2xl mr-1"/> 
                    <div className="text-sm">
                     Camera
                    </div>   
                </div>
             
                 <div className="flex flex-col px-4 justify-center items-center ">
                   <BsMic className="text-2xl mr-1"/> 
                    <div className="text-sm">
                     Mic
                    </div>   
                </div>
                 <div className="flex flex-col px-4 justify-center items-center " onClick={shareScreen}>
                   <FiShare className="text-2xl mr-1"/> 
                    <div className="text-sm">
                     Share
                    </div>   
                </div>
            </div>
            <div className="flex justify-center items-center ">
              <button className="px-4 py-2 lex justify-center items-center bg-red-600 text-white text-sm font-bold rounded-[8%] flex"> 
              <FcEndCall className="text-2xl mr-1"/> 
               Leave
              </button>
            </div>
          </div>
        </div>
        <div className=" h-[calc(100%-60px)]">

          <div className="  h-[100%] ">
            <div className="grid grid-cols-3 gap-3">
              <VideoPlay stream={stream}  />
              {Object.values(peers).map(peer1=>(
                  <VideoPlay stream={peer1?.stream}  />
              ))}

            </div>
          </div>
        </div>
    </div>;
}

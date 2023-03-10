import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  useParams } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import MsgDisplay from "./MsgDisplay";
import { addMessages, getMessages } from "../api/messageAPI";
export default function RightSide() {
    const { auth, message, socket } = useSelector(state => state)
  const { id } = useParams()
  const dispatch = useDispatch()
  const [user, setUser] = useState([])
  const [text, setText] = useState('')
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(1)
  const [isLoadMore, setIsLoadMore] = useState(0)
    const [data, setData] = useState([])
   const refDisplay = useRef()
    const pageEnd = useRef()
 
  const handleSubmit = (e)=>{
    e.preventDefault()
      if (!text.trim()) return;

      setText('')
      let newArr = [];
      const msg = {
          conversation:id,
          sender: auth?.user?._id,
          text,
          media: newArr,
          createdAt: new Date().toISOString()
      }
    

      addMessages(msg,auth,socket,dispatch)
     /*  if (refDisplay.current) {
          refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      } */
  
  }
    useEffect(() => {
        const getMessagesData = async () => {
            if (message?.data?.every(item => item?._id !== id)) {
               
               await getMessages( auth, id,page,dispatch )
           /*      setTimeout(() => {
                    refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
                }, 50) */
        }
    }
        getMessagesData()
    }, [id, dispatch, auth, message.data])
   
    useEffect(() => {
        if (id && message.users.length > 0) {
           
            const newUser = message?.users?.find(user => user._id === id)
            if (newUser) setUser(newUser)
            console.log(newUser)
        }
    }, [message.users, id])
    useEffect(() => {
        const newData = message?.data?.find(item => item._id === id)
      
       /*  console.log(newData) */
        if (newData) {
            setData(newData.messages)
            setResult(newData.result)
            setPage(newData.page)
       
         } 
    }, [message.data, id])
    
   /*  useEffect(() => {
        console.log(refDisplay)
        console.log(pageEnd)

    }, [refDisplay, pageEnd])
    useEffect(() => {
        if (id && message.users.length > 0) {
            setTimeout(() => {
                refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }, 50)

            const newUser = message.users.find(user => user._id === id)
            if (newUser) setUser(newUser)
        }
    }, [message.users, id])
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsLoadMore(p => p + 1)
            }
        }, {
            threshold: 0.1
        })
        console.log(observer)
        observer.observe(pageEnd.current)
    }, [setIsLoadMore]) */
 /*    useEffect(() => {
        if (isLoadMore > 1) {
            if (result >= page * 9) {
                dispatch(loadMoreMessages({ auth, id, page: page + 1 }))
                setIsLoadMore(1)
            }
        }
       
    }, [isLoadMore]) */
  return <div className="flex flex-col h-[100%] ">
        <div className="py-1 px-4  flex flex-row justify-between bg-slate-300 border-gray-400  border-b-[2px] cursor-pointer w-[100%]">
       
           <div className="flex">
                    <div className="w-[46px] h-[46px]" >
                    <img className=" w-[100%] h-[100%] rounded-[50%]" src="https://res.cloudinary.com/khoa252001/image/upload/v1668777257/socialmedia/duck_orrdvy.jpg" />
                </div>   
                <div className="ml-3 flex justify-start items-start flex-col">
                    <div className="font-medium text-blue-400">Meeting</div>
                    <div className="font-medium text-blue-400">welcome</div>
                </div>
           </div>
           <div className="flex justify-center items-center">
            <button className="px-2 py-2 bg-gray-700 text-white text-sm rounded-[8%]"> 
              Join with us
            </button>
           </div>
        </div>
      <div className=" h-[100%] flex justify-end flex-col " ref={refDisplay}>
{/* grid grid-rows-6  row-span-5 row-span-1 */}
  
     
              <button style={{ marginTop: '-25px' }} ref={pageEnd}>
                  Load more
              </button>
        <div className=" h-[82%] flex flex-col  justify-end">
              <div className="flex justify-start">

       
            </div>
              {
                  data.map((msg, index) => (
                      <div key={index}>
                          {
                              msg?.sender?._id !== auth?.user._id &&
                              <div className="flex justify-start ml-2">
                                      <MsgDisplay sender={msg.sender} msg={msg} />
                                </div>
                          }

                          {
                              msg?.sender._id  === auth?.user._id &&
                               <div className="flex justify-end ">
                                      <MsgDisplay user={auth.user} msg={msg} sender="true" data={data} />
                                </div>
                          }
                      </div>
                  ))
              }
         </div>
        <div className=" h-[8%]">
           <form className="relative   border-gray-400  border-t-[2px]" onSubmit={handleSubmit}  >
                <input type="text" placeholder="Enter you message..."
                value={text} onChange={e => setText(e.target.value)}  className="w-[90%] border-none outline-none py-1 px-6 text-black"
                />

             {/*    <Icons setContent={setText} content={text} theme={theme} />

                <div className="file_upload">
                    <i className="fas fa-image text-danger" />
                    <input type="file" name="file" id="file"
                    multiple accept="image/*,video/*" onChange={handleChangeMedia} />
                </div> */}

                <button type="submit" className="absolute px-1 right-[-2px] top-[10px] cursor-pointer " 
                /* disabled={text > 0 ? true : false}  */>
                    <AiOutlineSend className="text-xl"/>
                </button>
            </form>
        </div>
        </div>
     </div>;
}

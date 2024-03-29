import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
/* import "node_modules/flag-icons/css/flag-icons.min.css"; */
import axios from '../../axios'
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../api/authAPI";
import { BiLogOut} from "react-icons/bi";
import { AiOutlineMenu, AiOutlineBell } from "react-icons/ai";
import NotifyModal from "../Modal/NotifyModal";
import { SearchBar } from "../Search/SearchBar";
import { SearchResultsList } from "../Search/SearchResultsList";
import Delayed from "../../hooks/DeplayShow";
import vn from "../../assets/img/vn.svg"
import usa from "../../assets/img/usa.svg"
import i18n from "i18next";
import {  Select } from "antd";

const languages = [

  {
    code: 'en',
    name: 'English',
    country_code: 'gb',
  },
  {
    code: 'vi',
    name: 'VietName',
    country_code: 'vi',
  }

]

export default function HeaderAdmin({setOpened ,opened,openedMobile,setOpenedMobile}) {
  
  const { Option } = Select;
    const [searchUsers, setSearchUsers] = useState([])
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const [avatar,setAvatar] = useState('')
    const navigate = useNavigate();
    const [isLogin,setIsLogin] = useState(false)
  const [input, setInput] = useState("");
  const {user} = useSelector(state => state.auth)
  const {notify} = useSelector(state => state)
  const [results, setResults] = useState([]);
  useEffect(()=>{

   
    setAvatar(user.avatar)

  },[user])
  useEffect(()=>{
    if(!user){
      setTimeout(()=>{

        setIsLogin(false)
      },2000)
    }
    else if(user){
      setTimeout(()=>{

      
        setIsLogin(true)
      },2000)
    }
  },[user])
    // Function
      
    const handleClick = e =>{
       e.preventDefault()
       setOpen(!open)
    }
    const handleLogout = e =>{
        e.preventDefault()
        Logout(dispatch)
        console.log("logout")
       setOpen(false)
     

    }
    function handleChange(value) {
      console.log(value); // { key: "lucy", label: "Lucy (101)" }
      i18n.changeLanguage(value.key);
  
  
    }
  return (
    
        <div className=" bg-white z-[20] grid grid-cols-9 px-2 py-1 w-[100%]  border-b-[1px] border-black ">
                <div className="col-span-2 flex justify-start items-center">
                  <div    type="button" onClick={() => setOpened(!opened)} >

                  <AiOutlineMenu className="hidden sm:block w-[30px] h-[30px] cursor-pointer mr-6 ml-2"   />
                  </div>
                  <div    type="button" onClick={() => setOpenedMobile(!openedMobile)} >

                  <AiOutlineMenu className="sm:hidden w-[30px] h-[30px] cursor-pointer mr-6 ml-2 "   />
                  </div>
                {/*   <Link to="/home" className="logo hidden sm:block m-w-[130px]">
                      <img className="text-white text-2xl " src="https://socialite-template.netlify.app/assets/images/logo.png"
                      onClick={() => window.scrollTo({top: 0})}>
                        
                      </img>
                  </Link> */}

                </div>
                <div className="col-span-5" >
              
      
     
        {/*  */}
                </div>
        
    
                <div className="col-span-2  flex justify-center items-center  relative">
        <div className="flex-row flex items-center">
             {/*  <Select
          labelInValue
          defaultValue={{ key: 'en' }}
          className="ml-[6px] text-sm rounded-lg  items-center hidden sm:flex"
          style={{
            width: 61,
          
          
          }}    
          onChange={handleChange}
        >
          <Option value="en" ><img src={usa} alt="usa" className="w-[30px] h-[30px]" /></Option>
          <Option value="vi"><img src={vn} alt="vn" className="w-[30px] h-[30px]" /></Option>
        </Select> */}
                        {/*  */}
                           <div className="nav-item dropdown" style={{opacity: 1}} >
                    <span className="nav-link position-relative" id="navbarDropdown" 
                    role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                      {/*   <span className="material-icons" 
                        style={{color: notify?.data.length > 0 ? 'crimson' : ''}}>
                            favorite
                        </span> */}
            {
                avatar ?
              <AiOutlineBell className={`${notify?.data.length > 0 ? 'text-red-900 fill-red-900 ' : ''
                }  w-[25px] h-[25px]   cursor-pointer`} >
                    </AiOutlineBell>
                :<></>
            }
              {/*   <span className="text-red-700 absolute top-0 right-[16px]">{notify?.data.length}</span> */}
                      

                    </span>
          
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown"
                    style={{transform: 'translateX(75px)'}}>
                        <NotifyModal />
                    </div>
                        
                </div> 
          
                  {
                   isLogin && avatar ?
                   <Delayed>

                    <div className=" flex justify-end w-[40px] h-[40px]  ">
                        <img src={avatar} className=" w-[100%] h-[100%] rounded-[50%]" onClick={handleClick}/>
                    </div>
                   </Delayed>
                  
                    : 
                    <Delayed>

                    <div className="flex justify-center items-center">
                    <Link to="/login" className="font-semibold text-black mr-3">
                        Đăng nhập
                     </Link>
                    <Link to="/login" className="font-semibold text-black">
                        Đăng Ký
                     </Link>
                  </div>
              </Delayed>
                  }
                  
                 
                  
                    </div>
                    {
                      open?
                      <div className=" w-[150px] h-[120px]  absolute top-[102%] right-[0%] rounded-md flex flex-col "  >
              <div id="dropdownAvatar" className="z-10 w-[100px] bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700 dark:divide-gray-600">
               {/*  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div className="font-bold text-lg text-gray-700 only:bg-gray-100 truncate">{user.fullname}</div>
                  <div className="font-medium text-gray-700 only:bg-gray-100 truncate">{user.username}</div>
                </div> */}
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
               
                  <li>
                    <Link to={`/profile/${user._id}`} className="block pl-4  py-2  text-gray-700 only:bg-gray-100">Profile</Link>
                  </li>
          
                </ul>
                <div className="py-2">
                  <button onClick={handleLogout} className="block pl-4  py-2 text-sm text-gray-700 only:bg-gray-100 ">Sign out</button>
                </div>
              </div>
                        </div> 
                      :<></>
                    }
                </div>
                  
        </div>
    )
}

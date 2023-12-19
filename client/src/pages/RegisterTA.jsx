import React, { useEffect, useMemo, useRef, useState } from "react";
import { DatePicker, Space,Select,Spin } from 'antd';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import axios from '../axios';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useClipboard } from "@mantine/hooks";
import { Button, Text } from "@mantine/core";
import { showNotification } from "../utils/helper";
import { useGetUserData } from "../hooks/getUserTa";

export default function RegisterTA() {
     const clipboard = useClipboard({ timeout: 1000 });
       const { auth} = useSelector(state => state)
       
       const {id} = useParams()
     const [informationTA, setInformationTA] = useState({});
     const [loading, setLoading] = useState(false);
     const [information, setInformation] = useState({
          fullName:"",
          gpaTotal:"",
          gpaSubject:"",
          studentId:"",
     });

     const navigate = useNavigate();
   /*   const {isLoading,data,error,isError} = useGetUserData(id,auth.accesstoken) */
   
     
     const handleForm = (e) => {
          e.preventDefault();
          const { name, value } = e.target;
          setInformation({ ...information, [name]: value });

     };
  
  

     const handleSubmit = async(e)=>{
        
           e.preventDefault();
          try{
               console.log(information)
               console.log({
                    ...informationTA, fullName: information.fullName, gpaSubject: information.gpaSubject,
                    gpaTotal: information.gpaTotal, studentId: information.studentId
})
                                                                                                                                                           
   
               const response = await axios.post(`/api/apply-taSchedule/${id}`, {
                    ...informationTA, fullName: information.fullName, gpaSubject: information.gpaSubject,
                    gpaTotal: information.gpaTotal, studentId: information.studentId
               },{
          headers: { Authorization: auth.accesstoken },
          })
          console.log(response)
          showNotification('success',"register form success")
               navigate(`/home`);
          }
          catch(err){
               console.log(err)
          }
     }
   
     useEffect(()=>{
               const getINF = async () => {
                    try {

                         const res = await axios.get(`/api/taSchedule/${id}`, {
                              headers: { Authorization: auth.accesstoken },
                         })
                        
                         console.log(res.data[0])
                         console.log(res.data[0].creator.fullname)
                         console.log(res.data[0].subject.subjectName)
                         setInformationTA(res.data[0])
                         
                    } catch (err) {
                         console.log(err)
                         setLoading(true)
                    }
                      
                  
               }
          if (auth.accesstoken) {
               getINF()
          }
     }, [id, auth.accesstoken])
     if(loading) return(
     <div className="flex justify-center items-center h-[80vh]">
          <Text size={40} fw={600}>Form is closed or does not exist</Text>

     </div>)
  
  return(
   
  
   <div className="flex flex-col ">
       <div>
            <div className=" relative">
                 <div className=" relative ">
                      <div className="flex justify-start  border-b-2  pl-4 pb-3 pt-3">
                           <div className="text-xl font-bold mb-1 lg:text-2xl mt-2 mr-4">
                                Apply become T.A
                           </div>
                           <div className="text-xl font-bold mb-1 lg:text-2xl mt-2">
                           <Button
                                   variant="outline" color="red" radius="md" size="md"
                                   onClick={() => clipboard.copy(`http://localhost:3000/registerTA/${id}`)}
                              >
                                   {clipboard.copied ? 'Copied' : 'Copy Link'}
                              </Button>
                           </div>
                          
                      </div>
                      <form className="  my-4  " onSubmit={handleSubmit}>
                           <div className="  justify-items-start mx-3 ">

                                     <div className="flex mb-6 sm:py-1 flex-row   w-[100%]">
                                          <div className="flex items-center   justify-start w-[140px]">
                                               <label className=" mr-3  font-semibold lg:text-lg text-base">
                                                   Teacher:
                                               </label>
                                          </div>
                                          <div className="flex  w-[70%]">
                                            
                                              <div className=" mr-2  font-semibold lg:text-lg text-base">
                                               {informationTA?.creator?.fullname}
                                               </div>
                                          </div>
                                     </div>
                                     <div className="flex mb-6 sm:py-1 flex-row   w-[100%]">
                                          <div className="flex items-center   justify-start w-[140px]">
                                               <label className=" mr-3  font-semibold lg:text-lg text-base">
                                                   SubjectName:
                                               </label>
                                          </div>
                                          <div className="flex  w-[70%]">
                                            
                                              <div className=" mr-2  font-semibold lg:text-lg text-base">
                                               {informationTA?.subject?.subjectName}
                                               </div>
                                          </div>
                                     </div>
                                     <div className="flex mb-6 sm:py-1 flex-row   w-[100%]">
                                          <div className="flex items-center   justify-start w-[140px]">
                                               <label className=" mr-3  font-semibold lg:text-lg text-base">
                                                   Requirement:
                                               </label>
                                          </div>
                                          <div className="flex  w-[70%]">
                                            
                                              <div className=" mr-2  font-semibold lg:text-lg text-base">
                                               {informationTA?.requirement}
                                               </div>
                                          </div>
                                     </div>
                                     <div className="flex mb-6 sm:py-1 flex-row   w-[100%]">
                                          <div className="flex items-center   justify-start w-[140px]">
                                               <label className=" mr-3  font-semibold lg:text-lg text-base">
                                                    StudentId:
                                               </label>
                                          </div>
                                          <div className="flex  w-[70%]">
                                               <input
                                                    className="outline-none border-[1px] sm:px-2 rounded-md py-[6px] px-1 border-gray-200 text-base  w-[100%]  line-clamp-1"
                                                    type="text"
                                                    name="studentId"
                                                    onChange={handleForm}
                                                    defaultValue={information?.studentId}
                                               />
                                          </div>
                                     </div>
                                     <div className="flex mb-6 sm:py-1 flex-row  w-[100%]">
                                          <div className="flex items-center   justify-start w-[140px]">
                                                <label className=" mr-3  font-semibold  lg:text-lg text-base">
                                                    GpaTotal:
                                               </label>
                                          </div>
                                          <div className="flex  w-[70%]">
                                               <input
                                                    className="outline-none border-[1px] sm:px-2 rounded-md py-[6px] px-1 border-gray-200 text-base  w-[100%]  line-clamp-1"
                                                    type="text"
                                                    name="gpaTotal"
                                                    onChange={handleForm}
                                                    defaultValue={information?.gpaTotal}
                                               />
                                          </div>
                                     </div>
                                     <div className="flex mb-6 sm:py-1 flex-row  w-[100%]">
                                          <div className="flex items-center   justify-start w-[140px]">
                                                <label className=" mr-3  font-semibold  lg:text-lg text-base">
                                                    GpaSubject:
                                               </label>
                                          </div>
                                          <div className="flex  w-[70%]">
                                               <input
                                                    className="outline-none border-[1px] sm:px-2 rounded-md py-[6px] px-1 border-gray-200 text-base  w-[100%]  line-clamp-1"
                                                    type="text"
                                                    name="gpaSubject"
                                                    onChange={handleForm}
                                                    defaultValue={information?.gpaSubject}
                                               />
                                          </div>
                                     </div>
                                     <div className="flex mb-6 sm:py-1 flex-row  w-[100%]">
                                          <div className="flex items-center   justify-start w-[140px]">
                                               <label className=" mr-3 font-semibold lg:text-lg text-base">
                                                    FullName:
                                               </label>
                                          </div>
                                          <div className="flex  w-[70%]">
                                               <input
                                                    className="outline-none border-[1px] sm:px-2 rounded-md py-[6px] px-1 border-gray-200 text-base  w-[100%]  line-clamp-1"
                                                    type="text"
                                                    name="fullName"
                                                    onChange={handleForm}
                                                    defaultValue={information?.fullName}
                                               />
                                          </div>
                                     </div>
                                  
                                  
 
                           </div>
                           <div className="flex mb-3 ">
                                <div className="flex items-center w-2/5  justify-end ">
                                     <label className="text-gray-500 mr-3  "></label>
                                </div>
                                <div className="flex ">
                                     <button  className="py-2 px-4 mt-2 mb-4 round-md font-medium bg-red-600  hover:translate-y-[-1px] transition-all text-white rounded-sm" type="submit">
                                          Đăng Ký
                                     </button>
                                </div>
                           </div>
                      </form>
                 </div>
            </div>
       </div>
  </div>

  )
}

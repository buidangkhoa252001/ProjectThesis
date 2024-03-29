import { useState, useMemo, useRef, useEffect } from "react";
import { Form, Input, DatePicker, Button, Select } from "antd";
import {   Spin } from 'antd';
import moment from "moment";
import debounce from 'lodash/debounce';
import axios from "../../../axios";
import { useSelector } from "react-redux";
const { Option } = Select;
const { Item } = Form;





function EditSubject({ onClose, data, refetchData }) {
     const [dataEdit, setDataEdit] = useState({ ...data });
/* console.log(dataEdit) */
     function DebounceSelect({ fetchOptions, debounceTimeout = 500, ...props }) {
          const [fetching, setFetching] = useState(false);
          const [options, setOptions] = useState([]);
          const fetchRef = useRef(0);
          const debounceFetcher = useMemo(() => {
               const loadOptions = (value) => {
         
                    fetchRef.current += 1;
                    const fetchId = fetchRef.current;
                    setOptions([]);
                    setFetching(true);
                    fetchOptions(value).then((newOptions) => {
                       /*   console.log('value')
                         console.log(value)
                         console.log('offip')
                         console.log(newOptions)
 */
                         if (fetchId !== fetchRef.current) {

                              return;
                         }
                         setOptions(newOptions);
                         setFetching(false);
                    });
               };
               return debounce(loadOptions, debounceTimeout);
          }, [fetchOptions, debounceTimeout]);
          return (
               <Select
                    labelInValue
                    defaultValue={value1}
                    filterOption={false}
                    onSearch={debounceFetcher}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    {...props}
                    options={options}
               />
          );
     }
     async function fetchUserList(username) {

       
          return await axios.get(`/api/user/search?username=${username}`)
               .then((response) => response.data)
               .then((data) =>

                    data.users.map((user) => ({
                         label: `${user.fullname}`,
                         value: user._id,
                    }))

               );
     }
     
    
     const [loading, setLoading] = useState(false);
     const [isDisable, setIsDisable] = useState(false);


     const { auth } = useSelector(state => state)
     useEffect(()=>{
         console.log(data.teacher)
         const newArray = data.teacher.map(user => ({
          label: `${user.fullname}`,
          value: user._id,
        }));
        
       
        setValue1(newArray)

    },[])
     const [value, setValue] = useState([]);
     const [value1, setValue1] = useState([]);
   
   
      /*     const gg = dataEdit.teacher.map(user => ({
               label: `${user.fullname}`,
               value: user._id,
          }))
          setOptions(gg); */
 
     const acceptEditCareer = async () => {
          setLoading(true);
        
          try {
               console.log('gg')
               console.log(dataEdit)
               const teacher = value.map(user => ( user.value
               ))
               console.log(value)
                    
               const approve = {
                    subjectName: dataEdit.subjectName,
                    subjectCode: dataEdit.subjectCode,
                    description: dataEdit.description,
                    teacher:teacher,    
                    id:dataEdit._id
               }
               console.log(approve)
               const res = await axios.post(`/api/update-subject`, approve, {
                    headers: { Authorization: auth.accesstoken }
               });

               console.log(res)
               setLoading(false);
               // setIsDisable(false);
               refetchData();
               onClose();
          } catch (error) {
               console.log(error);
          }
     };
     return (
          <>
               <div className="fixed inset-0  bg-slate-600 bg-opacity-50 z-20 flex justify-center items-center">
                    <div className="relative w-[700px] flex flex-col bg-white p-6 gap-y-3 animate-modal_in mx-4 rounded-xl overflow-auto">
                         <div className="flex justify-between items-center gap-y-3">
                              <span className="text-xl uppercase font-bold h-fit">
                                   Edit Subject
                              </span>
                              <Button
                                   size="large"
                                   disabled={isDisable}
                                   className={
                                        !isDisable &&
                                        "hover:bg-red-500 hover:border-red-700 hover:text-white border-none"
                                   }
                                   onClick={onClose}
                              >
                                   x
                              </Button>
                         </div>
                         <Form
                              labelCol={{
                                   span: 6,
                              }}
                              wrapperCol={{
                                   span: 14,
                              }}
                              layout="horizontal"
                              autoComplete="off"
                              initialValues={{
                                   ...dataEdit,
                                   deadline: moment(dataEdit.deadline)
                              }}
                              onFinish={acceptEditCareer}
                         >
                              <Item
                                   label="subjectName"
                                   name="subjectName"

                              >
                                   <Input
                                        value={dataEdit.subjectName}
                                        onChange={(e) =>
                                             setDataEdit({
                                                  ...dataEdit,
                                                  subjectName: e.target.value,
                                             })
                                        }
                                   />
                              </Item>
                              <Item
                                   label="subjectCode"
                                   name="subjectCode"
                                   rules={[
                                        {
                                             required: true,
                                             message: "Vui lòng nhập descrption",
                                        },
                                   ]}
                              >
                                   <Input
                                        value={dataEdit.subjectCode}
                                        onChange={(e) =>
                                             setDataEdit({
                                                  ...dataEdit,
                                                  subjectCode: e.target.value,
                                             })
                                        }
                                   />
                              </Item>
                              <Item
                                   label="Description"
                                   name="description"
                                   rules={[
                                        {
                                             required: true,
                                             message: "Vui lòng nhập descrption",
                                        },
                                   ]}
                              >
                                   <Input
                                        value={dataEdit.description}
                                        onChange={(e) =>
                                             setDataEdit({
                                                  ...dataEdit,
                                                  description: e.target.value,
                                             })
                                        }
                                   />
                              </Item>
                     
                              <Item
                                   label="Teacher"
                                   name="teacher.username"

                              >
                                   <DebounceSelect
                                        itialvalues ={value}
                                        mode="multiple"
                                        value={value}
                                        placeholder="Select users"
                                        fetchOptions={fetchUserList}
                                        onChange={(newValue) => {

                                             setValue(newValue);
                                        }}

                                        style={{
                                             width: '100%',
                                        }}
                                   />
                              </Item>
                            

                         

                              <div className="flex justify-end mt-2 text-sm gap-x-6">
                                   <Button
                                        size="large"
                                        disabled={isDisable}
                                        className={
                                             !isDisable &&
                                             "hover:bg-red-500 hover:border-red-700 hover:text-white rounded-lg"
                                        }
                                        onClick={onClose}
                                   >
                                        Hủy
                                   </Button>
                                   <Button
                                        type="primary"
                                        size="large"
                                        loading={loading}
                                        htmlType="submit"
                                        className="rounded-lg bg-blue-400"
                                   >
                                        Approve
                                   </Button>
                              </div>
                         </Form>
                    </div>
               </div>
          </>
     );
}

export default EditSubject;

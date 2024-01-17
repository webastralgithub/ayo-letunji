import React, { useState } from 'react'
import { FaLock } from 'react-icons/fa'
import "./ForgotPassword.css"
import {Button} from 'react-bootstrap'
import axios from 'axios'

const INITIAL_STATE = {
  
  currentpassword: "",
  password: "",
  password1:"",
  
};
const ForgotPassword = () => {
    const [obj,setObj]=useState(INITIAL_STATE)

  const[err,setErr]=useState('')
  const token =JSON.parse(localStorage.getItem('token'));
  const url=process.env.REACT_APP_API_KEY
let config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}
    const handleChange=(e)=>{
          const object = {};
        object[e.target.name] = e.target.value;
      //  console.log(e.target.value)
       setObj({...obj,...object})

       console.log({...obj,...object})
       setErr('')
     
      }

const submit=()=>{
  if(obj.password!=obj.password1){
    setErr("New Password and confirm new password doesn't match")
    return
  }
  else if (obj.password.length < 8) {
    setErr('Password must be at least 8 chars long');
    return
  }

  const newObj={
    currentpassword:obj.currentpassword,
    password:obj.password
  }
  changepass(newObj)
}
const changepass=async(newObj)=>{
const res=  await axios.post(`${url}/change_password`,newObj,config).then((res) => {
  setObj(INITIAL_STATE)
setErr(res.data.message)
}).catch((error) => {
 
    console.log(error)
      setErr(error.response.data.message)
  })


}

  return (
    <div className='reset-block'>
    {err.length>0 &&<p style={{color:"red"}}>{err}</p>}
    <div className='input-head'>
 
    <label>
    Enter Current Password
    <FaLock /> 
    </label><input
    type="password"
    className='inp'
    name="currentpassword"
    placeholder="Enter current password"
    value={obj.currentpassword}
    onChange={handleChange}
    
  />
  </div>
  <div className='input-head'>
  <label>New Password
  <FaLock /> </label> <input
  type="password"
  className='inp'
  name="password"
  placeholder="Enter new password"
  value={obj.password}
  onChange={handleChange}
  
/>
</div>
<div className='input-head'>
<label>
Confirm-Password
<FaLock />
</label>   <input
type="password"
className='inp'
name="password1"
placeholder="ReEnter new password"
value={obj.password1}
onChange={handleChange}

/>
 
</div>
<div className='submit-btn'>
<Button onClick={submit}>Submit</Button></div>
    </div>
  )
}

export default ForgotPassword
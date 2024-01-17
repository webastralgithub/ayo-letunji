import React, { useState, useLayoutEffect,useRef} from "react";


import Input from "./Input";
import axios from "axios";
import "./Profile.css"
import MiniHeader from "./MiniHeader";
import { Button, Modal } from "react-bootstrap";
import ForgotPassword from "./ForgotPassword";


const INITIAL_STATE = {
  
  name: "",
  email: "",
  phone_number:"",
  image:""
};
export default function Profile() {
  const [user, setUser] = useState(INITIAL_STATE);
 
  
  const[show,setShow]=useState(false)
  const[msg,setMsg]=useState('')
  const [previewImage, setPreviewImage] = useState('');
  const token =JSON.parse(localStorage.getItem('token'));
  const url=process.env.REACT_APP_API_KEY
let config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}

  useLayoutEffect(() => {
    (async () => {
      try {
        const user = await 
          axios.get(`${url}/profile`,config)
     let userData=user.data.user
        setUser({
          name:userData.name,
          email:userData.email,
          phone_number:userData.phone_number,
          image:userData.image
        }
          );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleClose = () => 
  {
    setShow(false);
  }

  const handleInput = (e) => {
    console.log(e.target.name, " : ", e.target.value);




    if(e.target.name == "image"){
      var src = URL.createObjectURL(e.target.files[0]);
      
      setPreviewImage(src);
      setUser({ ...user, [e.target.name]:  e.target.files[0] });
    }
    else
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      var form_data = new FormData();
for ( var key in user ) {
    form_data.append(key, user[key]);
}
    
      const response = await axios.post(`${url}/update_profile`, form_data,config);
      setMsg(response.data.message)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=''>
    <MiniHeader head={user.name} />
    {msg.length>0 &&<p style={{color:"red"}}>{msg}</p>}
      <form onSubmit={handleSubmit}>
      <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="topleft" >
    
     
    </div>
  
  </label>
  <div className="form-devider">
  <div className="user-image">
    {previewImage==''?<img className="profile-img" for="photo-upload" src={`https://kate.nvinfobase.com/storage/${user.image}`}/>:
    <img className="profile-img" for="photo-upload" src={previewImage}/>

  }
  <label for="upload-img" >Change picture<img src='/images/icons/change.svg' /></label>
  <div  style={{display:'none'}}>
  <Input  name="image" type="file"    handleInput={handleInput}></Input> 
  </div>
    </div>
    <div className="input-feilds">
    <label>Username
        <Input
          name="name"
          type="text"
          value={user.name}
          placeholder={"Your names"}
          handleInput={handleInput}
        />
        </label>
        <label>Email
        <Input
          name="email"
          type="email"
          value={user.email}
          placeholder={"Your email"}
          handleInput={handleInput}
        /> </label>
       
        <label>Phone Number
        <Input
        name="phone_number"
        type="number"
        value={user.phone_number}
        placeholder={"Phone Number"}
        handleInput={handleInput}
      />
      </label>
    <label><Button onClick={()=>{
      setShow(true)
    }}> Change Password</Button></label>
    
    <Modal className='login-modal' show={show}

aria-labelledby="contained-modal-title-vcenter"
centered
>
<div style={{display:"flex",justifyContent:"flex-end"}}>
<button style={{border:"none",background:"transparent"}} onClick={handleClose} ><img className='img-fluid' src="/images/cross.png"/></button> 

</div>
<ForgotPassword />
</Modal>
      
        </div>
        </div>
        <div style={{textAlign:'end'}} className="custom_profile_btn">
        <button className="btn-save" type="submit">Update</button>
        </div>
      </form>
    </div>
  );
}


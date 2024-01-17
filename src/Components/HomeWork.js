import React,{useState,useLayoutEffect} from 'react'
import { Button } from 'react-bootstrap'
import MiniHeader from './MiniHeader'
import "./homework.css"
import axios from "axios";

const INITIAL_STATE = {
  
  short_description: "",
  description: "",
  thoughts:"",
  file:""
};



const HomeWork = () => {
  const [data, setData] = useState(INITIAL_STATE);
  const[homeworkData,setHomeworkData]=useState([])
  const[homeworkScreen,setHomeworkScreen]=useState(false)




  useLayoutEffect(() => {
    (async () => {
      try {
        const response = await 
          axios.get(`${url}/homework`,config)
console.log(response.data.data)
        setHomeworkData(
       response.data.data
        
          );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);


  
  const[msg,setMsg]=useState('')
  const [previewFile, setPreviewFile] = useState('');
  const token =JSON.parse(localStorage.getItem('token'));
  const url=process.env.REACT_APP_API_KEY
let config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}

const changeScreen=(note)=>{
  setData(

    {
      short_description: note.short_description,
      description: note.description,
      thoughts:note.thoughts,
      file:note.file,
    }
  )
  setHomeworkScreen(true)
}
  const handleInput = (e) => {
    console.log(e.target.name, " : ", e.target.value);




    if(e.target.name == "file"){
      var src = URL.createObjectURL(e.target.files[0]);
      setPreviewFile(src);
      setData({ ...data, [e.target.name]:  e.target.files[0] });
    }
   
    else
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data)
  }
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    var form_data = new FormData();
for ( var key in data ) {
  form_data.append(key, data[key]);
}
  
    const response = await axios.post(`${url}/homework`, form_data,config);
    setMsg(response.data.message)
  } catch (error) {
    console.log(error);
  }
}

  return (
    <div>
    <MiniHeader head='Homework'/>
    {!homeworkScreen && <div className='addnotes-wrapper'>
 <div className='addnote-child addone-value'  onClick={()=>{
  setHomeworkScreen(true)
}}>
    <img src='/images/addnote.svg'/>
   <p style={{textAlign:'center'}}>New Homework</p>
    </div>
    { homeworkData?.length>0&& homeworkData.map(note=><div className='addnote-child'>
    <h5>{note.created_at.slice(0,10)}</h5>
    <p>{note.short_description}</p>
    <div className='timing'>
    <p>{new Date(note.created_at).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
   <img onClick={()=>{
     changeScreen(note)

   }} src='/images/right-arrow.svg'/></div>
    </div>)}

    </div>}
  {homeworkScreen&&  <form onSubmit={handleSubmit}>
    <div className='homework-image-section' style={{display:'flex'}}>
    <img src='/images/atwork1.png' />
    <span>
    <h2>Woohoo! Time for homework!</h2>
    <p className='sub-head'>In this section, you will write notes about what your homework is for your therapy session. You can either write a description, enter a link for a website, etc. </p>
    </span>
    </div>
   
   <div className='short-main'>
   <label>Short description of homework
  <input className='short-input'  name="short_description"  defaultValue={data.short_description}  onChange={handleInput} style={{width:'100%'}} type='text'></input>
  </label>
  <label>Add File
  <span><input name="file" type="file"    onChange={handleInput} ></input></span>
  </label>
   
   </div>
   <div style={{display:'flex',gap:'20px'}} className="homework_Section">
   <div style={{width:'50%'}} className="homework_blocks">
  <p>What is the homework?</p>
 <input name="description"  defaultValue={data.description}  onChange={handleInput} style={{width:'100%',height:"107px"}} type='text'></input>
 </div>
 <div style={{width:'50%'}} className="homework_blocks">
  <p>Thoughts, responses, how did it go?
  </p>
 
  
 <input name="thoughts"  defaultValue={data.thoughts}  onChange={handleInput} style={{width:'100%',height:"107px"}} type='text'></input>
 
  </div>

  </div>
  <div  style={{textAlign:'center',paddingTop:"20px"}}>
  <button type='submit' className='btn-save'>Save</button>

  </div>
  </form>}
    </div>
  )
}

export default HomeWork
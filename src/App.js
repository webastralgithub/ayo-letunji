import React,{useState,useEffect} from 'react'

import "./App.css"
import { Route, Routes,useLocation } from 'react-router-dom'

import Home from './Components/Home';
import Profile from './Components/Profile';

import Projects from './Components/Projects';
import Sidebar from './Components/Sidebar';
import Footer from './Footer/Footer';
import Navbar from './Header/Navbar';
import Protected from './Components/Protected';
import HomeWork from './Components/HomeWork';
import Notifications from './Components/Notifications';
import detect from 'devtools-detect';
import Notes from './Components/Notes';
import NotesDisp from './Components/NotesDisp';
import User from './Components/User/User';
import Attribute from './Components/Attribute';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';


const App=()=> {
    
  
  const [isLoggedIn, setisLoggedIn] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const navigate=useNavigate()
  const location = useLocation();
  let HomePageStyling ='content-main container-fluid'
  if (location.pathname === '/'||location.pathname === '/termsandconditions') {
    HomePageStyling = '';
}
const onLogout=()=>{
  localStorage.clear()
setExpanded(false)
  setisLoggedIn(false)
navigate("/")
}

  useEffect(() => {
    
    const token=localStorage.getItem('token')
    if(!token){
      setisLoggedIn(false)
    }
    else
    {
      setisLoggedIn(true)
    }
    //   const id = localStorage.getItem("id")
    // setAccountType(Account)
  }, [isLoggedIn]);

  return (
    <>
    <div className="top-nav-tp">
       <img src="/images/latunji-logo.png"/> 
       <Button onClick={onLogout} className="nav-item nav-link px-3">Logout</Button>
    </div>
     { <Navbar isLoggedIn={isLoggedIn} setisLoggedIn={setisLoggedIn}/>}
     <div className={HomePageStyling}>

      {isLoggedIn && location.pathname != '/termsandconditions' && <Sidebar />}
      <Routes>
        <Route exact path="/" element={<Home isLoggedIn={isLoggedIn} setisLoggedIn={setisLoggedIn}/>}  />
     
        <Route path="/folders" element={<Protected isLoggedIn={isLoggedIn}> <div className='main'>  <Projects/></div></Protected>}/>
        <Route path="/user" element={<Protected isLoggedIn={isLoggedIn}> <div className='main'>  <User/></div></Protected>}/>
        <Route path="/attribute" element={<Protected isLoggedIn={isLoggedIn}> <div className='main'>  <Attribute/></div></Protected>}/>
      </Routes>
      </div>
      {/* <div className='footer-app'><Footer /></div>       */}
    </>
  );
}
export default App
import React from 'react'
import MiniHeader from './MiniHeader'
import './Notes.css'

const Notes = () => {

    const arr=['Feels Scary','Excited','Fearful','Worried','Hopeful','Overwhelming','Joyful','Encouraged','Other','Greiving','Laughing','Serious','Family Work','Love','Relationships','Self-esteem','Sad']
        
    
  return (
    <div>
    <MiniHeader  head='Notes During Therapy'/>
    <div className='note-head'>
        <p>Enter Your Text Here</p>
    <input className='textbox' style={{width:'100%',height:"107px"}} type='text'></input>
    <p className='checkbox-p'>Pick a theme or feeling for this session</p>
    <div className='checkbox-perent'>
    {arr.map(item=>(<label>
    <input type="checkbox" />
    {item}
  </label>))}
  </div>
  <div style={{textAlign:"center"}}>
    <button className='btn-save'>Save</button>
    </div>
    </div>
    </div>

  )
}

export default Notes
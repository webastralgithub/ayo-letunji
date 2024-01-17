import React, { useLayoutEffect, useState } from 'react';
import UserTable from './UserTable';
import axios from 'axios';
import MiniHeader from '../MiniHeader';
import Toaster from '../Toaster';

const User = () => {

  const [users, setUsers] = useState([]);

  const url = process.env.REACT_APP_API_KEY
  const token = JSON.parse(localStorage.getItem('token'));
  let config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  useLayoutEffect(() => {
    (async () => {
      try {
        getUser();
      } catch (error) {
      }

    })();

  }, []);

   const getUser = async ()=>{
    try {
        const response = await axios.get(`${url}/get-user`,config)
        setUsers(
          response.data
        )
      } catch (error) {
        console.log(error)
      };
      }
   


  const toggleActive = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, active: !user.active } : user
    );
    setUsers(updatedUsers);
  };

  return (
    <div>
         
     <MiniHeader head='User Mangement' />
      <UserTable userData={users} toggleActive={toggleActive} />
    </div>
  );
};

export default User;

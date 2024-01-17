import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTable } from 'react-table';
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ToggleButton from '../ToggleButton';
import Toaster from '../Toaster';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UserTable = ({ userData = [], toggleActive }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Active',
        accessor: 'status',
        Cell: ({ row }) => (
          <ToggleButton
          isActive={row.original.status}
          id={row.original.id}
          onToggleChange={handleToggleChange}
        />
        ),
      },
    ],
    [toggleActive]
  );

  const data = useMemo(() => userData, [userData]);
  const navigate = useNavigate()
  const url = process.env.REACT_APP_API_KEY
  const [obj, setObj] = useState({})
  useEffect(() => {
    // Good!

  }, [obj]);
  const [error, setError] = useState(null);
  const [image, setImage] = useState('/images/download.png')
  const [toasterMessage, setToasterMessage] = useState('');
  const [passwordType, setPasswordType] = useState("password");
  const [showModal, setShowModal] = useState(false);
  const token = JSON.parse(localStorage.getItem('token'));
  let config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const handleClose = () => {
    setShowModal(false);
  };
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text")
      return;
    }
    setPasswordType("password")
  }
  const handleChange = (e) => {
    if (error) {
      setError(null)
    }
    const object = {};
    object[e.target.name] = e.target.value;
    setObj({ ...obj, ...object })
  }
  const handleToggleChange = async (isActive,id) => {

    const statusAsNumber = isActive ? 1 : 0;
     const obj ={
      id:id,
      status:statusAsNumber

     }
    try {
       var form_data = new FormData();
       for ( var key in obj ) {
        form_data.append(key, obj[key]);
    }
      const res = await axios.post(`${url}/change-status`,form_data,config);
      toast.success('Status Change Successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });

      
    } catch (error) {
      console.log(error);
    }
  };
  const onChangePhoto = async (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);


    const reader = new FileReader();

    reader.onloadend = () => {
      const binaryString = reader.result;
      const imageFile = new File([binaryString], file.name, { type: file.type });
      setObj({ ...obj, image: imageFile });
    };

    if (file) {
      reader.readAsArrayBuffer(file);
    }

  };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });
  const signup = async (e) => {
    e.preventDefault()
    if (!validateEmail(obj.email)) {
      setError('Invalid Email');
      return
    }

    if (obj.password.length < 8) {
      setError('Password must be at least 8 chars long');
      return
    }
    if (!error) {
      var form_data = new FormData();
      var item = { ...obj }
      for (var key in item) {
        form_data.append(key, item[key]);
      } try {
        const response = await axios.post(`${url}/register`, form_data)

        const token = JSON.stringify(response.data.token);
        localStorage.setItem("token", token)
        if (token) {
          navigate("/home")
        }
        setObj({})
        e.target.reset()
      }
      catch (error) {
        console.log(error.response);
        setError(error.response.data.message)
      }
    }

  }
  const adduser = () => {
    setShowModal(true);
  }

  if (!userData || userData.length === 0) {
    return <div>No user data available.</div>;
  }

  return (
    <div className='top-btn-aftr-title'>
       <ToastContainer />
       <div className='addnote-child addone-value on-user-mng' onClick={adduser}>
            <img src='/images/Vector.png' />
            <p>Add user</p>
          </div>
      {/* <button className='btn-save' >Add User</button> */}
      <div className='table-responsive-mn table-responsive-mn-user'>
      <table {...getTableProps()} >
        <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <Modal
                  className="login-modal"
                  show={showModal}
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                   <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      style={{ border: "none", background: "transparent" }}
                      onClick={handleClose}
                    >
                      <img className="img-fluid" src="/images/cross.png" />
                    </button>
                  </div>
      {showModal &&
        <div className='signup-wrapper'>
          <form onSubmit={signup}>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <h2>Sign up</h2>
            <p>Create your account here</p>
            <div className='signup-inner-wrapper'>

              <div className='input-feilds-wrapper'>

                <div className="mb-3 input-box">

                  <FaUser /><input
                    type="name"
                    className='inp'
                    placeholder="Enter full name"
                    name="name"
                    value={obj.name}
                    onChange={handleChange}

                  />
                </div>
                <div className="mb-3 input-box">

                  <FaUser /><input
                    type="name"
                    className='inp'
                    placeholder="Enter User Name"
                    name="username"
                    value={obj.username}
                    onChange={handleChange}

                  />

                </div>
                <div className="mb-3 signup-password input-box">

                  <FaLock /> <input
                    type={passwordType}
                    className='inp'
                    name="password"
                    placeholder="Password"
                    value={obj.password}
                    onChange={handleChange}

                  />
                  <div onClick={togglePassword}>
                    {passwordType === "password" ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>
                <div className="mb-3 input-box">

                  <FaLock /><input
                    type="password"
                    className='inp'
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    value={obj.password_confirmation}
                    onChange={handleChange}

                  />

                </div>
                <div className="mb-3 input-box">
                <ToggleButton
          isActive={true}
          onClick={() => toggleActive()}
        />
                </div>
              </div>
              <div className='image-wrapper'>

                <div className='upload-image'>
                  <div className="profile-pic-container">
                    <img className="profile-pic" src={image} alt="" />
                  </div>

                  <div className="profile-pic-update-container">


                    <div className="">
                      <label for="profilePhoto" htmlFor="profilePhoto" className="form-label">
                        Upload Picture <img src='\images\upload-icon.svg' />
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        multiple={false}
                        id="profilePhoto"
                        onChange={onChangePhoto}
                      />
                    </div>
                    <input
                      type="button"
                      value="Upload"
                      className="btn btn-primary btn-block mt-1"
                      onClick={onChangePhoto}
                    />

                  </div>
                </div>

              </div>


            </div>
            <div className='button-wrapper'>
              <Button type='submit' className='login-btn' variant="primary" size="lg">Signup</Button>
            </div>
          </form>
        </div>}
        </Modal>
    </div>
  );
};

export default UserTable;

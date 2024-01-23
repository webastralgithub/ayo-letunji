import React, { useState, useLayoutEffect, useRef } from "react";
import "./Projects.css";
import MiniHeader from "./MiniHeader";
import { Button } from "react-bootstrap";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnnotateScreenshots from "./AnnotateScreenshots";
import { DNA } from "react-loader-spinner";
import BackButton from "./BackButton";
const Projects = () => {
  const [folders, setNotes] = useState();
  const [toasterMessage, setToasterMessage] = useState("");
  const [notesScreen, setNotesScreen] = useState(false);
  const [screenType, setScreenType] = useState("folder");


  const [title, setTitle] = useState();
  const [formType, setFormType] = useState();
  const [folderId,setFolderId]=useState();
 

  const [views, setViews] = useState([]);
  const url = process.env.REACT_APP_API_KEY;
  const [isLodaing, setIsLoading] = useState();

  let arr = [];
  for (let i = 1; i <= 10; i++) {
    arr.push(i);
  }

  useLayoutEffect(() => {
    (async () => {
      try {
        getFolder();
      } catch (error) {}
    })();
  }, []);
  const changeScreen = (type) => {
    setScreenType(type);

    setNotesScreen(true);
  };
  const changeViewScreen = (note) => {
    setScreenType("annotation");
    setNotesScreen(true);
  };


  const getFolder = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}/get/folder`, config);

      setNotes(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const token = JSON.parse(localStorage.getItem("token"));
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

 


  const submit = async () => {
    setIsLoading(true);
    const body = {
      name: title,
    };
    var form_data = new FormData();
    for (var key in body) {
      form_data.append(key, body[key]);
    }
    var res ="";
    if (formType) {
       res = await axios.post(`${url}/folder`, form_data, config);
    } else {
       res = await axios.post(`${url}/create-view/${folderId}`, form_data, config);
    }
    if(res.data.error){
      toast.error(res.data.error, {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    setNotesScreen(false);
    const response = await axios.get(`${url}/get/folder`, config);
    setNotes(response.data);
    toast.success("Added successfully", {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
    });

    setNotesScreen(false);
  };

  const handleBack =()=>{
      if(screenType === "views" ){
        setScreenType("folder");
        setNotesScreen(false);
      }
      else if(screenType === "annotation"){
        console.log('annotationannotationannotation');
        setScreenType("views");
        setNotesScreen(true);
      }
      else if(screenType === "form" && !formType){
        setScreenType("views");
        setNotesScreen(true);
      }
      else if(screenType === "form" && formType){
        setScreenType("folder");
        setNotesScreen(false);
      }
  }
  // const deletehandler = async () => {
  //   const rest = await axios.delete(`${url}/note/${id}`, config);
  //   setToasterMessage('Deleted successfully');
  //   setNotesScreen(false)
  //   setTrack(null)
  //   setid(null)
  // }
  console.log(screenType);

  return (
    <div>
      {isLodaing && (
        <div className="spinner">
          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      )}
      <ToastContainer />
      <BackButton onClick={handleBack}/>
      <MiniHeader
        head={
          screenType === "folder"
            ?"Folder"
            :screenType === "views"
            ? "Views"
            : screenType === "annotation"
            ? "Create Annotation"
            : formType
            ? "Folder"
            : "View"
        }
      />

      {!notesScreen && (
        <div className="top-btn-aftr-title">
          <div className="search-filter">
            {/* <form>
        <input placeholder='search' type="text" className='custom_search_filter'></input>
        </form> */}
            <div
              className="addnote-child addone-value"
              onClick={() => {
                changeScreen("form");
                setFormType(true);
              }}
            >
              <img src="/images/Vector.png" />
              <p>New Folder</p>
            </div>
            {/* <img src='/images/search_icon.png' className='search_img' /> */}

            <div className="short">
              Short:
              <Button>
                <img src="/images/short.svg" />
              </Button>
            </div>
          </div>

          <div className="table-responsive-mn">
            <table border="1">
              <thead>
                <tr>
                  <th>Folder Name</th>
                  <th className="hightlgt">Views</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {folders?.length > 0 &&
                  folders.map((folder, index) => (
                    <tr key={index}>
                      <td
                        onClick={() => {
                          changeScreen("views");
                          setViews(folder.views);
                          setFolderId(folder.id)
                        }}
                        className="hightlgt"
                      >
                        {folder.name}
                      </td>
                      <td>{folder.views.length}</td>
                      <td>
                        {folder.created_at.slice(0, 10)},{" "}
                        {new Date(folder.created_at).toLocaleString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {notesScreen && screenType == "annotation" && (
        <div>
          

          <AnnotateScreenshots />
          {/* <PageBuilder /> */}
        </div>
      )}
      {notesScreen && screenType == "form" && (
        <div>
          <form>
            <div className="input-group">
              <div className="input-group-btn">
                <button className="btn btn-default" type="submit">
                  <i className="glyphicon glyphicon-search"></i>
                </button>
              </div>
            </div>
          </form>
          <label>{formType ? "Folder Name" : "View Name"}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          ></input>

          {/* <button className="custom_notes">
            <img src="/images/del.png" alt="my image" />
          </button> */}
          <button className="custom_notes_save" onClick={submit}>
            <img src="/images/save.png" alt="my image" />
          </button>
        </div>
      )}
      {notesScreen && screenType == "views" && (
        <div>
          <div className="top-btn-aftr-title">
            <div className="search-filter">
              {/* <form>
<input placeholder='search' type="text" className='custom_search_filter'></input>
</form> */}
              <div
                className="addnote-child addone-value"
                onClick={() => {
                  changeScreen("form");
                  setFormType(false);
                }}
              >
                <img src="/images/Vector.png" />
                <p>New View</p>
              </div>
              {/* <img src='/images/search_icon.png' className='search_img' /> */}

              <div className="short">
                Short:
                <Button>
                  <img src="/images/short.svg" />
                </Button>
              </div>
            </div>
            <div className="table-responsive-mn">
              <table border="1">
                <thead>
                  <tr>
                    <th> Name</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {views?.length > 0 &&
                    views.map((view, index) => (
                      <tr key={index}>
                        <td
                          onClick={() => {
                            changeViewScreen(view);
                          }}
                          className="hightlgt"
                        >
                          {view.name}
                        </td>
                        <td>
                          {view.created_at.slice(0, 10)},{" "}
                          {new Date(view.created_at).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

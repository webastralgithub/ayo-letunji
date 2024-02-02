import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import "./Projects.css";
import MiniHeader from "./MiniHeader";
import { Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnnotateScreenshots from "./AnnotateScreenshots";
import { DNA } from "react-loader-spinner";
import BackButton from "./BackButton";
const Projects = ({ isSidebarOpen}) => {
  const [folders, setNotes] = useState();
  const [toasterMessage, setToasterMessage] = useState("");
  const [notesScreen, setNotesScreen] = useState(false);
  const [screenType, setScreenType] = useState("folder");
  const [selectedView, setSelectedView] = useState(null);
  const [newViewName, setNewViewName] = useState("");
  const [title, setTitle] = useState();
  const [formType, setFormType] = useState();

  const [folderId, setFolderId] = useState();
  const [folderDetail, setFolderDetails] = useState();
  const [views, setViews] = useState([]);
  const [singleView, setSingleView] = useState({});
  const url = process.env.REACT_APP_API_KEY;
  const [isLodaing, setIsLoading] = useState();

  let arr = [];
  for (let i = 1; i <= 10; i++) {
    arr.push(i);
  }
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    isSidebarOpen(true)
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedView]);

  useLayoutEffect(() => {
    (async () => {
      try {
        getFolder();
      } catch (error) {}
    })();
  }, []);
  const handleClickOutside = (e) => {
    if (
      selectedView &&
      !e.target.closest(".rename-input") &&
      !e.target.closest(".hightlgt")
    ) {
      
      // Click is outside the input field and the highlighted cell
      setSelectedView(null);
      setNewViewName("");
    }
  };
  const changeScreen = (type) => {
    setScreenType(type);

    setNotesScreen(true);
  };

  const handleTdClick = (view) => {
    setSelectedView(view);
    setNewViewName(view.name);
  };

  const handleInputChange = (e) => {
    setNewViewName(e.target.value);
  };
  const handleUpdateName = (id, newViewName) => {
    // Create a new array with the updated object
    if (screenType == "views") {
      const updatedData = views.map((view) =>
        view.id === id ? { ...view, name: newViewName } : view
      );
      setViews(updatedData);
    } else {
      const updatedData = folders.map((folder) =>
        folder.id === id ? { ...folder, name: newViewName } : folder
      );
      setNotes(updatedData);
    }
    // Update the state in the parent component
  };
  const updateName = async(id)=>{
  
      const body = { name: newViewName };
      try {
        setIsLoading(true);
        if (screenType == "views") {
          const res = await axios.patch(
            `${url}/update-view/${id}`,
            body,
            config
          );
        } else {
          const res = await axios.patch(
            `${url}/update-folder/${id}`,
            body,
            config
          );
        }

        setIsLoading(false);
        handleUpdateName(id, newViewName);
        if (screenType == "views") {
          Swal.fire("Updated!", "View name is renamed", "success");
        } else {
          Swal.fire("Updated!", "Folder name is renamed", "success");
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error renaming view:", error);
        Swal.fire("Error", error.response.data.message, "error");
        // Handle error if the rename request fails
      }
      setSelectedView(null);
      setNewViewName("");
    
  }
  const handleKeyUp = async (e, id) => {
    if (e.key === "Enter") {
      const body = { name: newViewName };
      try {
        setIsLoading(true);
        if (screenType == "views") {
          const res = await axios.patch(
            `${url}/update-view/${id}`,
            body,
            config
          );
        } else {
          const res = await axios.patch(
            `${url}/update-folder/${id}`,
            body,
            config
          );
        }

        setIsLoading(false);
        handleUpdateName(id, newViewName);
        if (screenType == "views") {
          Swal.fire("Updated!", "View name is renamed", "success");
        } else {
          Swal.fire("Updated!", "Folder name is renamed", "success");
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error renaming view:", error);
        Swal.fire("Error", error.response.data.message, "error");
        // Handle error if the rename request fails
      }
      setSelectedView(null);
      setNewViewName("");
    } else if (e.key === "Escape") {
      // Cancel renaming and reset the state
      setSelectedView(null);
      setNewViewName("");
    }
  };

  const getFolder = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}/get/folder`, config);

      setNotes(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const token = JSON.parse(localStorage.getItem("token"));
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          // Assuming you have already defined `axios` and `url` elsewhere in your code
          if (screenType == "views") {
            const rest = await axios.delete(`${url}/delete-view/${id}`, config);
            setViews(views.filter((v) => v.id !== id));
            setIsLoading(false);
            if (rest)
              Swal.fire("Deleted!", "Your data has been deleted.", "success");
          } else {
            const rest = await axios.delete(
              `${url}/delete-folder/${id}`,
              config
            );
            setNotes(folders.filter((f) => f.id !== id));
            setIsLoading(false);
            if (rest){
              Swal.fire("Deleted!", "Your data has been deleted.", "success");
            }
          
          }

          // Handle successful delete
        } catch (error) {
          setIsLoading(false);
          // Handle error if the delete request fails
          console.error("Error deleting data:", error);
          Swal.fire("Error", "An error occurred while deleting data.", "error");
        }
      }
    });
  };
  const updateData = (newData, screenType) => {
    if (screenType == "views") {
      setViews((prevData) => [...prevData, newData]);
    } else {
      setNotes((prevData) => [...prevData, newData]);
    }
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
    try {
      var res = "";
      if (formType) {
        res = await axios.post(`${url}/folder`, form_data, config);
        updateData(res.data.folder, "folder");
        setNotesScreen(false);
        setScreenType("folder");
      } else {
        res = await axios.post(
          `${url}/create-view/${folderId}`,
          form_data,
          config
        );
        setNotesScreen(true);
        setScreenType("views");
        updateData(res.data.view, "views");
      }
    } catch (error) {
        toast.error(error.response.data.error, {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false);
        return false;
    
    }
   

    setIsLoading(false);

    const response = await axios.get(`${url}/get/folder`, config);
    setNotes(response.data);
    toast.success("Added successfully", {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleBack = () => {
    if (screenType === "views") {
      setScreenType("folder");
      setNotesScreen(false);
    } else if (screenType === "annotation") {
      isSidebarOpen(true)
      setScreenType("views");
      setNotesScreen(true);
    } else if (screenType === "form" && !formType) {
      setScreenType("views");
      setNotesScreen(true);
    } else if (screenType === "form" && formType) {
      setScreenType("folder");
      setNotesScreen(false);
    }
  };
  // const deletehandler = async () => {
  //   const rest = await axios.delete(`${url}/note/${id}`, config);
  //   setToasterMessage('Deleted successfully');
  //   setNotesScreen(false)
  //   setTrack(null)
  //   setid(null)
  // }

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
      <BackButton onClick={handleBack} />
      <MiniHeader
        head={
          screenType === "folder"
            ? "Folders"
            : screenType === "views"
            ? "Views"
            : screenType === "annotation"
            ? singleView?.name
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
                  <th >Folder Name</th>
                  <th className="hightlgt">Views</th>
                  <th>Last Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {folders?.length > 0 ?
                  folders.map((folder, index) => (
                    <tr key={index}>
                      
                        <td
                          onClick={() => handleTdClick(folder)}
                          className={selectedView === folder ? "hightlgt highlight2" : "highlight2"}
                        >
                          {selectedView === folder ? (
                            <input
                              type="text"
                              value={newViewName}
                              onChange={handleInputChange}
                              onKeyUp={(e) => handleKeyUp(e, folder.id)}
                              autoFocus
                            />

                            
                          ) : (
                            folder.name
                          )}

                          {selectedView === folder && <button onClick={()=>{updateName(folder.id)}} className="chnage-folder-nm-sv-btn">Save</button>}

                <span className="edit-folder-name-edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                          </span>
                          
                        </td>
                     
                      <td style={{ "padding-left": "24px" }}>
                        {folder?.views?.length}
                      </td>
                      <td>
                        {folder.created_at.slice(0, 10)},{" "}
                        {new Date(folder.created_at).toLocaleString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </td>
                      <td className="hover-action">
                        ...
                        <div className="action-buttons">
                          <img
                            onClick={() => {
                              handleDelete(folder.id);
                              setFolderId(folder.id);
                            }}
                            src="/images/trash.png"
                          />
                          <img
                            onClick={() => {
                              changeScreen("views");
                              setViews(folder.views);
                              setFolderId(folder.id);
                              setFolderDetails(folder)
                            }}
                            src="/images/eye.png"
                          />
                        </div>
                      </td>
                    </tr>
                  )): <h4 className="no-data-found-txt">No Data Found</h4>}
               
              </tbody>
            </table>
          </div>
        </div>
      )}
      {notesScreen && screenType == "annotation" && (
        <div>
          <AnnotateScreenshots folder={folderDetail} isSidebarOpen={isSidebarOpen} setScreenType={setScreenType} setNotesScreen={setNotesScreen}/>
          {/* <PageBuilder /> */}
        </div>
      )}
      {notesScreen && screenType == "form" && (
        <div className="create-folder-nw-block">

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
            save
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
  <path d="M11 2H9v3h2z"/>
  <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
</svg>
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
                    <th className="hightlgt"> View Name</th>
                    <th>Last Updated</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {views?.length > 0 ?
                    views.map((view, index) => (
                      <tr key={index}>
                        <td
                          onClick={() => handleTdClick(view)}
                          className={selectedView === view ? "hightlgt highlight2" : "highlight2"}
                        >
                          {selectedView === view ? (
                            <input
                              type="text"
                              value={newViewName}
                              onChange={handleInputChange}
                              onKeyUp={(e) => handleKeyUp(e, view.id)}
                              autoFocus
                            />
                          ) : (
                            view.name
                          )}
                           {selectedView === view && <button onClick={()=>{updateName(view.id)}} className="chnage-folder-nm-sv-btn">Save</button>}

                          <span className="edit-folder-name-edit">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                              </svg>
                            </span>
                        </td>
                        <td>
                          {view.created_at.slice(0, 10)},{" "}
                          {new Date(view.created_at).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </td>
                        <td className="hover-action">
                          ...
                          <div className="action-buttons">
                            <img
                              onClick={() => {
                                handleDelete(view.id);
                              }}
                              src="/images/trash.png"
                            />
                            <img
                              onClick={() => {
                                changeScreen("annotation");
                                setSingleView(view)

                              }}
                              src="/images/eye.png"
                            />
                          </div>
                        </td>
                      </tr>
                    )): <h4 className="no-data-found-txt">No Data Found</h4>}
                   
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

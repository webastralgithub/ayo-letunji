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
const Projects = () => {
  const [folders, setNotes] = useState();
  const [toasterMessage, setToasterMessage] = useState("");
  const [notesScreen, setNotesScreen] = useState(false);
  const [screenType, setScreenType] = useState("folder");
  const [selectedView, setSelectedView] = useState(null);
  const [newViewName, setNewViewName] = useState("");
  const [title, setTitle] = useState();
  const [formType, setFormType] = useState();
  const [folderId, setFolderId] = useState();

  const [views, setViews] = useState([]);
  const url = process.env.REACT_APP_API_KEY;
  const [isLodaing, setIsLoading] = useState();

  let arr = [];
  for (let i = 1; i <= 10; i++) {
    arr.push(i);
  }
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

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
  const changeViewScreen = (note) => {
    setScreenType("annotation");
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
            ? "Folder"
            : screenType === "views"
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {folders?.length > 0 ?
                  folders.map((folder, index) => (
                    <tr key={index}>
                      <td>
                        {" "}
                        <td
                          onClick={() => handleTdClick(folder)}
                          className={selectedView === folder ? "hightlgt" : ""}
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
                        </td>
                      </td>
                      <td style={{ "padding-left": "20px" }}>
                        {folder?.views.length}
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
                            }}
                            src="/images/eye.png"
                          />
                        </div>
                      </td>
                    </tr>
                  )): <h4>No Data Found</h4>}
               
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {views?.length > 0 ?
                    views.map((view, index) => (
                      <tr key={index}>
                        <td
                          onClick={() => handleTdClick(view)}
                          className={selectedView === view ? "hightlgt" : ""}
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
                              }}
                              src="/images/eye.png"
                            />
                          </div>
                        </td>
                      </tr>
                    )): <h4>No Data Found</h4>}
                   
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

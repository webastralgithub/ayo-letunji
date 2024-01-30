import React, { useEffect, useState,useRef } from "react";
import Annotation from "react-image-annotation";
import {
  PointSelector,
  RectangleSelector,
  OvalSelector
} from "react-image-annotation/lib/selectors";
import Table from "./Table";
import domtoimage from 'dom-to-image';
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DNA } from "react-loader-spinner";
import AlwaysVisibleAnnotations from "./AlwaysVisibleAnnotations";
import SidebarFolder from "./SidebarFolder";
import Sidebar from "./Sidebar";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";


const AnnotateScreenshots = ({folder,isSidebarOpen,setScreenType,setNotesScreen }) => {
  const [attribute, setAttributes] = useState([]);
  const [isLodaing, setIsLoading] = useState();
  const [annotation, setAnnotation] = useState({});
  const [tool, setTool] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [annotationHistory, setAnnotationHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const pasteContainerRef = useRef(null);
  const [edit, setEdit] = useState(false);
  const [select,setSelect] =useState(false);
  const url = process.env.REACT_APP_API_KEY;
  const [image, setImage] = useState("");
  useEffect(() => {
    getAttributes();
    isSidebarOpen(false)
  }, []);
  const location = useLocation();
  const handleEdit = () => {
    if(image)
    setEdit((prevEdit) => !prevEdit);
  else
  Swal.fire("Error", "Please Paste image first", "error");
  };
  const handleSelect = () => {
    if(image)
    setSelect((prevSelect) => !prevSelect);
  else
  Swal.fire("Error", "Please Paste image first", "error");
  };
  const token = JSON.parse(localStorage.getItem('token'));
  let config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const getAttributes = async () => {
    try {
      const res = await axios.get(`${url}/attributes`, config);
      setAttributes(res.data);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };
  const updateImage = (image) => {
    setImage(image);
  };

  const saveToHistory = (newAnnotations) => {
    setAnnotationHistory((prevHistory) => [
      ...prevHistory.slice(0, historyIndex + 1),
      { annotations: newAnnotations.map(annotation => ({ ...annotation })) },
    ]);
    setHistoryIndex((prevIndex) => prevIndex + 1);
  };
  const handlePasteButtonClick = async () => {
    const pasteContainer = pasteContainerRef.current;

    if (pasteContainer) {
      // Clear paste article
      pasteContainer.textContent = "";

      try {
        // Read clipboard data
        const data = await navigator.clipboard.read();

        // Check if it's an image
        const clipboardContent = data[0];

        console.log(clipboardContent);

        // Get blob representing the image
        const blob = await clipboardContent.getType("image/png");

        // Create blob URL
        const blobUri = window.URL.createObjectURL(blob);
        updateImage(blobUri);
      } catch (err) {
        console.log(err);

        // If there is an error, assume it's not an image
        const text = await navigator.clipboard.readText();
        pasteContainer.textContent = text;
      }
    }
  };


  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => prevIndex - 1);
      setAnnotations(annotationHistory[historyIndex - 1].annotations.map(annotation => ({ ...annotation })));
    }else{
      setAnnotations([])
      setHistoryIndex(-1)
    }
  };

  const handleRedo = () => {
    if (historyIndex < annotationHistory.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      setAnnotations(annotationHistory[historyIndex + 1].annotations.map(annotation => ({ ...annotation })));
    }
  };
  
  const onSubmit = (newAnnotation) => {
    const { geometry, data } = newAnnotation;
  
    setAnnotation({});
    const newAnnotations = [
      ...annotations,
      {
        geometry,
        data: {
          ...data,
          id: Math.random(),
        },
      },
    ];
  
    setAnnotations(newAnnotations);
    saveToHistory([...newAnnotations]); // Make sure to create a deep copy
  };
  

  const saveImageWithAnnotations = async () => {
    try {
      setIsLoading(true)
      // Capture the content of the annotation container
      const annotationContainer = document.getElementById('annotation-container');
      const annotationTextContainer = document.getElementById('annotation-text');
  
      const [imageData] = await Promise.all([
        domtoimage.toPng(annotationContainer),
      ]);
  
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      // Add images to the PDF
      pdf.addImage(imageData, 'PNG', 10, 10, 190, 100);// Adjust the parameters as needed
  
      // Add a table for annotation data using jspdf-autotable
      const tableData = [['Text', 'Description', 'EN', 'FR', 'Source', 'Notes']];
      annotations.forEach((annotation) => {
        const { text } = annotation.data;
        const { description, en, fr, source, notes } = annotation;
        tableData.push([text, description, en, fr, source, notes]);
      });
      const startY = 120; // Adjust the Y position as needed
      const margin = 10;
      const cellWidth = (pdf.internal.pageSize.width - 2 * margin) / 7;
      const cellHeight = 10;
      const fontSize = 12;
  
      pdf.setFontSize(fontSize);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Annotation Data', margin, startY);
  
      tableData.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          pdf.rect(margin + cellIndex * cellWidth, startY + rowIndex * cellHeight, cellWidth, cellHeight, 'S');
          pdf.text(cell, margin + cellIndex * cellWidth + 2, startY + rowIndex * cellHeight + 8);
        });
      });
  
      // Save or open the PDF
      pdf.save('image_with_annotations.pdf');
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Error exporting to PDF:', error);
    }
  };
  
  const getToolbarItem = (selector) => {
    return (
      <button
        className={tool === selector ? "selected-tool" : ""}
        onClick={() => setTool(selector)}
      >
        {selector.TYPE}
      </button>
    );
  };
  return (
    <>
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
      <Sidebar disabled={true}/>
      <div className="sidenav sidenav-scren">
      <Link
        to="/folders"
        className={
          location.pathname === "/folders"
            ? "nav-item nav-link px-3 active"
            : "nav-item nav-link px-3"
        }
        onClick={() => {
          setScreenType("folder");
          isSidebarOpen(true)
          setNotesScreen(false);
          
        }}
      >
        <div >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder" viewBox="0 0 16 16">
  <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/>
</svg>
          Folders
        </div>
      </Link>
      <SidebarFolder key={folder.id} folder={folder} />
      </div>
      
      <div className="buttons-bundle">
        <button onClick={handlePasteButtonClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-clipboard-check"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"
            />
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
          </svg>
          Paste
        </button>

        <button onClick={handleEdit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-pencil-square"
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fill-rule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
            />
          </svg>
          Edit
        </button>

        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-floppy"
            viewBox="0 0 16 16"
          >
            <path d="M11 2H9v3h2z" />
            <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
          </svg>
          Save
        </button>

        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-floppy2-fill"
            viewBox="0 0 16 16"
          >
            <path d="M12 2h-2v3h2z" />
            <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1" />
          </svg>
          Save As
        </button>

        <button onClick={handleUndo} disabled={historyIndex === -1}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-counterclockwise"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
          </svg>
          Undo
        </button>

        <button onClick={handleSelect}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-hand-index-thumb"
            viewBox="0 0 16 16"
          >
            <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1M8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5 5 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.6 2.6 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046zm2.094 2.025" />
          </svg>
          Select
        </button>
        <button
          onClick={handleRedo}
          disabled={historyIndex === annotationHistory.length - 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-clockwise"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
          </svg>
          Redo
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-printer"
            viewBox="0 0 16 16"
          >
            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
            <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
          </svg>
          Print
        </button> 
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-copy"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
            />
          </svg>
          Copy
        </button>
         <button onClick={saveImageWithAnnotations}>
           <svg
             xmlns="http://www.w3.org/2000/svg"
             width="16"
             height="16"
             fill="currentColor"
             class="bi bi-box-arrow-up-right"
             viewBox="0 0 16 16"
           >
             <path
               fill-rule="evenodd"
               d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
             />
             <path
               fill-rule="evenodd"
               d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
             />
           </svg>
           Export
         </button>
      </div>
      {!image && (
        <div className="paste-canvas-over"
          ref={pasteContainerRef}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
            height: "100vh",
          }}
        >
          {" "}
          <span>Paste an image here...</span>
        </div>
      )}
      {image && (
        <>
          {/* {edit && (
            <div className="toolbar">
              {getToolbarItem(RectangleSelector)}
              {getToolbarItem(PointSelector)}
              {getToolbarItem(OvalSelector)}
            </div>
          )} */}

          <hr />
          <div className={edit ?"border-annotation":"" }>
          <div id="annotation-container" className={select ?"annot-cursor":""}>
        
            <Annotation
              src={image}
              alt="Annotated Image"
              annotations={annotations}
              type={tool.TYPE}
              value={annotation}
              onChange={edit && select ? (value) => setAnnotation(value) : undefined}
              onSubmit={onSubmit}
              allowTouch
            >
              {/* Render the annotation text directly */}
              <div id="annotation-text">
              {annotations.map((annotation) => (
        <div
          key={annotation.data.id}
          className="always-visible-annotation"
          style={{
            left: `${annotation.geometry.x}%`,
            top: `${annotation.geometry.y + annotation.geometry.height}%`,
            height: 'auto', // Adjust as needed
            position: 'absolute',
          }}
        >
          {annotation.data.text}
        </div>
      ))}</div>
            </Annotation>
          </div>
          </div>
          {annotations.length > 0 && (
            <Table attribute={attribute} annotations={annotations} />
          )}
        
        </>
      )}
    </>
  );
};

export default AnnotateScreenshots;

import React, { useEffect, useState } from "react";
import Annotation from "react-image-annotation";
import {
  PointSelector,
  RectangleSelector,
  OvalSelector
} from "react-image-annotation/lib/selectors";
import Table from "./Table";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AnnotateScreenshots = (props) => {
  const [attribute, setAttributes] = useState([]);
  const [annotation, setAnnotation] = useState({});
  const [tool, setTool] = useState(props.edit);
  const [annotations, setAnnotations] = useState([]);
  const [annotationHistory, setAnnotationHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const url = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    getAttributes();
  }, []);

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

  const saveToHistory = (newAnnotations) => {
    setAnnotationHistory((prevHistory) => [
      ...prevHistory.slice(0, historyIndex + 1),
      { annotations: newAnnotations.map(annotation => ({ ...annotation })) },
    ]);
    setHistoryIndex((prevIndex) => prevIndex + 1);
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
      // ... (existing code remains unchanged)
    } catch (error) {
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
      {props.edit && (
        <div className="toolbar">
          {getToolbarItem(RectangleSelector)}
          {getToolbarItem(PointSelector)}
          {getToolbarItem(OvalSelector)}
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
          <button onClick={handleRedo} disabled={historyIndex === annotationHistory.length - 1}>
            Redo
          </button>
        </div>
      )}
      <hr />

      <div id="annotation-container">
        <Annotation
          src={props.img}
          alt="Annotated Image"
          annotations={annotations}
          type={tool.TYPE}
          value={annotation}
          onChange={props.edit ? (value) => setAnnotation(value) : undefined}
          onSubmit={onSubmit}
          allowTouch
        />
      </div>

      {annotations.length > 0 && <Table attribute={attribute} annotations={annotations} />}
      {props.edit && <button onClick={saveImageWithAnnotations}>Save Image with Annotations (PDF)</button>}
    </>
  );
};

export default AnnotateScreenshots;

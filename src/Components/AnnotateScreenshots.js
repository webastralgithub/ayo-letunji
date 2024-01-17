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
  const [annotations, setAnnotations] = useState([]);
  const [attribute, setAttributes] = useState([]);
  const [annotation, setAnnotation] = useState({});
  const [tool, setTool] = useState(props.edit);
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

  const onSubmit = (newAnnotation) => {
    const { geometry, data } = newAnnotation;

    setAnnotation({});
    setAnnotations([
      ...annotations,
      {
        geometry,
        data: {
          ...data,
          id: Math.random(),
        },
      },
    ]);
  };

  const saveImageWithAnnotations = async () => {
    try {
      // Capture the content of the annotation container
      const annotationContainer = document.getElementById('annotation-container');
      const annotationCanvas = await html2canvas(annotationContainer);

      // Capture the content of the table container
      const tableContainer = document.getElementById('table-container');
      const tableCanvas = await html2canvas(tableContainer);

      // Convert canvas to data URLs
      const annotationData = annotationCanvas.toDataURL('image/png');
      const tableData = tableCanvas.toDataURL('image/png');

      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Add annotated image to the PDF
      pdf.addImage(annotationData, 'PNG', 10, 10, 190, 100);

      // Add table to the PDF
      pdf.addPage();
      pdf.addImage(tableData, 'PNG', 10, 10, 190, 100);

      // Save or open the PDF
      pdf.save('image_with_annotations.pdf');
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
      {props.edit && <div className="toolbar">
        {getToolbarItem(RectangleSelector)}
        {getToolbarItem(PointSelector)}
        {getToolbarItem(OvalSelector)}
      </div>}
      <hr />

      <div id="annotation-container">
        <Annotation
          src={props.img}
          alt="Two pebbles anthropomorphized holding hands"
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
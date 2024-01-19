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

  console.log(annotations,'annotations');

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
      const canvas = await html2canvas(document.getElementById('annotation-container'));
  
      // Convert canvas to a data URL
      const imageData = canvas.toDataURL('image/png');
  
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imageData, 'PNG', 10, 10, 190, 100); // Adjust the parameters as needed
  
      // Add a table for annotation data using jspdf-autotable
      const tableData = [['Text', 'Description', 'EN', 'FR', 'Source', 'Notes']];
      annotations.forEach((annotation) => {
        const { text } = annotation.data;
        const {  description, en, fr, source, notes } = annotation;
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
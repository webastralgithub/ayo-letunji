import React, { useEffect, useState } from "react";
import Annotation from "react-image-annotation";
import {
  PointSelector,
  RectangleSelector,
  OvalSelector
} from "react-image-annotation/lib/selectors";
import Table from "./Table";
import axios from "axios";

const AnnotateScreenshots = (props) => {
  const [annotations, setAnnotations] = useState([]);
  const [attribute,setAttribtes]=useState([]);
  const [annotation, setAnnotation] = useState({});
  const [tool, setTool] = useState(RectangleSelector);
  const url = process.env.REACT_APP_API_KEY
  useEffect(() => {
    getAttributes()
  }, []);
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
  const token = JSON.parse(localStorage.getItem('token'));
  let config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const getAttributes = async()=>{
    const res= await axios.get(`${url}/attributes` ,config)
    setAttribtes(res.data);
  }
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
      <div className="toolbar">
        {getToolbarItem(RectangleSelector)}
        {getToolbarItem(PointSelector)}
        {getToolbarItem(OvalSelector)}
      </div>
      <hr />
      <Annotation
        src={props.img}
        alt="Two pebbles anthropomorphized holding hands"
        annotations={annotations}
        type={tool.TYPE}
        value={annotation}
        onChange={(value) => setAnnotation(value)}
        onSubmit={onSubmit}
        allowTouch
      />
     {annotations.length>0 && <Table attribute={attribute} annotations={annotations}/>}

    </>
  );
};

export default AnnotateScreenshots;

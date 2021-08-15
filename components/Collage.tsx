import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";
import styled from "@emotion/styled";
import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";

const CollageStyles = styled.div`
  height: 100%;
  .collage-container {
    background-color: black;
  }
`;

const OpenSeaDragonViewer = () => {
  const [viewer, setViewer] = useState( null);
  useEffect(() => {
    if (viewer) {
      viewer.open();
    }
  }, []);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();

    setViewer(
      OpenSeaDragon({
        id: "wizards-collage",
        prefixUrl: "static/img/collage/",
        tileSources: "/static/img/collage/wizards.dzi",
        showNavigationControl: false
      })
    );
  };

  useEffect(() => {
    InitOpenseadragon();
    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  return (
    <div
      id="wizards-collage"
      style={{
        height: "100%",
        width: "100%"
      }}
    >
    </div>
  );
};

const Collage = () => {

  return (
    <CollageStyles>
      <OpenSeaDragonViewer
        options
        openSeadragonOptions
        toolBarOptions
      />
    </CollageStyles>
  )
};

export default Collage;

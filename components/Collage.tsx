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

const wizardsList = () => {
  const x = [...Array(200)].map((_, i) => ({
    type: 'image',
    url:  `https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${i}.png`,
  }));

  return x;
}

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
        tileSources: wizardsList(),
        collectionMode: true,
        collectionRows: 10,
        collectionTileSize: 50,
        collectionTileMargin: 5,
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

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "@emotion/styled";
import OpenSeadragon from "OpenSeadragon";
import OpenSeadragonViewerInputHook from '@OpenSeadragon-imaging/OpenSeadragon-viewerinputhook';
import '@OpenSeadragon-imaging/OpenSeadragon-imaginghelper';

import Layout from "../components/Layout";

const CollageStyles = styled.div`
  height: 100%;
  .collage-container {
    background-color: black;
  }
  .lore-overlay{
    background-color: rgba(255, 249, 192, 0.9);
    z-index: -1;
  }
`;

const WIZ_PER_ROW = 100;

// TODO: Get json of lore enabled wizards
const getLoreWizards = () => {
  const numbers = Array(10000).fill().map((_, index) => index + 1);
  numbers.sort(() => Math.random() - 0.5);
  return numbers.slice(0, 1000);
}

const overlays = () => {
  const indicesWithLore = getLoreWizards();

  return [...Array(10000).keys()].map(i => {
    if (!indicesWithLore.includes(i)) {
      return;
    }

    const row = Math.floor(i / WIZ_PER_ROW);
    const col = i % WIZ_PER_ROW;

    return {
      className: 'lore-overlay',
      x: col * 0.01,
      y: row * 0.01,
      width: 0.01,
      height: 0.01,
    }
  }).filter(x => x !== undefined);
}

const OpenSeadragonViewer = () => {
  const [viewer, setViewer] = useState(null);
  useEffect(() => {
    if (viewer) {
      viewer.open();
    }
  }, []);

  const InitOpenSeadragon = () => {
    viewer && viewer.destroy();

    const viewer = OpenSeadragon({
      id: "wizards-collage",
      prefixUrl: "static/img/collage/",
      tileSources: "/static/img/collage/wizards.dzi",
      showNavigationControl: false,
      defaultZoomLevel: 3,
      minZoomImageRatio: 0.2,
      useCanvas: true,
      overlays: overlays()
    });

    // var viewerInputHook = new OpenSeadragonViewerInputHook({ viewer: viewer, hooks: [
    //   { tracker: 'viewer', handler: 'clickHandler', hookHandler: onViewerClick }
    // ]});

    // const onViewerClick = (event) => {
    //   // Disable click zoom on the viewer using event.preventDefaultAction
    //   event.preventDefaultAction = true;
    //   event.stopBubbling = true;
    // }

    // const imagingHelper = viewer.activateImagingHelper({
    //   worldIndex: 0,
    //   onImageViewChanged: (event) => {
    //     // event.viewportWidth == width of viewer viewport in logical
    //     //   coordinates relative to image native size
    //     // event.viewportHeight == height of viewer viewport in logical
    //     //   coordinates relative to image native size
    //     // event.viewportOrigin == OpenSeadragon.Point, top-left of the
    //     //   viewer viewport in logical coordinates relative to image
    //     // event.viewportCenter == OpenSeadragon.Point, center of the
    //     //   viewer viewport in logical coordinates relative to image
    //     // event.zoomFactor == current zoom factor
    //     updateImgViewerViewVM();
    //     updateImgViewerScreenCoordinatesVM();
    //     updateImgViewerDataCoordinatesVM();
    //   }
    // });

    // let updateImgViewerViewVM = function () {
    //   if (haveImage) {
    //     let containerSize = viewer.viewport.getContainerSize();
    //     let boundsRect = viewer.viewport.getBounds(true);
    //     let tiledImage = viewer.world.getItemAt(0);
    //     let boundsTiledImageRect = tiledImage.getBounds(true);
    //     setViewerProps({
    //       osdContainerWidth: containerSize.x,
    //       osdContainerHeight: containerSize.y,
    //       osdZoom: viewer.viewport.getZoom(true),
    //       osdBoundsX: boundsRect.x,
    //       osdBoundsY: boundsRect.y,
    //       osdBoundsWidth: boundsRect.width,
    //       osdBoundsHeight: boundsRect.height,
    //       osdTiledImageBoundsX: boundsTiledImageRect.x,
    //       osdTiledImageBoundsY: boundsTiledImageRect.y,
    //       osdTiledImageBoundsWidth: boundsTiledImageRect.width,
    //       osdTiledImageBoundsHeight: boundsTiledImageRect.height,
    //       zoomFactor: imagingHelper.getZoomFactor(),
    //       viewportWidth: imagingHelper._viewportWidth,
    //       viewportHeight: imagingHelper._viewportHeight,
    //       viewportOriginX: imagingHelper._viewportOrigin.x,
    //       viewportOriginY: imagingHelper._viewportOrigin.y,
    //       viewportCenterX: imagingHelper._viewportCenter.x,
    //       viewportCenterY: imagingHelper._viewportCenter.y
    //     });
    //   }
    // };

    // let onOpen = function (event) {
    //   osdCanvasEl = viewer.canvas;

    //   let minzoomX = 50.0 / imagingHelper.imgWidth;
    //   let minzoomY = 50.0 / imagingHelper.imgHeight;
    //   let minZoom = Math.min(minzoomX, minzoomY);
    //   let maxZoom = 10.0;
    //   imagingHelper.setMinZoom(minZoom);
    //   imagingHelper.setMaxZoom(maxZoom);
    //   imagingHelper.setZoomStepPercent(35);

    //   //imagingHelper.setZoomFactor(1.0);
    //   updateImageVM();
    //   updateImgViewerViewVM();
    //   updateImgViewerDataCoordinatesVM();
    // };

    // let onClose = function (event) {
    //   osdCanvasEl = null;
    // };

    // let onNavigatorScroll = function (event) {
    //   if (event.scroll > 0) {
    //     imagingHelper.zoomIn();
    //   } else {
    //     imagingHelper.zoomOut();
    //   }
    // };

    // let updateImgViewerScreenCoordinatesVM = function () {
    //   if (haveImage && haveMouse) {
    //     let logX = imagingHelper.physicalToLogicalX(mouseRelativeX);
    //     let logY = imagingHelper.physicalToLogicalY(mouseRelativeY);
    //     let dataX = imagingHelper.physicalToDataX(mouseRelativeX);
    //     let dataY = imagingHelper.physicalToDataY(mouseRelativeY);
    //     setScreenCoordinateProps({
    //       physicalToLogicalX: logX,
    //       physicalToLogicalY: logY,
    //       logicalToPhysicalX: imagingHelper.logicalToPhysicalX(logX),
    //       logicalToPhysicalY: imagingHelper.logicalToPhysicalY(logY),
    //       physicalToDataX: dataX,
    //       physicalToDataY: dataY,
    //       dataToPhysicalX: imagingHelper.dataToPhysicalX(dataX),
    //       dataToPhysicalY: imagingHelper.dataToPhysicalY(dataY)
    //     });
    //   }
    // };

    // let updateImgViewerDataCoordinatesVM = function () {
    //   if (haveImage) {
    //     setDataCoordinateProps({
    //       logicalToDataTLX: imagingHelper.logicalToDataX(0.0),
    //       logicalToDataTLY: imagingHelper.logicalToDataY(0.0),
    //       logicalToDataBRX: imagingHelper.logicalToDataX(1.0),
    //       logicalToDataBRY: imagingHelper.logicalToDataY(1.0),
    //       dataToLogicalTLX: imagingHelper.dataToLogicalX(0),
    //       dataToLogicalTLY: imagingHelper.dataToLogicalY(0),
    //       dataToLogicalBRX: imagingHelper.dataToLogicalX(
    //         imagingHelper.imgWidth
    //       ),
    //       dataToLogicalBRY: imagingHelper.dataToLogicalY(
    //         imagingHelper.imgHeight
    //       )
    //     });
    //   }
    // };
    // viewer.addHandler('open', onOpen);
    // viewer.addHandler('close', onClose);
    setViewer(viewer);
  };

  useEffect(() => {
    InitOpenSeadragon();
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
      <OpenSeadragonViewer
        options
        OpenSeadragonOptions
        toolBarOptions
      />
    </CollageStyles>
  )
};

export default Collage;

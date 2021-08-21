import Layout from "../../../components/Layout";
import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import Book from "../../../components/Lore/Book";
import { useRouter } from "next/router";
import productionWizardData from "../../../data/nfts-prod.json";
import { GetServerSidePropsContext } from "next";
import { ResponsivePixelImg } from "../../../components/ResponsivePixelImg";

const wizData = productionWizardData as { [wizardId: string]: any };

const Wrapper = styled.div<{ bg: string }>`
  min-height: 100vh;
  background-color: ${(props) => props.bg || "#000000"};
  display: grid;
  grid-template-columns: [col1] 20% [col2] 50% [col3];
  grid-template-rows: [row1] 25% [row2] 400px [row3] 25% [end];
  align-items: center;
  justify-content: center;
`;

const CanvasContainer = styled.div`
  grid-column-start: col1;
  grid-column-end: col2;
  grid-row-start: row2;
  grid-row-end: row3;
  z-index: 0;

  @media (min-width: 768px) {
    transform: translateX(25%);
  }
`

const WizardImageContainer = styled.div`
  position: relative;

  @media (min-width: 768px) {
    transform: translateX(25%);
  }
`;

const InputContainer = styled.div<{ editable: boolean }>`
  grid-column-start: col1;
  grid-column-end: col2;
  grid-row-start: row2;
  grid-row-end: row3;
  z-index: 10;

  .textInput {
    font-family: 'Alagard';
    background-color: inherit;
    color: white;
    display: ${(props) => props.editable ? "block" : "none"};
    font-size: 23px;
  }
`;

const getImageData = function (imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", imageUrl, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      if (this.status == 200) {
        let uInt8Array = new Uint8Array(this.response);
        let i = uInt8Array.length;
        let binaryString = new Array(i);
        for (let i = 0; i < uInt8Array.length; i++) {
          binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        let data = binaryString.join("");
        let base64 = window.btoa(data);
        resolve("data:image/png;base64," + base64);
      }
    };
    xhr.send();
  });
};

const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
};

const DEFAULT_WIZARD_TEXT = 'Hello darkness, my old friend.';
const CANVAS_FONT = '24px Alagard';
const CANVAS_TXT_WIDTH = 500;

const TextGeneratorPage = () => {
  const router = useRouter();
  const { wizardId, page } = router.query;
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;
  const textbox = useRef(null);

  const [wizardText, setWizardText] = useState();
  const [editable, setEditable] = useState(true);

  useEffect(() => {
    async function run() {
      if (!wizardId) return;
      // TODO: Change to S3 link with CORS enabled
      const url = `/static/img/wizard-${wizardId}.png`

      const imageData = await getImageData(url);
      const image: HTMLImageElement = document.createElement("img");

      image.addEventListener("load", function () {
        const canvas = document.getElementById("wizard-canvas");
        canvas.addEventListener("dblclick", handleCanvasDblClick, false);
        const context = canvas.getContext("2d");
        if (!context) return;

        // Calc dimensions
        context.font = CANVAS_FONT;
        // When editing, display max width, otherwise, measure roughly
        const textWidth = editable ? CANVAS_TXT_WIDTH : context.measureText(wizardText).width;
        canvas.width = CANVAS_TXT_WIDTH + image.naturalWidth;
        canvas.height = image.naturalHeight;
        context.drawImage(image, CANVAS_TXT_WIDTH, 0, image.naturalWidth, image.naturalHeight);

        // Write the text
        if (wizardText) {
          context.font = CANVAS_FONT;
          context.fillStyle = "white";
          wrapText(context, wizardText, Math.max(0, CANVAS_TXT_WIDTH-textWidth), 150, CANVAS_TXT_WIDTH, 24);
        }

        const imagePixels = context.getImageData(0, 0, canvas.width, canvas.height);
      });

      image.src = imageData;
    }

    run();
  }, [wizardId, editable]);

  const handleBlur = (e) => {
    setWizardText(e.target.value);
    setEditable(false)
  }

  const handleCanvasDblClick = () => {
    setWizardText('');
    setEditable(true);
    textbox.current.focus();
  }

  const inputText = wizardText || DEFAULT_WIZARD_TEXT;
  return (
    <Layout title="wtf | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <Wrapper bg={bg}>
        {
          <InputContainer editable={editable}>
            <textarea ref={textbox} className="textInput" cols="30" rows="5" defaultValue={inputText} onBlur={handleBlur} />
          </InputContainer>
        }
        <CanvasContainer>
        <canvas id="wizard-canvas"/>
        </CanvasContainer>
      </Wrapper>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { wizardId: context?.query?.wizardId }
  };
}

export default TextGeneratorPage;

import Layout from "../../../components/Layout";
import ReactMarkdown from "react-markdown";
import { useState } from 'react';
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
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WizardImageContainer = styled.div`
  max-width: 400px;
  position: relative;

  @media (min-width: 768px) {
    transform: translateX(25%);
  }
`;

const InputContainer = styled.div<{ bg: string }>`
  margin-right: -150px;
  .textInput {
    font-family: 'Alagard';
    background-color: inherit;
    color: white;
    border: none;
    font-size: 1em;
    font-family: 'Alagard';
    resize: none;
  }

  @media (min-width: 768px) {
    font-size: 1.8em;
  }
`;

const TextGeneratorPage = () => {
  const router = useRouter();
  const { wizardId, page } = router.query;
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;

  const [text, setText] = useState('Hello darkness, my old friend.');

  const onChange = e => {
    setText(e.target.value); // Remove this line will lead to normal denounce
  };

  return (
    <Layout title="wtf | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <Wrapper bg={bg}>
        <InputContainer>
          <textarea className="textInput" cols="25" rows="10" value={text} onChange={onChange} />
        </InputContainer>
        <WizardImageContainer>
          <ResponsivePixelImg
            src={`https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${wizardId}.png`}
          />
        </WizardImageContainer>
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

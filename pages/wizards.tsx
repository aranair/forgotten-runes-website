import Collage from '../components/Collage';
import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";

const DynamicCollage = dynamic(() => import("../components/Collage"), {
  ssr: false
});
const CollageWrapper = styled.div`
  height: 90vh;
`;

const MapPage = () => (
  <Layout title="A World Map Fragment of Forgotten Runes | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
    <CollageWrapper>
      <DynamicCollage />
    </CollageWrapper>
  </Layout>
);

export default MapPage;

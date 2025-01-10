import React from "react";
import CanvasWrapper from "../../components/canvas/CanvasWrapper";
import { Analytics } from "@vercel/analytics/react";

const Home = () => {
  return (
    <div>
      <Analytics />
      <CanvasWrapper />
    </div>
  );
};

export default Home;

// src/components/common/Loader.tsx
import React from "react";
import { CircularProgress, Box } from "@mui/material";
import styled from "styled-components";

const LoaderWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.background};
`;

const Loader: React.FC = () => (
  <LoaderWrapper>
    <CircularProgress />
  </LoaderWrapper>
);

export default Loader;

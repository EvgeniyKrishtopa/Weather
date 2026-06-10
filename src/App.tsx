import React from "react";
import { Container } from "@mui/material";
import Form from "./components/Form";
import Info from "./components/Info";
import WeatherState from "./context/weatherState";
import { ContentStack, Page } from "./App.styles";

function App() {
  return (
    <WeatherState>
      <Page>
        <Container maxWidth="sm">
          <ContentStack>
            <Form />
            <Info />
          </ContentStack>
        </Container>
      </Page>
    </WeatherState>
  );
}

export default App;

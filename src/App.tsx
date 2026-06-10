import React from "react";
import Weatherstate from "./context/weatherState";
import Info from "./components/Info";
import Form from "./components/Form";
import "./App.scss";

function App() {
  return (
    <Weatherstate>
      <div className="wrapper">
        <Form />
        <Info />
      </div>
    </Weatherstate>
  );
}

export default App;

import React from "react";
import Weatherstate from "./context/weatherState";
import Info from "./components/info";
import Form from "./components/form";
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

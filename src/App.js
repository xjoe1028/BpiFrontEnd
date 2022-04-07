import React from "react";
import { BrowserRouter, Route, Switch, Link, Routes, } from "react-router-dom";
import BpiIndex from "./BpiIndex";
import Example from "./example";
import BpiCRUDTable from "./BpiCRUDTable";
import BpiTable from "./BpiTable";
import BpiEditForm from "./BpiEditForm";
// import Component's Base CSS
import "./index.css";
import "antd/dist/antd.css";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={BpiIndex} />
      <Route path="/bpi/edit" exact={true} component={BpiEditForm} />
      <Route path="/bpi/curd" component={BpiCRUDTable} />  
    </BrowserRouter>
  );
}

export default App;

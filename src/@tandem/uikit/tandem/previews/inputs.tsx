import "@tandem/uikit/scss/index.scss";
import "./inputs.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

export const renderPreview = () => {
  const element = document.createElement("div");
  ReactDOM.render(<div className="container">
    <ul className="row">
      <li className="button">
        Button
      </li>
      <li className="slider">

      </li>
      <li className="progress">
        Progress
      </li>
    </ul>
  </div>, element);
  return element;
}
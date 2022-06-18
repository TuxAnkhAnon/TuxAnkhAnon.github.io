import React from "react";
import ReactDOM from "react-dom/client";
import App from "./comps/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
      <React.StrictMode>
            <div style={{width: "100%",height: "100%"}}>
                  <App/>
            </div>
      </React.StrictMode>  
);


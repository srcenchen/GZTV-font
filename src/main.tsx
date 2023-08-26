import "uno.css";
import ReactDOM from "react-dom/client";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "@arco-design/web-react/dist/css/arco.css";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <FluentProvider theme={webLightTheme}>
    <RouterProvider router={router}/>
  </FluentProvider>
);

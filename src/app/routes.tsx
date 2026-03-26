import { createBrowserRouter } from "react-router";
import { JourneyMap } from "./components/JourneyMap";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: JourneyMap,
  },
  {
    path: "*",
    Component: JourneyMap,
  },
]);

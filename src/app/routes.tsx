import { createBrowserRouter } from "react-router";
import { JourneyMap } from "./components/JourneyMap";
import { BuilderDashboard } from "./components/builder/BuilderDashboard";
import { BuilderMapView } from "./components/builder/BuilderMapView";
import { BuilderLayout } from "./components/builder/BuilderLayout";
import { JourneyMapPreviewPage, PublishedJourneyMapPage } from "./components/builder/PublicJourneyMapPages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: JourneyMap,
  },
  {
    path: "/preview/:orgSlug/:mapSlug",
    Component: JourneyMapPreviewPage,
  },
  {
    path: "/published/:orgSlug/:siteSlug",
    Component: PublishedJourneyMapPage,
  },
  {
    path: "/app",
    Component: BuilderLayout,
    children: [
      {
        index: true,
        Component: BuilderDashboard,
      },
      {
        path: "orgs/:orgSlug/maps/:mapSlug",
        Component: BuilderMapView,
      },
    ],
  },
  {
    path: "*",
    Component: JourneyMap,
  },
]);

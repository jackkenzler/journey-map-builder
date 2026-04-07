import { createBrowserRouter, Navigate } from "react-router";
import { BuilderDashboard } from "./components/builder/BuilderDashboard";
import { BuilderMapView } from "./components/builder/BuilderMapView";
import { BuilderLayout } from "./components/builder/BuilderLayout";
import { JourneyMapPreviewPage, PublishedJourneyMapPage } from "./components/builder/PublicJourneyMapPages";

function HomeRedirect() {
  return <Navigate to="/app" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeRedirect,
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
    Component: HomeRedirect,
  },
]);

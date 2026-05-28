import { createBrowserRouter } from "react-router-dom";

import { EntriesPage } from "../modules/entries/page/EntriesPage";
import { OutPutPage } from "../modules/removals/page/OutPutPage";
import HistoryPage from "../modules/activity/page/HistoryPage";
import { Layout } from "../layout/Dasboard";
import UserTableExample from "../modules/permisses/PermissionsPage";
import AccounPage from "../modules/account/page/AccountPage";
import ProtectedRoute from "./ProtectedRoutePage";
import WorkerPage from "../modules/worker/page/WorkerPage";
import NoPermissionPage from "../components/page/NoPermissionPage";
import ProductModelpage from "../modules/catalogo/Product/page/ProductModelPage";
import { AssignmentsPage } from "../modules/assignments/page/AssignmentsPage";
import { ReturnsPage } from "../modules/returns/page/ReturnsPage";
import InventoryPage from "../modules/inventory/page/InventoryPage";
import ProfilePage from "../modules/profile/page/ProfilePage";
import { AuthPage } from "../modules/auth/AuthPage";
import RouterErrorPage from "../components/page/RouterErrorPage";
// import ToolTypepage from "../modules/catalogo/ToolType/Page/ProductModelPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthPage />,
    errorElement: <RouterErrorPage />,
  },
  {
    path: "/unauthorized",
    element: <NoPermissionPage />,
    errorElement: <RouterErrorPage />,
  },
  {
    path: "/not-found",
    element: <RouterErrorPage />,
    errorElement: <RouterErrorPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouterErrorPage />,
    children: [
      {
        path: "/",
        element: <Layout />,
        errorElement: <RouterErrorPage />,
        children: [
          { index: true, element: <EntriesPage /> },
          { path: "entries", element: <EntriesPage /> },
          { path: "out", element: <OutPutPage /> },
          { path: "assigment", element: <AssignmentsPage /> },
          { path: "returns", element: <ReturnsPage /> },
          { path: "history", element: <HistoryPage /> },
          { path: "permisses", element: <UserTableExample /> },
          { path: "account", element: <AccounPage /> },
          { path: "product_model", element: <ProductModelpage /> },
          { path: "worker", element: <WorkerPage /> },
          { path: "inventory", element: <InventoryPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "*", element: <RouterErrorPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <RouterErrorPage /> },
]);

export default router;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import GraficaDiaria from "./pages/graphic/Graphic.jsx";
import Layout from "./components/Layout.jsx";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <GraficaDiaria /> }
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

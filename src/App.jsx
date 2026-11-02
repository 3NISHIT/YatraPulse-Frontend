import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import LoginForm from "./pages/LoginForm";
import Tours from "./pages/Tours";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/tours",
      element: <Tours />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: "/admin/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/booking",
      element: <booking />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

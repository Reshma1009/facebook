import { useContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import EditProfile from "./pages/editProfile/EditProfile";
import Profile from "./pages/profile/Profile";
import "./style/dark.scss";

import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const AuthRouter = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthRouter>
          <Home />
        </AuthRouter>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/profile/:username",
      element: (
        <AuthRouter>
          <Profile />
        </AuthRouter>
      ),
    },
    {
      path: "/profile/:username/edit",
      element: (
        <AuthRouter>
          {" "}
          <EditProfile />
        </AuthRouter>
      ),
    },
  ]);
  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/*    <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route index element={<Home />} />
            <Route path="profile">
              <Route path=":userId" element={<Profile />} />
              <Route path=":userId/edit" element={<EditProfile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter> */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

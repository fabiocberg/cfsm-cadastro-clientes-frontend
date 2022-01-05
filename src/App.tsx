import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import { ChakraProvider } from "@chakra-ui/react";

interface PrivateRouteProps {
  children: JSX.Element;
  redirectTo: string;
}

const PrivateRoute = ({
  children,
  redirectTo,
}: PrivateRouteProps): JSX.Element => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/home"
            element={
              <PrivateRoute redirectTo="/">
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

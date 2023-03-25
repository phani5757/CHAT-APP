import React from "react";
import ReactDOM from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import ChatsPage from "./Pages/ChatsPage";
import ChatProvider from "./context/ChatProvider";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "chats",
    element: <ChatsPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChatProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </ChatProvider>
  </React.StrictMode>
);

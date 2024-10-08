import { createBrowserRouter, Outlet, Route, RouterProvider, useLocation } from 'react-router-dom';
import Navbar from "./components/navbar/Navbar";
import HomePage from "./pages/HomePage";
import WhatsAppWidget from "react-whatsapp-chat-widget";
import "react-whatsapp-chat-widget/index.css";
import programmer from "./assets/banner-image.png";
import ProjectsPage from './pages/ProjectsPage';
import { useEffect } from 'react';

const NavLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Navbar />
      <WhatsAppWidget
        phoneNo="7025248975"
        position="right"
        widgetWidthMobile="260px"
        messageBox={true}
        iconSize="56"
        iconColor="white"
        iconBgColor="rgb(79, 206, 93)"
        headerIcon={programmer}
        headerTitle="Ijlaaan"
        headerCaption="Online"
        chatPersonName="Support"
        chatMessage={<>Hi there 👋 <br /> How we can help you?</>}
        placeholder="Type a message.."
        btnBgColor="#075E54"
      />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavLayout />,
    children: [
      { path: "/", element: <HomePage />, index: true },
      { path: "/projects", element: <ProjectsPage /> },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

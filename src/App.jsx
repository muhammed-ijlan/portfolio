import { createBrowserRouter, Outlet, Route, RouterProvider, Routes } from 'react-router-dom'
import Navbar from "./components/navbar/Navbar"
import HomePage from "./pages/HomePage"
import WhatsAppWidget from "react-whatsapp-chat-widget";
import "react-whatsapp-chat-widget/index.css";

import programmer from "./assets/banner-image.png"

const NavLayout = () => {
  return (
    <>
      <Navbar />
      <WhatsAppWidget
        phoneNo="7025248975"
        position="right"
        // widgetWidth="300px" 
        widgetWidthMobile="260px"
        // autoOpen={true}
        // autoOpenTimer={1000}
        messageBox={true}
        // messageBoxTxt="Hi Team, is there any related service available ?"
        iconSize="56"
        iconColor="white"
        iconBgColor="rgb(79, 206, 93)"
        headerIcon={programmer}
        // headerIconColor="pink"
        // headerTxtColor="black"
        // headerBgColor="tomato"
        headerTitle="Ijlaaan"
        headerCaption="Online"
        // bodyBgColor="#bbb"
        chatPersonName="Support"
        chatMessage={<>Hi there 👋 <br /> How we can help you?</>}
        // footerBgColor="#999"
        placeholder="Type a message.."
        btnBgColor="#075E54"
      // btnTxt="Start Chat"
      // btnTxtColor="black"
      />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavLayout />,
    children: [
      { path: "/", element: <HomePage />, index: true },
    ]
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App

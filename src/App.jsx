import { createBrowserRouter, Outlet, Route, RouterProvider, Routes } from 'react-router-dom'
import Navbar from "./components/navbar/Navbar"
import HomePage from "./pages/HomePage"

const NavLayout = () => {
  return (
    <>
      <Navbar />
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

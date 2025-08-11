// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import GenreBooks from './pages/GenreBooks.jsx'
// import { createBrowserRouter,RouterProvider } from "react-router-dom"


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />
//   },
//     {
//     path: "/genres/:genreName",
//     element: <GenreBooks />
//   }
// ])

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RouterProvider router={router}></RouterProvider>
//   </StrictMode>,
// )


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

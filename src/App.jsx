import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import GenreBooks from "./pages/GenreBooks";
import "bootstrap/dist/css/bootstrap.min.css";
import { SearchProvider } from "./context/SearchContext";

export default function App() {
  return (
    <Router>
      
      <SearchProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genre/:genreName" element={<GenreBooks />} />
        </Routes>
      </SearchProvider>
    </Router>
  );
}




// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useState } from "react";
// import Home from "./pages/Home";
// import GenreBooks from "./pages/GenreBooks";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Nav from "./components/Nav"; // Optional, if you want global nav

// function App() {
//   const [searchBook, setSearchBook] = useState("");
//   return (
//     <BrowserRouter>
//       <Nav searchBook={searchBook} setSearchBook={setSearchBook} />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/genre/:genreName" element={<GenreBooks searchBook={searchBook} />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

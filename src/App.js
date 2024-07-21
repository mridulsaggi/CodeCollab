import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Joinroom from "./pages/room";
import Room from "./pages/Editorpage.js";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div>
        <Toaster />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Joinroom />} />
          <Route path="/editor/:roomid" element={<Room />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

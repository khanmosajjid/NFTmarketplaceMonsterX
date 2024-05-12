import { BrowserRouter, Routes, Route } from "react-router-dom";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// Style
import "./components/Style/style.css";
import "./components/Style/responsive.css";
import "./components/Style/nice-select.css";
import "./components/Style/fontawesome.css";
// Pages
import Home from "./views/Home/HomePage";
import Dashboard from "./views/Dashboard/Dashboard";
import Curation from "./views/Curation/Curation";
import NFTDetails from "./views/NFT/NFTDetails";
import Profile from "./components/Dashboard/Sidebar/Profile";
function App() {
  console.log("check for env is------>", process.env.REACT_APP_NODE_ENV);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/curation/:curationId" element={<Curation />} />
        <Route path="/dashboard/nft/:id" element={<NFTDetails />} />
        <Route path="/dashboard/user/:userId" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

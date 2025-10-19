import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import LostItems from "./Components/LostItems";
import FoundItems from "./Components/FoundItems";
import Home from "./Components/Home";
import ItemPage from "./Components/ItemPage";
import LostItem from "./Components/Lost_item";
import adminDash from "./Components/adminDash.js";
import MyListings from "./Components/MyListings";
import Layout from "./layout"; 
import AdminDash from "./Components/adminDash.js";
window.OneSignal = window.OneSignal || [];
const OneSignal = window.OneSignal;
function App() {
 
  
  return (
      <BrowserRouter>
          <Layout>
          <Routes>

          <Route path="/" element={<Home />}  />
          <Route path="/log-in" element={<Login/>} />
          <Route path="/sign-up" element={<Signup/>} />
          <Route path="/lostitems" element={<LostItems/>} />
          <Route path="/founditems" element={<FoundItems/>} />
          <Route path="/postitem" element={<LostItem/>} />
          <Route path="/mylistings" element={<MyListings/>} />
          <Route path="/:item" element={<ItemPage/>} />
          <Route path="/*" element={<Home/>} />
             <Route path="/admin/dashboard" element={<AdminDash/>} />
          </Routes>
          <ToastContainer />
          </Layout>


      </BrowserRouter>

  );
}

export default App;

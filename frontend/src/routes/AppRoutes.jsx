import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLogin from '../auth/UserLogin';
import UserRegister from '../auth/UserRegister';
import PartnerLogin from '../auth/PartnerLogin';
import PartnerRegister from '../auth/PartnerRegister';
import Home from '../general/Home';
import CreateFood from '../general/CreateFood';
import FoodPartnerProfile from '../general/foodPartnerProfile';
import Saved from '../general/SavedFood';


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/food-partner/login" element={<PartnerLogin />} />
        <Route path="/food-partner/register" element={<PartnerRegister />} />
        <Route path="/" element={<Home />} />
        <Route path="/create-food" element={<CreateFood/>}/>
        <Route path="food-partner/:id" element={<FoodPartnerProfile/>}/>
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes
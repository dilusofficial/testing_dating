import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';


import LoginScreen from '../pages/login_screen/login_screen';

import SwipeGallery from '../pages/swip/swip';
import UserLogin from '../pages/userlogin/userlogin';
import LandingPage from '../pages/landing_page/landing';
import Descripition from '../pages/describe/describe';
const Routing = () => {
    return (
     <>
   
      <Router>
        <Routes>
      <Route path='/' element={<LandingPage/>}></Route>
        
          <Route path="/swip" element={<SwipeGallery />}></Route>
          <Route path="/userlogin" element={<UserLogin />}></Route>

          <Route path="/profile" element={<Descripition/>}></Route>
        </Routes>
      </Router>
     </>
    );
  };
  
  export default Routing;
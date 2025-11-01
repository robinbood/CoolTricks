import { Routes, Route } from "react-router-dom";
import Main from "./Pages/Main";
import SignIn from "./Pages/Signin";
import SignUp from "./Pages/Signup";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import PassReset from "./Pages/PassReset";
import TokenLook from "./Pages/TokenLookup";
import Payment from "./Pages/Payment";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/Signin" element={<SignIn />} />
    <Route path="/Signup" element={<SignUp />} />
    <Route path="/forgot-pass" element={<PassReset />} />
    <Route path="/subscribe" element={<Payment />} />
    <Route path="token-lookup" element={<TokenLook />} />
    <Route path="/home" element={<Navbar />}>
      <Route index element={<Home />} />
    </Route>
  </Routes>
);
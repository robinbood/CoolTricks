import "./index.css";
import { Routes,Route } from "react-router";
import Main from "./Pages/Main";
import SignIn from "./Pages/Signin";
import SignUp from "./Pages/Signup";
import Navar from "./Pages/Navbar";
import Home from "./Pages/Home";
import PassReset from "./Pages/PassReset";
import TokenLook from "./Pages/TokenLookup";
import Payment from "./Pages/Payment";

export function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/Signin" element={<SignIn/>}/>
        <Route path="/Signup" element={<SignUp/>}/>
        <Route path="/forgot-pass" element={<PassReset/>}/>
        <Route path="/subscribe" element={<Payment/>}/>
        <Route path="token-lookup" element={<TokenLook/>} />
        <Route path="/home" element={<Navar/>}>
          <Route index element={<Home/>}/>
          <Route/>
          <Route/> 

        </Route>
      </Routes>
      
    </div>
  );
}

export default App;

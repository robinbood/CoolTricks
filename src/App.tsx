import "./index.css";
import { Routes,Route } from "react-router";
import Main from "./Pages/Main";
import SignIn from "./Pages/Signin";
import SignUp from "./Pages/Signup";
import Navar from "./Pages/Navbar";
import Home from "./Pages/Home";

export function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/Signin" element={<SignIn/>}/>
        <Route path="/Signup" element={<SignUp/>}/>
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

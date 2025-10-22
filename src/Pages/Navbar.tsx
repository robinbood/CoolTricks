import {NavLink, Outlet } from "react-router";
interface Navbar {
  label: string;
  path: string;
}
const Navar = () => {
  const items: Navbar[] = [
    { label: "Home", path: "/" },
    { label: "About This", path: "/api/about" },
  ];

  return (
    <>
    <nav>
        {items.map((item : Navbar)  => {
            return (
              // so Navlink automaticallyt sets a class to the element or page that we navigated to on the navbar so we can style it differently
                <NavLink key={item.path} to={item.path} className={({isActive}) => isActive ? "nav-link active" : "nav-link"} >{item.label}</NavLink>
            )
        })}
        
    </nav>
    <main className="main-content">
      {/* the most important part of the code,,everything gets rendered below the navbar....Hence you need the Outlet function */}
      <Outlet/>
    </main>
    </>
  )
};

export default Navar;
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
                <NavLink key={item.path} to={item.path} className={({isActive}) => isActive ? "nav-link active" : "nav-link"} >{item.label}</NavLink>
            )
        })}
    </nav>
    <main className="main-content">
      <Outlet/>
    </main>
    </>
  )
};

export default Navar;
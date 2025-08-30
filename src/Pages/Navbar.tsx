import { useLocation,Link } from "react-router";
interface Navbar {
  label: string;
  path: string;
}
const Navar = () => {
    const location = useLocation()
  const items: Navbar[] = [
    { label: "Home", path: "/" },
    { label: "About This", path: "/api/about" },
  ];

  return (
    <nav>
        {items.map((item : Navbar)  => {
            const isActive : boolean  = location.pathname === item.path
            return (
                <Link key={item.path} to={item.path} className={isActive ? "nav-link active" : "nav-link"} >{item.label}</Link>
            )
        })}
    </nav>
  )
};

export default Navar;
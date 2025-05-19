import { NavLink } from "react-router-dom";
import menu from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import { useState } from "react";

const Sidemenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="flex justify-between items-center mx-4 sm:mx-[10%] mt-5 font-outfit relative z-50">
      {/** Logo */}
      <div className="flex items-center gap-2">
        <img className="w-10 h-10" src={logo} alt="logo" />
        <p className="text-[20px] font-medium text-[#5AC5C8]">
          <span className="text-[25px] font-bold text-[#04353D]">Med</span>Sync
        </p>
      </div>

      {/** Menu Icon */}
      <div className="cursor-pointer w-8 h-8" onClick={toggleMenu}>
        <img src={menu} alt="menu" />
      </div>

      {/** Side Menu - Visible only when `menuOpen` is true */}
      {menuOpen && (
        <div className="text-2xl fixed top-0 left-0 w-full h-full bg-[#04353D] p-5">
          <div
            className="text-6xl font-thin cursor-pointer flex justify-end "
            onClick={toggleMenu}
          >
            x
          </div>
          <div className="text-white items-center flex justify-center">
            <ul className="mt-6 space-y-4">
              <li>
                <NavLink
                  to="/"
                  onClick={toggleMenu}
                  className="hover:text-[#5AC5C8]"
                >
                  HOME
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/department"
                  onClick={toggleMenu}
                  className="hover:text-[#5AC5C8]"
                >
                  DEPARTMENT
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  onClick={toggleMenu}
                  className="hover:text-[#5AC5C8]"
                >
                  ABOUT
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contact"
                  onClick={toggleMenu}
                  className="hover:text-[#5AC5C8]"
                >
                  CONTACT
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="flex justify-center mt-20">
            <button className="rounded-3xl bg-[#5AC5C8] text-white w-36 h-12">
            <NavLink to="/auth">Login</NavLink>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidemenu;

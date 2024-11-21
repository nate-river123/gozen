import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/logo">Logo Creator</Link></li>
      <li><Link to="/banner">Banner Creator</Link></li>
    </ul>
  </nav>
);

export default Navbar;


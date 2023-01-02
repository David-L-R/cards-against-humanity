import React from "react";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";

function Navbar() {
  return (
    <nav className="navContainer">
      <ul className="navUl">
        <Link className="navLink" href="/">
          <CgProfile />
        </Link>
        <Link className="navLink" href="/">
          <li>Sign up</li>
        </Link>
        <Link className="navLink" href="/">
          <li>Sign in</li>
        </Link>
      </ul>
    </nav>
  );
}

export default Navbar;

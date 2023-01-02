import React from "react";
import Link from "next/link";
import { HiOutlineUser } from "react-icons/hi";

function Navbar() {
  return (
    <nav className="navContainer">
      <ul>
        <li>
          <Link href="/" className="navLink">
            Sign Up
          </Link>
        </li>
        <li>
          <Link href="/" className="navLink">
            Login
          </Link>
        </li>
        <li>
          <Link href="/" className="navIcon">
            <HiOutlineUser />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

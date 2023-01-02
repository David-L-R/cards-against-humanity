import React from "react";
import Link from "next/link";
import { HiOutlineUser } from "react-icons/hi";

function Navbar() {
  return (
    <nav className="navContainer">
      <Link href="/" className="navLink">
        Sign Up
      </Link>
      <Link href="/" className="navLink">
        Login
      </Link>

      <Link href="/" className="navIcon">
        <HiOutlineUser />
      </Link>
    </nav>
  );
}

export default Navbar;

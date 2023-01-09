import Home from "./Home";
import Card from "../components/card";
import Avatar from "../components/Avatar";
import { useRef, useState } from "react";
import AvatarCustomizer from "../components/AvatarCustomizer";

export default function index() {
  const [userName, setUsername] = useState("Kevin");

  return (
    <main>
      <AvatarCustomizer />
      <input
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        name="UserName"
        id="UserName"
        placeholder="Default-Username"
      />
      <Avatar UserName={userName} />

      <Home />
    </main>
  );
}

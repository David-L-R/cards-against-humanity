import Home from "./Home";
import Card from "../components/card";
import Avatar from "../components/Avatar";
import { useRef, useState } from "react";
import AvatarCustomizer from "../components/AvatarCustomizer";

export default function index() {
  const [userName, setUsername] = useState("Kevin");
  const [savedAvatar, setSavedAvatar] = useState(null);

  return (
    <main>
      <Avatar UserName={userName} savedAvatar={savedAvatar} />
      <Home />
    </main>
  );
}

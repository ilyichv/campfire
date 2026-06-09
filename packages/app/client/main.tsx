import { createRoot } from "react-dom/client";
import manifest from "virtual:campfire/project";
import "virtual:campfire/theme.css";
import "./shell.css";
import { App } from "./app.js";

document.title = manifest.title ?? "Campfire";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}

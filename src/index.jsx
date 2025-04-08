import "../style.css";
import "./init.jsx"; // Initialize the app

// 🔁 Global registration for MathLive custom element
import { MathfieldElement } from "mathlive";
customElements.define("math-field", MathfieldElement);

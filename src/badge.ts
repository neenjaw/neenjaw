import { document } from "./badge/svgdom";
import { SVG, Element } from "@svgdotjs/svg.js";

// create canvas
const canvas: Element = SVG(document.documentElement);

canvas.rect(100, 100).fill("yellow").move(50, 50);

console.log(canvas.svg());

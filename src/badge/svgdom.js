// returns a window with a document and an svg root node
const { createSVGWindow } = require("svgdom");
const window = createSVGWindow();
const document = window.document;
const { registerWindow } = require("@svgdotjs/svg.js");

// register window and document
registerWindow(window, document);

module.exports = {
  document,
};

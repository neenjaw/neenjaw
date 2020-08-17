const { links } = require("./data");
const { queryStats } = require("./github-ql");
const { scrape, mentorUrl } = require("./exercism-scraper");
const { document } = require("./svgdom");
const { SVG } = require("@svgdotjs/svg.js");
const fs = require("fs");

const githubPromise = queryStats();
const scrapePromise = scrape(mentorUrl);

const fontSettings = {
  family: "Segoe UI,Helvetica,Arial,sans-serif",
  size: 16,
};

favorites = ["./img/javascript.png", "./img/typescript.png", "./img/python.png", "./img/elixir.png"];
play = ["./img/c-lang.png", "./img/java.png", "./img/golang.png", "./img/php.png"];
tech = [
  "./img/mysql.png",
  "./img/postgresql.png",
  "./img/react.png",
  "./img/redux.png",
  "./img/rxjs.png",
  "./img/ruby.png",
  "./img/kotlin.png",
];

Promise.all([githubPromise, scrapePromise])
  .then(([stats, { helpedCount, solutions }]) => {
    console.log({ stats, helpedCount, solutions: solutions.slice(0, 2) });

    // create canvas
    const canvas = SVG(document.documentElement).size(500, 310);

    canvas.rect(496, 306).radius(5).stroke({ color: "#333", width: 2 }).fill("#fff").move(2, 2);

    drawList(canvas, "Languages I like to work in:", favorites, 12, 2);
    drawList(canvas, "Languages I play around with:", play, 12, 62);
    drawList(canvas, "Cool technologies I'm learning:", tech, 12, 122);

    drawLinks(canvas, "Find me also on here:", links, 12, 182);

    canvas.line(250, 15, 250, 295).stroke({ color: "#000", width: 1 });

    return canvas;
  })
  .then((canvas) => fs.writeFileSync("./badge.svg", canvas.svg()));

function drawList(canvas, title, list, x, y) {
  canvas.text(title).font(fontSettings).fill("000").dx(x).dy(y);

  list.reduce(
    ({ x, y, sx, sy }, imagePath) => {
      canvas.image(imagePath).size(sx, sy).dx(x).dy(y);
      return {
        x: x + 30,
        y,
        sx,
        sy,
      };
    },
    { x, y: y + 30, sx: 25, sy: 25 }
  );
}

function drawLinks(canvas, title, links, x, y) {
  canvas.text(title).font(fontSettings).fill("000").dx(x).dy(y);

  links.reduce(
    ({ x, y, sx, sy }, { icon, name, url }) => {
      const link = canvas.link(url);
      link.image(icon).size(sx, sy).dx(x).dy(y);
      link
        .text(name)
        .font(fontSettings)
        .fill("000")
        .dx(x + 30)
        .dy(y);

      return {
        x,
        y: y + 30,
        sx,
        sy,
      };
    },
    { x, y: y + 30, sx: 25, sy: 25 }
  );
}

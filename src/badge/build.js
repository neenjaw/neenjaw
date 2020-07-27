const { queryStats } = require("./github-ql");
const { scrape, mentorUrl } = require("./exercism-scraper");
const { document } = require("./svgdom");
const { SVG } = require("@svgdotjs/svg.js");
const fs = require("fs");

const githubPromise = queryStats();
const scrapePromise = scrape(mentorUrl);

Promise.all([githubPromise, scrapePromise])
  .then(([details, solutions]) => {
    console.log({ details, solutions: solutions.data.slice(0, 5) });
    console.log(solutions.slice(0, 2));

    // create canvas
    const canvas = SVG(document.documentElement).size(500, 300);

    canvas.rect(496, 296).radius(5).stroke({ color: "#333", width: 2 }).fill("#eee").move(2, 2);

    return canvas;
  })
  .then((canvas) => fs.writeFileSync("./badge.svg", canvas.svg()));

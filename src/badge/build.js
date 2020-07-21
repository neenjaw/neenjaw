const { scrape, mentorUrl } = require("./exercism-scraper");
const { document } = require("./svgdom");
const { SVG } = require("@svgdotjs/svg.js");
const fs = require("fs");

scrape(mentorUrl)
  .then((solutions) => {
    console.log(solutions.slice(0, 2));

    // create canvas
    const canvas = SVG(document.documentElement).size(500, 300);

    canvas.rect(496, 296).radius(5).stroke({ color: "#333", width: 2 }).fill("#eee").move(2, 2);

    return canvas;
  })
  .then((canvas) => fs.writeFileSync("./badge.svg", canvas.svg()));

// GraphQL query
// {
//   user(login: "neenjaw") {
//     name
//     login
//     contributionsCollection {
//       totalCommitContributions
//     }
//     repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
//       totalCount
//     }
//     pullRequests(first: 1) {
//       totalCount
//     }
//     issues(first: 1) {
//       totalCount
//     }
//     repositories(first: 5, ownerAffiliations: OWNER, isFork: false, orderBy: {direction: DESC, field: STARGAZERS}) {
//       totalCount
//       nodes {
//         stargazers {
//           totalCount
//         }
//       }
//     }
//     followers {
//       totalCount
//     }
//   }
// }

import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import fs from "fs";

import Handlebars from "handlebars";
import { registerAllHelpers } from "./helpers";
registerAllHelpers(Handlebars);

import { Solution, monthMap, compareSolutionsByDate, mentorUrl } from "./scrape";
import * as readmeData from "./data";

axios.get(mentorUrl).then((response: AxiosResponse) => {
  const $ = cheerio.load(response.data);

  const solutions = <Solution[]>(<unknown>$("a.solution")
    .map((_i, solution) => {
      const el$ = $(solution);
      const date = el$.find("div.published-at").text().trim().split(" ");

      return {
        title: el$.find("div.title").text(),
        track: el$.find("div.track").text().slice(0, -6),
        date: {
          year: date[2],
          month: monthMap.get(date[0]),
          day: date[1],
        },
        date_obj: new Date(`${date[2]}-${monthMap.get(date[0])}-${date[1]}`),
      };
    })
    .toArray());

  solutions.sort(compareSolutionsByDate);

  const helpedCount = $("div.count").text();

  buildReadme(solutions, helpedCount);
});

function buildReadme(solutions: Solution[], helpedCount: string) {
  const templateSource = fs.readFileSync("./readme_template.hbs", { encoding: "utf-8" });
  const template = Handlebars.compile(templateSource);

  const data = {
    solutions: solutions.slice(0, 5),
    favorite: readmeData.favorites,
    know: readmeData.know,
    learning: readmeData.learning,
    other: readmeData.other,
    links: readmeData.links,
    helpedCount: helpedCount,
  };

  const output = template(data);
  fs.writeFileSync("./README.md", output);
}

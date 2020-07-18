import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import fs from "fs";

type Solution = {
  title: string;
  track: string;
  date: {
    year: string;
    month: string;
    day: string;
  };
  date_obj: Date;
};

const month = new Map<string, string>([
  ["Jan", "01"],
  ["Feb", "02"],
  ["Mar", "03"],
  ["Apr", "04"],
  ["May", "05"],
  ["Jun", "06"],
  ["Jul", "07"],
  ["Aug", "08"],
  ["Sep", "09"],
  ["Oct", "10"],
  ["Nov", "11"],
  ["Dec", "12"],
]);

const compareSolutionsByDate = (a: Solution, b: Solution) => b.date_obj.getTime() - a.date_obj.getTime();

const mentorUrl = "https://exercism.io/profiles/neenjaw";

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
          month: month.get(date[0]),
          day: date[1],
        },
        date_obj: new Date(`${date[2]}-${month.get(date[0])}-${date[1]}`),
      };
    })
    .toArray());

  solutions.sort(compareSolutionsByDate);

  const helpedCount = $("div.count").text();

  buildReadme(solutions, helpedCount);
});

function buildReadme(solutions: Solution[], helpedCount: string) {
  function imageUrl(language: string, slug: string) {
    return `${language} <img src="./img/${slug}.png" alt="${language} Language" width="16px" height="16px">`;
  }

  let output = `👋 Hi there! I'm Tim.

I like developing software. Am not tied to a particular ecosystem, but I like:

  - ${imageUrl("JavaScript", "typescript")} (${imageUrl("TypeScript", "typescript")})
  - ${imageUrl("Elixir", "elixir")}
  - ${imageUrl("Python", "python")}

I know some:

  - ${imageUrl("Java", "java")}
  - ${imageUrl("C", "c-lang")}

And right now I am learning:

  - ${imageUrl("Ruby", "ruby")}

---

Here what I have been up to on exercism.io (one of my favorite hangouts):

  - I have helped ${helpedCount} students learn programming.
  - Some recent solutions I've completed:
`;

  output += solutions
    .slice(0, 5)
    .map((s) => `    - ${s.title} (${s.track}) on ${s.date.year}-${s.date.month}-${s.date.day}`)
    .join("\n");

  fs.writeFileSync("./README.md", output);
}

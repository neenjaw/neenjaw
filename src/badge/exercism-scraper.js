const axios = require("axios");
const cheerio = require("cheerio");

const mentorUrl = "https://exercism.io/profiles/neenjaw";

const monthMap = new Map([
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

const compareSolutionsByDate = (a, b) => b.date_obj.getTime() - a.date_obj.getTime();

const scrape = async (url) => {
  const response = await axios.get(url);

  const $ = cheerio.load(response.data);

  const solutions = $("a.solution")
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
    .toArray();

  solutions.sort(compareSolutionsByDate);

  const helpedCount = $("div.count").text();

  return { helpedCount, solutions };
};

module.exports = {
  mentorUrl,
  scrape,
};

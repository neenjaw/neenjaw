export type Solution = {
  title: string;
  track: string;
  date: {
    year: string;
    month: string;
    day: string;
  };
  date_obj: Date;
};

export const monthMap = new Map<string, string>([
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

export const compareSolutionsByDate = (a: Solution, b: Solution) => b.date_obj.getTime() - a.date_obj.getTime();

export const mentorUrl = "https://exercism.io/profiles/neenjaw";

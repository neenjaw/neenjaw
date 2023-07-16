import { SafeString } from "handlebars";

const helpers = [
  {
    name: "print_item",
    fn: function (item: string, slug: string) {
      const url = `https://raw.githubusercontent.com/neenjaw/neenjaw/master/img/${slug}.png`;
      return new SafeString(`${item} <img src="${url}" alt="Logo for ${item}" width="16px" height="16px">`);
    },
  },
  {
    name: "print_link",
    fn: function (icon: string, name: string, url: string) {
      const iconUrl = `https://raw.githubusercontent.com/neenjaw/neenjaw/master/img/${icon}.png`;
      const img = `<img src="${iconUrl}" alt="Logo for ${icon}" width="16px" height="16px">`;
      return new SafeString(`<a href="${url}">${img} ${name}</a>`);
    },
  },
  {
    name: "print_book",
    fn: function (emoji: string, name: string, url: string) {
      return new SafeString(`<a href="${url}">${emoji} ${name}</a>`);
    },
  },
];

export const registerAllHelpers = (instance: any) => {
  helpers.forEach((helper) => instance.registerHelper(helper.name, helper.fn));
};

const axios = require("axios");
const token = process.env.NEENJAW_TOKEN;

const githubEndpoint = "https://api.github.com/graphql";

function request(data, headers) {
  return axios({
    url: githubEndpoint,
    method: "post",
    headers,
    data,
  });
}

function queryStats() {
  data = getQuery();
  header = getHeader();
  return request(data, header);
}

function getQuery() {
  return {
    query: `
    {
      user(login: "neenjaw") {
        name
        login
        contributionsCollection {
          totalCommitContributions
        }
        repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
          totalCount
        }
        pullRequests(first: 1) {
          totalCount
        }
        issues(first: 1) {
          totalCount
        }
        repositories(first: 5, ownerAffiliations: OWNER, isFork: false, orderBy: {direction: DESC, field: STARGAZERS}) {
          totalCount
          nodes {
            stargazers {
              totalCount
            }
          }
        }
        followers {
          totalCount
        }
      }
    }
    `,
  };
}

function getHeader() {
  return {
    Authorization: `bearer ${token}`,
  };
}

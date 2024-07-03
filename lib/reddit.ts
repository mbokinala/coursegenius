import { CoreTool } from "ai";
import axios from "axios";
import { z } from "zod";
const qs = require("qs");

async function getToken() {
  return {
    access_token:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzE5Njk1MjExLjg5MTI5MiwiaWF0IjoxNzE5NjA4ODExLjg5MTI5MiwianRpIjoielJSdU5RSDJJcUF2TUxINGs3UElDOHd6QmlrSFR3IiwiY2lkIjoiZlMyZHFHVmVCX09pR0xJNVY5OVRkdyIsImxpZCI6InQyX2FpenlnMzhwIiwiYWlkIjoidDJfYWl6eWczOHAiLCJsY2EiOjE2MTQwNzEzMDcwMDAsInNjcCI6ImVKeUtWdEpTaWdVRUFBRF9fd056QVNjIiwiZmxvIjo5fQ.IC4vKOWbSv4W1jOXZ3XJTjfIuBRqn16UDJiV96TKHpHqr51hvNa-8OCdtbP5eD-dpphdlHI9D4OD_bpUUBvdBNHNqEV8dxipyIN-SvQZY2VTryuQgXPcdkq-BadLoiWmM5jaZdLFMqCGtzKEI7CNxRUhcHu8Em9Y5bQGMd5jrONrB49zGkt75F0pzAvFZQQHAPOb-6ciKzgVpJnohpar8ZRRK-eJ9fNtt597LrlU6NhyhrJN3US5R_WaTWLv6JSFgKS_CJtS6TjojRdRmvRrfgJnyXjHxNg3r4NZrmcbCurMWiUDYps6LziawMPGbYl5QgouvwI3nispE-Wjfy7RUQ",
    token_type: "bearer",
    expires_in: 86400,
    scope: "*",
  };

  const data = qs.stringify({
    grant_type: "password",
    username: "serene_stealth",
    password: "ZycM8xU7ia",
  });

  const config = {
    method: "post",
    url: "https://www.reddit.com/api/v1/access_token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: "fS2dqGVeB_OiGLI5V99Tdw",
      password: "gko_LXELoV07ZBNUXrvWZfzE3aI",
    },
    data: data,
  };

  try {
    let result = await axios(config);
    console.log(result.data);
  } catch (err: any) {
    console.log(err.response.data);
  }
}

async function executeRedditRequest(url: string, method = "GET") {
  let token = await getToken();
  try {
    let response = await axios({
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "User-Agent": "ChangeMeClient/0.1 by serene_stealth",
      },
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
  }
}

async function searchSubreddit(subredditName: string) {
  let response = await executeRedditRequest(
    `https://oauth.reddit.com/api/search_reddit_names?query=${subredditName}`,
    "POST",
  );
  return response;
}

async function getMe() {
  let response = await executeRedditRequest(
    "https://oauth.reddit.com/api/v1/me",
  );
  return response;
}

async function getAboutSubreddit(subredditName: string) {
  let response = await executeRedditRequest(
    `https://oauth.reddit.com/r/${subredditName}/about`,
  );
  return response;
}

async function searchPostsFromSubreddit(
  subredditName: string,
  query: string,
  sort = "top",
) {
  let response = await executeRedditRequest(
    `https://oauth.reddit.com/r/${subredditName}/search?q=${query}&restrict_sr=on&sort=${sort}&t=all`,
  );

  let posts = response.data.children.map(async (post: any) => {
    return {
      title: post.data.title,
      selftext: post.data.selftext,
      id: post.data.id,
    };
  });
  return posts;
}

async function getCommentsForPost(subreddit: string, postId: string) {
  if (!subreddit || !postId) {
    return { error: "Invalid subreddit or post id" };
  }
  let response = await executeRedditRequest(
    `https://oauth.reddit.com/r/${subreddit}/comments/${postId}`,
    "GET",
  );

  type Comment = {
    id: string;
    content: string;
    replies: Comment[];
  };

  if (!response || !response[1]) {
    return { error: "No comments found" };
  }

  let commentsData = response[1].data.children;

  // recursive function to parse comments and replies
  const parseComment = (commentData: any) => {
    let id = commentData.data.id;
    let content = commentData.data.body;
    let replies =
      commentData.data.replies?.data?.children?.map(parseComment) ?? [];

    return {
      id,
      content,
      replies,
    };
  };

  // parse commentsData into Comments
  let comments = commentsData.map(parseComment);

  return comments;
}

export let redditTools: Record<string, CoreTool> = {
  search_subreddits: {
    description: "Search for a subreddit",
    parameters: z.object({
      query: z.string().describe("the subreddit query to search for"),
    }),
    execute: async ({ query }) => {
      console.log("[TOOL] search_subreddit: ", query);
      return await searchSubreddit(query);
    },
  },
  search_posts: {
    description: "Search for posts within a subreddit",
    parameters: z.object({
      subredditName: z
        .string()
        .describe("the subreddit to search without the leading r/"),
      query: z.string().describe("the query to search for"),
    }),
    execute: async ({ subredditName, query }) => {
      console.log(
        `[TOOL] searchPosts - searching r/${subredditName} for ${query}`,
      );
      let result = await searchPostsFromSubreddit(subredditName, query);
      console.log("[TOOL] got", result.length, "posts");
      return result;
    },
  },
  get_comments_for_post: {
    description: "Get comments for a post",
    parameters: z.object({
      subreddit: z.string().describe("the subreddit of the post"),
      id: z.string().describe("the id of the post"),
    }),
    execute: async ({ subreddit, postId }) => {
      console.log("[TOOL] get_comments_for_post: ", subreddit, postId);
      return await getCommentsForPost(subreddit, postId);
    },
  },
  get_about_subreddit: {
    description: "Get information about a subreddit",
    parameters: z.object({
      subreddit: z.string().describe("the subreddit to get information about"),
    }),
    execute: async ({ subreddit }) => {
      console.log("[TOOL] get_about_subreddit: ", subreddit);
      return await getAboutSubreddit(subreddit);
    },
  },
};

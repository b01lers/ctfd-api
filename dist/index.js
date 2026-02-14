'use strict';

function createChallengesMethods(client) {
  return {
    /**
     * Attempts to submit a flag for the given challenge.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/challenges/operation/post_challenge_attempt}
     *
     * @param id The ID of the challenge to submit a flag for.
     * @param flag The flag to submit.
     * @returns The status of the flag submission.
     */
    async submitFlag(id, flag) {
      const { session, nonce } = await client.getAuthedSessionNonce();
      const res = await (await fetch(`${client.url}/api/v1/challenges/attempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Csrf-Token": nonce,
          cookie: session
        },
        body: JSON.stringify({ challenge_id: id, submission: flag })
      })).json();
      return res.data;
    },
    /**
     * Fetches the list of all challenges.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/challenges/operation/get_challenge_list}
     *
     * @returns The list of challenges, as a `Challenge[]`.
     */
    async get() {
      return client.callApi("/challenges");
    },
    /**
     * Fetches details for the given challenge.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/challenges/operation/get_challenge}.
     *
     * @param id The ID of the challenge to fetch.
     * @returns The challenge details.
     */
    async getDetails(id) {
      return client.callApi(`/challenges/${id}`);
    },
    /**
     * Fetches solves for the given challenge.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/challenges/operation/get_challenge_solves}.
     *
     * @param id The ID of the challenge to fetch solves for.
     * @returns The challenge's solves.
     */
    async getSolves(id) {
      return client.callApi(`/challenges/${id}/solves`);
    }
  };
}

function createScoreboardMethods(client) {
  return {
    /**
     * Fetches the list of scoreboard entries.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/scoreboard/operation/get_scoreboard_list}
     *
     * @returns The scoreboard, as a `ScoreboardEntry[]`.
     */
    async get() {
      return client.callApi("/scoreboard");
    },
    /**
     * Fetches details for the top `n` teams on the scoreboard.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/scoreboard/operation/get_scoreboard_detail}
     *
     * @param count The number of teams to fetch.
     * @returns The scoreboard details.
     */
    async getTop(count) {
      return client.callApi(`/scoreboard/top/${count}`);
    }
  };
}

function createUsersMethods(client) {
  return {
    me: {
      /**
       * Retrieves the currently logged-in user.
       * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_private}
       * @returns The logged-in user.
       */
      async get() {
        return client.callApi("/users/me");
      },
      /**
       * Retrieves solves for the currently logged-in user.
       * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_private_solves}
       *
       * @returns The logged-in user's solves.
       */
      async getSolves() {
        return client.callApi("/users/me/solves");
      },
      /**
       * Retrieves awards for the currently logged-in user.
       * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_private_awards}
       *
       * @returns The logged-in user's awards.
       */
      async getAwards() {
        return client.callApi("/users/me/awards");
      }
    },
    /**
     * Retrieves a user by ID.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_public}
     *
     * @param id The ID of the user to retrieve.
     * @returns The fetched user.
     */
    async getById(id) {
      return client.callApi(`/users/${id}`);
    },
    /**
     * Retrieves solves for a given user.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_public_solves}
     *
     * @param id The ID of the user to retrieve solves for.
     * @returns The user's solves.
     */
    async getSolves(id) {
      return client.callApi(`/users/${id}/solves`);
    },
    /**
     * Retrieves awards for a given user.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_public_awards}
     *
     * @param id The ID of the user to retrieve awards for.
     * @returns The user's awards.
     */
    async getAwards(id) {
      return client.callApi(`/users/${id}/awards`);
    }
  };
}

function extractNonce(raw) {
  return raw.match(/'csrfNonce': "(.+?)"/)[1];
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class CTFdClient {
  constructor(options) {
    __publicField(this, "url");
    __publicField(this, "username");
    __publicField(this, "password");
    __publicField(this, "cachedSession", null);
    __publicField(this, "cachedNonce", null);
    __publicField(this, "sessionExpiry", /* @__PURE__ */ new Date());
    __publicField(this, "challenges");
    __publicField(this, "scoreboard");
    __publicField(this, "users");
    this.url = options.url.endsWith("/") ? options.url.slice(0, -1) : options.url;
    this.username = options.username;
    this.password = options.password;
    this.challenges = createChallengesMethods(this);
    this.scoreboard = createScoreboardMethods(this);
    this.users = createUsersMethods(this);
  }
  async callApi(endpoint) {
    const { session, nonce } = await this.getAuthedSessionNonce();
    const res = await (await fetch(`${this.url}/api/v1${endpoint}`, {
      headers: {
        "Csrf-Token": nonce,
        cookie: session
      }
    })).json();
    return res.data;
  }
  // TODO
  async getAuthedSessionNonce() {
    if (/* @__PURE__ */ new Date() < this.sessionExpiry && this.cachedSession && this.cachedNonce)
      return { session: this.cachedSession, nonce: this.cachedNonce };
    const res = await fetch(`${this.url}/login`);
    const [session] = res.headers.getSetCookie()[0].split("; ");
    const nonce = extractNonce(await res.text());
    const params = new URLSearchParams();
    params.append("name", this.username);
    params.append("password", this.password);
    params.append("_submit", "Submit");
    params.append("nonce", nonce);
    const loginRes = await fetch(`${this.url}/login`, {
      method: "POST",
      headers: { cookie: session },
      redirect: "manual",
      body: params
    });
    const [authedSession, expiresGmt] = loginRes.headers.getSetCookie()[0].split("; ");
    const authedRaw = await (await fetch(`${this.url}/challenges`, {
      headers: { cookie: authedSession }
    })).text();
    this.cachedSession = authedSession;
    this.cachedNonce = extractNonce(authedRaw);
    this.sessionExpiry = new Date(expiresGmt.slice(8));
    return {
      nonce: this.cachedNonce,
      session: this.cachedSession
    };
  }
}

exports.CTFdClient = CTFdClient;

'use strict';

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
    this.url = options.url.endsWith("/") ? options.url.slice(0, -1) : options.url;
    this.username = options.username;
    this.password = options.password;
  }
  async submitFlag(id, flag) {
    const { session, nonce } = await this.getAuthedSessionNonce();
    const res = await (await fetch(`${this.url}/api/v1/challenges/attempt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Csrf-Token": nonce,
        cookie: session
      },
      body: JSON.stringify({ challenge_id: id, submission: flag })
    })).json();
    return res.data;
  }
  async getChallenges() {
    const { session } = await this.getAuthedSessionNonce();
    const res = await (await fetch(`${this.url}/api/v1/challenges`, {
      headers: { cookie: session }
    })).json();
    return res.data;
  }
  async getChallengeDetails(id) {
    const { session } = await this.getAuthedSessionNonce();
    const res = await (await fetch(`${this.url}/api/v1/challenges/${id}`, {
      headers: { cookie: session }
    })).json();
    return res.data;
  }
  async getScoreboard() {
    const { session, nonce } = await this.getAuthedSessionNonce();
    const res = await (await fetch(`${this.url}/api/v1/scoreboard`, {
      headers: {
        "Csrf-Token": nonce,
        cookie: session
      }
    })).json();
    return res.data;
  }
  async getAuthedSessionNonce() {
    if (/* @__PURE__ */ new Date() < this.sessionExpiry && this.cachedSession && this.cachedNonce)
      return { session: this.cachedSession, nonce: this.cachedNonce };
    const res = await fetch(`${this.url}/login`);
    const [session] = res.headers.getSetCookie()[0].split("; ");
    const nonce = extractNonce(await res.text());
    const formData = new URLSearchParams();
    formData.append("name", this.username);
    formData.append("password", this.password);
    formData.append("_submit", "Submit");
    formData.append("nonce", nonce);
    const loginRes = await fetch(`${this.url}/login`, {
      method: "POST",
      headers: { cookie: session },
      redirect: "manual",
      body: formData
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

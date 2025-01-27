import { extractNonce } from './util';
import type { ChallengesResponse, FlagSubmissionResponse, ScoreboardResponse } from './types';


type ClientOptions = {
    url: string,
    username: string,
    password: string,
}

export class CTFdClient {
    private readonly url: string;
    private readonly username: string;
    private readonly password: string;

    private cachedSession: string | null = null;
    private cachedNonce: string | null = null;
    private sessionExpiry = new Date();

    constructor(options: ClientOptions) {
        this.url = options.url.endsWith('/') ? options.url.slice(0, -1) : options.url;
        this.username = options.username;
        this.password = options.password;
    }

    public async submitFlag(id: number, flag: string) {
        const { session, nonce } = await this.getAuthedSessionNonce();

        const res = await (await fetch(`${this.url}/api/v1/challenges/attempt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Csrf-Token': nonce,
                cookie: session,
            },
            body: JSON.stringify({ challenge_id: id, submission: flag }),
        })).json() as FlagSubmissionResponse;

        return res.data;
    }

    public async getChallenges() {
        const { session } = await this.getAuthedSessionNonce();

        const res = await (await fetch(`${this.url}/api/v1/challenges`, {
            headers: { cookie: session }
        })).json() as ChallengesResponse;

        return res.data;
    }

    public async getScoreboard() {
        const { session, nonce } = await this.getAuthedSessionNonce();

        const res = await (await fetch(`${this.url}/api/v1/scoreboard`, {
            headers: {
                'Csrf-Token': nonce,
                cookie: session,
            },
        })).json() as ScoreboardResponse;

        return res.data;
    }

    private async getAuthedSessionNonce() {
        // If we have a cached, non-expired session, use it
        if (new Date() < this.sessionExpiry && this.cachedSession && this.cachedNonce)
            return { session: this.cachedSession, nonce: this.cachedNonce };

        const res = await fetch(`${this.url}/login`);

        const [session] = res.headers.getSetCookie()[0].split('; ');
        const nonce = extractNonce(await res.text());

        const formData = new FormData();
        formData.append('name', this.username);
        formData.append('password', this.password);
        formData.append('_submit', 'Submit');
        formData.append('nonce', nonce);

        const loginRes = await fetch(`${this.url}/login`, {
            method: 'POST',
            headers: { cookie: session },
            redirect: 'manual',
            body: formData,
        });

        const [authedSession, expiresGmt] = loginRes.headers.getSetCookie()[0].split('; ');
        const authedRaw = await (await fetch(`${this.url}/challenges`, {
            headers: { cookie: authedSession }
        })).text();

        // Cache session data and expiry date
        this.cachedSession = authedSession;
        this.cachedNonce = extractNonce(authedRaw);
        this.sessionExpiry = new Date(expiresGmt.slice(8));

        return {
            nonce: this.cachedNonce,
            session: this.cachedSession,
        };
    }
}

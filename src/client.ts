import { createChallengesMethods } from './endpoints/challenges';
import { createScoreboardMethods } from './endpoints/scoreboard';
import { createUsersMethods } from './endpoints/users';
import { extractNonce } from './util';
import type { APISuccess } from './types/api';


type ClientOptions = {
    url: string,
    username: string,
    password: string,
}

export class CTFdClient {
    public readonly url: string;
    private readonly username: string;
    private readonly password: string;

    private cachedSession: string | null = null;
    private cachedNonce: string | null = null;
    private sessionExpiry = new Date();

    public readonly challenges: ReturnType<typeof createChallengesMethods>;
    public readonly scoreboard: ReturnType<typeof createScoreboardMethods>;
    public readonly users: ReturnType<typeof createUsersMethods>;

    constructor(options: ClientOptions) {
        this.url = options.url.endsWith('/') ? options.url.slice(0, -1) : options.url;
        this.username = options.username;
        this.password = options.password;

        this.challenges = createChallengesMethods(this);
        this.scoreboard = createScoreboardMethods(this);
        this.users = createUsersMethods(this);
    }

    public async callApi<T>(endpoint: string) {
        const { session, nonce } = await this.getAuthedSessionNonce();

        // TODO: error handling?
        const res = await (await fetch(`${this.url}/api/v1${endpoint}`, {
            headers: {
                'Csrf-Token': nonce,
                cookie: session,
            },
        })).json() as APISuccess<T>;

        return res.data;
    }

    // TODO
    public async getAuthedSessionNonce() {
        // If we have a cached, non-expired session, use it
        if (new Date() < this.sessionExpiry && this.cachedSession && this.cachedNonce)
            return { session: this.cachedSession, nonce: this.cachedNonce };

        const res = await fetch(`${this.url}/login`);

        const [session] = res.headers.getSetCookie()[0].split('; ');
        const nonce = extractNonce(await res.text());

        const params = new URLSearchParams();
        params.append('name', this.username);
        params.append('password', this.password);
        params.append('_submit', 'Submit');
        params.append('nonce', nonce);

        const loginRes = await fetch(`${this.url}/login`, {
            method: 'POST',
            headers: { cookie: session },
            redirect: 'manual',
            body: params,
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

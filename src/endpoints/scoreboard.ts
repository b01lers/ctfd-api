import type { CTFdClient } from '../client';
import type { ScoreboardEntry } from '../types/scoreboard';
import type { APISuccess } from '../types/api';


// TODO: abstract APISuccess
export type ScoreboardResponse = APISuccess<ScoreboardEntry[]>;

export function createScoreboard(client: CTFdClient) {
    return {
        async getScoreboard() {
            const { session, nonce } = await client.getAuthedSessionNonce();

            const res = await (await fetch(`${client.url}/api/v1/scoreboard`, {
                headers: {
                    'Csrf-Token': nonce,
                    cookie: session,
                },
            })).json() as ScoreboardResponse;

            return res.data;
        }
    }
}

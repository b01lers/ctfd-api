import type { CTFdClient } from '../client';
import type { ScoreboardEntry } from '../types/scoreboard';


export function createScoreboardMethods(client: CTFdClient) {
    return {
        /**
         * Fetches the list of scoreboard entries.
         * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/scoreboard/operation/get_scoreboard_list}
         *
         * @returns The scoreboard, as a `ScoreboardEntry[]`.
         */
        async get() {
            return client.callApi<ScoreboardEntry[]>('/scoreboard');
        }
    }
}

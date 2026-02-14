import type { CTFdClient } from '../client';
import type { ScoreboardDetails, ScoreboardEntry } from '../types/scoreboard';


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
        },

        /**
         * Fetches details for the top `n` teams on the scoreboard.
         * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/scoreboard/operation/get_scoreboard_detail}
         *
         * @param count The number of teams to fetch.
         * @returns The scoreboard details.
         */
        async getTop(count: number) {
            return client.callApi<ScoreboardDetails[]>(`/scoreboard/top/${count}`);
        }
    }
}

import type { CTFdClient } from '../client';
import type { ScoreboardEntry } from '../types/scoreboard';


export function createScoreboard(client: CTFdClient) {
    return {
        async getScoreboard() {
            return client.callApi<ScoreboardEntry[]>('/scoreboard');
        }
    }
}

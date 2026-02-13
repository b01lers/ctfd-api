import type { CTFdClient } from '../client';
import type { ChallengeDetailsResponse, ChallengesResponse, FlagSubmissionResponse } from '../types';


export function createChallenges(client: CTFdClient) {
    return {
        /**
         * Attempts to submit a flag for the given challenge.
         * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/challenges/operation/post_challenge_attempt}
         *
         * @param id The ID of the challenge to submit a flag for.
         * @param flag The flag to submit.
         * @returns The status of the flag submission.
         */
        async submitFlag(id: number, flag: string) {
            const { session, nonce } = await client.getAuthedSessionNonce();

            const res = await (await fetch(`${client.url}/api/v1/challenges/attempt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Csrf-Token': nonce,
                    cookie: session,
                },
                body: JSON.stringify({ challenge_id: id, submission: flag }),
            })).json() as FlagSubmissionResponse;

            return res.data;
        },

        async getChallenges() {
            const { session } = await client.getAuthedSessionNonce();

            const res = await (await fetch(`${client.url}/api/v1/challenges`, {
                headers: { cookie: session }
            })).json() as ChallengesResponse;

            return res.data;
        },

        /**
         * Fetches details for the given challenge.
         * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/challenges/operation/get_challenge}.
         *
         * @param id The ID of the challenge to fetch.
         * @returns The challenge details.
         */
        async getDetails(id: number) {
            const { session } = await client.getAuthedSessionNonce();

            const res = await (await fetch(`${client.url}/api/v1/challenges/${id}`, {
                headers: { cookie: session }
            })).json() as ChallengeDetailsResponse;

            return res.data;
        }
    }
}

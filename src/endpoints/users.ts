import type { CTFdClient } from '../client';
import type { Award, User } from '../types/users';


interface UserSolve {
    user: {
        name: string,
        id: number,
    },
    date: string, // ISO
    challenge_id: number,
    challenge: {
        value: number,
        name: string,
        id: number,
        category: string,
    },
    team: number | null,
    id: number,
    type: "correct" // TODO?
}

export function createUsers(client: CTFdClient) {
    return {
        me: {
            /**
             * Retrieves the currently logged-in user.
             * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_private}
             * @returns The logged-in user.
             */
            async getMeUser() {
                return client.callApi<User>('/users/me');
            },

            /**
             * Retrieves solves for the currently logged-in user.
             * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_private_solves}
             *
             * @returns The logged-in user's solves.
             */
            async getSolves() {
                return client.callApi<UserSolve[]>('/users/me/solves');
            },

            /**
             * Retrieves awards for the currently logged-in user.
             * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_private_awards}
             *
             * @returns The logged-in user's awards.
             */
            async getAwards() {
                return client.callApi<Award[]>('/users/me/awards');
            }
        },

        /**
         * Retrieves a user by ID.
         * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_public}
         *
         * @param id The ID of the user to retrieve.
         * @returns The fetched user.
         */
        async getById(id: number) {
            return client.callApi<User>(`/users/${id}`);
        },

        /**
         * Retrieves solves for a given user.
         * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_public_solves}
         *
         * @param id The ID of the user to retrieve solves for.
         * @returns The user's solves.
         */
        async getSolves(id: number) {
            return client.callApi<UserSolve[]>(`/users/${id}/solves`);
        },

        /**
         * Retrieves awards for a given user.
         * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_public_awards}
         *
         * @param id The ID of the user to retrieve awards for.
         * @returns The user's awards.
         */
        async getAwards(id: number) {
            return client.callApi<Award[]>(`/users/${id}/awards`);
        }
    }
}

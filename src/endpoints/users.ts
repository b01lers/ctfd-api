import type { CTFdClient } from '../client';
import type { User } from '../types/users';


export function createUsers(client: CTFdClient) {
    return {
        me: {
            /**
             * Retrieves the currently logged-in user.
             * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_private}
             * @returns The logged-in user.
             */
            async getMeUser() {
                return client.callApi<User>(`/users/me`);
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
        }
    }
}

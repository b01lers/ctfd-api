interface Solve {
    account_id: number;
    account_url: string;
    date: string;
    name: string;
}
type ChallengeType = 'standard' | 'multiple_choice' | 'code';
interface Challenge {
    id: number;
    type: ChallengeType;
    name: string;
    category: string;
    script: string;
    solved_by_me: boolean;
    solves: number;
    tags: string[];
    template: string;
    value: number;
}
type BaseChallengeDetails = {
    id: number;
    name: string;
    value: number;
    description: string;
    category: string;
    state: "visible";
    max_attempts: number;
    type_data: {
        id: ChallengeType;
        name: ChallengeType;
        templates: {
            create: string;
            update: string;
            view: string;
        };
        scripts: {
            create: string;
            update: string;
            view: string;
        };
    };
    solves: number;
    solved_by_me: boolean;
    attempts: number;
    files: string[];
    tags: string[];
    hints: string[];
    view: string;
};
type StandardChallengeDetails = BaseChallengeDetails & {
    type: Exclude<ChallengeType, 'code'>;
    attribution: string | null;
    connection_info: string | null;
    next_id: number | null;
};
type ProgrammingChallengeDetails = BaseChallengeDetails & {
    type: Extract<ChallengeType, 'code'>;
    language: string;
    version: null;
    output_enabled: null;
};
type ChallengeDetails = StandardChallengeDetails | ProgrammingChallengeDetails;

declare function createChallengesMethods(client: CTFdClient): {
    /**
     * Attempts to submit a flag for the given challenge.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/challenges/operation/post_challenge_attempt}
     *
     * @param id The ID of the challenge to submit a flag for.
     * @param flag The flag to submit.
     * @returns The status of the flag submission.
     */
    submitFlag(id: number, flag: string): Promise<{
        status: "incorrect";
        message: "Incorrect";
    } | {
        status: "correct";
        message: "Correct";
    } | {
        status: "already_solved";
        message: "You already solved this";
    } | {
        status: "paused";
        message: `${string} is paused`;
    } | {
        status: "ratelimited";
        message: "You're submitting flags too fast. Slow down.";
    }>;
    /**
     * Fetches the list of all challenges.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/challenges/operation/get_challenge_list}
     *
     * @returns The list of challenges, as a `Challenge[]`.
     */
    get(): Promise<Challenge[]>;
    /**
     * Fetches details for the given challenge.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/challenges/operation/get_challenge}.
     *
     * @param id The ID of the challenge to fetch.
     * @returns The challenge details.
     */
    getDetails(id: number): Promise<ChallengeDetails>;
    /**
     * Fetches solves for the given challenge.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/challenges/operation/get_challenge_solves}.
     *
     * @param id The ID of the challenge to fetch solves for.
     * @returns The challenge's solves.
     */
    getSolves(id: number): Promise<Solve[]>;
};

type BaseScoreboardEntry = {
    pos: number;
    account_id: number;
    account_url: string;
    oauth_id: null;
    name: string;
    score: number;
    bracket_id: number | null;
    bracket_name: string | null;
};
type ScoreboardUserEntry = BaseScoreboardEntry & {
    account_type: "user";
};
type ScoreboardTeamEntry = BaseScoreboardEntry & {
    account_type: "team";
    members: {
        id: number;
        oauth_id: null;
        name: string;
        score: number;
        bracket_id: null;
        bracket_name: null;
    }[];
};
type ScoreboardEntry = ScoreboardUserEntry | ScoreboardTeamEntry;
interface ScoreboardDetails {
    id: number;
    account_url: string;
    name: string;
    score: number;
    bracket_id: null;
    bracket_name: null;
    solves: {
        challenge_id: number;
        account_id: number;
        team_id: number | null;
        user_id: number;
        value: number;
        date: string;
    }[];
}

declare function createScoreboardMethods(client: CTFdClient): {
    /**
     * Fetches the list of scoreboard entries.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/scoreboard/operation/get_scoreboard_list}
     *
     * @returns The scoreboard, as a `ScoreboardEntry[]`.
     */
    get(): Promise<ScoreboardEntry[]>;
    /**
     * Fetches details for the top `n` teams on the scoreboard.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/scoreboard/operation/get_scoreboard_detail}
     *
     * @param count The number of teams to fetch.
     * @returns The scoreboard details.
     */
    getTop(count: number): Promise<ScoreboardDetails[]>;
};

interface User {
    id: number;
    oauth_id: number | null;
    name: string;
    email?: string;
    website: string | null;
    affiliation: string | null;
    country: string | null;
    bracket_id: number | null;
    language: string | null;
    team_id: number | null;
    created: string;
    fields: [];
}
interface Award {
    description: string | null;
    date: string;
    id: number;
    category: string;
    user_id: number;
    team_id: null;
    name: string;
    user: number;
    team: null;
    value: number;
    icon: string;
}

interface UserSolve {
    user: {
        name: string;
        id: number;
    };
    date: string;
    challenge_id: number;
    challenge: {
        value: number;
        name: string;
        id: number;
        category: string;
    };
    team: number | null;
    id: number;
    type: "correct";
}
declare function createUsersMethods(client: CTFdClient): {
    me: {
        /**
         * Retrieves the currently logged-in user.
         * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_private}
         * @returns The logged-in user.
         */
        get(): Promise<User>;
        /**
         * Retrieves solves for the currently logged-in user.
         * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_private_solves}
         *
         * @returns The logged-in user's solves.
         */
        getSolves(): Promise<UserSolve[]>;
        /**
         * Retrieves awards for the currently logged-in user.
         * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_private_awards}
         *
         * @returns The logged-in user's awards.
         */
        getAwards(): Promise<Award[]>;
    };
    /**
     * Retrieves a user by ID.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_public}
     *
     * @param id The ID of the user to retrieve.
     * @returns The fetched user.
     */
    getById(id: number): Promise<User>;
    /**
     * Retrieves solves for a given user.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_public_solves}
     *
     * @param id The ID of the user to retrieve solves for.
     * @returns The user's solves.
     */
    getSolves(id: number): Promise<UserSolve[]>;
    /**
     * Retrieves awards for a given user.
     * Ref: {@Link https://docs.ctfd.io/docs/api/redoc#tag/users/operation/get_user_public_awards}
     *
     * @param id The ID of the user to retrieve awards for.
     * @returns The user's awards.
     */
    getAwards(id: number): Promise<Award[]>;
};

type ClientOptions = {
    url: string;
    username: string;
    password: string;
};
declare class CTFdClient {
    readonly url: string;
    private readonly username;
    private readonly password;
    private cachedSession;
    private cachedNonce;
    private sessionExpiry;
    readonly challenges: ReturnType<typeof createChallengesMethods>;
    readonly scoreboard: ReturnType<typeof createScoreboardMethods>;
    readonly users: ReturnType<typeof createUsersMethods>;
    constructor(options: ClientOptions);
    callApi<T>(endpoint: string): Promise<T>;
    getAuthedSessionNonce(): Promise<{
        session: string;
        nonce: string;
    }>;
}

export { type Award, CTFdClient, type Challenge, type ChallengeDetails, type ChallengeType, type ScoreboardEntry, type Solve, type User };

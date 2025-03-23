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
type ChallengeType = 'standard' | 'multiple_choice' | 'code';
type ChallengeData = {
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
};
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

type ClientOptions = {
    url: string;
    username: string;
    password: string;
};
declare class CTFdClient {
    private readonly url;
    private readonly username;
    private readonly password;
    private cachedSession;
    private cachedNonce;
    private sessionExpiry;
    constructor(options: ClientOptions);
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
    getChallenges(): Promise<ChallengeData[]>;
    getChallengeDetails(id: number): Promise<ChallengeDetails>;
    getScoreboard(): Promise<ScoreboardEntry[]>;
    private getAuthedSessionNonce;
}

export { CTFdClient, type ChallengeData, type ChallengeDetails, type ChallengeType, type ScoreboardEntry };

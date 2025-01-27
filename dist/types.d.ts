type BaseScoreboardEntry = {
    pos: number;
    account_id: number;
    account_url: string;
    oauth_id: null;
    name: string;
    score: number;
    bracket_id: null;
    bracket_name: null;
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
type ChallengeData = {
    id: number;
    type: 'standard' | 'multiple_choice' | 'code';
    name: string;
    category: string;
    script: string;
    solved_by_me: boolean;
    solves: number;
    tags: string[];
    template: string;
    value: number;
};

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
    }>;
    getChallenges(): Promise<ChallengeData[]>;
    getScoreboard(): Promise<ScoreboardEntry[]>;
    private getAuthedSessionNonce;
}

export { CTFdClient, type ChallengeData, type ScoreboardEntry };

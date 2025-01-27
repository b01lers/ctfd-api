type ScoreboardData = {
    pos: number;
    account_id: number;
    account_url: string;
    account_type: "user";
    oauth_id: null;
    name: string;
    score: number;
    bracket_id: null;
    bracket_name: null;
};
type ChallengesResponse = {
    success: true;
    data: ChallengeData[];
};
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
type FlagSubmissionResponse = {
    success: true;
    data: {
        status: "incorrect";
        message: "Incorrect";
    };
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
    submitFlag(id: number, flag: string): Promise<FlagSubmissionResponse>;
    getChallenges(): Promise<ChallengesResponse>;
    private getAuthedSessionNonce;
}

export { CTFdClient, type ChallengeData, type ScoreboardData };

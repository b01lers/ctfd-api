export type ScoreboardResponse = {
    success: true,
    data: ScoreboardEntry[],
}

type BaseScoreboardEntry = {
    pos: number,
    account_id: number,
    account_url: string,
    oauth_id: null,
    name: string,
    score: number,
    bracket_id: null,
    bracket_name: null
}

type ScoreboardUserEntry = BaseScoreboardEntry & {
    account_type: "user",
}

type ScoreboardTeamEntry = BaseScoreboardEntry & {
    account_type: "team",
    members: {
        id: number,
        oauth_id: null,
        name: string,
        score: number,
        bracket_id: null,
        bracket_name: null
    }[]
}

export type ScoreboardEntry = ScoreboardUserEntry | ScoreboardTeamEntry;

export type ChallengesResponse = {
    success: true,
    data: ChallengeData[]
}

export type ChallengeData = {
    id: number,
    type: 'standard' | 'multiple_choice' | 'code',
    name: string,
    category: string,
    script: string,
    solved_by_me: boolean,
    solves: number,
    tags: string[],
    template: string,
    value: number,
}

export type FlagSubmissionResponse = {
    success: true,
    data: {
        status: 'incorrect',
        message: 'Incorrect'
    } | {
        status: 'correct',
        message: 'Correct'
    }
}

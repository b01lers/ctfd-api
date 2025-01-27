export type ScoreboardResponse = {
    success: true,
    data: ScoreboardData[],
}

export type ScoreboardData = {
    pos: number,
    account_id: number,
    account_url: string,
    account_type: "user",
    oauth_id: null,
    name: string,
    score: number,
    bracket_id: null,
    bracket_name: null
}

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
        status: "incorrect", // TODO
        message: "Incorrect"
    }
}

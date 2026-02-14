type BaseScoreboardEntry = {
    pos: number,
    account_id: number,
    account_url: string,
    oauth_id: null, // TODO
    name: string,
    score: number,
    bracket_id: number | null,
    bracket_name: string | null  // e.g. "Open Bracket"
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

export interface ScoreboardDetails {
    id: number,
    account_url: string,
    name: string,
    score: number,
    bracket_id: null, // TODO
    bracket_name: null,
    solves: {
        challenge_id: number,
        account_id: number,
        team_id: number | null,
        user_id: number,
        value: number,
        date: string // ISO
    }[]
}

type BaseScoreboardEntry = {
    pos: number,
    account_id: number,
    account_url: string,
    oauth_id: null,
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

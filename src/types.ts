type APISuccess<T> = {
    success: true,
    data: T
}

export type ScoreboardResponse = APISuccess<ScoreboardEntry[]>

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

export type ChallengesResponse = APISuccess<ChallengeData[]>

export type ChallengeType = 'standard' | 'multiple_choice' | 'code';
export type ChallengeData = {
    id: number,
    type: ChallengeType,
    name: string,
    category: string,
    script: string,
    solved_by_me: boolean,
    solves: number,
    tags: string[],
    template: string,
    value: number,
}

export type ChallengeDetailsResponse = APISuccess<ChallengeDetails>;

type BaseChallengeDetails = {
    id: number,
    name: string,
    value: number,
    description: string,
    category: string,
    state: "visible", // TODO
    max_attempts: number,
    type_data: {
        id: ChallengeType,
        name: ChallengeType,
        templates: { create: string, update: string, view: string },
        scripts: { create: string, update: string, view: string }
    },
    solves: number,
    solved_by_me: boolean,
    attempts: number,
    files: string[],
    tags: string[],
    hints: string[],
    view: string
}

type StandardChallengeDetails = BaseChallengeDetails & {
    type: Exclude<ChallengeType, 'code'>
    attribution: string | null,
    connection_info: string | null,
    next_id: number | null,
}

type ProgrammingChallengeDetails = BaseChallengeDetails & {
    type: Extract<ChallengeType, 'code'>
    language: string,
    version: null,
    output_enabled: null,
}

export type ChallengeDetails = StandardChallengeDetails | ProgrammingChallengeDetails;

export type FlagSubmissionResponse = APISuccess<{
    status: 'incorrect',
    message: 'Incorrect'
} | {
    status: 'correct',
    message: 'Correct'
} | {
    status: 'already_solved',
    message: 'You already solved this'
}>

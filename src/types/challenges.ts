export interface Solve {
    account_id: number,
    account_url: string,
    date: string,
    name: string,
}

export type ChallengeType = 'standard' | 'multiple_choice' | 'code';
export interface Challenge {
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

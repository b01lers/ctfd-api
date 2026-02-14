export interface User {
    id: number,
    oauth_id: number | null,
    name: string,
    // password: string,
    email?: string,
    // type: string,
    // secret: string,
    website: string | null,
    affiliation: string | null,
    country: string | null,
    bracket_id: number | null,
    // hidden: boolean,
    // banned: boolean,
    // verified: boolean,
    language: string | null,
    // change_password: boolean,
    team_id: number | null,
    created: string, // ISO

    fields: [], // TODO
}

export interface Award {
    description: string | null,
    date: string,
    id: number,
    category: string,
    user_id: number,
    team_id: null, // TODO
    name: string,
    user: number,
    team: null, // TODO
    value: number,
    icon: string,
}

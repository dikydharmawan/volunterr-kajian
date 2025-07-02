export interface Admin {
    id: string;
    name: string;
    email: string;
}

export interface Volunteer {
    id: string;
    name: string;
    skills: string[];
    availability: string;
}
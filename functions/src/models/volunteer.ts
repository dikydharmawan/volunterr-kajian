export class Volunteer {
    id: string;
    name: string;
    skills: string[];
    availability: string;

    constructor(id: string, name: string, skills: string[], availability: string) {
        this.id = id;
        this.name = name;
        this.skills = skills;
        this.availability = availability;
    }
}
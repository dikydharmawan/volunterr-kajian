export interface Division {
    id?: string;
    name: string;
    description: string;
    quota: number;
    currentRegistered: number;
    deadline: Date;
    requirements: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class DivisionModel {
    constructor(
        public name: string,
        public description: string,
        public quota: number,
        public deadline: Date,
        public requirements: string[] = [],
        public isActive: boolean = true
    ) {
        this.currentRegistered = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public currentRegistered: number;
    public createdAt: Date;
    public updatedAt: Date;

    public get isFull(): boolean {
        return this.currentRegistered >= this.quota;
    }

    public get isExpired(): boolean {
        return new Date() > this.deadline;
    }

    public get isOpenForRegistration(): boolean {
        return this.isActive && !this.isFull && !this.isExpired;
    }

    public get remainingQuota(): number {
        return Math.max(0, this.quota - this.currentRegistered);
    }
} 
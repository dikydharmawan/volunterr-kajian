"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionModel = void 0;
class DivisionModel {
    constructor(name, description, quota, deadline, requirements = [], isActive = true) {
        this.name = name;
        this.description = description;
        this.quota = quota;
        this.deadline = deadline;
        this.requirements = requirements;
        this.isActive = isActive;
        this.currentRegistered = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    get isFull() {
        return this.currentRegistered >= this.quota;
    }
    get isExpired() {
        return new Date() > this.deadline;
    }
    get isOpenForRegistration() {
        return this.isActive && !this.isFull && !this.isExpired;
    }
    get remainingQuota() {
        return Math.max(0, this.quota - this.currentRegistered);
    }
}
exports.DivisionModel = DivisionModel;
//# sourceMappingURL=division.js.map
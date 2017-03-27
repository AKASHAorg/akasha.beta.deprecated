"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatSettings {
    constructor() {
        this.TOPICS = new Set();
        this.defaultTopic = '0x616b617368612e616c706861';
        this.chanPrefix = '0x19416b3a';
        this.TOPICS.add(this.defaultTopic);
        this.activeChannel = this.defaultTopic;
    }
    setActive(channel) {
        if (!this.TOPICS.has(channel)) {
            throw new Error(`Can't navigate to ${channel} before joining it.`);
        }
        this.activeChannel = channel;
    }
    getActive() {
        return this.activeChannel;
    }
    getDefaultTopic() {
        return this.defaultTopic;
    }
    isDefaultActive() {
        return this.defaultTopic === this.activeChannel;
    }
    getChanPrefix() {
        return this.chanPrefix;
    }
}
exports.default = new ChatSettings();
//# sourceMappingURL=settings.js.map
"use strict";
class ChatSettings {
    constructor() {
        this.TOPICS = new Set();
        this.defaultTopic = '0x616b617368612e616c706861';
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new ChatSettings();
//# sourceMappingURL=settings.js.map
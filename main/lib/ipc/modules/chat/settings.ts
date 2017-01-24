class ChatSettings {
    public TOPICS = new Set();
    private defaultTopic = '0x616b617368612e616c706861';
    private activeChannel: string;

    constructor() {
        this.TOPICS.add(this.defaultTopic);
        this.activeChannel = this.defaultTopic;
    }

    /**
     *
     * @param channel
     */
    public setActive(channel: string) {
        if (!this.TOPICS.has(channel)) {
            throw new Error(`Can't navigate to ${channel} before joining it.`)
        }
        this.activeChannel = channel;
    }

    /**
     *
     * @returns {string}
     */
    public getActive() {
        return this.activeChannel;
    }

    /**
     *
     * @returns {string}
     */
    public getDefaultTopic() {
        return this.defaultTopic;
    }

    /**
     *
     * @returns {boolean}
     */
    public isDefaultActive() {
        return this.defaultTopic === this.activeChannel;
    }

}

export default new ChatSettings();

/**
 * https://github.com/geelen/x-gif/blob/gh-pages/src/stream_reader.js
 */
export default class StreamReader {
    constructor (arrayBuffer) {
        this.data = new Uint8Array(arrayBuffer);
        this.index = 0;
    }

    readByte () {
        return this.data[this.index++];
    }

    readAscii (n) {
        let s = '';
        for (let i = 0; i < n; i += 1) {
            s += String.fromCharCode(this.readByte());
        }
        return s;
    }
    getFrameNumber () {
        const length = this.data.length;
        let i;
        let len;
        let frames = 0;
        for (i = 0, len = length - 3; i < len; ++i) {
            if (this.data[i] === 0x00 && this.data[i + 1] === 0x21 && this.data[i + 2] === 0xF9) {
                const blocklength = this.data[i + 3];
                const afterblock = i + 4 + blocklength;
                if (afterblock + 1 < length &&
                    this.data[afterblock] === 0x00 &&
                    (this.data[afterblock + 1] === 0x2C || this.data[afterblock + 1] === 0x21)) {
                    frames += 1;
                }
            }
        }
        return frames;
    }
}

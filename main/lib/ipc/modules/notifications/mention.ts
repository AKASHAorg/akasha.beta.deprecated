import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import currentProfile from '../registry/current-profile';
import { whisperIdentity } from '../chat/post';
import { MENTION_CHANNEL, MENTION_TTL, MENTION_TYPE } from '../../config/settings';
import { uniq } from 'ramda';

const execute = Promise.coroutine(
    function*(data: { mention: string[], entryId: string, commentId?: string }) {
        if (data.mention.length > 10) {
            throw new Error('Can mention max 10 users');
        }

        if (!whisperIdentity.from) {
            whisperIdentity.from = yield GethConnector.getInstance().web3.shh.newIdentityAsync();
        }
        const mention = uniq(data.mention);
        const mentionType = (data.commentId) ? MENTION_TYPE.COMMENT : MENTION_TYPE.ENTRY;
        const from = yield currentProfile.execute();

        const payload = GethConnector.getInstance().web3
            .fromUtf8(
                JSON.stringify({
                    mention: mention,
                    akashaId: from.akashaId,
                    mentionType: mentionType,
                    entryId: data.entryId,
                    commentId: data.commentId
                }));

        const post = yield GethConnector.getInstance().web3
            .shh
            .postAsync({
                from: whisperIdentity.from,
                topics: [MENTION_CHANNEL],
                payload: payload,
                ttl: MENTION_TTL
            });
        return { post, mention };
    });

export default { execute, name: 'mention' };

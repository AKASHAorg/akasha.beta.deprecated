import debug from 'debug';
import BaseService from './base-service';

/*** DELETE THIS *****/
import { generateComments } from './faker-data';
/********************/

const Channel = window.Channel;
const dbg = debug('App:CommentService:');

class CommentService extends BaseService {
    getCommentsByEntry = (entryId, options) =>
        new Promise((resolve, reject) => {
            dbg('getCommentsByEntry ', entryId, options);
            return resolve(generateComments(15));
        });
}
export { CommentService };

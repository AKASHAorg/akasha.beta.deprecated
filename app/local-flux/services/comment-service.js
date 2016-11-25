import BaseService from './base-service';
/** * DELETE THIS *****/
import { generateComments } from './faker-data';
/** ******************/


class CommentService extends BaseService {
    getCommentsByEntry = (entryId, options) =>
        new Promise(resolve =>
            resolve(generateComments(15))
        );
}
export { CommentService };

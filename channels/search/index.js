var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import queryInit from './query';
import flushInit from './clear-index';
import findTagsInit from './find-tags';
import findProfilesInit from './find-profiles';
import indexes from './indexes';
import { SEARCH_MODULE } from '@akashaproject/common/constants';
const init = function init(sp, getService) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = queryInit(sp, getService);
        const flush = flushInit(sp, getService);
        const findTags = findTagsInit(sp, getService);
        const findProfiles = findProfilesInit(sp, getService);
        indexes(sp);
        return {
            [SEARCH_MODULE.query]: query,
            [SEARCH_MODULE.flush]: flush,
            [SEARCH_MODULE.findTags]: findTags,
            [SEARCH_MODULE.findProfiles]: findProfiles,
        };
    });
};
const app = {
    init,
    moduleName: SEARCH_MODULE.$name,
    async: true,
};
export default app;
//# sourceMappingURL=index.js.map
import * as Promise from 'bluebird';
import {
  COMMON_MODULE,
  CORE_MODULE,
  ENTRY_MODULE,
  NOTIFICATIONS_MODULE,
} from '@akashaproject/common/constants';

const publishS = {
  id: '/publish',
  type: 'object',
  properties: {
    content: {
      type: 'object',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      uniqueItems: true,
      minItems: 1,
    },
    entryType: {
      type: 'number',
    },
    token: {
      type: 'string',
    },
  },
  required: ['content', 'tags', 'entryType', 'token'],
};

export default function init (sp, getService) {
  const execute = Promise.coroutine(function* (data, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, publishS, { throwError: true });

    let ipfsEntry = new getService(ENTRY_MODULE.ipfs).IpfsEntry();
    const ipfsHash = yield ipfsEntry.create(data.content, data.tags, data.entryType);
    const decodedHash = getService(COMMON_MODULE.ipfsHelpers).decodeHash(ipfsHash);
    const web3Api = getService(CORE_MODULE.WEB3_API);
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const tags = data.tags.map(tag => web3Api.instance.fromUtf8(tag));
    let publishMethod;
    switch (data.entryType) {
      case 0:
        publishMethod = contracts.instance.Entries.publishArticle;
        break;
      case 1:
        publishMethod = contracts.instance.Entries.publishLink;
        break;
      case 2:
        publishMethod = contracts.instance.Entries.publishMedia;
        break;
      default:
        publishMethod = contracts.instance.Entries.publishOther;
    }
    const txData = publishMethod.request(...decodedHash, tags, { gas: 600000 });
    ipfsEntry = null;
    delete data.content;
    delete data.tags;
    const receipt = yield contracts.send(txData, data.token, cb);
    let entryId = null;
    // in the future extract this should be dynamic @TODO
    if (receipt.logs && receipt.logs.length > 2) {
      const log = receipt.logs[receipt.logs.length - 1];
      entryId = log.topics.length > 2 ? log.topics[2] : null;
    }

    yield getService(NOTIFICATIONS_MODULE.entriesCache).push(entryId);
    return { entryId, receipt };
  });

  const publish = { execute, name: 'publish', hasStream: true };
  const service = function () {
    return publish;
  };
  sp().service(ENTRY_MODULE.publish, service);
  return publish;
}

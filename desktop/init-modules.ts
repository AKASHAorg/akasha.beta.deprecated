import jsonSchemaWeb3 from '@akashaproject/jsonschema-web3';
import sp, { getService } from '@akashaproject/core/sp';
import { CORE_MODULE } from '@akashaproject/common/constants';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import core from '@akashaproject/core';
import commonModule from '@akashaproject/common';
import authModule from '@akashaproject/auth';
import commentsModule from '@akashaproject/comments';
import entryModule from '@akashaproject/entry';
import gethModule from '@akashaproject/geth';
import ipfsModule from '@akashaproject/ipfs';
import licencesModule from '@akashaproject/licences';
import notificationsModule from '@akashaproject/notifications';
import pinnerModule from '@akashaproject/pinner';
import profileModule from '@akashaproject/profile';
import registryModule from '@akashaproject/registry';
import searchModule from '@akashaproject/search';
import { init } from '@akashaproject/search/indexes';
import tagsModule from '@akashaproject/tags';
import txModule from '@akashaproject/tx';

(function bootstrap(serviceProvider, gS) {
  core.init();
  const common = commonModule.init(serviceProvider, gS);
  const auth = authModule.init(serviceProvider, gS);
  const comments = commentsModule.init(serviceProvider, gS);
  const entry = entryModule.init(serviceProvider, gS);
  const geth = gethModule.init(serviceProvider, gS);
  const ipfs = ipfsModule.init(serviceProvider, gS);
  const licences = licencesModule.init(serviceProvider, gS);
  const notifications = notificationsModule.init(serviceProvider, gS);
  const pinner = pinnerModule.init(serviceProvider, gS);
  const profile = profileModule.init(serviceProvider, gS);
  const registry = registryModule.init(serviceProvider, gS);
  const search = searchModule.init(serviceProvider, gS);
  const tags = tagsModule.init(serviceProvider, gS);
  const tx = txModule.init(serviceProvider, gS);
  const serviceValidator = function () {
    return { Validator: jsonSchemaWeb3 };
  };

  gS(CORE_MODULE.WEB3_API).instance = GethConnector.getInstance().web3;
  gS(CORE_MODULE.IPFS_API).instance = IpfsConnector.getInstance();
  serviceProvider().service(CORE_MODULE.VALIDATOR_SCHEMA, serviceValidator);
  serviceProvider().service(CORE_MODULE.GETH_CONNECTOR, GethConnector);
  serviceProvider().service(CORE_MODULE.IPFS_CONNECTOR, IpfsConnector);

  console.log({
    common,
    auth,
    comments,
    entry,
    geth,
    ipfs,
    licences,
    notifications,
    pinner,
    profile,
    registry,
    search,
    tags,
    tx,
  });
  init().then(d => console.log(d)).catch(err => console.log(err));
  return {
    common,
    auth,
    comments,
    entry,
    geth,
    ipfs,
    licences,
    notifications,
    pinner,
    profile,
    registry,
    search,
    tags,
    tx,
  };
})(sp, getService);

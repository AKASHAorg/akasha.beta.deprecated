import jsonSchemaWeb3 from '@akashaproject/jsonschema-web3';
import core from '@akashaproject/core';
import common from '@akashaproject/common';
import sp, { getService } from '@akashaproject/core/sp';
import { CORE_MODULE } from '@akashaproject/common/constants';
import auth from '@akashaproject/auth';
import comments from '@akashaproject/comments';
import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

(function bootstrap(serviceProvider, gS) {
  core.init();
  const commonModule = common.init(serviceProvider, gS);
  const authModule = auth.init(serviceProvider, gS);
  const commentsModule = comments.init(serviceProvider, gS);
  const serviceValidator = function () {
    return { Validator: jsonSchemaWeb3 };
  };
  serviceProvider().service(CORE_MODULE.VALIDATOR_SCHEMA, serviceValidator);
  serviceProvider().service(CORE_MODULE.GETH_CONNECTOR, GethConnector);
  serviceProvider().service(CORE_MODULE.IPFS_CONNECTOR, IpfsConnector);


})(sp, getService);

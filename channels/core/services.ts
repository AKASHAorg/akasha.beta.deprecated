import { CORE_MODULE } from '@akashaproject/common/constants';

export default function init (sp) {

  class Service {
    protected serviceInstance: any;

    public get instance (): any {
      if (!this.serviceInstance) {
        throw new Error('No instance available');
      }
      return this.serviceInstance;
    }

    public set instance (apiInstance: any) {
      this.serviceInstance = apiInstance;
    }
  }

  const web3Api = new Service();
  const ipfsApi = new Service();
  const ipfsProvider = new Service();
  const serviceW = function () {
    return web3Api;
  };
  const serviceIA = function () {
    return ipfsApi;
  };
  const serviceIP = function () {
    return ipfsProvider;
  };
  sp().service(CORE_MODULE.WEB3_API, serviceW);
  sp().service(CORE_MODULE.IPFS_API, serviceIA);
  sp().service(CORE_MODULE.IPFS_PROVIDER, serviceIP);
}

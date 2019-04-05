import { CORE_MODULE, GENERAL_SETTINGS } from '@akashaproject/common/constants';

export default function init(sp, getService) {

  class GethStatus {
    public shouldLogout: boolean = false;
    public shouldUnlockVault: boolean = false;
    private gethProcess: boolean;
    private gethApi: boolean;
    private gethNetworkID: number;
    private gethKey: string;
    private gethVersion: string;
    private gethAkashaKey: string;

    public get process() {
      return this.gethProcess;
    }

    public set process(status: boolean) {
      this.gethProcess = status;
    }

    public get api() {
      return this.gethApi;
    }

    public set api(status: boolean) {
      this.gethApi = status;
    }

    public get networkID() {
      return this.gethNetworkID;
    }

    public set networkID(id: number) {
      this.gethNetworkID = id;
    }

    public get version() {
      return this.gethVersion;
    }

    public set version(nr: string) {
      this.gethVersion = nr;
    }

    public get ethKey() {
      getService(CORE_MODULE.WEB3_API).instance.eth.getAccounts((err, accList) => {
        if (err) {
          throw err;
        }
        if (accList[0] !== this.gethKey) {
          console.log('default account changed');
          if (this.gethKey) {
            location.reload();
          }

          if (!accList[0]) {
            this.shouldUnlockVault = true;
          }
          this.gethKey = accList[0];
          if (this.shouldUnlockVault && this.gethKey) {
            this.shouldUnlockVault = false;
          }
          this.shouldLogout = true;
        }
      });
      return this.gethKey;
    }

    public set ethKey(address: string) {
      this.gethKey = address;
    }

    public get akashaKey() {
      return this.gethAkashaKey;
    }

    public set akashaKey(address: string) {
      this.gethAkashaKey = address;
    }

  }

  const gethStatus = new GethStatus();

  const mainResponse = (rawData: any, request: any) => {
    if (rawData.error) {
      return {
        data: {},
        services: {
          ipfs: Object.assign(
            getService(CORE_MODULE.IPFS_API).instance.serviceStatus,
            {
              [GENERAL_SETTINGS.BASE_URL]:
                getService(CORE_MODULE.SETTINGS).get(GENERAL_SETTINGS.BASE_URL),
            }),
          geth: {
            process: gethStatus.process,
            api: gethStatus.api,
            networkID: gethStatus.networkID,
            ethAddress: gethStatus.ethKey,
            version: gethStatus.version,
            shouldLogout: gethStatus.shouldLogout,
            shouldUnlockVault: gethStatus.shouldUnlockVault,
          },
        },
        error: { message: rawData.error.message }, request,
      };
    }
    return {
      data: rawData,
      services: {
        ipfs: Object.assign(
          getService(CORE_MODULE.IPFS_API).instance.serviceStatus,
          {
            [GENERAL_SETTINGS.BASE_URL]:
              getService(CORE_MODULE.SETTINGS).get(GENERAL_SETTINGS.BASE_URL),
          }),
        geth: {
          process: gethStatus.process,
          api: gethStatus.api,
          networkID: gethStatus.networkID,
          ethAddress: gethStatus.ethKey,
          version: gethStatus.version,
          shouldLogout: gethStatus.shouldLogout,
          shouldUnlockVault: gethStatus.shouldUnlockVault,
        },
      }, request,
    };
  };
  const emitResponse = { gethStatus, mainResponse };
  const service = function () {
    return emitResponse;
  };
  sp().service(CORE_MODULE.RESPONSES, service);
}

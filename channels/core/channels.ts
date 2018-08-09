const hashPath = (...path: string[]) => {
  return path.join('/');
};

const channels: any = { client: {}, server: {} };

export function
registerChannel(
  implListener: any,
  implRequest: any,
  module: string,
  method: string,
) {
  if (!channels.client.hasOwnProperty(module)) {
    channels.client[module] = {};
    channels.server[module] = {};
  }
  channels.client[module][method] = new implListener(hashPath('client', module, method), method);
  channels.server[module][method] = new implRequest(hashPath('server', module, method), method);
}

export default function getChannels() {
  return { client: channels.client, server: channels.server };
}

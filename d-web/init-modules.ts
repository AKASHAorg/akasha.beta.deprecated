import apiModules from './modules';

export default function initModules() {
  apiModules.forEach((obj: any) => {
    obj.initListeners();
  });
}
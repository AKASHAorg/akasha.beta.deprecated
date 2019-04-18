import { action } from './helpers';
import { LICENCE_MODULE } from '@akashaproject/common/constants';

export const licenseGetAll = () => action(`${ LICENCE_MODULE.getLicences }`);

/*
:: Electron example ::

const prof = require('electron').remote.getGlobal('akasha').profileInstance;

JSON.stringify(prof.estimate('create'));

prof.profileModel.list().then((d)=> console.log(JSON.stringify(d)));

prof.get('name').then((d)=> console.log(JSON.stringify(d)));

prof.create('name', {data: 'yes'}, (e,r)=> console.log(e,r));
prof.update('name', {cheese: 'please'}, (e,r)=> console.log(e,r));
prof.delete('name', (e,r)=> console.log(e,r));

*/

const ProfileApi = require('./ProfileApi');
export default ProfileApi;


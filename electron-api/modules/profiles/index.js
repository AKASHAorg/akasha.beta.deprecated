/*
:: Electron example ::

const prof = require('electron').remote.getGlobal('profiles');

JSON.stringify(prof.estimate('create'));

prof.profileModel.get('akasha').then((d)=> console.log(JSON.stringify(d)));

prof.profileModel.list().then((d)=> console.log(JSON.stringify(d)));

prof.create('name', {data: 'yes'}, (e,r)=> console.log(e,r));
prof.update('name', {cheese: 'please'}, (e,r)=> console.log(e,r));
prof.delete('name', (e,r)=> console.log(e,r));

*/

export default require('./ProfileApi');

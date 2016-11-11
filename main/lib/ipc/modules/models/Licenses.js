"use strict";
exports.LicencesList = [
    {
        id: '1',
        parent: null,
        label: 'All rights reserved',
        description: [
            {
                icon: 'copyright-1', text: 'Others cannot copy, distribute, or perform your work without your' +
                    ' permission (or as permitted by fair use).'
            },
        ]
    }, {
        id: '2',
        parent: null,
        label: 'Some rights reserved',
        description: [
            { icon: 'copyright-2', text: 'There are some rights reserved with this licence.' }
        ]
    }, {
        id: '3',
        parent: null,
        label: 'No rights reserved',
        description: [
            { icon: 'copyright-3', text: 'You will not have any rights.' }
        ]
    }, {
        id: '4',
        parent: '2',
        label: 'Attribution',
        description: [
            {
                icon: 'copyright-4',
                text: `Others can distribute, remix, and build upon your 
                        work as long as they credit you.`
            }
        ]
    }, {
        id: '5',
        parent: '2',
        label: 'Attribution, no derivatives',
        description: [
            {
                icon: 'copyright-5-0',
                text: `Others can distribute, remix, and build upon your work 
                        as long as they credit you.`
            },
            {
                icon: 'copyright-5-1',
                text: 'no derivatives licence description'
            }
        ]
    }, {
        id: '6',
        parent: '2',
        label: 'Attribution, share-alike',
        description: [
            {
                icon: 'copyright-6-0',
                text: `Others can distribute, remix, and build upon your work as
                         long as they credit you.`
            },
            {
                icon: 'copyright-6-1',
                text: 'Others must distribute derivatives of your work under the same license.'
            }
        ]
    }, {
        id: '7',
        parent: '2',
        label: 'Attribution, non-commercial',
        description: [
            {
                icon: 'copyright-7',
                text: 'Others can use your work for non-commercial purposes only. '
            }
        ]
    }, {
        id: '8',
        parent: '2',
        label: 'Attribution, non-commercial, no-derivatives',
        description: [
            {
                icon: 'copyright-8',
                text: 'Others can use your work for non-commercial purposes only. '
            }
        ]
    }, {
        id: '9',
        parent: '2',
        label: 'Attribution, non-commercial, share-alike',
        description: [
            {
                icon: 'copyright-9-0',
                text: 'Others can use your work for non-commercial purposes only. '
            },
            {
                icon: 'copyright-9-1',
                text: 'Others must distribute derivatives of your work under the same license.'
            }
        ]
    }, {
        id: '10',
        parent: '3',
        label: 'Creative Commons copyright waiver',
        description: [
            {
                icon: 'copyright-10',
                text: 'You waive all your copyright and related rights in this work, worldwide.'
            }
        ]
    }, {
        id: '11',
        parent: '3',
        label: 'Public Domain',
        description: [
            { icon: 'copyright-11', text: 'Public domain licence description' }
        ]
    }
];
function getLicence(id) {
    return exports.LicencesList.find((element) => {
        return element.id === id + '';
    });
}
exports.getLicence = getLicence;
//# sourceMappingURL=Licenses.js.map
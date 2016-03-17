/* eslint key-spacing: 0 quote-props: 0 */

const db = {
  'address': '0x08455210ea238f96b33851b385b83492cbe646ab',
  'creation_block': 519035,
  'creation_tx': '0xada6d7bacb3b5a56ef7a027d3ed9a8f9ee6a6fef28450c5dac61d4d3aaa9ee25',
  'creator': '0xdaeb6794927ad1fb118575c66cf17c0f558bf945',
  'abi': [
    {
      'constant': false,
      'inputs': [
        {
          'name': 'k',
          'type': 'bytes12'
        },
        {
          'name': 'v',
          'type': 'bytes32'
        }
      ],
      'name': 'setVal',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'creator',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_owner',
          'type': 'address'
        }
      ],
      'name': 'delProfile',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_addr',
          'type': 'address'
        }
      ],
      'name': 'existsProfileAddr',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        }
      ],
      'name': 'delComment',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_addr',
          'type': 'address'
        },
        {
          'name': '_name',
          'type': 'bytes32'
        }
      ],
      'name': 'isProfileOwner',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'name': 'entries',
      'outputs': [
        {
          'name': 'owner',
          'type': 'address'
        },
        {
          'name': 'tags',
          'type': 'uint8'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_addr',
          'type': 'address'
        },
        {
          'name': '_lvl',
          'type': 'uint8'
        }
      ],
      'name': 'delTrusted',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_owner',
          'type': 'address'
        },
        {
          'name': '_hash',
          'type': 'string'
        }
      ],
      'name': 'updateProfile',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_owner',
          'type': 'address'
        },
        {
          'name': '_tags',
          'type': 'uint8'
        },
        {
          'name': '_hash',
          'type': 'string'
        }
      ],
      'name': 'addEntry',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_hash',
          'type': 'string'
        }
      ],
      'name': 'updateComment',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'name': 'comments',
      'outputs': [
        {
          'name': 'owner',
          'type': 'address'
        },
        {
          'name': 'parent',
          'type': 'bytes32'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_owner',
          'type': 'address'
        },
        {
          'name': '_parent',
          'type': 'bytes32'
        },
        {
          'name': '_hash',
          'type': 'string'
        }
      ],
      'name': 'addComment',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'blockn',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_owner',
          'type': 'address'
        },
        {
          'name': '_g',
          'type': 'int8'
        }
      ],
      'name': 'addVote',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_addr',
          'type': 'address'
        }
      ],
      'name': 'getUserVote',
      'outputs': [
        {
          'name': '',
          'type': 'int8'
        }
      ],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        }
      ],
      'name': 'getEntryOwner',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_name',
          'type': 'bytes32'
        }
      ],
      'name': 'existsProfileName',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        }
      ],
      'name': 'unlistEntry',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'nrProfiles',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '',
          'type': 'bytes32'
        },
        {
          'name': '',
          'type': 'address'
        }
      ],
      'name': 'votes',
      'outputs': [
        {
          'name': '',
          'type': 'int8'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_tags',
          'type': 'uint8'
        },
        {
          'name': '_hash',
          'type': 'string'
        }
      ],
      'name': 'updateEntry',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'name': 'profiles',
      'outputs': [
        {
          'name': 'name',
          'type': 'bytes32'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_addr',
          'type': 'address'
        },
        {
          'name': '_val',
          'type': 'uint256'
        }
      ],
      'name': 'sendEther',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_name',
          'type': 'bytes32'
        },
        {
          'name': '_owner',
          'type': 'address'
        },
        {
          'name': '_hash',
          'type': 'string'
        }
      ],
      'name': 'addProfile',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': 'k',
          'type': 'bytes12'
        }
      ],
      'name': 'getKey',
      'outputs': [
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        }
      ],
      'name': 'getCommentOwner',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_addr',
          'type': 'address'
        },
        {
          'name': '_lvl',
          'type': 'uint8'
        }
      ],
      'name': 'addTrusted',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_addr',
          'type': 'address'
        },
        {
          'name': '_lvl',
          'type': 'uint8'
        }
      ],
      'name': 'isTrusted',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_owner',
          'type': 'address'
        }
      ],
      'name': 'delVote',
      'outputs': [],
      'type': 'function'
    },
    {
      'inputs': [],
      'type': 'constructor'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': 'profile',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'ipfs',
          'type': 'string'
        }
      ],
      'name': 'CreateProfile',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': 'profile',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'ipfs',
          'type': 'string'
        }
      ],
      'name': 'UpdateProfile',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'profile',
          'type': 'address'
        }
      ],
      'name': 'DestroyProfile',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': 'id',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'author',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'ipfs',
          'type': 'string'
        }
      ],
      'name': 'CreateEntry',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': 'id',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'ipfs',
          'type': 'string'
        }
      ],
      'name': 'UpdateEntry',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': 'id',
          'type': 'bytes32'
        }
      ],
      'name': 'UnlistEntry',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': 'id',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'author',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'ipfs',
          'type': 'string'
        }
      ],
      'name': 'CreateComment',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': 'id',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'ipfs',
          'type': 'string'
        }
      ],
      'name': 'UpdateComment',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': 'id',
          'type': 'bytes32'
        }
      ],
      'name': 'DestroyComment',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': 'id',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'from',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'g',
          'type': 'int8'
        }
      ],
      'name': 'Vote',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': 'id',
          'type': 'bytes32'
        }
      ],
      'name': 'CancelVote',
      'type': 'event'
    }
  ]
};

const profile = {
  'address': '0xe8b4af932d03cdac73b913ba9f2ca48b021b7f01',
  'creation_block': 519038,
  'creation_tx': '0x40bbc4704af793edf9a3a567c6bdb565e98e2727fa6d0ac630051d04de9a230a',
  'creator': '0xdaeb6794927ad1fb118575c66cf17c0f558bf945',
  'abi': [
    {
      'constant': true,
      'inputs': [],
      'name': 'creator',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'xContract',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [],
      'name': 'enableContract',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_name',
          'type': 'bytes32'
        }
      ],
      'name': 'destroy',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_addr',
          'type': 'address'
        }
      ],
      'name': 'setMainAddr',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'blockn',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [],
      'name': 'disableContract',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_to',
          'type': 'address'
        },
        {
          'name': '_val',
          'type': 'uint256'
        }
      ],
      'name': 'sendEther',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_name',
          'type': 'bytes32'
        },
        {
          'name': '_hash',
          'type': 'string'
        }
      ],
      'name': 'update',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_name',
          'type': 'bytes32'
        },
        {
          'name': '_hash',
          'type': 'string'
        }
      ],
      'name': 'create',
      'outputs': [],
      'type': 'function'
    }
  ]
};

const entry = {
  'address': '0xa999c466888ab2c21f83c08ae33106d615a818a2',
  'creation_block': 519038,
  'creation_tx': '0x9822d4aa6fdace1b1387260662544eed960a377ed10757801ff88c3a796ff81e',
  'creator': '0xdaeb6794927ad1fb118575c66cf17c0f558bf945',
  'abi': [
    {
      'constant': true,
      'inputs': [],
      'name': 'creator',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'xContract',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_g',
          'type': 'int8'
        }
      ],
      'name': 'updateEntryVote',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'E_UPDATE_FEE',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        }
      ],
      'name': 'destroyComment',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_parent_id',
          'type': 'bytes32'
        },
        {
          'name': '_ipfs',
          'type': 'string'
        }
      ],
      'name': 'createComment',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_g',
          'type': 'int8'
        }
      ],
      'name': 'voteComment',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [],
      'name': 'enableContract',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_ipfs',
          'type': 'string'
        }
      ],
      'name': 'updateComment',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_addr',
          'type': 'address'
        }
      ],
      'name': 'setMainAddr',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_g',
          'type': 'int8'
        }
      ],
      'name': 'updateCommentVote',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'blockn',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'VOTE_FEE',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [],
      'name': 'disableContract',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'E_BASE_FEE',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        }
      ],
      'name': 'hideEntry',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_tags',
          'type': 'uint8'
        },
        {
          'name': '_ipfs',
          'type': 'string'
        }
      ],
      'name': 'updateEntry',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_to',
          'type': 'address'
        },
        {
          'name': '_val',
          'type': 'uint256'
        }
      ],
      'name': 'sendEther',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        }
      ],
      'name': 'delVote',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'C_BASE_FEE',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'bytes32'
        },
        {
          'name': '_g',
          'type': 'int8'
        }
      ],
      'name': 'voteEntry',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'C_UPDATE_FEE',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_fee',
          'type': 'uint256'
        }
      ],
      'name': 'setCommentFee',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_fee',
          'type': 'uint256'
        }
      ],
      'name': 'setEntryFee',
      'outputs': [],
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_tags',
          'type': 'uint8'
        },
        {
          'name': '_ipfs',
          'type': 'string'
        }
      ],
      'name': 'createEntry',
      'outputs': [],
      'type': 'function'
    }
  ]
};

export { db, profile, entry };

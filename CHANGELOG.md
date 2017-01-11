# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.3.0"></a>
# [0.3.0](https://github.com/AkashaProject/node-app/compare/v0.2.0...v0.3.0) (2017-01-11)


### Bug Fixes

* **avatar:** Limit avatar initials to 2 characters ([80d76d2](https://github.com/AkashaProject/node-app/commit/80d76d2))
* **bookmarks:** fix navigating back to bookmarks ([fe38f23](https://github.com/AkashaProject/node-app/commit/fe38f23))
* **chat:** Fix chat input validation inconsistency ([0556a1c](https://github.com/AkashaProject/node-app/commit/0556a1c))
* **comment:** Fix subtitle for unresolved comments ([bc7df3a](https://github.com/AkashaProject/node-app/commit/bc7df3a))
* **comments:** do not delete comment on publish button click ([e4978bd](https://github.com/AkashaProject/node-app/commit/e4978bd))
* **comments:** fix loading comments on wrong entries and multiple times ([7887d53](https://github.com/AkashaProject/node-app/commit/7887d53))
* **comments:** keep comment editor content until publishing state ([1c45990](https://github.com/AkashaProject/node-app/commit/1c45990))
* **comments:** Show loading comments message when fetching for 1st time ([cf7dda5](https://github.com/AkashaProject/node-app/commit/cf7dda5))
* **commentsList:** fix comments list fetching and cleanup ([b7fb65d](https://github.com/AkashaProject/node-app/commit/b7fb65d))
* **conflicts:** fix merge conflicts ([11a74cd](https://github.com/AkashaProject/node-app/commit/11a74cd))
* **draftCard:** prevent double entry posting by disabling draft card. ([c57a77e](https://github.com/AkashaProject/node-app/commit/c57a77e))
* **entry:** Fix navigation to author profile from comments and implement votes panel in entry page ([eef234d](https://github.com/AkashaProject/node-app/commit/eef234d))
* **entryPublishing:** fix that nasty bug when draft was not updated correctly ([9a44f9a](https://github.com/AkashaProject/node-app/commit/9a44f9a))
* **images:** fix loading images based on container size ([a69cd86](https://github.com/AkashaProject/node-app/commit/a69cd86))
* **panel:** Fix issue with scrolling entry through overlayed panels ([c73306b](https://github.com/AkashaProject/node-app/commit/c73306b))
* **profile:** Fix follow button flickering ([e5ed92a](https://github.com/AkashaProject/node-app/commit/e5ed92a))
* **profile:** Fix small profile related issues ([0d87850](https://github.com/AkashaProject/node-app/commit/0d87850))
* **recommended:** Update recommended people list ([1469dd9](https://github.com/AkashaProject/node-app/commit/1469dd9))
* **sidebar:** fix sidebar stream navigation ([3a7c410](https://github.com/AkashaProject/node-app/commit/3a7c410))
* **store:** Clean store on logout ([e62eaef](https://github.com/AkashaProject/node-app/commit/e62eaef))
* Add key attribute ([194af0f](https://github.com/AkashaProject/node-app/commit/194af0f))
* **stream:** Stream is not loading after login or page reload ([6c5fda9](https://github.com/AkashaProject/node-app/commit/6c5fda9))
* **tag field:** Fix tag field issues ([5d8c85b](https://github.com/AkashaProject/node-app/commit/5d8c85b))
* **tags): Fix tag route param issues fix(auto fetch:** Add initial check for auto fetch ([b89a5c7](https://github.com/AkashaProject/node-app/commit/b89a5c7))
* **unlockAccount:** update to latest web3 api ([f7157b0](https://github.com/AkashaProject/node-app/commit/f7157b0))
* **vote:** Fix success vote console error ([180e998](https://github.com/AkashaProject/node-app/commit/180e998))
* **vote:** Fix vote notifications ([ce9fcd2](https://github.com/AkashaProject/node-app/commit/ce9fcd2))
* Display placeholders for unresolved items ([d99ad9b](https://github.com/AkashaProject/node-app/commit/d99ad9b))
* Small visual fixes ([b42ae64](https://github.com/AkashaProject/node-app/commit/b42ae64))


### Features

* **bookmark:** pin/unpin entries on bookmark ([adce2dc](https://github.com/AkashaProject/node-app/commit/adce2dc))
* **chat:** Create chat page ([1cb0be1](https://github.com/AkashaProject/node-app/commit/1cb0be1))
* **chat:** return initial collection of messages ([0bdbbac](https://github.com/AkashaProject/node-app/commit/0bdbbac))
* **ipfs): Show ipfs logs refactor(geth:** Remove mining option ([727bbbb](https://github.com/AkashaProject/node-app/commit/727bbbb))
* **pinner:** pin content on vote/follow ([7c14878](https://github.com/AkashaProject/node-app/commit/7c14878))
* **profile:** Use placeholder icon until avatar is loaded ([b778412](https://github.com/AkashaProject/node-app/commit/b778412))
* **whisper:** add basic whisper chat channel ([50d5497](https://github.com/AkashaProject/node-app/commit/50d5497))
* **whisper:** add post ([d6f26c7](https://github.com/AkashaProject/node-app/commit/d6f26c7))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/AkashaProject/node-app/compare/v0.1.0...v0.2.0) (2016-12-21)


### Bug Fixes

* **add entry:** minor fix ([86358cc](https://github.com/AkashaProject/node-app/commit/86358cc))
* **auth-diag:** prevent fs reload on enter ([adaf67d](https://github.com/AkashaProject/node-app/commit/adaf67d))
* **authDialog:** fix intl message id ([6a548c7](https://github.com/AkashaProject/node-app/commit/6a548c7))
* **avatar:** change input file behaviour ([de9703d](https://github.com/AkashaProject/node-app/commit/de9703d))
* **avatar:** remove input conditions ([8ecd092](https://github.com/AkashaProject/node-app/commit/8ecd092))
* **background image:** Fix background image issues ([f2e1b04](https://github.com/AkashaProject/node-app/commit/f2e1b04))
* **background image:** Fix profile background image ratio ([e464bfe](https://github.com/AkashaProject/node-app/commit/e464bfe))
* **comments:** show different comments when publishing in a row ([82dda77](https://github.com/AkashaProject/node-app/commit/82dda77))
* **draft:** fix loading new draft when other already opened ([9f5e3da](https://github.com/AkashaProject/node-app/commit/9f5e3da))
* **draftsPanel:** change draft filtering by akashaId ([560e9a1](https://github.com/AkashaProject/node-app/commit/560e9a1))
* **entry editor:** copy/paste with styles would break layout ([b483f6f](https://github.com/AkashaProject/node-app/commit/b483f6f))
* **entry editor:** default image size defaults to normal ([35fb55d](https://github.com/AkashaProject/node-app/commit/35fb55d))
* **entry publishing status:** update to the new draft structure ([5f8a130](https://github.com/AkashaProject/node-app/commit/5f8a130))
* **entryEditor:** fix entry editor sidebar add button ([0627b8f](https://github.com/AkashaProject/node-app/commit/0627b8f))
* **history:** fix strange behaviour of router.goBack() ([c6fc45e](https://github.com/AkashaProject/node-app/commit/c6fc45e))
* **login:** Fix login issue and multiple requests issue ([d0b263e](https://github.com/AkashaProject/node-app/commit/d0b263e))
* **login:** Hopefully fixing authenticate issue ([8c621f4](https://github.com/AkashaProject/node-app/commit/8c621f4))
* **publish:** Fix small issue ([4559d4c](https://github.com/AkashaProject/node-app/commit/4559d4c))
* **session:** clear flush task on logout ([b788a7e](https://github.com/AkashaProject/node-app/commit/b788a7e))
* **sidebar:** Fix sidebar icons style when hovered/selected ([0ed7131](https://github.com/AkashaProject/node-app/commit/0ed7131))
* **tabs:** Change tab selection indicator from red to blue ([7592618](https://github.com/AkashaProject/node-app/commit/7592618))
* **terms:** Update terms and conditions panel ([a2fdff1](https://github.com/AkashaProject/node-app/commit/a2fdff1))
* **votesIterator:** destruct from array ([d022a25](https://github.com/AkashaProject/node-app/commit/d022a25))
* Make geth/ipfs tabs look similar to the others. Fix login dialog small issues ([d6e0b0a](https://github.com/AkashaProject/node-app/commit/d6e0b0a))
* Minor fixes ([7f39862](https://github.com/AkashaProject/node-app/commit/7f39862))


### Features

* **db:** add env based dexie db name ([e621ed3](https://github.com/AkashaProject/node-app/commit/e621ed3))
* **draft card:** Add delete button to draft card ([1f08672](https://github.com/AkashaProject/node-app/commit/1f08672))
* **entry:** Display relative time format instead of block difference ([db9c738](https://github.com/AkashaProject/node-app/commit/db9c738))
* **entry card:** Display an entry's votes ([a7d174d](https://github.com/AkashaProject/node-app/commit/a7d174d))
* **entry&comments:** return unixStamp of publish ([a00cb3b](https://github.com/AkashaProject/node-app/commit/a00cb3b))
* **menu:** add util shortcuts ([907d5ce](https://github.com/AkashaProject/node-app/commit/907d5ce))
* **people:** Add recommended people tab ([d3f6a16](https://github.com/AkashaProject/node-app/commit/d3f6a16))
* **profile:** Navigate to own profile from user profile panel ([b0e077d](https://github.com/AkashaProject/node-app/commit/b0e077d))
* **profile:** Replace follow button with edit button for own profile ([7235576](https://github.com/AkashaProject/node-app/commit/7235576))
* **profiles:** add profiles list resolver ([7b906f8](https://github.com/AkashaProject/node-app/commit/7b906f8))
* **recommended people:** add a new profile ([e0c767f](https://github.com/AkashaProject/node-app/commit/e0c767f))


# 0.1.0 (2016-12-15)

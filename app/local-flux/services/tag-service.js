import tagsDB from './db/tags';

export const getTagMargins = () =>
    new Promise((resolve, reject) =>
        tagsDB.margins
            .toArray()
            .then(data => resolve(data[0]))
            .catch(err => reject(err))
    );

export const tagSearch = (tag, start, limit) =>
    new Promise((resolve, reject) =>
        tagsDB.allTags
            .filter(item => item.tagName.includes(tag))
            .toArray()
            .then((data) => {
                const tags = ((start + limit) > data.length) ?
                data.slice(start, data.length).map(item => item.tagName) :
                data.slice(start, start + limit).map(item => item.tagName);
                return resolve(tags);
            })
            .catch(err => reject(err))
    );

export const tagCount = tag =>
    new Promise((resolve, reject) =>
        tagsDB.allTags
            .filter(item => item.tagName.includes(tag))
            .count()
            .then(data => resolve(data))
            .catch(err => reject(err))
    );

export const saveTags = ({ collection }) =>
    new Promise((resolve, reject) =>
        tagsDB.allTags.bulkPut(collection)
            .then(() =>
                tagsDB.margins
                    .toArray()
                    .then((data) => {
                        const oldMargins = data[0];
                        let margins;
                        let firstTag = collection[collection.length - 1].tagId;
                        let lastTag = collection[0].tagId;
                        if (!oldMargins) {
                            margins = { firstTag, lastTag };
                            tagsDB.margins.put({ ...margins, staticId: 'staticId' })
                                .then(() => resolve(margins))
                                .catch(err => reject(err));
                        } else {
                            firstTag = Number(firstTag) < Number(oldMargins.firstTag) ?
                                firstTag :
                                oldMargins.firstTag;
                            lastTag = Number(lastTag) > Number(oldMargins.lastTag) ?
                                lastTag :
                                oldMargins.lastTag;
                            margins = { firstTag, lastTag };
                            tagsDB.margins.put({ ...margins, staticId: 'staticId' })
                                .then(() => resolve(margins))
                                .catch(err => reject(err));
                        }
                    })
            )
            .catch(err => reject(err))
    );

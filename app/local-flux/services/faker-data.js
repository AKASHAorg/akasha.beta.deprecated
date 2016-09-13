import { convertFromHTML } from 'draft-js';
import faker from 'faker';

const randomUUids = [faker.random.uuid(), faker.random.uuid(), faker.random.uuid(), faker.random.uuid()];

function generateProfile () {
    return {
        address: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        optionalData: {
            avatar: faker.internet.avatar(),
        },
        userName: faker.internet.userName()
    };
}

export function generateComments (count) {
    const comments = [];
    for (let i = 0; i < count; i++) {
        comments.push({
            parent: faker.random.arrayElement(randomUUids),
            address: faker.random.arrayElement(randomUUids),
            author: generateProfile(),
            publishDate: faker.date.past(),
            text: faker.random.arrayElement([
                faker.lorem.text(),
                faker.lorem.sentences(),
                faker.lorem.paragraph()
            ]),
            upvotes: faker.random.number({ min: 0, max: 500 }),
            downvotes: faker.random.number({ min: 0, max: 300 }),
        });
    }
    return comments;
}

export function generateEntries (count) {
    const entries = [];
    for (let i = 0; i < count; i++) {
        entries.push({
            author: generateProfile(),
            title: faker.hacker.phrase(),
            address: faker.random.uuid(),
            excerpt: faker.lorem.sentences(),
            content: convertFromHTML(`
                <div>
                    <h4>${faker.hacker.phrase()}</h4>
                    <p>${faker.lorem.paragraph()}</p>
                    <p>${faker.lorem.paragraph()}</p>
                </div>`),
            status: {
                created_at: faker.date.past(),
                updated_at: faker.date.recent(),
            },
            tags: [
                faker.random.word().replace(/\s+/g, '-').toLowerCase(),
                faker.random.word().replace(/\s+/g, '-').toLowerCase(),
                faker.random.word().replace(/\s+/g, '-').toLowerCase()
            ],
            wordCount: faker.random.number(),
            licence: {},
            upvotes: faker.random.number({ min: 0, max: 500 }),
            downvotes: faker.random.number({ min: 0, max: 100 }),
            commentCount: faker.random.number({ min: 0, max: 1500 }),
            shareCount: faker.random.number({ min: 0, max: 80 })
        });
    }
    return entries;
}

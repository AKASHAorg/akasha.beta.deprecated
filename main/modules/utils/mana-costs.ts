import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from './jsonschema';
import { GethConnector } from '@akashaproject/geth-connector';

const manaCosts = {
    'id': '/manaCosts',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' }
    },
    'required': ['ethAddress']
};

const execute = Promise.coroutine(function* (data: { ethAddress: string }) {
    const v = new schema.Validator();
    v.validate(data, manaCosts, { throwError: true });
    const [, collected] = yield contracts.instance.Essence.getCollected(data.ethAddress);

    const publishEntry = yield contracts.instance.Entries.required_essence();
    const discountEntry = yield contracts.instance.Entries.discount_every();
    const entry = publishEntry.minus(collected.div(discountEntry));

    const publishComment = yield contracts.instance.Comments.required_essence();
    const discountComment = yield contracts.instance.Comments.discount_every();
    const comments = publishComment.minus(collected.div(discountComment));

    const oneVote = yield contracts.instance.Votes.required_essence();
    const fromWei = GethConnector.getInstance().web3.fromWei;
    const costs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
        return { weight: val, cost: (fromWei(oneVote.times(val), 'ether')).toFormat(5) };
    });
    return {
        entry: {
            baseCost: (fromWei(publishEntry, 'ether')).toFormat(5),
            discount: (fromWei(collected.div(discountEntry), 'ether')).toFormat(5),
            cost: (fromWei(entry, 'ether')).toFormat(5)
        },
        comments: {
            baseCost: (fromWei(publishComment, 'ether')).toFormat(5),
            discount: (fromWei(collected.div(discountComment), 'ether')).toFormat(5),
            cost: (fromWei(comments, 'ether')).toFormat(5)
        },
        votes: costs
    };
});

export default { execute, name: 'manaCosts' };

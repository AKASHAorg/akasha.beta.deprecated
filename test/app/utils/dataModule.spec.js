import { expect } from 'chai';
import { getInitials } from '../../../app/utils/dataModule';

describe('Utils tests', () => {
    describe('get initials', () => {
        it('should work with latin characters', () => {
            expect(getInitials('first name', 'last name')).to.be.equal('fl');
        });
        it('should work with chinese characters', () => {
            expect(getInitials('其实', '传了')).to.be.equal('其传');
        });
        it('should work with non-english characters', () => {
            expect(getInitials('éxample', 'ùtil')).to.be.equal('éù');
        });
        it('should work without last name', () => {
            expect(getInitials('其实')).to.be.equal('其');
        });
        it('should ignore emojis', () => {
            expect(getInitials('abc', '😀ghi')).to.be.equal('a');
        });
        it('should take 2 initials from first name if last name is missing or is invalid', () => {
            expect(getInitials('abc def')).to.be.equal('ad');
        });
        it('should take initials from both first name and last name if possible', () => {
            expect(getInitials('abc def', 'ghi😀')).to.be.equal('ag');
        });
        it('should not break with invalid first name', () => {
            expect(getInitials('-', 'ghi😀')).to.be.equal('g');
        });
        it('should not break with invalid last name', () => {
            expect(getInitials('abc', '---')).to.be.equal('a');
        });
        it('should not break with invalid first name and last name', () => {
            expect(getInitials('---', '---')).to.be.equal('');
        });
    });
});

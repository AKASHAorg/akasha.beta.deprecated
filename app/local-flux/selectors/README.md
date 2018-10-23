### Description
Every file contains selectors for a "slice" of the state
eg. `action-selectors.js` contains selectors which operates on `state.actionState`

### File structure:
 - state slice selectors (selecting from state directly, eg. state.actionState...)
 - get methods (combining the above selectors)

*Note: You may find this a little too verbose but it will help a lot when you need to change 
something in store (eg. state.actionState becomes state.action). You will only need to change this here! :)*

Keep this format as it is and use selectors everywhere!
(think of them as 'getters' for state).

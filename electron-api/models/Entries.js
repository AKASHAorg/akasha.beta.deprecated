
const LinvoDb = require('linvodb3');

const EntrySchema = new LinvoDb('Entries', {
  id:     { type: String, index: true, unique: true },
  author: { type: String, index: true },
  tags:   Number,
  ipfs:   String
});

class EntryModel {

  get table () {
    return EntrySchema;
  }

  get (id) {
    return new Promise((resolve, reject) => {
      EntrySchema.findOne({ id }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

}

export default EntryModel;


const LinvoDb = require('linvodb3');

const CommentSchema = new LinvoDb('Comments', {
  id: { type: String, index: true, unique: true },
  parent: { type: String, index: true },
  author: String,
  ipfs: String
});

class CommentModel {

  get table() {
    return CommentSchema;
  }

  get(id) {
    return new Promise((resolve, reject) => {
      CommentSchema.findOne({ id }, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

}

export default CommentModel;

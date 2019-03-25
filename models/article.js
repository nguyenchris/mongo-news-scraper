const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    summary: {
      type: String,
      required: true,
      unique: true
    },
    link: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Article', ArticleSchema);

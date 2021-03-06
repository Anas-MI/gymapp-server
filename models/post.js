const cuid = require('cuid');

const db = require('../config/db');
const Comment = require('./comment');

const Model = db.model('Post', {
  _id: {
    type: String,
    default: cuid
  },
  userId:{
    type:String,
    required: true
  },
  postType: {
    type: String,
    default: 'TEXT',
    enum: ['TEXT', 'IMAGE']
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  textContent: {
    type: String,
    required: true
  },
  postImageUrl: {
    type: String
  },
  comments:[{type:String, ref:'Comment', index:true}]
})

async function get(_id) {
  const model = await Model.findOne(
    {_id}
    // {__v: 0}
  )
    .populate('comments')
    .exec();
  return model;
}

async function list(opts = {}) {
  const {
    offset = 0, limit = 25
  } = opts;
  const model = await Model.find({}, {__v: 0})
    .sort({dateCreated: -1})
    .skip(offset)
    .limit(limit)
    .populate('comments')
    .exec();
  return model;
}

async function remove(_id, userId) {
  const model = await get(_id);
  if(!model) throw new Error("Post not found");
  if(model.userId!==userId) throw new Error("Not authorised to delete Post");

  model.comments.map(comment=> Comment.remove(comment._id,userId)); // Delete associated comments

  await Model.deleteOne({
    _id
  });
  return true;
}

async function create(fields) {
  const model = new Model(fields);
  await model.save();
  return model;
}

async function edit(_id, change) {
  const model = await get(_id);
  Object.keys(change).forEach(key => {
    model[key] = change[key]
  });
  await model.save();
  return await get(_id);
}

async function addComment(postId, commentId){
  const model = await get(postId);
  model.comments.push(commentId);
  await model.save();
  return model;
}

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  addComment,
  model: Model
}
const { ObjectId } = require("mongodb");

const database = require("../utils/database");

/* eslint dot-notation: 0 */
const Schema = {
  name: "Category",
  fields: {
    name: "name",
    userId: "userId"
  }
};

const New = ({ name = "", userId = "", id = undefined }) => ({
  ...(id !== undefined && { id }),
  [Schema.fields.name]: name,
  [Schema.fields.userId]: userId
});

const CreateFromBodyRequest = (body, userId) => {
  if (body.name !== undefined && body.name !== "") {
    return New({ name: body.name, userId });
  }
  return undefined;
};

const CreateFromDocument = categoryDocument => {
  let fields = {};
  Object.keys(Schema.fields).forEach(key => {
    fields = {
      ...fields,
      [Schema.fields[key]]: categoryDocument[Schema.fields[key]]
    };
  });
  return New({
    ...fields,
    id: categoryDocument["_id"]
  });
};

const CreateFromDocuments = categoryDocuments =>
  categoryDocuments.map(doc => CreateFromDocument(doc));

const GetAllAsync = async (userId, limit, skip) => {
  const db = database.instance();
  const filter = { [Schema.fields.userId]: userId };
  const query =
    limit !== undefined && skip !== undefined
      ? db
          .collection(Schema.name)
          .find(filter)
          .limit(limit)
          .skip(skip)
      : db.collection(Schema.name).find(filter);
  const categoriesDocs = await query.toArray();
  return CreateFromDocuments(categoriesDocs);
};

const GetAllFilteredAsync = async (categoriesId = []) => {
  const db = database.instance();
  const filter = [categoriesId.length > 0 ? { id: { $in: categoriesId } } : {}];
  const query = db.collection(Schema.name).find(filter);
  const categoriesDocs = await query.toArray();
  return CreateFromDocuments(categoriesDocs);
};

const InsertAsync = async category => {
  const db = database.instance();
  return db.collection(Schema.name).insertOne(category);
};

const DeleteAsync = async (userId, id) => {
  const db = database.instance();
  return db.collection(Schema.name).deleteOne({
    $and: [{ _id: ObjectId(id.toString()) }, { [Schema.fields.userId]: userId }]
  });
};

const SearchAsync = async (userId, text) => {
  const db = database.instance();
  let regex = "";
  const words = text.split(" ");
  words.forEach(word => {
    regex = `${regex}(.*${word})`;
  });
  const filter = {
    $and: [
      { [Schema.fields.userId]: userId },
      { [Schema.fields.name]: { $regex: `${regex}`, $options: "i" } }
    ]
  };
  const query = db.collection(Schema.name).find(filter);
  const categoriesDocs = await query.toArray();
  return CreateFromDocuments(categoriesDocs);
};

module.exports = {
  Schema,
  New,
  CreateFromBodyRequest,
  CreateFromDocument,
  CreateFromDocuments,
  GetAllAsync,
  GetAllFilteredAsync,
  InsertAsync,
  DeleteAsync,
  SearchAsync
};

import { v4 as uuidv4 } from 'uuid';
import { schema } from '../dbconfig.js';

class Repository {
  constructor(type, dbPromise) {
    this.type = type;
    dbPromise.then(db => {
      this.db = db;
      this.onDbReady();
    });
  }

  onDbReady() {
    // You can override this in child classes if you need to do something when the db is ready
  }

  async find(id) {
    const collection = this.db.collection(this.type);
    const entity = await collection.findOne({ id });
    return entity;
  }
  
  async findAll(sort = { sorts: [] }) {
    const collection = this.db.collection(this.pluralType);
    const sortObj = sort.sorts.reduce((acc, s) => {
      acc[`data.${s.field}`] = s.direction === 'asc' ? 1 : -1;
      return acc;
    }, {});

    const entities = await collection.find({}).sort(sortObj).toArray();
    return entities;
  }

  async count() {
    const collection = this.db.collection(this.pluralType);
    const count = await collection.countDocuments();
    return count;
  }

  async search(criteria) {
    const collection = this.db.collection(this.pluralType);
    const entities = await collection.find(criteria.selector).toArray();
    return entities;
  }

  async save(entity) {
    const collection = this.db.collection(this.pluralType);
    const currentTime = new Date().toISOString();

    const entityToSave = {
      ...entity,
      id: uuidv4(),
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    await collection.insertOne(entityToSave);
    return this.find(entityToSave.id);
  }

  async saveOrUpdate(entity) {
    const collection = this.db.collection(this.pluralType);
    const currentTime = new Date().toISOString();

    if (!entity.id) {
      return this.save(entity);
    }

    const entityToUpdate = {
      ...entity,
      updatedAt: currentTime,
    };

    const result = await collection.updateOne(
      { id: entity.id },
      { $set: entityToUpdate },
      { upsert: true }
    );

    if (result.matchedCount === 0) {
      return this.save(entity);
    } else {
      return this.find(entity.id);
    }
  }

  async delete(entity) {
    const collection = this.db.collection(this.pluralType);
    await collection.deleteOne({ id: entity.id });
    return entity;
  }
}

export default Repository;
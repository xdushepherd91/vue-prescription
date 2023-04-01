import db from './db'
const tableName = 'treatment'
class TreatmentService {
  findAll() {
    return db.getData(tableName)
  }
  async find(id : Number) {
    return await db.getById(tableName, id)
  }
  async addTreatment(treatment: Object) {
    return await db.addData(tableName, treatment)
  }
  async updateTreatment(treatment: Object) {
    return await db.updateData(tableName, treatment)
  }
  async delete(id: Number) {
    db.deleteData(tableName, id)
  }
}
export { TreatmentService };
import db from './db'
const tableName = 'prescription'
class PrescriptionService {
  findAll() {
    return db.getData(tableName)
  }
  async addPrescription(prescription: Object) {
    console.log(333)
    return await db.addData(tableName, prescription)
  }
  async deletePrescription(id: Number) {
    db.deleteData(tableName, id)
  }
  async find(id : Number) {
    return await db.getById(tableName, id)
  }
  async updatePrescription(prescription: Object) {
    return await db.updateData(tableName, prescription)
  }
}
export { PrescriptionService };
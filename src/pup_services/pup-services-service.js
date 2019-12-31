const PupsServiceService = {
  getAllServiceInfo(db) {
    return db
      .from('pup_services')
      .returning('*')
  },
  insertService(db, newService) {
    return db
      .insert(newService)
      .into('pup_services')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(db, id) {
    return PupsServiceService.getAllServiceInfo(db)
      .where('pup_services.id', id)
      .first()
  },
  deleteService(db, id) {
    return db('pup_services')
      .where({ id })
      .delete()
  },
  updateService(db, id, newPupServiceFields) {
    return knex('pup_services')
      .where({ id })
      .update(newPupServiceFields)
  }
}

module.exports = PupsServiceService
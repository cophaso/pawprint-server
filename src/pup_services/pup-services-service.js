const PupsServiceService = {
  getAllServiceInfo(db) {
    return db
      .from('pup_services AS ps')
      .select(
        'ps.id',
        'ps.date',
        'ps.service_type',
        'ps.note',
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                p.id,
                p.pup_name,
                p.parent_id,
                p.breed,
                p.allergies,
                p.hobbies
            ) tmp)
          ) AS "pup"`
        )
      )
      .leftJoin(
        'pups AS p',
        'ps.pup_id',
        'p.id',
      )
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
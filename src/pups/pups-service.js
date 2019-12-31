const PupsService = {
    getAllPupInfo(db){
        return db
            .from('pups AS p')
            .select(
                'p.id',
                'p.pup_name',
                'p.parent_id',
                'p.breed',
                'p.allergies',
                'p.hobbies',
                'p.image_url',
                db.raw(
                    `row_to_json(
                        (SELECT tmp FROM (
                            SELECT
                            ps.id,
                            ps.date,
                            ps.service_type,
                            ps.note
                        ) tmp)
                    ) AS "services"`
                )
            )
            .leftJoin(
                'pup_services AS ps',
                'p.id',
                'ps.pup_id'
                
            )
    },
    insertPup(db, newPup){
        return db
            .insert(newPup)
            .into('pups')
            .returning('*')
            .then(rows =>{
                return rows[0]
              })
    },
    getById(db, id){
        return PupsService.getAllPupInfo(db)
            .where('pups.id', id)
            .first()
    },
    deletePup(db, id){
        return db('pups')
            .where({id})
            .delete()
    },
    updatePup(db, id, newPupFields){
        return knex('pups')
        .where({id})
        .update(newPupFields)
    }
}

module.exports = PupsService
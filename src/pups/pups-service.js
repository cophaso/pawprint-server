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
                    `array_to_json(array_agg(row_to_json(
                        (SELECT tmp FROM (
                            SELECT
                            ps.id,
                            ps.appt_date,
                            ps.service_type,
                            ps.note
                        ) tmp)
                    ))) AS "services"`
                ),
                db.raw(
                    `row_to_json(
                        (SELECT tmp FROM (
                            SELECT
                            usr.id,
                            usr.name,
                            usr.email
                        ) tmp)
                    ) AS "parent"`
                )
            )
            .leftJoin(
                'pup_services AS ps',
                'p.id',
                'ps.pup_id'
            )
            .leftJoin(
                'users AS usr',
                'p.parent_id',
                'usr.id'
            )
            .groupBy('p.id', 'ps.pup_id', 'usr.id')
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
            .where('p.id', id)
            .first()
    },
    getServicesForPups(db, pup_id){
        return db
            .from('pup_services AS ps')
            .select('*')
            .where('ps.pup_id', pup_id)
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
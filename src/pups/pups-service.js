const PupsService = {
    getAllPupInfo(db){
        return db
            .from('pups')
            .returning('*')
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
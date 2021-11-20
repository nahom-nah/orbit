const request = require('./request')
const {selectAccountByEmailQuery} = require('./queries')

const selectAccountById = async (id) =>{

}

const selectAccountByEmail =async (email) =>{

    try{
     
        const hasuraData = await request(selectAccountByEmailQuery,{email})
       return await hasuraData.orbit_user[0]
    }catch(err){
        console.error(err)
    }
     
}

const selectAccount = async (body) => {
    const {email, id} = body;

     if(email){
         
        return await selectAccountByEmail(email)
     }else if(id){
          
            return await selectAccountById(id)
     }else{
         return undefined
     }
         
     
}

module.exports = selectAccount;
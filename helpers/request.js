const {  GraphQLClient } = require('graphql-request')
const {print} = require('graphql/language/printer')

const client = new GraphQLClient(   "http://localhost:8080/v1/graphql", {
    headers:{
        'x-hasura-admin-secret': "nahomdev2021_novemver_04"
    }
})

const request = async (query, variables) =>{
     return await client.request(print(query), variables) 
     
     
}

module.exports = request;
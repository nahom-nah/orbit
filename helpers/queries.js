const {gql} = require('graphql-tag')

const accountFragment = gql`
  fragment accountFragment on orbit_user {
    username
    updated_at
    profile_pic
    phone_no
    password
    last_name
    id
    first_name
    email
  }
`

exports.uploadfileQuery = gql`
mutation MyMutation ($id: uuid!) {
  update_orbit_user(where: {id: {_eq: $id}}) {
    affected_rows
    returning {
      ...accountFragment
    }
  }
}


`

exports.updateContatImage = gql`
mutation MyMutation($id: uuid!, $image_url: String) {
  update_orbit_contact_by_pk(pk_columns: {id: $id}, _set: {image: $image_url, }) {
    id
  }
}
`

exports.selectAccountByEmailQuery = gql`
query MyQuery ($email:String!){
    orbit_user(where: {email: {_eq: $email}}) {
        ...accountFragment
    }
  }
  ${accountFragment}
  
`
exports.insertAccount = gql`
mutation MyMutation($insertAccount:[orbit_user_insert_input!]!) {
  insert_orbit_user(objects: $insertAccount) {
    returning {
      ...accountFragment
    }
  }
}

  ${accountFragment}
  
`
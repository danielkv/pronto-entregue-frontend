import { createUploadLink } from 'apollo-upload-client';

const host = process.env.NODE_ENV === 'production' ? 'https://pronto-entregue-backend.herokuapp.com/graphql' : 'http://localhost:4000/graphql';

export default createUploadLink({ uri: host });
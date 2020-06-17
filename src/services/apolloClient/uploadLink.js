import { createUploadLink } from 'apollo-upload-client';

const host = process.env.NODE_ENV === 'production' ? 'https://api.prontoentregue.com.br/graphql' : 'http://localhost:4000/graphql';
//const host = process.env.NODE_ENV === 'production' ? 'https://api.prontoentregue.com.br/graphql' : 'http://ec2-18-229-163-189.sa-east-1.compute.amazonaws.com:4000/graphql';

export default createUploadLink({ uri: host });
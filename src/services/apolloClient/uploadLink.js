import { createUploadLink } from 'apollo-upload-client';

const host = process.env.NODE_ENV === 'production' ? 'https://ec2-18-228-44-149.sa-east-1.compute.amazonaws.com/graphql' : 'http://localhost:4000/graphql';

export default createUploadLink({ uri: host });
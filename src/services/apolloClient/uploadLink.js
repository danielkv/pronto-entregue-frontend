import { createUploadLink } from 'apollo-upload-client';

import serverConfig from '../../config/server';

export default createUploadLink({ uri: serverConfig.host });
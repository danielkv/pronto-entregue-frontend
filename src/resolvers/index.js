import { merge } from 'lodash';

import companies from './companies';
import products from './products';
import users from './users';

export default merge(companies, users, products);
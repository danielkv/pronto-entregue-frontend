import { merge } from 'lodash';

import branches from './branches';
import companies from './companies';
import products from './products';
import users from './users';


export default merge(companies, branches, users, products);
import {merge} from 'lodash';

import branches from './branches';
import companies from './companies';
import users from './users';
import products from './products';


export default merge(companies, branches, users, products);
import { merge } from 'lodash';

import companies from './companies';
import ordersRoll from './ordersRoll';
import products from './products';
import users from './users';

export default merge(companies, users, products, ordersRoll);
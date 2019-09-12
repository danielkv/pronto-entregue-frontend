import {merge} from 'lodash';

import branches from './branches';
import companies from './companies';


export default merge(companies, branches);
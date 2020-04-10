import { ErrorBuilder } from './helpers/ErrorBuilder';
import { paginate } from './helpers/Utility';

const Greeter = (name: string) => `Hello ${name}`;

export {Greeter, ErrorBuilder, paginate}
import { DevConfig } from './environments/environment.dev';
import { ProdConfig } from './environments/environment.prod';

export default process.env.NODE_ENV === 'production' ? ProdConfig : DevConfig;

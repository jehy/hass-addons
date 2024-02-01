import { ConfigService } from './config.service';

const config = new ConfigService();
export default () => config.data;

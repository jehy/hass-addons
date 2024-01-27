import * as YAML from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import type { DataSourceOptions } from 'typeorm';

type DBType = DataSourceOptions['type'];

function fixDbType(type: string): DBType {
  const fixed = type.replace('postgresql', 'postgres');
  if (!['sqlite', 'mysql', 'postgres'].includes(fixed)) {
    throw new Error(`Database type ${fixed} not supported`);
  }
  return fixed as DBType;
}

function fixConnectStr(str: string) {
  if (str.startsWith('sqlite')) {
    return str.split('://')[1];
  }
  return str;
}
function extractRecorderConfig(
  dbType?: string,
  dbConnectString?: string,
): Partial<DataSourceOptions> {
  if (dbType && dbConnectString) {
    return { type: dbType as DBType, connectString: dbConnectString };
  }
  // TODO: search in packages?
  // TODO: check secrets?
  const configFileName = path.join(
    __dirname,
    '../../../',
    '/homeass/configuration.yaml',
  );
  if (!fs.existsSync(configFileName)) {
    throw new Error(`Config file not found in ${configFileName}`);
  }
  const data = YAML.parse(fs.readFileSync(configFileName, 'utf-8'));
  if (data?.recorder?.db_url) {
    const type = fixDbType(data.recorder.db_url.split('://')[0]);
    const connectString = fixConnectStr(data.recorder.db_url);
    return { type, connectString };
  }
  const sqliteFileName = path.join(
    __dirname,
    '../../../',
    '/homeass/home-assistant_v2.db',
  );
  if (!fs.existsSync(sqliteFileName)) {
    throw new Error(`SQLite database file not found in ${sqliteFileName}`);
  }
  return { type: 'sqlite', database: sqliteFileName };
}

export type ConfigData = {
  typeOrmConfig: Partial<DataSourceOptions>;
  db: {
    logging: boolean;
  };
  server: {
    port: number;
  };
};
class ConfigProvider {
  private readonly data: ConfigData;

  constructor() {
    const { env } = process;
    const typeOrmConfig = extractRecorderConfig(
      env.DB_TYPE,
      env.DB_CONNECT_STRING,
    );
    this.data = {
      typeOrmConfig,
      db: {
        logging: env.DB_LOGGING === 'true',
      },
      server: {
        port: parseInt(env.port, 10) || 3000,
      },
    };
    Object.freeze(this.data);
    const errorMessages = [];
    Object.entries(this.data).forEach(([sectionName, section]) => {
      Object.entries(section).forEach(([settingName, value]) => {
        if (value === undefined) {
          errorMessages.push(`${sectionName}.${settingName} not provided`);
        }
      });
    });
    if (errorMessages.length) {
      console.log(errorMessages.join('\n'));
      process.exit(1);
    }
  }

  get(): ConfigData {
    return this.data;
  }
}
const provider = new ConfigProvider();
export default () => provider.get();

import * as YAML from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import type { DataSourceOptions } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as util from 'util';
import * as childProcess from 'child_process';
const exec = util.promisify(childProcess.exec);

async function execPromise(command: string) {
  try {
    const { stdout, stderr } = await exec(command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
}

type DBType = DataSourceOptions['type'];

export type ConfigData = {
  typeOrmConfig: Partial<DataSourceOptions>;
  db: {
    logging: boolean;
  };
  server: {
    port: number;
  };
};

function findKey(object: Record<string, unknown>, key: string) {
  let value;
  Object.keys(object).some(function (k) {
    if (k === key) {
      value = object[k];
      return true;
    }
    if (object[k] && typeof object[k] === 'object') {
      value = findKey(object[k] as Record<string, unknown>, key);
      return value !== undefined;
    }
  });
  return value;
}

@Injectable()
export class ConfigService {
  public readonly data: ConfigData;
  private logger: Logger;
  private readonly secretCache = {} as Record<string, Record<string, string>>;
  constructor(haHomeDir?: string) {
    this.logger = new Logger(ConfigService.name);
    const { env } = process;
    const typeOrmConfig = this.extractRecorderConfig(
      haHomeDir || env.HOME_DIR || '/homeassistant',
      env.DB_CONNECT_STRING,
    );
    this.secretCache = {};
    this.data = {
      typeOrmConfig,
      db: {
        logging: env.DB_LOGGING === 'true',
      },
      server: {
        port: parseInt(env.SERVER_PORT, 10) || 3000,
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

  static getDbTypeFromConnectionString(dbConnectString: string): DBType {
    /*Examples from https://www.home-assistant.io/integrations/recorder/:

SQLite
sqlite:////PATH/TO/DB_NAME

MariaDB (omit pymysql)
mysql://user:password@SERVER_IP/DB_NAME?charset=utf8mb4

MariaDB (omit pymysql, using TLS encryption)
mysql://user:password@SERVER_IP/DB_NAME?charset=utf8mb4;ssl=true

MariaDB (omit pymysql, Socket)
mysql://user:password@SERVER_IP/DB_NAME?unix_socket=/var/run/mysqld/mysqld.sock&charset=utf8mb4

MySQL
mysql://user:password@SERVER_IP/DB_NAME?charset=utf8mb4

MySQL (using TLS encryption)
mysql://user:password@SERVER_IP/DB_NAME?charset=utf8mb4;ssl=true

MySQL (Socket)
mysql://user:password@localhost/DB_NAME?unix_socket=/var/run/mysqld/mysqld.sock&charset=utf8mb4

MariaDB
mysql+pymysql://user:password@SERVER_IP/DB_NAME?charset=utf8mb4

MariaDB (Socket)
mysql+pymysql://user:password@localhost/DB_NAME?unix_socket=/var/run/mysqld/mysqld.sock&charset=utf8mb4

PostgreSQL
postgresql://user:password@SERVER_IP/DB_NAME

PostgreSQL (Socket)
postgresql://@/DB_NAME

PostgreSQL (Custom socket dir)
postgresql://@/DB_NAME?host=/path/to/dir
*/
    if (dbConnectString.startsWith('postgres')) {
      return 'postgres';
    }
    if (dbConnectString.startsWith('mysql')) {
      return 'mysql';
    }
    if (dbConnectString.startsWith('sqlite')) {
      return 'sqlite';
    }
    throw new Error(`Unknown database type ${dbConnectString.split(':')[0]}`);
  }

  static connectionStringToDatabaseOptions(
    dbConnectString: string,
  ): Partial<DataSourceOptions> {
    const dbType = ConfigService.getDbTypeFromConnectionString(dbConnectString);
    if (dbType === 'sqlite') {
      // https://www.sqlite.org/c3ref/c_open_autoproxy.html
      // #define SQLITE_OPEN_READONLY         0x00000001  /* Ok for sqlite3_open_v2() */
      const database = dbConnectString.split('://')[1];
      //const tmpFileRecovered = '/tmp/copy.recovered.db';
      //childProcess.execSync(`sqlite3 ${database} ".clone ${tmpFileRecovered}"`);
      const options: SqliteConnectionOptions = {
        type: 'sqlite',
        database: database,
        flags: 0x00000001,
      };
      return options;
    }
    if (dbType === 'postgres') {
      const options: PostgresConnectionOptions = {
        type: 'postgres',
        url: `postgresql://${dbConnectString.split('://')[1]}`,
      };
      return options;
    }
    if (dbType === 'mysql') {
      const options: MysqlConnectionOptions = {
        type: 'mysql',
        url: `mysql://${dbConnectString.split('://')[1]}`,
      };
      return options;
    }
    throw new Error(`Unknown database type ${dbType}`);
  }

  fixYaml(data: string, secrets: Record<string, string>) {
    // UGLY workaround because those yaml tags are non-standard and otherwise parser throws on them :(
    const badTags = [
      'include_dir_merge_list',
      'include',
      'include_dir_list',
      'include_dir_named',
      'include_dir_merge_named',
    ];
    const noUnknownTags = badTags.reduce(
      (res, item) => res.split(`!${item}`).join(item),
      data,
    );
    return Object.entries(secrets as Record<string, string>).reduce(
      (res, [secretName, secretValue]) => {
        return res.replace(`!secret ${secretName}`, secretValue);
      },
      noUnknownTags,
    );
  }

  loadSecrets(dir: string, homeDir: string): Record<string, string> {
    if (this.secretCache[dir]) {
      return this.secretCache[dir];
    }
    const secretsFileName = path.join(dir, '/secrets.yaml');
    if (fs.existsSync(secretsFileName)) {
      this.logger.log(`found and parsed secrets file`);
      return YAML.load(fs.readFileSync(secretsFileName, 'utf-8'));
    }
    if (
      path.resolve(path.dirname(dir)) !== path.resolve(path.dirname(homeDir))
    ) {
      this.secretCache[dir] = this.loadSecrets(path.join(dir, '../'), homeDir);
      return this.secretCache[dir];
    }
    this.secretCache[dir] = {};
    return {};
  }

  loadYaml(filePath: string, haHomeDir) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const secrets = this.loadSecrets(
      path.resolve(path.dirname(filePath)),
      haHomeDir,
    );
    this.logger.log(
      `${Object.keys(secrets).length} secrets found for file ${filePath}`,
    );
    return YAML.load(this.fixYaml(data, secrets));
  }

  extractRecorderConfig(
    haHomeDir?: string,
    dbConnectString?: string,
  ): Partial<DataSourceOptions> {
    if (dbConnectString) {
      this.logger.log(`Using database options from env`);
      return ConfigService.connectionStringToDatabaseOptions(dbConnectString);
    }
    if (!haHomeDir) {
      throw new Error(
        `Neither home dir nor database connection string is provided!`,
      );
    }
    this.logger.log(`database options from env not found, checking config`);
    const configFileName = path.join(haHomeDir, '/configuration.yaml');
    if (!fs.existsSync(configFileName)) {
      throw new Error(`Config file not found in path ${haHomeDir}`);
    }
    this.logger.log(`config file found, parsing`);
    const data = this.loadYaml(configFileName, haHomeDir);
    this.logger.log(`parsed config file`);

    if (data?.recorder?.db_url) {
      this.logger.log(`found recorder config, gonna use it`);
      return ConfigService.connectionStringToDatabaseOptions(
        data.recorder.db_url,
      );
    }
    if (data?.homeassistant?.packages) {
      this.logger.log(`found packages, gonna check it`);
      const localDir = data.homeassistant.packages.split(' ')[1];
      const packagesDir = path.join(haHomeDir, localDir);
      if (!fs.existsSync(packagesDir)) {
        throw new Error(`packages dir ${packagesDir} does not exist!`);
      }
      this.logger.log(
        `checking packages files from ${packagesDir} for database config`,
      );
      const files = fs
        .readdirSync(packagesDir, { recursive: true, encoding: 'utf-8' })
        .filter((file) => file.endsWith('.yaml'));
      const connectStringFound = files
        .map((file) => this.loadYaml(path.join(packagesDir, file), haHomeDir))
        .map((content) => {
          const recorder = findKey(content, 'recorder');
          return recorder?.db_url;
        })
        .filter((el) => el)?.[0];
      if (connectStringFound) {
        this.logger.log(`Found database options in packages, gonna use it`);
        return ConfigService.connectionStringToDatabaseOptions(
          connectStringFound,
        );
      }
      this.logger.log(`not found database options in packages`);
    }
    this.logger.log(
      `recorder options not found, gonna try standard database path`,
    );
    const sqliteFileName = path.resolve(
      path.join(haHomeDir, '/home-assistant_v2.db'),
    );
    if (!fs.existsSync(sqliteFileName)) {
      throw new Error(`SQLite database file not found in ${sqliteFileName}`);
    }
    this.logger.log(
      `Found standard sqlite file, gonna use it: ${sqliteFileName}`,
    );
    return ConfigService.connectionStringToDatabaseOptions(
      `sqlite://${sqliteFileName}`,
    );
  }
}

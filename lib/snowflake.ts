import snowflake from 'snowflake-sdk';
import fs from 'fs';
import crypto from 'crypto';

let connection: snowflake.Connection | null = null;

function getPrivateKey(): string {
  const keyPath = process.env.SNOWFLAKE_PRIVATE_KEY_PATH!;
  const privateKeyFile = fs.readFileSync(keyPath);
  const privateKeyObject = crypto.createPrivateKey(privateKeyFile);
  return privateKeyObject.export({ type: 'pkcs8', format: 'pem' }) as string;
}

function getConnection(): Promise<snowflake.Connection> {
  return new Promise((resolve, reject) => {
    if (connection) return resolve(connection);

    const conn = snowflake.createConnection({
      account: process.env.SNOWFLAKE_ACCOUNT!,
      username: process.env.SNOWFLAKE_USERNAME!,
      authenticator: 'SNOWFLAKE_JWT',
      privateKey: getPrivateKey(),
      database: process.env.SNOWFLAKE_DATABASE!,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
      role: process.env.SNOWFLAKE_ROLE!,
      schema: process.env.SNOWFLAKE_SCHEMA!,
    });

    conn.connect((err, conn) => {
      if (err) return reject(err);
      connection = conn;
      resolve(conn);
    });
  });
}

export function query<T = any>(sql: string): Promise<T[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const conn = await getConnection();
      conn.execute({
        sqlText: sql,
        complete: (err, _stmt, rows) => {
          if (err) return reject(err);
          resolve((rows || []) as T[]);
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

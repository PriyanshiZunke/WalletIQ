import dotenv from "dotenv";
import pkg from "pg";
import { type } from "os";

dotenv.config();

const { Pool, types } = pkg;

// Keep database dates as simple 'YYYY-MM-DD' strings to avoid timezone errors.
// This overrides the default behavior of converting OID 1082 (DATE) into a JS Date object.
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

pool.on('connect', () => {
    console.log("Connected to Neon Postgres");
});

pool.on('error',(err) => {
    console.error('Unexpected Postgres error', err);
    process.exit(-1);
});

export default pool;
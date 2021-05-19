import { Database } from "better-sqlite3";
import { promises as fs } from "fs";
import path from "path";
import { l } from "../modules/logs";
import { errWrap } from "../utils/errors";

export class DatabaseMigrations {
  constructor(private readonly db: Database) {}

  private fetchExecutedMigrations() {
    this.db.exec(`CREATE TABLE IF NOT EXISTS migrations (
      filename text PRIMARY KEY,
      date_executed text NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    const rows: { filename: string }[] = this.db
      .prepare(`SELECT filename FROM migrations`)
      .all();

    const filenames = rows.map((row) => row.filename);

    return new Set(filenames);
  }

  private insertExecutedMigration(filename: string) {
    try {
      this.db
        .prepare(`INSERT INTO migrations (filename) VALUES (?)`)
        .run(filename);
    } catch (err) {
      throw errWrap(err, `Can not insert executed migration ${filename}`);
    }
  }

  private executeMigration(filename: string, sql: string) {
    try {
      this.db.exec(sql);
    } catch (err) {
      throw errWrap(err, `Can not execute migration ${filename}`);
    }
  }

  async run() {
    const directory = path.join(__dirname, "./migrations");
    const filenames = await fs.readdir(directory);

    const executed = this.fetchExecutedMigrations();

    for (const filename of filenames) {
      if (executed.has(filename)) {
        continue;
      }

      const filepath = path.join(directory, filename);
      const sql = await fs.readFile(filepath, { encoding: "utf-8" });

      l({
        msg: "Executing database migration",
        filename: filename,
      });

      this.executeMigration(filename, sql);
      this.insertExecutedMigration(filename);
    }
  }
}

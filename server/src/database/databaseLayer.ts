import StormDB from "stormdb"; // module system of this package is broken
import { databaseDefaultState } from "./databaseState";

type ArrKey<Schema> = Schema extends any[]
  ? Exclude<keyof Schema, string>
  : keyof Schema;

export class DatabaseLayer<Schema> extends StormDB {
  constructor(engine: any) {
    super(engine);
    this.default(databaseDefaultState);
  }

  get<K extends ArrKey<Schema>>(key: K): DatabaseLayer<Schema[K]> {
    return super.get(key);
  }

  set<K extends ArrKey<Schema>>(
    key: K,
    val: Schema[K],
  ): DatabaseLayer<Schema[K]> {
    return super.set(key, val);
  }

  push<K extends ArrKey<Schema>>(val: Schema[K]) {
    super.push(val);
  }

  value(): Schema {
    return super.value();
  }
}

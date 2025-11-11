declare module "expo-sqlite" {
  export interface SQLResultSetRowList {
    length: number;
    item(index: number): any;
  }
  export interface SQLResultSet {
    insertId?: number;
    rows: SQLResultSetRowList;
    rowsAffected?: number;
  }
  export interface SQLTransaction {
    executeSql(
      sqlStatement: string,
      args?: any[],
      success?: (tx: SQLTransaction, result: SQLResultSet) => void,
      error?: (tx: SQLTransaction, error: any) => boolean | void
    ): void;
  }
  export interface Database {
    transaction(
      callback: (tx: SQLTransaction) => void,
      error?: (err: any) => void,
      success?: () => void
    ): void;
  }
  export function openDatabase(name: string): Database;
  export = { openDatabase: openDatabase } as any;
}

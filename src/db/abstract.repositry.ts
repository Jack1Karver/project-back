import { Connection } from "./connection";


export class AbstractRepository{

    connection = new Connection();
    async insertArrayObjects(tableName: string, arrayObject: object[], foreignKeyField?: string, foreign_id?: number) {
        for (let object of arrayObject) {
            this.insertAndGetID(tableName, object, foreignKeyField, foreign_id)
        }
    }

    async insertAndGetID(tableName: string, columns: object, foreignKeyField?: string, foreign_id?: number): Promise<number | null> {
        try {
            delete columns['id'];
            if (foreignKeyField != undefined && foreign_id != undefined) {
                columns[foreignKeyField] = foreign_id
            }
            const columnValues = Object.values(columns);
            const valuesPlaceholder = columnValues.map((_, i: number) => `$${i + 1}`).join(', ');
            const columnNames = Object.keys(columns).map((columnName: string) => `"${columnName}"`).join(', ');

            const sql = `INSERT INTO "${tableName}" (${columnNames}) VALUES (${valuesPlaceholder}) RETURNING id`;
            let result = await this.connection.sqlQuery(sql, columnValues)

            return this.getID_afterInsert(result)
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async updateTable(tableName: string, columns: object) {
        const columnValues = Object.values(columns);
        const valuesPlaceholder = columnValues.map((_, i: number) => `$${i + 1}`).join(', ');
        const columnNames = Object.keys(columns).map((columnName: string) => `${columnName}`).join(', ');

        const sql = `UPDATE "${tableName}" SET (${columnNames}) = (${valuesPlaceholder}) WHERE id = ${columns['id']}`;
        await this.connection.sqlQuery(sql, columnValues)
    }

    getID_afterInsert(queryResult: object): number {
        let id: number;

        try {
            id = queryResult[0].id
        } catch (error) {
            console.log(error)
        }

        return queryResult[0].id
    }

    getByField(field: string, table: string, value: string ){
        return this.connection.sqlQuery(`SELECT * FROM ${table} WHERE ${field} = ${value} LIMIT 1`)
    }
}
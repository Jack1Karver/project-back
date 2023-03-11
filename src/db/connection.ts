import { Pool, PoolConfig, QueryConfig, QueryResult } from 'pg';
import { db } from '../config/db';


export class Connection {
    private readonly pool: Pool;

    constructor() {
        this.pool = new Pool(<PoolConfig>db);
    }

  

    async sqlQuery(
        queryTextOrConfig: string | QueryConfig<any[]>,
        values?: any[] | undefined
    ): Promise<object> {

        const client = await this.pool.connect();
        let result: QueryResult<any>;

        try {
            result = await client.query(queryTextOrConfig, values);
        } finally {
            client.release();
        }

        return <object>result.rows
    }

   
}

export const connection = new Connection();

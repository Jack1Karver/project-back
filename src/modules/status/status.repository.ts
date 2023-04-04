import { AbstractRepository } from "../../db/abstract.repository";
import { IStatus } from "../../models/status.module";


export class StatusRepository extends AbstractRepository{

    getStatus = async (status: IStatus)=>{
        try{
        const result =  await this.getByFields('status', status, true);
        if(result.length){
            return result[0]
        }
        return null
    } catch(e){
        console.log(e)
        throw new Error
    }
    }

    insertStatus = async (status: string)=>{
        try{
        return await this.insertAndGetID('status', {name: status})
    } catch{
        throw new Error
    }
    }
}
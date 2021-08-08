import {Types} from 'mongoose';

const checkMongoId = (id:string):boolean => {
    return Types.ObjectId.isValid(id)
}

export default checkMongoId;
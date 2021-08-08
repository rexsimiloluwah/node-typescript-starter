import {model, Document, Model, Schema} from 'mongoose';

export interface TokenDocument extends Document{
    user: string,
    refresh_token: string,
    access_token: string,
    expires_at: Date, 
    revoked: boolean
}

const TokenSchema:Schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refresh_token: {type: String},
    access_token: {type: String},
    expires_at: {type: Date},
    revoked: {type: Boolean, default: false},  
}, {
    timestamps: true
})

TokenSchema.virtual('is_expired').get(() => {
    return Date.now() >= this.expires_at;
})

TokenSchema.virtual('is_active').get(()=>{
    return !this.is_expired && !this.revoked;
})

export const Token:Model<TokenDocument> = model<TokenDocument>('Token', TokenSchema);

import { Schema } from 'mongoose';

export const JobSchema = new Schema({
    _id: String,  // 确保 _id 被定义为字符串类型
    code: String,
    result: String,
    status: { type: String, default: 'pending' },
});

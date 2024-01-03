import { model, Schema } from "mongoose"

const languageSchema = new Schema({
    id : { type: Number, require: true },
    korean : { type: String },
    english : { type: String },
    spanish : { type: String}
});

languageSchema.index({ id: 1 });

export const language = model("language", languageSchema);
import { model, Schema } from "mongoose"

const languageSchema = new Schema({
    english: { type: String },
    korean: { type: String },
    spanish: { type: String }
});

languageSchema.index({ english: 1 });

export const language = model("language", languageSchema);
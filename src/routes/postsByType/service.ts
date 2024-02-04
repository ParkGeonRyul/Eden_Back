import "dotenv/config";
import { DuplicatePropertyError } from "../../utils/cunstomError";
import { posts } from "../../models/postsServer";

export const insertPostDB = async (
  content: string,
  uploadFile: [object],
  isSign: boolean,
  language: string,
  category: number
) => {
  try {
    const newPosts = new posts({
      content: content,
      uploadFile: uploadFile,
      isSign: isSign,
      language: language,
      category: category,
    });

    const post = await newPosts.save();

    if (post) {
      console.log("SUCCESS CREATED DATA : ", post);
    }
    return;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("E11000")) {
      console.log(err);
      throw new DuplicatePropertyError("content");
    }
    throw err;
  }
};

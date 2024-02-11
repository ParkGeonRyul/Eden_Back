import {
  InvalidPropertyError,
  NotFoundDataError,
} from "../../utils/cunstomError";
import { posts } from "../../models/postsServer";
import { formatDate } from "../../utils/formatKoreanDate";
import { PipelineStage } from "mongoose";

/// type list

interface Post {
  postId: number;
  title: string;
  content: string;
  uploadFile: [{ fileUrl: string }];
  isSign: boolean;
  language: number;
  category: number;
}

interface TotalAvgData {
  totalCount: number;
  totalPage: number;
  list?: Array<Object>;
}

// 1. Insert POst API

export const insertPostDB = async (
  title: string,
  content: string,
  uploadFile: [object],
  isSign: boolean,
  language: number,
  category: number
) => {
  try {
    const newPosts = new posts({
      title: title,
      content: content,
      uploadFile: uploadFile,
      isSign: isSign,
      language: language,
      category: category,
    });

    return newPosts
      .save()
      .then((post: Post) => {
        console.log(post, "SUCCESS CREATED DATA");
        return post.postId;
      })
      .catch((err: unknown) => {
        console.error(err);
        if (err instanceof Error && err.message.includes("CastError"))
          throw new InvalidPropertyError("PROPERTY_TYPE");
      });
  } catch (err: unknown) {
    throw err;
  }
};

// 2. GET Post Details API

//// 2-1. isSign Check Function
const checkisSign = async (postId: string, userIsSign: boolean) => {
  try {
    const post = await posts.findOne({ postId: postId });
    if (!post) throw new NotFoundDataError("POST");
    if (userIsSign === false && post.isSign === true) {
      throw new NotFoundDataError("USERID");
    }
    return;
  } catch (err: unknown) {
    throw err;
  }
};

//// 2-2. Post Details API

export const getPostDetailsDB = async (postId: string, userIsSign: boolean) => {
  try {
    await checkisSign(postId, userIsSign);

    const post: any = await posts
      .findOneAndUpdate(
        { postId: postId },
        { $inc: { view: 1 } },
        { returnNewDocument: true, projection: { _id: 0, "uploadFile._id": 0 } }
      )
      .lean()
      .catch((err: unknown) => {
        console.error(err);
        if (err instanceof Error && err.name === "CastError")
          throw new InvalidPropertyError("postId_TYPE");
      });

    if (!post) {
      throw new NotFoundDataError("POST");
    } else {
      post.createdAt = formatDate(post.createdAt);
      post.updatedAt = formatDate(post.updatedAt);
    }

    return post;
  } catch (err: unknown) {
    throw err;
  }
};

// 3. Modify Post API

export const modifyPostDB = async (
  postId: string,
  title: string,
  content: string,
  uploadFile: [object],
  isSign: boolean,
  language: number,
  category: number
) => {
  try {
    return await posts
      .updateOne(
        { postId: postId },
        {
          title: title,
          content: content,
          uploadFile: uploadFile,
          isSign: isSign,
          language: language,
          category: category,
        }
      )
      .then((res) => {
        if (!res.modifiedCount) {
          throw new NotFoundDataError(`POST`);
        }
        console.log(res, "SUCCESS UPDATE POST");
        return postId;
      });
  } catch (err: unknown) {
    throw err;
  }
};

// 4. Delete Post API

export const deletePostDB = async (postId: string) => {
  try {
    await posts.findOneAndDelete({ postId: postId }).then((res) => {
      if (!res) throw new NotFoundDataError("POST");
      console.log(res, "SUCCESS DELETE POST");
    });

    return;
  } catch (err: unknown) {
    throw err;
  }
};

// 5. GET Post List API

////// 5-1. PipeLine Function

const getPipeline = (
  category: number,
  word: string,
  language: number,
  isSign: boolean
) => {
  try {
    if (word && language) {
      const regexWord = new RegExp(word);
      return {
        $match: {
          category: category,
          language: language,
          title: { $regex: regexWord, $options: "i" },
          isSign: isSign,
        },
      };
    } else if (!word && language) {
      return {
        $match: {
          category: category,
          language: language,
          isSign: isSign,
        },
      };
    } else if (word && !language) {
      const regexWord = new RegExp(word);
      return {
        $match: {
          category: category,
          title: { $regex: regexWord, $options: "i" },
          isSign: isSign,
        },
      };
    } else {
      return {
        $match: { category: category, isSign: isSign },
      };
    }
  } catch (err: unknown) {
    throw err;
  }
};

////// 5-2. TotalAvg Function

const getTotalAvg = async (
  category: number,
  word: string,
  language: number,
  limit: number,
  isSign: boolean
) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $count: "totalCount",
      },
    ];

    pipeline.unshift(getPipeline(category, word, language, isSign));

    const [count] = await posts.aggregate(pipeline);
    const totalPage = Math.ceil(count.totalCount / limit);

    const totalAvg = {
      totalCount: count.totalCount,
      totalPage: totalPage,
    };

    return totalAvg;
  } catch (err: unknown) {
    throw err;
  }
};

////// 5-3. PostList Function

const getList = async (
  pageNumber: number,
  limit: number,
  category: number,
  word: string,
  language: number,
  isSign: boolean
) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $sort: { postId: -1 },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          postId: 1,
          createdAt: 1,
        },
      },
      {
        $skip: (pageNumber - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];

    pipeline.unshift(getPipeline(category, word, language, isSign));

    const postList = await posts.aggregate(pipeline);
    if (!postList.length) throw new NotFoundDataError("POSTLIST");

    for (const post of postList) {
      post.createdAt = formatDate(post.createdAt);
    }

    return postList;
  } catch (err: unknown) {
    throw err;
  }
};

////// 5-4. API

export const postListDB = async (
  pageNumber: number,
  limit: number,
  category: number,
  word: string,
  language: number,
  isSign: boolean
) => {
  try {
    const postList = await getList(
      pageNumber,
      limit,
      category,
      word,
      language,
      isSign
    );

    const data: TotalAvgData = await getTotalAvg(
      category,
      word,
      language,
      limit,
      isSign
    );
    data.list = postList;

    return data;
  } catch (err: unknown) {
    throw err;
  }
};

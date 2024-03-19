import {
  NotFoundDataError,
  InvalidPropertyError,
  UnauthorizedAccessError,
} from "../../utils/cunstomError";
import { users } from "../../models/usersServer";
import { inquiry } from "../../models/inquiryServer";
import { formatDate } from "../../utils/formatKoreanDate";
import mongoose, { PipelineStage } from "mongoose";

interface TotalAvgData {
  totalCount: number;
  totalPage: number;
  list?: Array<Object>;
}
export const findUserById = async (userId: string) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: { "auths.userData.userId": userId },
      },
      {
        $project: {
          _id: 0,
          userFirstName: "$avatar.firstName",
          userLastName: "$avatar.surName",
          userId: "$auths.userData.userId",
          userEmail: "$auths.userData.userEmail",
          address: {
            $cond: {
              if: { $eq: [{ $type: "$address" }, "missing"] },
              then: null,
              else: "$address",
            },
          },
          phoneNumber: "$phoneNumber",
          birthDate: {
            $cond: {
              if: { $eq: [{ $type: "$birthDate" }, "missing"] },
              then: null,
              else: {
                $dateToString: { format: "%Y.%m.%d", date: "$birthDate" },
              },
            },
          },
          userImage: {
            $cond: {
              if: { $eq: [{ $type: "$avatar.userImage" }, "missing"] },
              then: null,
              else: "$avatar.userImage",
            },
          },
        },
      },
    ];

    const [userInfo] = await users.aggregate(pipeline);

    return userInfo;
  } catch (err: unknown) {
    throw err;
  }
};

export const updateUserInfo = async (
  userEmail: string,
  phoneNumber: string,
  address: string,
  birthDate: Date,
  userImage: string,
  userId: string
) => {
  try {
    let userInfo = await users.findOne({ "auths.userData.userId": userId });
    if (!userInfo) throw new NotFoundDataError("USER");

    if (userInfo.auths.userData.userId != userId)
      throw new UnauthorizedAccessError();

    validateProperty(userEmail, "string");
    validateProperty(phoneNumber, "string");
    validateProperty(address, "string");
    validateProperty(birthDate, "object");
    validateProperty(userImage, "string");

    if (userEmail) userInfo.auths.userData.userEmail = userEmail;
    if (phoneNumber) userInfo.phoneNumber = phoneNumber;
    if (address) userInfo.address = address;
    if (birthDate) userInfo.birthDate = birthDate;
    if (userImage) userInfo.avatar.userImage = userImage;

    await userInfo
      .save()
      .then((res) => console.log(res, "SUCCESS UPDATE DATA"));

    return findUserById(userId);
  } catch (err: unknown) {
    throw err;
  }
};

export const selectInquiry = async (id: string) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $project: {
          _id: 0,
          inquiryUniqueId: "$_id",
          title: 1,
          content: 1,
          inquiryCreatedAt: 1,
          answerStatus: {
            $cond: {
              if: { $eq: [{ $type: "$answer" }, "missing"] },
              then: false,
              else: true,
            },
          },
          answer: 1,
          answerUpdatedAt: {
            $cond: {
              if: "$answer",
              then: "$reviewUpdatedAt",
              else: "$$REMOVE",
            },
          },
        },
      },
    ];

    const [mySelectedInquiry] = await inquiry.aggregate(pipeline);

    if (!mySelectedInquiry) {
      return { message: "NO_INQUIRIES_FOUND" };
    }

    if (mySelectedInquiry.inquiryCreatedAt) {
      mySelectedInquiry.inquiryCreatedAt = await formatDate(
        mySelectedInquiry.inquiryCreatedAt
      );
    }
    if (mySelectedInquiry.answerUpdatedAt) {
      mySelectedInquiry.answerUpdatedAt = await formatDate(
        mySelectedInquiry.answerUpdatedAt
      );
    }

    return mySelectedInquiry;
  } catch (err: unknown) {
    throw err;
  }
};

export const getLatestInquiry = async (userEmail: string) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: { "auths.userEmail": userEmail },
      },
      {
        $sort: { inquiryCreatedAt: -1 },
      },
      {
        $limit: 1, // 최상위 문서 하나만 선택
      },
      {
        $project: {
          _id: 0,
          inquiryUniqueId: "$_id",
          title: 1,
          content: 1,
          inquiryCreatedAt: 1,
          answerStatus: {
            $cond: {
              if: { $eq: [{ $type: "$answer" }, "missing"] },
              then: false,
              else: true,
            },
          },
          answer: 1,
          answerUpdatedAt: {
            $cond: {
              if: "$answer",
              then: "$reviewUpdatedAt",
              else: "$$REMOVE",
            },
          },
        },
      },
    ];

    const [myFirstInquiry] = await inquiry.aggregate(pipeline);

    if (!myFirstInquiry) {
      return { message: "NOT_FOUND_INQUIRY" };
    }

    if (myFirstInquiry.inquiryCreatedAt) {
      myFirstInquiry.inquiryCreatedAt = await formatDate(
        myFirstInquiry.inquiryCreatedAt
      );
    }
    if (myFirstInquiry.answerUpdatedAt) {
      myFirstInquiry.answerUpdatedAt = await formatDate(
        myFirstInquiry.answerUpdatedAt
      );
    }

    return myFirstInquiry;
  } catch (err: unknown) {
    throw err;
  }
};

export const getPaginatedList = async (
  userEmail: string | undefined,
  pageNumber: number,
  limit: number
) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: { "auths.userEmail": userEmail },
      },
      {
        $sort: { inquiryCreatedAt: -1 },
      },
      {
        $project: {
          _id: 0,
          inquiryUniqueId: "$_id",
          title: 1,
          inquiryCreatedAt: 1,
          answerStatus: {
            $cond: {
              if: { $eq: [{ $type: "$answer" }, "missing"] },
              then: false,
              else: true,
            },
          },
        },
      },
      {
        $skip: (pageNumber - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];

    const inquiryList = await inquiry.aggregate(pipeline);

    if (!inquiryList.length) {
      console.log(inquiryList);

      return { message: "NOT_FOUND_LIST" };
    }

    for (const inquiry of inquiryList) {
      inquiry.inquiryCreatedAt = await formatDate(inquiry.inquiryCreatedAt);
    }

    const data: TotalAvgData = await getTotalAvg(userEmail);
    data.list = inquiryList;

    return data;
  } catch (err: unknown) {
    throw err;
  }
};

const validateProperty = (value: any, type: string) => {
  if (value !== undefined && typeof value !== type) {
    throw new InvalidPropertyError("PROPERTY_TYPE");
  }
};

const getTotalAvg = async (userEmail: string | undefined) => {
  try {
    const limit = 3;

    const totalCount = await inquiry.countDocuments({
      "auths.userEmail": userEmail,
    });
    const totalPage = Math.ceil(totalCount / limit);

    const totalAvg = {
      totalCount: totalCount,
      totalPage: totalPage,
    };

    return totalAvg;
  } catch (err: unknown) {
    throw err;
  }
};

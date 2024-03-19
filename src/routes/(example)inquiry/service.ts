import { inquiry } from "../../models/inquiryServer";

// createdAt, updatedAt rename test
export const createInquiry = async (
  userName: string,
  userEmail: string,
  category: number,
  title: string,
  content: string,
  answer: string
) => {
  try {
    const inquiryData = new inquiry({
      auths: {
        userName,
        userEmail,
      },
      category,
      title,
      content,
      answer,
    });
    await inquiryData.save();

    return inquiryData;
  } catch (err) {
    console.error(err);
  }
};

export const updateInquiry = async (
  id: string,
  inquiryTitle: string,
  inquiryAnswer: string
) => {
  try {
    const findingInquiry = await inquiry.findById(id);
    if (!findingInquiry) return null;

    if (inquiryAnswer) findingInquiry.answer = inquiryAnswer;
    if (inquiryTitle) findingInquiry.title = inquiryTitle;

    await findingInquiry.save();
    return findingInquiry;
  } catch (err) {
    console.error(err);
  }
};

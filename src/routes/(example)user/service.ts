import { users } from "../../models/usersServer";

export const checkExistingUser = async (userId: string, userEmail: string) => {
  try {
    const existingUser = await users.findOne({
      $and: [
        { "auths.userData.userId": userId },
        { "auths.userData.userEmail": userEmail },
      ],
    });
    return existingUser;
  } catch (err) {
    console.error(err);
  }
};

export const createUser = async (
  userId: string,
  userEmail: string,
  password: string,
  firstName: string,
  surName: string,
  phoneNumber: string
) => {
  try {
    const user = new users({
      auths: {
        userData: {
          userId,
          userEmail,
        },
        secret: {
          bcrypt: password,
        },
      },
      avatar: {
        firstName,
        surName,
      },
      phoneNumber,
      isAdmin: false,
    });
    await user.save();

    return user;
  } catch (err) {
    console.error(err);
  }
};

export const getUser = async (userId: string, password: string) => {
  try {
    return await users.findOne({
      "auths.userData.userId": userId,
      "auths.secret.bcrypt": password,
    });
  } catch (err) {
    console.error(err);
  }
};

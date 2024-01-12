import { users } from "../../models/usersServer";

export const checkExistingUser = async (userId: String, userEmail: String) => {
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
  userId: String,
  userEmail: String,
  password: String,
  firstName: String,
  surName: String,
  phoneNumber: String
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

export const getUser = async (userId: String, password: String) => {
  try {
    return await users.findOne({
      "auths.userData.userId": userId,
      "auths.secret.bcrypt": password,
    });
  } catch (err) {
    console.error(err);
  }
};

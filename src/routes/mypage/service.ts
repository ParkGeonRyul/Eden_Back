import { users } from "../../models/usersServer";

export const getUserById = async (userId: String) => {
  try {
    return await users.findOne({
      "auths.userData.userId": userId,
    });
  } catch (err) {
    console.error(err);
  }
};

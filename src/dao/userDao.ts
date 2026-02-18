import { ObjectId, Types } from "mongoose";
import { User } from "../../lib/models";
import { TypesObjectId } from "../../lib/schemas";

class userDao {
  async findUser(email: string) {
    return User.findOne({ email: email });
  }

  async createUser(data: object) {
    return User.create(data);
  }

  async findUserById(id: TypesObjectId) {
    return User.findOne({ _id: id });
  }
  async updateUser(email: string, data: Object) {
    return User.updateOne({ email:email  }, { data });
  }
}
export default new userDao();

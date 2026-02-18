import { Course } from "../../lib/models/Course.model";
import { TypesObjectId } from "../../lib/schemas";

class courseDao {
  async createCourse(data: Object) {
    return Course.create(data);
  }
  async updateClass(id: TypesObjectId, data: Object) {
    return Course.updateOne({ _id: id }, { data });
  }
}
export default new courseDao();

import { customFetch } from "../utils/customFetch";

export class SkillService {

  async fetchSkills() {
    const { data } = await customFetch.get(`/skills`);
    return data;
  }

  async createSkill(title) {
    const { data } = await customFetch.post(`/skills`, { title });
    return data;
  }

  async updateSkill(id, updates) {
    const { data } = await customFetch.patch(`/skills/${id}`, updates);
    return data;
  }

  async deleteSkill(id) {
    await customFetch.delete(`/skills/${id}`);
  }
}

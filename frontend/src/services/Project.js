import { customFetch } from "../utils/customFetch";

export class ProjectService {

  async fetchProjects(pageParam, debouncedSearchTerm) {
    const { data } = await customFetch.get(`/projects?page=${pageParam}&limit=6&search=${encodeURIComponent(
      debouncedSearchTerm
    )}`);
    return data;
  }

  async createProject(formData) {
    const { data } = await customFetch.post(`/projects`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

  async updateProject(id, updates) {
    const { data } = await customFetch.patch(`/projects/${id}`, updates);
    return data;
  }

  async deleteProject(id) {
    await customFetch.delete(`/projects/${id}`);
  }
}

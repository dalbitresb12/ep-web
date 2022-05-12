import { http } from "@/core/services/http-common";

export class ChallengesService {
  getAll() {
    return http.get("/challenges");
  }

  getById(id) {
    return http.get(`/challenges/${id}`);
  }

  create(data) {
    return http.post("/challenges", data);
  }

  update(data) {
    if (!data.id) {
      throw new Error(`Data is missing id, unable to update. Body was ${data}`);
    }
    return http.put(`/challenges/${data.id}`, data);
  }

  delete(id) {
    return http.delete(`/challenges/${id}`);
  }

  async countByChallenge(type) {
    const res = await http.get(
      `/challenges?challengeType=${type}&_start=0&_end=0`
    );
    return res.headers["x-total-count"];
  }
}

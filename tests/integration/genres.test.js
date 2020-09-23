const request = require("supertest");
let server;
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.result.length).toBe(2);
      expect(res.body.result.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.result.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return genre if valid id is passed", async () => {
      const genres = new Genre({ genre: "genre1" });
      await genres.save();
      const res = await request(server).get(`/api/genres/${genres._id}`);
      expect(res.status).toBe(200);
      expect(res.body.result).toHaveProperty("genre", genres.genre);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    // Define the happy path ,and in each test we change
    // we change one parameter that clearly aligns with the name of the test

    let token;
    let genre;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ genre });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      genre = "genre1";
    });

    it("should return 401 if client is not loggedin", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      genre = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      const name = new Array(52).join("a");
      genre = name;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();
      const genre = await Genre.find({ genre: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should save return genre if it is valid", async () => {
      const res = await exec();

      expect(res.body.genre).toHaveProperty("_id");
      expect(res.body.genre).toHaveProperty("genre", "genre1");
    });
  });
});

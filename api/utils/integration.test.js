const request = require("supertest");
const app = require("../server.js"); // ton server.js
const { Pool } = require("pg");
jest.setTimeout(20000); // 20 secondes


// Optionnel : config si tu veux une pool spécifique pour les tests
const pool = new Pool({
  user: "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "projet_renforcement",
  password: "password",
  port: 5432,
});

beforeAll(async () => {
  // Vérifie que la DB est accessible
  await new Promise((res) => setTimeout(res, 5000));
  await pool.query("SELECT 1");
});

afterAll(async () => {
  await pool.end();
});

describe("Integration tests /last-metro", () => {
  test("200 avec station connue (insensible à la casse)", async () => {
    const res = await request(app).get("/last-metro?station=Aragon");
    expect(res.statusCode).toBe(200);
    expect(res.body.station.toLowerCase()).toBe("aragon");
    expect(res.body.lastMetro).toMatch(/\d{2}:\d{2}/);
    expect(res.body.line).toBeDefined();
    expect(res.body.tz).toBeDefined();
  });

  test("404 avec station inconnue", async () => {
    const res = await request(app).get("/last-metro?station=Inconnue");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test("400 sans station", async () => {
    const res = await request(app).get("/last-metro");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe("Integration tests /next-metro", () => {
  test("200 avec station → nextArrival au format HH:MM", async () => {
    const res = await request(app).get("/next-metro?station=Chatelet");
    expect(res.statusCode).toBe(200);
    expect(res.body.station).toBeDefined();
    expect(res.body.nextArrival).toMatch(/^\d{2}:\d{2}$/);
    expect(res.body.line).toBeDefined();
    expect(res.body.headwayMin).toBeDefined();
  });
});

const pool = require("../index/index");

exports.getAll = async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stations");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.getById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM stations WHERE id = $1", [
      id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.create = async (req, res) => {
  const { name, ligne } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO stations (name, ligne) VALUES ($1, $2) RETURNING *",
      [name, ligne]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.modify = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, ligne } = req.body;
  try {
    const result = await pool.query(
      "UPDATE stations SET name = $1, ligne = $2 WHERE id = $3 RETURNING *",
      [name, ligne, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Station not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.delete = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "DELETE FROM stations WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Station not found" });
    }
    res.json({ message: "Station deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

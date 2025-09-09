import express from "express"
import cors from "cors"
import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("select * from tasks order by id asc")
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/tasks", async (req, res) => {
  const { title, description } = req.body
  try {
    const result = await pool.query(
      "insert into tasks (title, description) values ($1, $2) returning *",
      [title, description]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params
  const { title, description, status } = req.body
  try {
    const result = await pool.query(
      "update tasks set title=$1, description=$2, status=$3 where id=$4 returning *",
      [title, description, status, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params
  try {
    await pool.query("delete from tasks where id=$1", [id])
    res.json({ message: "Task deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = 5000
app.listen(PORT, () => console.log("server running on http://localhost:" + PORT))

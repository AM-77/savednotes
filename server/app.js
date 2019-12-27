const express = require("express")
const mysql = require("mysql")
const cors = require("cors")

const app = express()
app.use(cors())

const DB_HOST = process.env.DB_HOST || "localhost"
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_NAME = process.env.DB_NAME || "savednotes-db"

const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
})

db.connect((err) => {
    if (err) console.log("[!] There was an error connecting to the database: \n" + err)
    else console.log("[+] Connected to the database.")
})
module.exports = app
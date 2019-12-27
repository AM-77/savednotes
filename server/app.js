const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const sn_router = require("./routes")
app.use("/sn-api", sn_router)

app.use((req, res, next) => {
    const error = new Error("Not Found")
    error.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
        .json({
            message: err.message,
            method: err.method,
            url: err.url
        })
})

module.exports = app
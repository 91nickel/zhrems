const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')
const path = require('path')
const cors = require('cors')
const initDatabase = require('startUp/initDatabase')

const routes = require('routes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use('/api', routes)

const PORT = config.get('port') ?? 3000

if (process.env.NODE_ENV === 'production') {
    console.log('Prod ...')
    // app.use('/', express.static(path.join(__dirname, 'client')))
    // const indexPath = path.join(__dirname, 'client', 'index.html')
    // app.get('*', (request, response) => {
    //     return response.sendFile(indexPath)
    // })
} else {
    console.log('Dev ...')
}

async function start () {
    try {
        // mongoose.connection.once('open', () => {
        //     initDatabase()
        // })
        await mongoose.connect(config.get('mongoDbConnectionString'))
        console.log(chalk.green(`MongoDB connected...`))
        app.listen(PORT, () => {
            console.log(chalk.green(`Server has been started on port ${PORT}...`))
        })
    } catch(error) {
        console.error(chalk.red(error.message))
        process.exit(1)
    }
}
start()

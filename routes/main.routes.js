const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).setHeader('Content-Type', 'text/html')
    .send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MemoryX API</title>
      </head>
      <body>
        <h1> WELCOME TO MEMORYX API </h1>
      </body>
      </html>

      <style>
        * {
          margin: 0;
          padding: 0;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        }
        body {
          padding: 20px;
          background: linear-gradient(45deg, #c471f5 0%, #fa71cd 100%);
        }
        h1 {
          position: absolute;
          display: block;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 3rem;
          color: white;
          text-shadow: 1px 1px 10px black;
        }
      </style>
    `)
})

module.exports = router

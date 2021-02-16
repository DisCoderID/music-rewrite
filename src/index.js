/*                                                             Not A 開発者 Music Bot Example
                                                         1. Put Bot Token and Youtube API Key in .env file
                                                           2. Put Prefix and Your User ID in config.json
                                                                          3. Modify It!
                                                     
           © Not A 開発者 2021 | Please, do not use our project as a commercial project. Instead, you can contribute on writing it. Also, please do not remove the credit                        */
require("dotenv").config()
const MusicClient = require("./classes/MusicClient")
new MusicClient().intialize()
const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(3000)

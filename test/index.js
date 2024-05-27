import PinataFileService from '../src/services/pinata-file.js'
import fs from 'fs'

const pinataOptions = 
  { pinata_api_key: process.env['PINATA_API_KEY'] || ''
  , pinata_api_secret: process.env['PINATA_API_SECRET'] || ''
  , pinata_jwt: process.env['PINATA_JWT'] || ''
  , pinata_gateway: process.env['PINATA_GATEWAY'] || ''
  }


//console.log(pinataOptions)
const filePath = process.env['PINATA_FILE']
const fileService = new PinataFileService({}, pinataOptions)
const res = await fileService.upload({ buffer: fs.readFileSync(filePath), originalname: 'river123'})
console.log('test res')
console.log(res)

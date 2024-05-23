import FormData from 'form-data'
import fs from 'fs'
import axios from 'axios'
const api_key='aa68d492f3e4b10bfd87'
const api_secret='853dd993b58f440a86a215346ddef38a0006cc8aba6fc2e3b5794cec553503b2'
const JWT='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkNzRhZmY1NS0wZTEzLTQyY2MtYmJhMi05MzI4NThiMjAzMDciLCJlbWFpbCI6ImhhcHB5amFtc0Bwcm90b24ubWUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYWE2OGQ0OTJmM2U0YjEwYmZkODciLCJzY29wZWRLZXlTZWNyZXQiOiI4NTNkZDk5M2I1OGY0NDBhODZhMjE1MzQ2ZGRlZjM4YTAwMDZjYzhhYmE2ZmMyZTNiNTc5NGNlYzU1MzUwM2IyIiwiaWF0IjoxNzE2MzY4MTY1fQ.X27HcvWF5vsZSqwEpVjHWyfJ_JSOrccePYFmcZThKVc'

const filePath = '/home/raymond/Pictures/yz6ggt7m18l41.webp'
const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

const formData = new FormData()
const buffer = fs.readFileSync(filePath)

//console.log(data)
formData.append('file',buffer,{filename: 'aoueaou'})

//console.log(formData)
const options =
  { maxContentLength: -1
  , headers:
    { "Content-Type": 'multipart/form-data; boundary=' + formData.getBoundary()
    , pinata_api_key: api_key
    , pinata_secret: api_secret
    , path: 'ueoa'
    }
  }
const res = await axios.post(url,formData,options)
console.log((res))

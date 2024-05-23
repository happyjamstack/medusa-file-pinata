import { AbstractFileService } from "@medusajs/medusa"
import { tap, pipe, toPairs, map } from 'ramda'
import FormData from 'form-data'
import fs from 'fs'
import axios from 'axios'


/*
const objToFormData =
  (obj) => {
    console.log(toPairs(obj))
    const name = JSON.parse(obj['pinataMetadata']).name
    const formData = new FormData()
    map
      ( p => formData.append
        ( p[0]
        , p[1]
        , Buffer.isBuffer(p[1]) ? {filename: name || '' + Math.random()} : {}
        )
      )
      ( toPairs(obj) )
    return formData
  }
  */

const pinFileToIPFS =
  (config) => async (fileData) => {
    const upload_url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

    /*
    const obj =
      { file: fileData.buffer
      , pinataMetadata: JSON.stringify({ name: 'abc' })
      , pinataOptions: JSON.stringify({ cidVersion: 1 })
      }
    const formData = objToFormData(obj)
      */
    

    const formData = new FormData()

    console.log(formData)

    formData.append('pinataMetadata', JSON.stringify({name: fileData['originalname']}))
    formData.append('pinataOptions', JSON.stringify({cidVersion: 1}))
    formData.append('file',fileData.buffer,{filename: fileData['originalname']})

    const options =
      { maxContentLength: -1
      , headers:
        { "Content-Type": 'multipart/form-data; boundary=' + formData.getBoundary()
        , Authorization: "Bearer " + config['pinata_jwt']
        }
      }
    console.log(options)
    const res = await axios.post(upload_url,formData,options)
    console.log((res.data))

    }

class PinataFileService extends AbstractFileService {
  //Available on this.config:
  //pinata_api_key
  //pinata_api_secret
  //pinata_jwt
  //pinata_user_domain
  //pinata_endpoint_upload
  //pinata_endpoint_upload_protected
  //pinata_endpoint_delete

  async upload(fileData) {
    pinFileToIPFS(this.config)(fileData)
  }
  async uploadProtected(fileData){
    throw new Error("Method not implemented.")
  }
  async delete(fileData){
    throw new Error("Method not implemented.")
  }
  async getUploadStreamDescriptor(fileData){
    throw new Error("Method not implemented.")
  }
  async getDownloadStream(fileData){
    throw new Error("Method not implemented.")
  }
  async getPresignedDownloadUrl(fileData){
    throw new Error("Method not implemented.")
  }
}

export default PinataFileService

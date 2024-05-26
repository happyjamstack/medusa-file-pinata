import { AbstractFileService } from "@medusajs/medusa"
import { andThen, tap, pipe, toPairs, map } from 'ramda'
import FormData from 'form-data'
import fs from 'fs'
import axios from 'axios'

const pinFileToIPFS =
  (config) => async (fileData) => {
    const urlUpload = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
    const filename = fileData['originalname'] || '' + Math.random()
    const formData = new FormData()
    formData.append('pinataMetadata', JSON.stringify({name: filename}))
    formData.append('pinataOptions', JSON.stringify({cidVersion: 1}))
    formData.append('file',fileData.buffer,{filename: filename })

    const options =
      { maxContentLength: -1
      , headers:
        { "Content-Type": 'multipart/form-data; boundary=' + formData.getBoundary()
        , Authorization: "Bearer " + config['pinata_jwt']
        }
      }
    const res = await axios.post(urlUpload,formData,options)
    return res.data

    }

const unpinFromIPFS =
  (config) => async(cid) => {
    const urlDelete = `https://api.pinata.cloud/pinning/unpin/${cid}`
    const res = await axios.delete(urlDelete,{headers: {Authorization: "Bearer " + config['pinata_jwt']}})
    return res
  }

class PinataFileService extends AbstractFileService {
  //Available on this.config:
  //pinata_api_key
  //pinata_api_secret
  //pinata_jwt
  //pinata_gateway
  //pinata_endpoint_upload
  //pinata_endpoint_upload_protected
  //pinata_endpoint_delete

  async upload(fileData) {
    return pipe
    ( pinFileToIPFS(this.config)
    , andThen( res => ({...res, url: 'https://' + this.config['pinata_gateway'] + '/ipfs/' + res['IpfsHash']}))
    ) (fileData)
  }
  async uploadProtected(fileData){
    return pipe
    ( pinFileToIPFS(this.config)
    , andThen( res => ({...res, url: 'https://' + this.config['pinata_gateway'] + '/ipfs/' + res['IpfsHash']}))
    ) (fileData)
  }
  async delete(cid){
    const res = await unpinFromIPFS(this.config)(cid)
    console.log(res)
    return res
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

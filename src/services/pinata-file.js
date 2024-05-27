import { AbstractFileService } from "@medusajs/medusa"
import { createReadStream } from 'fs'
import {  Readable } from 'stream'
import pinataSDK from '@pinata/sdk'
import { andThen, tap, pipe, toPairs, map } from 'ramda'

const bufferToReadStream =
  (buffer) => {
    const readable = new Readable()
    readable._read = () => {}
    readable.push(buffer)
    readable.push(null)
    return readable
  }

class PinataFileService extends AbstractFileService {

  constructor(container,config){
    super(container)
    this['pinata'] = new pinataSDK( config['pinata_api_key'], config['pinata_api_secret'] )
//    const authenticated = await pinata.testAuthentication()
//    console.log(pinata)
    this['pinata_api_key']    = config['pinata_api_key']
    this['pinata_api_secret'] = config['pinata_api_secret']
    this['pinata_jwt']        = config['pinata_jwt']
    this['pinata_gateway']    = config['pinata_gateway']
  }

  /*
  async upload(fileData) {
    return pipe
    ( pinFileToIPFS(this)
    , andThen( res => ({url: 'https://' + this['pinata_gateway'] + '/ipfs/' + res['IpfsHash'], key: res['IpfsHash']}))
    ) (fileData)
  }
  async uploadProtected(fileData){
    return pipe
    ( pinFileToIPFS(this)
    , andThen( res => ({url: 'https://' + this['pinata_gateway'] + '/ipfs/' + res['IpfsHash'], key: res['IpfsHash']}))
    ) (fileData)
  }
  async delete(cid){
    const res = await unpinFromIPFS(this.config)(cid)
    console.log(res)
    return res
  }
  */
  async getUploadStreamDescriptor(fileData){
    const fname = 'getUploadStreamDescriptor'
    console.log(fname + ' not implemented')
    return {fname}
  }
  async getDownloadStream(fileData){
    const fname = 'getDownloadStream'
    console.log(fname + ' not implemented')
    return {fname}
  }
  async getPresignedDownloadUrl(fileData){
    const fname = 'getPresignedDownloadUrl'
    console.log(fname + ' not implemented')
    return {fname}
  }
}

PinataFileService['prototype']['upload'] =
  async function (fileData) {
    const pinata = this.pinata
    return pipe
      ( fileData => (
        [ bufferToReadStream(fileData.buffer)
        , { pinataMetadata: { name: fileData['originalname'] || '' + Math.random() }
          , pinataOptions: {cidVersion: 1}
          }
        ])
      , (pinataArgs) => pinata.pinFileToIPFS(...pinataArgs)
      , andThen( (res) => (
        { url: 'https://' + this['pinata_gateway'] + '/ipfs/' + res['IpfsHash']
        , key: res['IpfsHash']
        }))
      ) (fileData)
  } 

PinataFileService['prototype']['uploadProtected'] = PinataFileService['prototype']['upload']

PinataFileService['prototype']['delete'] =
  (config) => async(cid) => {
    const urlDelete = `https://api.pinata.cloud/pinning/unpin/${cid}`
    const res = await axios.delete(urlDelete,{headers: {Authorization: "Bearer " + config['pinata_jwt']}})
    return res
  }

module.exports = PinataFileService

const { AbstractFileService } = require('@medusajs/medusa')
const { createReadStream }  = require('fs')
const { Readable } = require('stream')
const pinataSDK = require('@pinata/sdk')
const { Stream } = require('stream')
const fs = require('fs')
const { andThen, tap, pipe, toPairs, map } = require('ramda')

const uploadFile =
  (config) => async (fileData) => pipe
      ( fileData => (
        [ bufferToReadStream(fileData.buffer)
        , { pinataMetadata: { name: fileData['originalname'] || '' + Math.random() }
          , pinataOptions: {cidVersion: 1}
          }
        ])
      , (pinataArgs) => config.pinata.pinFileToIPFS(...pinataArgs)
      , andThen( (res) => (
        { url: 'https://' + config['pinata_gateway'] + '/ipfs/' + res['IpfsHash']
        , key: '' + res['IpfsHash']
        }))
      ) (fileData)

const bufferToReadStream =
  (buffer) => {
    const readable = new Readable()
    readable._read = () => {}
    readable.push(buffer)
    readable.push(null)
    return readable
  }

class PinataFileService extends AbstractFileService {

  constructor(container,config) {
    super(container)
    this.config =
      { pinata:            new pinataSDK( config['pinata_api_key'], config['pinata_api_secret'] )
      , pinata_api_key:    config['pinata_api_key']
      , pinata_api_secret: config['pinata_api_secret']
      , pinata_jwt:        config['pinata_jwt']
      , pinata_gateway:    config['pinata_gateway']
      }
  }

  async upload(fileData){
    return await uploadFile(this.config)(fileData)
  }
  async uploadProtected(fileData) {
    return await uploadFile(this.config)(fileData)
  }
  async delete(fileData){
    const res = await unpinFromIPFS(this.config)(cid)
    return 
  }
  async getUploadStreamDescriptor(uploadStreamDescriptor) {
    const pass = new Stream.PassThrough()
    const writeStream = fs.createWriteStream('./utnheon')
    pass.pipe(writeStream)
    return { writeStream: pass, promise: Promise.resolve(), url: '', fileKey: ''}
  }
  async getDownloadStream(info) {
    return bufferToReadStream(info)
  }
  async getPresignedDownloadUrl(info) {
    return ''
  }
}

exports.default = PinataFileService

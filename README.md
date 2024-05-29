# Pinata Plugin for Medusa

So far only uploading a file is working, no deletion. Here, the environment variables are on the `env` object. Include in your plugins like this:

```node
// medusa.config

const plugins =
  [ ...
  ,  { resolve: 'medusa-file-pinata'
    , options:
      { pinata_api_key: env['PINATA_API_KEY']
      , pinata_api_secret: env['PINATA_API_SECRET']
      , pinata_jwt: env['PINATA_JWT']
      , pinata_gateway: env['PINATA_GATEWAY']
      }
    }
  ]
```

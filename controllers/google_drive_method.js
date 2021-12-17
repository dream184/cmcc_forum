const fs = require('fs')
const { google } = require('googleapis')

const googleApi = require('../config/google_api.js').google_api
const privatekey = JSON.parse(JSON.stringify(googleApi))


// configure a JWT auth client
let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ['https://www.googleapis.com/auth/drive']
);
//authenticate request
jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected!");
  }
});

const drive = google.drive({
  version: 'v3',
  auth: jwtClient
})

async function createFolder(className, parentsFolder) { 
  const fileMetadata = {
    'name': className,
    'mimeType': 'application/vnd.google-apps.folder',
    'parents' : [parentsFolder],
  };
  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    })
    console.log('folder_id:', response.data.id)
    return response.data
  } catch(error) {
    console.log(error.message)
  }
}

async function uploadImage(file, name, parentsFolderId) {
  const fileMetadata = {
    'name': `${name}.jpg`,
    parents: [parentsFolderId]
  };
  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(file.path)
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id', 
    })
    console.log(response.data.id)
    return response.data.id
  } catch (error) {
    console.log(error.message)
  }
}

async function becomePublic(uploadedId) {
  try {
    const fileId = uploadedId
    await drive.permissions.create({
      fileId: fileId,
      resource: {
        role: 'reader',
        type: 'anyone'
      }
    })
    const result = await drive.files.get({fileId: fileId})
    return result.data
  } catch (error) {
    console.log(error.message)
  }
}  

module.exports = {
  createFolder,
  uploadImage,
  becomePublic
}
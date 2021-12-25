const fs = require('fs')
const { google } = require('googleapis')

const googleApi = require('../config/google_api.js').google_api
const privatekey = JSON.parse(JSON.stringify(googleApi))

const pageToken = null

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
    console.log('Created new google folder, folder_id:', response.data.id)
    return response.data
  } catch(error) {
    console.log(error.message)
  }
}

async function uploadImage(file, name, parentsFolderId) {
  let rename = ''
  const regex = /^([^\\]*)\.(\w+)$/;
  const matches = file.originalname.match(regex);
  if (matches) {
    const extension = matches[2];
    rename = `${name}.${extension}`
  } else {
    rename = name
  }

  const fileMetadata = {
    'name': rename,
    parents: [parentsFolderId]
  };
  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path)
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id', 
    })
    console.log('Uploaded image to google drive, image_id:',response.data.id)
    return response.data.id
  } catch (error) {
    console.log(error.message)
  }
}

async function uploadVoiceFile(file, name, parentsFolderId) {
  const fileMetadata = {
    name: name,
    parents: [parentsFolderId]
  };
  const media = {
    mimeType: 'audio/mpeg',
    body: fs.createReadStream(file.path)
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id', 
    })
    console.log('Uploaded voice file to google drive, google_file_id:',response.data.id)
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
    console.log('file status is public')
    return result.data
  } catch (error) {
    console.log(error.message)
  }
}

async function renameFile(name, renameFileId) {
  try {
    const fileId = renameFileId
    const response = await drive.files.update({
      fileId: fileId,
      resource: {'name': name}
    })
    console.log(response.data, response.status)
  } catch (error){
    console.log(error.message)
  }
}

async function deleteFile(fileId) {
  try {
    const response = await drive.files.delete({
      'fileId': fileId
    });
    console.log('Deleted file on google drive',response.data, response.status)
  } catch (error) {
    console.log(error.message)
  }
}


async function searchfile() {
  try {
    const response = await drive.files.list({
      q: "",
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
      pageToken: pageToken
    })
    console.log(response.data.files)
    return response.data
  } catch(error) {
    console.log(error)
  }
}


module.exports = {
  createFolder,
  uploadImage,
  uploadVoiceFile,
  becomePublic,
  renameFile,
  deleteFile,
  searchfile
}
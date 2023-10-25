import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Function to upload a file to CouchDB
export const uploadImageToCouchDB = async (file, baseUrl) => {
  const docId = uuidv4();
  const fileName = encodeURIComponent(file.name.trim());
  const url = `${baseUrl}${docId}/${fileName}`;
  console.log("uploadImageToCouchDB: url: ", url);
  try {
    const response = await axios.put(url, file, {
      headers: {
        'Content-Type': file.type
      }
    });
    // const imageUrl = `${url}${response.data.id}/${fileName}`;
    console.log("uploadImageToCouchDB response: ", response);
    return url;
  } catch (error) {
    console.log("Error response from couchDB: ", JSON.stringify(error.response.data));
    throw new Error('Error uploading image to CouchDB: ' + error.message);
  }
};

// Function to upload JSON to CouchDB
export const uploadJSONToCouchDB = async (url, JSONBody) => {
  try {
    await axios.put(url, JSONBody, {
      headers: {
        'Content-Type': 'application/json'
      },
    });

    return url;
  } catch (error) {
    console.log(error);
    throw new Error('Error uploading JSON to CouchDB: ' + error.message);
  }
};

// Function to get the metadata for a token id from CouchDB
export const getTokenMetaData = async (url) => {
  try {
    const response = await axios.get(url);
    console.log("getTokenMetaData response: ", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log("Error response from couchDB: ", JSON.stringify(error.response.data));
    throw new Error('Error fetching token metadata from CouchDB: ' + error.message);
  }
};

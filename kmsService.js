
import AWS from 'aws-sdk'

AWS.config.update({region: 'us-west-1'});

const kms = new AWS.KMS();

const getParams = (data) => {
    const params = {
        KeyId: 'ce5724td-c97c-4bc5-8e53-6d0a6a85f01b', /* required */
        Plaintext: 'MESSAGE' /* required */
    };
    return params;
}
const encrypt = (data) => {
    kms.encrypt(getParams(data), ((err, response) => {
        if(err) console.log(err);
        else console.log(response);
    }))
}

const decrypt = (data) => {
    kms.decrypt({CiphertextBlob: Buffer.from(data, 'base64')}, (err, response) => {
        if(err) console.log(err);
        else console.log(response);
    })
}

export default {encrypt, decrypt}

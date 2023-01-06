
import AWS from 'aws-sdk'

const awsConfig = {
    region: 'us-east-1',
    accessKeyId: 'AWS ACCESS KEY ID',
    acecesSecretKey: 'AWS SECRET KEY'
}

AWS.config.update({awsConfig})
const kms = new AWS.KMS();


const generateKey = () => {
    var params = {
        KeySpec: 'RSA_4096',
        KeyUsage: 'ENCRYPT_DECRYPT'
    }
    kms.createKey(params, (err, response) => {
        if (err) console.log(err, err.stack);
        else console.log('[response]', response);
    })
}
const encrypt = (data) => {
    generateKey();
}

const decrypt = (data) => {
    kms.decrypt({CiphertextBlob: Buffer.from(data, 'base64')}, (err, response) => {
        if(err) console.log(err);
        else console.log(response);
    })
}

export default {encrypt, decrypt}
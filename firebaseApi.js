import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { Base64 } from 'js-base64';

const firebaseApi = {
    signIn: (email, password) => {
        auth().signInWithEmailAndPassword(email.trim(), password).then(res => {
            return res;
        }).catch(err => {
            return err
        })
    },

    postRequest: (collection, params) => {
        firestore().collection(collection).add(params).then(res => {
            return res;
        }).catch(err => {
            return err;
        })
    },

    getRequest: async (collection, limit) => {
        await firestore().collection(collection).limit(limit).get().then(res => {
            res.forEach(response => {
                // console.log(response);
                return response.data()
            })
        }).catch(err => {
            return res
        })
    }
}

export default firebaseApi;

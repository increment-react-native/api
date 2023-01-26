import { Routes } from 'common';
import Data from 'services/Data';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import Security from 'services/api/security';
import config from 'src/config.js'
const Api = {
  authenticate: (username, password, callback, errorCallback = null) => {
    const body = {
      username: username,
      password: password,
      status: 'VERIFIED',
      device: {
        unique_code: DeviceInfo.getUniqueId(),
        model: DeviceInfo.getModel()
      }
    };
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: !config.DEBUG_MODE ? JSON.stringify({ 'body': Security.EncryptData(JSON.stringify(body)) }) : JSON.stringify(body)
    };
    fetch(Routes.auth, fetchOptions).then((response) => response.json()).then((json) => {
      if (!config.DEBUG_MODE) {
        callback(Security.DecryptData(json.token));
      } else {
        callback(json);
      }
    }).catch((error) => {
      if (errorCallback) {
        errorCallback(error)
      }
    })
  },
  getAuthUser: (token, callback, errorCallback = null, position = null) => {
    let body = {
      device: {
        unique_code: DeviceInfo.getUniqueId(),
        model: DeviceInfo.getModel()
      },
    };
    if (position != null) {
      body['position'] = 'first'
    }
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: !config.DEBUG_MODE ? JSON.stringify({ 'body': Security.EncryptData(JSON.stringify(body)) }) : JSON.stringify(body)
    };
    fetch(Routes.authUser + '?token=' + token, fetchOptions).then((response) => response.json()).then((json) => {
      if (!config.DEBUG_MODE) {
        callback(Security.DecryptData(json));
      } else {
        callback(json);
      }
    }).catch((error) => {
      if (errorCallback) {
        errorCallback(error)
      }
    })
  },
  request: (route, parameter, callback, errorCallback = null) => {
    const apiRoute = Data.token ? route + '?token=' + Data.token : route;
    let params = JSON.stringify({
      ...parameter,
      device: {
        unique_code: DeviceInfo.getUniqueId(),
        model: DeviceInfo.getModel()
      }
    })
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Data.token },
      body: !config.DEBUG_MODE ? JSON.stringify({ 'body': Security.EncryptData(params) }) : params
    }
    // console.log({
    //   apiRoute,
    //   fetchOptions
    // })
    console.log('[parameter]: ', apiRoute, fetchOptions.body);
    fetch(apiRoute, fetchOptions).then(response => response.json()).then(json => {
      if (!config.DEBUG_MODE) {
        json.data = Security.DecryptData(json.data)
        callback(json);
      } else {
        callback(json)
      }
    }).catch(error => {
      if (errorCallback) {
        errorCallback(error)
      }
    })
  },
  getRequest: (route, callback, errorCallback = null) => {
    // console.log({
    //   route
    // })
    fetch(route).then(response => response.json()).then(json => {
      callback(json)
    }).catch(error => {
      if (errorCallback) {
        errorCallback(error)
      }
    })
  },
  upload: async (route, parameter, callback, errorCallback = null) => {
    // console.log('route', Data.token ? route + '?token=' + Data.token : route)
    const apiRoute = Data.token ? route + '?token=' + Data.token : route;
    // console.log({ apiRoute, parameter })
    await axios({
      url: apiRoute,
      method: 'POST',
      data: parameter,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        callback(response.data)
      })
      .catch(function (error) {
        console.info('[ERROR]', error)
        if (errorCallback) {
          errorCallback(error)
        }
      });
  },
  uploadByFetch: (route, parameter, callback, errorCallback = null) => {
    const apiRoute = Data.token ? route + '?token=' + Data.token : route;
    fetch(apiRoute, {
      method: "POST",
      body: {
        ...parameter,
        device: {
          unique_code: DeviceInfo.getUniqueId(),
          model: DeviceInfo.getModel()
        }
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log('success upload')
        callback(response)
      })
      .catch(error => {
        console.log('error upload')
        if (errorCallback) {
          errorCallback(error)
        }
      });
  }
};

export default Api;
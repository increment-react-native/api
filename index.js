import { Routes } from 'common';
import Data from 'services/Data';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
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
      body: JSON.stringify(body)
    };
    console.log(body, Routes.auth);
    fetch(Routes.auth, fetchOptions).then((response) => response.json()).then((json) => {
      callback(json);
    }).catch((error) => {
      if(errorCallback){
        errorCallback(error)
      }
    })
  },
  getAuthUser: (token, callback, errorCallback = null) => {
    const body = {
      device: {
        unique_code: DeviceInfo.getUniqueId(),
        model: DeviceInfo.getModel()
      }
    };
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    fetch(Routes.authUser + '?token=' + token, fetchOptions).then((response) => response.json()).then((json) => {
      callback(json);
    }).catch((error) => {
      if(errorCallback){
        errorCallback(error)
      }
    })
  },
  request: (route, parameter, callback, errorCallback = null) => {
    const apiRoute = Data.token ? route + '?token=' + Data.token : route;
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Data.token},
      body: JSON.stringify({
        ...parameter,
        device: {
          unique_code: DeviceInfo.getUniqueId(),
          model: DeviceInfo.getModel()
        }
      })
    }
    fetch(apiRoute, fetchOptions).then(response => response.json()).then(json => {
      callback(json)
    }).catch(error => {
      if(errorCallback){
        errorCallback(error)
      }
    })
  },
  getRequest: (route, callback, errorCallback = null) => {
    fetch(route).then(response => response.json()).then(json => {
      callback(json)
    }).catch(error => {
      if(errorCallback){
        errorCallback(error)
      }
    })
  },
  upload: (route, parameter, callback, errorCallback = null) => {
    console.log('route', Data.token ? route + '?token=' + Data.token : route)
    const apiRoute = Data.token ? route + '?token=' + Data.token : route;
    console.log({ apiRoute, parameter })
    axios({
      url: apiRoute,
      method: 'POST',
      data: {
        ...parameter, 
        device: {
          unique_code: DeviceInfo.getUniqueId(),
          model: DeviceInfo.getModel()
        }
      },
      headers: {
        Accept: 'application/json', 'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      callback(response)
    })
    .catch(function (error) {
      console.info(error.config)
      if(errorCallback){
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
      if(errorCallback){
        errorCallback(error)
      }
    });
  }
};

export default Api;
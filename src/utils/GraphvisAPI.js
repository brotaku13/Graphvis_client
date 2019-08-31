import axios from 'axios';

//const API = 'http://5e441a4c.ngrok.io/api/';
const API = 'http://localhost:5415/api/';

const GET_GRAPH = id => `graph/id/${id}`;
const NEW_GRAPH = 'graph/new';

export const getGraph = async id => {
  let local = window.localStorage;
  let storedGraph = local.getItem(id);
  if (storedGraph !== null) {
    console.log('retrieving graph from localstorage');
    let graph = null;
    try {
      //try to parse the localstorage item
      graph = JSON.parse(storedGraph);
    } catch {
      //if we can't parse localstorage item, try to retrieve a new one from localstorage
      return getAndCacheGraph(id);
    }

    return {
      status: 200,
      data: graph,
    };
  } else {
    return getAndCacheGraph(id);
  }
};

const getAndCacheGraph = id => {
  return axios({
    method: 'get',
    url: API + GET_GRAPH(id),
  }).then(res => {
    if (res.status === 200) {
      console.log('Caching Graph in localstorage');
      localStorage.setItem(id, JSON.stringify(res.data));
    }
    return res;
  });
};

export const newGraph = (metadata, ocdData, conData) => {
  let formData = new FormData();
  for (let filetype in ocdData) {
    formData.append(`ocd_${filetype}`, ocdData[filetype]);
  }
  for (let filetype in conData) {
    formData.append(`con_${filetype}`, conData[filetype]);
  }
  for (let datatype in metadata) {
    formData.append(datatype, metadata[datatype]);
  }

  return axios({
    method: 'POST',
    url: API + NEW_GRAPH,
    data: formData,
    headers: {
      'Content-Type': 'multipart/formdata',
    },
  });
};

export default {};

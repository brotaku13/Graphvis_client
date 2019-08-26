import axios from 'axios'

const API = 'http://localhost:5415/api/'
const NEW_GRAPH = 'graph/new'

export const newGraph = (metadata, ocdData, conData) =>{
  let formData = new FormData();
  for(let filetype in ocdData){
    formData.append(`ocd_${filetype}`, ocdData[filetype])
  }
  for(let filetype in conData){
    formData.append(`con_${filetype}`, conData[filetype]);
  }
  for(let datatype in metadata) {
    formData.append(datatype, metadata[datatype]);
  }

  return axios({
    method: 'POST', 
    url: API + NEW_GRAPH, 
    data: formData, 
    headers: {
      'Content-Type': 'multipart/formdata'
    }
  })
}

export default {}
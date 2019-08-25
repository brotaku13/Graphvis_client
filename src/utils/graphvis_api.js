import axios from 'axios'

const API = "http://localhost:5415/api/"
const NEW_GRAPH = "graph/new"

const order = ['edge_list', 'weight_matrix', 'coordinates', 'node_names', 'node_ids', 'orbits'];


function new_graph(ocd_files, con_files, metadata){
    let formData = new FormData();
    debugger;

    [con_files, ocd_files].forEach(file_obj => {
        for(let i = 0; i < order.length; ++i){
            if(file_obj[order[i]]){
                formData.append(`${file_obj.name}_${order[i]}`, file_obj[order[i]]);
            }
        }
    })

    for(var key in metadata){
        formData.append(key, metadata[key]);
    }

    return axios({
        method: 'post',
        url: API + NEW_GRAPH, 
        data: formData, 
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export { new_graph };
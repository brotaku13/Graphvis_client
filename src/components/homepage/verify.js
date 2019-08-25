import React, { Component } from 'react'

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  metadata_container:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    fontFamily: 'Montserrat',
    width: '60%',
    marginBottom: '1em'
  },
  file_display:{
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    fontFamily: 'Montserrat',

  },
  file_title: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#4a148c'
    // marginBottom: '1em'
  },
  file_row:{
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.25em',
  },
  separator:{
    width: '100%',
    height: '1px',
    background: '#aaa',
    border: 0
  }
}

const data_titles = [
  {name: 'Edge List', accessor: 'edge_list'},
  {name: 'Weight Matrix', accessor: 'weight_matrix'},
  {name: 'Coordinates', accessor: 'coordinates'},
  {name: 'Node Names', accessor: 'node_names'},
  {name: 'Node IDs', accessor: 'node_ids'},
  {name: 'Orbits', accessor: 'orbits'},
]

export default class Verify extends Component {

  getFileName(files, accessor){
    if(files[accessor] !== null && files[accessor].name){
      return files[accessor].name
    }
  }
  render() {
    let rootStyles = { ...styles.root }
    if (!this.props.show) {
      rootStyles.display = 'none'
    }
    return (
      <div style={rootStyles}>
        <div style={styles.metadata_container}>
          <div>
            {this.props.metadata.name}
          </div>
          <div>
            by
          </div>
          <div>
            {this.props.metadata.creator}
          </div>
        </div>
        <div style={styles.file_display}>
          <div style={styles.file_title}>
            <div>
              File Type
            </div>
            <div>
              Control Files
            </div>
            <div>
              OCD Files
            </div>
          </div>
          <hr style={styles.separator}/>
          {data_titles.map((item, index) => {
            return (
              <div style={styles.file_row} key={index}>
                <div>{item.name}</div>
                <div>{this.getFileName(this.props.ocd_files, item.accessor)}</div>
                <div>{this.getFileName(this.props.control_files, item.accessor)}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

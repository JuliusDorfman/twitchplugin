import React from 'react';
import './StreamersList.scss';
interface props {
  streamerNames: Array<string>;
  handleSelected: any;
  streams: Array<string>;
}


export default class StreamersList extends React.Component
<{streamerNames: Array<string>, listItemSelected: Array<boolean>, streams: any, setSelectedListItem: any},
 {listItemSelected: Array<boolean>}> {
  constructor(props) {
    super(props);
    this.state= {
      listItemSelected: props.listItemSelected,
    }
  }

  handleSelected = (e) => {
    e.preventDefault();
    let setListItemSelected = Array(this.props.listItemSelected.length).fill(false);
    // console.log("(e.target as HTMLInputElement).getAttribute('data-streamerId')", (e.target as HTMLInputElement).getAttribute('data-streamerId'));
    let streamerClicked = (e.target as HTMLInputElement).getAttribute('data-streamerId')
    let listItem = (e.target as HTMLInputElement).getAttribute('data-listItem')
    // console.log('Selected: ', streamerClicked);
    // console.log('Selected List Item: ', listItem);
    // console.log('setListItemSelected', setListItemSelected);
    // console.log("STREAMS", this.props.streams)
    this.props.setSelectedListItem(streamerClicked);
    setListItemSelected[String(listItem)] = true;
    
    this.setState({listItemSelected: setListItemSelected}, ()=> {
      this.props.setSelectedListItem(this.state.listItemSelected);      
    });
    
  }

  render() {
    let listItemSelected = this.state.listItemSelected
    // console.log('this.props', this.props)
    return (
    <div id="streamer-sidebar-component">
      <div className="streamer-list-wrapper">
        <ul className="streamer-list">
          {
            this.props.streamerNames.map((val, index) => {
              return (
                <li
                  className={`streamer-list-item streamer-list-item-${listItemSelected[index]}`}
                  key={`${val}-${index}`}
                  data-listItem = {index}
                  data-streamerId = {val.toLowerCase()}
                  onClick={this.handleSelected}
                >{`${val}`}</li>
              )
            })
          }
        </ul>
      </div>
    </div>
    )
  }
}




// interface Props {
//   streamerNames: Array<string>;
//   handleSelected: any;
//   listItemSelected: object;
//   streams: Array<string>;
// }

// const StreamersList = (props: Props) => {


//   console.log("StreamersList  streams", props.streamerNames);
//   console.log("props.listItemSelected", props.listItemSelected)
//   console.log("streams", props.streams)

//   Object.keys(props.streams).map((val, index) => {
//     console.log("val", val);

//   })


//   let handleSelected = (
//     e: MouseEvent<HTMLUListElement>
//   ): void => {
//     e.preventDefault();
//     console.log((e.target as HTMLInputElement).getAttribute('data-nameValue'));
    
//   }


//   return (
//     <div id="streamer-sidebar-component">
//       <div className="streamer-list-wrapper">
//         <ul className="streamer-list">
//           {
//             props.streamerNames.map((val, index) => {
//               return (
//                 <li
//                   className={`streamer-list-item`}
//                   // className={`streamer-list-item ${}`}
//                   // listItemValue={``}
//                   key={`${val}-${index}`}
//                   data-nameValue = {props.listItemSelected}
//                   onClick={(e: any) => handleSelected(e)}
//                 >{`${val}`}</li>
//               )
//             })
//           }
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default StreamersList;

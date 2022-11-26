import React from 'react';
import './Streams.scss';
import axios from 'axios';
// import noImageFound from '../Assets/piano_falling.jpg'
import Spinner from '../Components/Spinner';
// import Typewriter from 'typewriter-effect';
import Appbackground from '../Components/Appbackground';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import StreamersList from '../Components/StreamersList';
import chatting from '../Assets/chatting.gif';
import { saveAs } from 'file-saver';



// const baseURL = `http://localhost:7000/`;

let api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  mode: "cors",
})


export default class Streams extends React.Component {
  constructor(props, ref) {
    super(props);
    this.state = {
      pageRerender: false,
      games: [],
      streams: [],
      streamerNames: [],
      listItemSelected: [],
      chatInput: [],
      showRenderButton: 'render-art-available',
      artImageFileName: '',
      loadingArt: false,
      firstTimeUser: true,
      chatTimeOut: false,
    }
  }

  updateStreamsRendered = (res) => {
    let topStreamData = res.data.Message;
    let streamsList = {};
    let streamerName = [];
    let listItemSelected = [];
    let streamerId = [];
    let streamSelected = false;
    for (let i = 0; i < topStreamData.length; i++) {
      streamSelected = i === 0 ? true : false;
      let streamName = topStreamData[i].user_login || topStreamData[i].broadcaster_login;
      let streamViewers = topStreamData[i].viewer_count || "Unavailable";
      let streamGame = topStreamData[i].game_name;
      let streamThumbnail = topStreamData[i].thumbnail_url;
      let streamChannel = topStreamData[i].user_name || topStreamData[i].display_name;
      let streamURL = `https://www.twitch.tv/${topStreamData[i].user_login}`;
      let streamLive = topStreamData[i].type || topStreamData[i].is_live;
      let streamerArtImage = '';
      streamsList[streamName] = [streamViewers, streamGame, streamThumbnail,
        streamChannel, streamerArtImage, streamURL, streamLive, streamSelected];
      streamerName.push(streamChannel);
      listItemSelected.push(streamSelected);
    }
    this.setState({ streams: streamsList });
    this.setState({ streamerNames: streamerName });
    this.setState({ listItemSelected: listItemSelected });
  }
  // handleGetTest = (e) => {
  //     e.preventDefault();
  //     console.log('handleGetTest', this.props);

  // let chatInput = ["Fema%%!le Ali!@#)($(*%&*^^en runn2ing through",  "forest m51ade of broc^$#!olli"];
  // chatInput = chatInput.join(" ");
  // const regexCharCheck = /[^A-Za-z0-9 ]/g;

  // chatInput = chatInput.replace(regexCharCheck, '');        
  // console.log("Post Processing Chat Input: ", chatInput)
  // api.post('/postRenderChatArt', {
  //     artPrompt: chatInput,
  // }).then((res)=> {
  //     console.log('handleGetTest res.data: ', res.data)
  // }).catch(err =>{
  //     throw err;
  // }) 
  // }

  getSnapshotBeforeUpdate(prevProps) {
    return {
      notifyRequired: prevProps.streamername !== this.props.streamername,
      getHomeTest: this.props.getHome[0]
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot.notifyRequired) {
      this.handleGetStreamer(snapshot.streamer);
    }
    if (snapshot.getHomeTest === true) {
      this.handleGetTopStreams();
    }
  }

  handleGetStreamer = () => {
    api.post(`/api/getStreamerChannel`, { streamerName: this.props.streamername }, (req, res) => {
      console.log("FRONTEND RES Inside: ", res.data)
    }).then(res => {
      this.updateStreamsRendered(res);
    }).catch(err => {
      throw err
    })
  }

  // handleGetTopGames = () => {
  //     api.get('/getTopGames').then(res => {
  //         console.log('HandleTopGames', res)
  //         let games = [];
  //         for (let i = 0; i < res.data.Message.length; i++) {
  //             games.push(res.data.Message[i].name)
  //         }
  //         this.setState({games: [...games]});
  //     }).catch((exception) => {
  //         console.log(exception);
  //     })
  // }    

  handleSearchForStreamer = (chatInput) => {
    api.post(`/api/getStreamerChannel`).then(res => {
      console.log('Generating Channel: ', res.data);
    })
  }

  handleGetTopStreams = () => {
    api.get(`/api/getTopStreams`).then(res => {
      // console.log('TOP STREAMS: ', res)
      this.updateStreamsRendered(res);
    }).catch((exception) => {
      console.log(exception);
    })
  }

  renderTopStreams = () => {
    const streams = this.state.streams;
    let loadingArt = this.state.loadingArt ? "art-loading" : 'not-loading'
    return Object.keys(streams).map((streamer, index) => {
      let streamerName = streamer;
      let streamViewers = streams[streamerName][0];
      let streamGame = streams[streamerName][1];
      let streamThumbnail = streams[streamerName][2];
      let streamChannel = streams[streamerName][3];
      let streamArtLink = streams[streamerName][4];
      let streamURL = streams[streamerName][5];
      let streamLive = streams[streamerName][6];
      let streamSelected = streams[streamerName][7]
      let reWidth = /{width}/gi;
      let reHeight = /{height}/gi;

      streamThumbnail = streamThumbnail.replace(reHeight, (match) => {
        return '190';
      })
      streamThumbnail = streamThumbnail.replace(reWidth, (match) => {
        return '300';
      })
      return (
        <div id={`${streamerName}-${index}`} key={`${streamerName}-${index}`} className={`streamer-window stream-selected-${this.state.listItemSelected[index]}`}>
          <div className="streamer-info-wrapper">
            <div className="render-art-button-wrapper">
              <div
                className={`render-art-button ${loadingArt}`}
                id={`id-${streamerName}`}
                buttonvalue={streamerName}
                streamername={streamerName}
                onClick={this.handleGetArt}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                {this.state.loadingArt
                  ?
                  <span className="centered">
                    Creating Art ...
                    <img src={chatting} alt="pepe-typing" />
                  </span>
                  :
                  <span className="centered">
                    Generate Art for:  ${streamChannel}
                  </span>
                }
              </div>
            </div>
            <div className="streamer-name">
              <span className="bolded">{streamChannel}</span>
              {streamLive === 'live' || streamLive
                ?
                <div className="live">
                  <p>Stream is Live: </p>
                </div>
                :
                <div id={`${streamChannel}-not-live`} className="not-live">
                  <p>Stream is Not Live: </p>
                </div>}
            </div>
            <div className="streamer-game"><span className="smaller-font">Category: </span><span className="bolded">{streamGame}</span></div>
            <div className="streamer-viewers"><span className="italicized smaller-font">Current Viewers: {streamViewers}</span></div>
            <div className="`streamer-thu`mbnail"><img className="streamer-screenshot" alt="streamer-thumbnail" src={streamThumbnail} /></div>
            <p className="stream-link-wrapper"><a href={streamURL} rel="noreferrer" target="_blank">Check out the stream at Twitch.tv</a></p>
          </div>
          <div id={`streamer-art-wrapper-${streamerName}`} className="streamer-art-wrapper">
            <div className="art-positioning">
              {/* {this.state.loadingArt === false
                ?
                <button id={`id-${streamerName}`} buttonvalue={streamerName} className="render-art-button" streamername={streamerName} onClick={this.handleGetArt}>
                  <div className="smaller-font" streamername={streamerName}> 
                    Show me 
                  </div>
                  <div className="bolded" streamername={streamerName}>{streamChannel}
                  </div>
                </button>
                :
                null
              } */}
              {
                this.state.streamArtLink !== ''
                  ?
                  <div id={`art-wrapper-${streamerName}`}
                    key={`art-wrapper-${streamerName}`}
                    className={`art-rendered art-rendered-${streamerName}`}>
                    {this.state.streams[streamerName][4]
                      ?
                      <img id={`img-${index}`} alt={`art-generated-for-${streamerName}`} src={streamArtLink} />
                      :
                      this.state.loadingArt === false
                        ?
                        <div></div>
                        :
                        <Spinner />
                    }
                  </div>
                  :
                  <div>
                  </div>
              }
              {
                // Future reference instead of using below method. If above was put into a functional component
                //  would be able to text for null or empty div
                this.state.streams[streamerName][4]
                  ?
                  <ul className="image-options bolded">
                    <li
                      onClick={this.handleImageDownload}
                      imageUrl={streamArtLink}
                    >Download Image</li>
                  </ul>
                  :
                  <div></div>
              }
            </div>

          </div>
        </div >
      )
    })
  };

  handleGetTwitchChat = (e) => {
    e.preventDefault();
    console.log('e', e)
    if (e.noChat === true) {
      this.setState({ chatTimeOut: true })
      return
    }
    this.setState({ firstTimeUser: false })
    console.log("HandleGetTwitchChat: ");
    this.setState({ chatInput: [] })
    api.post(`/api/getTwitchChat`).then(res => {
      // TODO: Handle errors from twitch chat
      let chatArtPrompt = res.data.chatInput;
      console.log('arr or string', chatArtPrompt);
      const regexCharCheck = /[^A-Za-z0-9 ]/g;

      chatArtPrompt = chatArtPrompt.map((input, index) => {
        console.log("input: ", input)
        return input = input.replaceAll(regexCharCheck, (input) => {
          console.log('inside input', input)
          return '';
        });
      })

      // console.log('chatArtPrompt: ', chatArtPrompt.join(" "));
      console.log("CHAT ART PROMPT: ", chatArtPrompt);
      // Wait for {number} of chats 
      this.setState({ chatInput: chatArtPrompt }, () => {
        this.renderTwitchChat();
      });
    }).catch((exception) => {
      console.log('handleGetTwitchChat exception: ', exception);
    });
  }

  renderTwitchChat = () => {
    let chatInput = this.state.chatInput;
    console.log('chatInput:', chatInput)
    return chatInput.map((chat, index) => {
      console.log("Render Twitch Chat: ", chatInput);
      return (
        <div id={`${chat} - ${index}`} className="ind-chat">{chat}</div>
      )
    })
  }

  handleGetArt = (e) => {
    const noChatInput = "Sorry! Your channel is dead! There weren't enough chatters!";
    let channelToJoin = e.target.getAttribute("streamername");
    console.log("Streamer Name: ", e.target.getAttribute("streamername"));
    if (channelToJoin === null) {
      this.setState({ loadingArt: false })
      this.setState({ chatTimeOut: true })
      return noChatInput;
    }
    this.setState({ loadingArt: true });
    api.post(`/api/getTwitchChat`, {
      channelToJoin: channelToJoin
    }).then(chatResponse => {
      if (chatResponse.data.noChat === true) {
        this.setState({ loadingArt: false })
        this.setState({ chatTimeOut: true })
        // console.log("true no chat", noChatInput);
        return noChatInput;
      }
      let chatArtPrompt = chatResponse.data.chatInput
      const regexCharCheck = /[^A-Za-z0-9 ]/g;

      chatArtPrompt = chatArtPrompt.map((input, index) => {
        return input = input.replace(regexCharCheck, (input) => {
          return '';
        });
      })
      api.post(`/api/postRenderChatArt`, {
        artPrompt: chatArtPrompt,
      }).then((artResponse) => {
        let artFileName = artResponse.data.artFileName.replace(/\s/g, "");
        // console.log("post render response", artResponse);
        // HIDDEN WHITESPACE .replace(/\s/g, ""); 10+ hours now go back and fix S3 upload
        // console.log('RENDER CHAT ART: ', res.data)
        if (artFileName.trim() === "NSFW") {
          this.setState({ loadingArt: false })
          this.setState({ chatTimeOut: true })
          this.modalErrorRender();
          return;
        }
        channelToJoin = channelToJoin.replace(/\s/g, "");
        this.setState({ artPrompt: [] })
        this.setState({ artImageFileName: artFileName }, () => {
          // console.log('Image filename: ', artFileName)
          let streams = this.state.streams;
          // console.log("Streams: ", streams);
          // NOTE: DEPRECIATED AFTER DECISION TO S3 UPLOAD FROM PYTHON ENV 
          // api.post(`/api/uploadFileAWS`, ({fileName: artFileName}), (req, res) => {
          //     if (res.data.s3ImageAddress === "NoImage") {
          //         this.setState({oadingArt: false});
          //     }
          //     console.log("res", res);
          // }).then(res=> {
          // console.log('AFTER UPLOAD', res);
          this.setState({ artPrompt: [] }, () => {
            // let newLink = res.data.s3ImageAddress;
            let newLink = artFileName.trim();
            let currentStream = this.state.streams[channelToJoin];
            currentStream[4] = newLink;
            // console.log("streams[channelToJoin]", streams[channelToJoin])
            // console.log('currentStream', currentStream)

            this.setState({ [streams[channelToJoin]]: currentStream });
            this.setState({ loadingArt: false })
          });
          // })
        })
      }).catch(err => {
        throw err;
      })
    }).catch(err => {
      throw err
    })
  }

  handleHideModal = (e) => {
    e.preventDefault();
    let chatTimeOut = this.state.chatTimeOut ? false : true;

    this.setState({ chatTimeOut: chatTimeOut });
  }


  modalErrorRender = () => {
    return (
      <Modal.Dialog id="alert-modal">
        <Modal.Header>
          {/* <Modal.Title>No Response from Twitch</Modal.Title> */}
        </Modal.Header>

        <Modal.Body>
          <h2>Unfortunately...</h2>
          <p>Your channel might not be active enough,
            or the result had triggered the NSFW filter.</p>
          <p>It is worth trying a few more times!</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={(e) => this.handleHideModal(e)}>I'll Try Again</Button>
          {/* <Button variant="secondary" onClick={(e) => {this.handleHideModal(e)}}>I'll Try Again</Button> */}
          {/* <Button variant="primary">Save changes</Button> */}
        </Modal.Footer>
      </Modal.Dialog>
    )
  }


  setSelectedListItem = (e) => {
    // console.log("parent E: ", e);
    this.setState({ listItemSelected: e }, () => {
      // console.log("parent state", this.state.listItemSelected);
    });

  }

  handleImageDownload = (e) => {
    let urlImageDownload = e.target.getAttribute('imageUrl');
    let imageFileName = urlImageDownload.slice(0, -4);

    saveAs(urlImageDownload, imageFileName)
  }

  componentDidMount() {
    this.handleGetTopStreams();
  }

  render() {

    const chatTimeOut = this.state.chatTimeOut;
    const streamerNames = this.state.streamerNames;
    const listItemSelected = this.state.listItemSelected;
    return (
      <div id='streams-component'>
        <StreamersList
          setSelectedListItem={this.setSelectedListItem}
          streamerNames={streamerNames}
          listItemSelected={listItemSelected}
          streams={this.state.streams} />
        {chatTimeOut ?
          this.modalErrorRender()
          :
          null
        }
        {this.state.loadingArt === false
          ?
          <div className="secret-home-button" onClick={this.handleGetTopStreams}>Top Currently Watched</div>
          :
          <div style={{ position: 'relative' }}>

          </div>
        }
        <div className="streams-wrapper">
          <div className="streamer-windows-wrapper">
            {/* <button onClick={this.handleGetTest}>GET TEST</button> */}
            {/* <button onClick={this.handleGetTopStreams}>getTopStreams BUTTON</button> */}
            {this.renderTopStreams()}
          </div>
          <div className="art-wrapper">
            {/* <button onClick={this.handleGetTwitchChat}>getTwitchChat Button</button>
                        <div className="chats-wrapper">
                            {this.renderTwitchChat()}
                        </div> */}
          </div>
        </div>

        <Appbackground />
        {/* <div className="ocean-wrapper">
          <div className="ocean">
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div> */}


        <div className="staggered-steps-wrapper">
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <svg className="staggered-steps" viewBox="0 0 4000 4000"><path className="absolute" d="M0 3761L174 3761L174 3401L348 3401L348 3801L522 3801L522 3561L696 3561L696 3041L870 3041L870 3321L1043 3321L1043 2801L1217 2801L1217 3761L1391 3761L1391 3801L1565 3801L1565 3041L1739 3041L1739 3921L1913 3921L1913 3801L2087 3801L2087 3361L2261 3361L2261 3881L2435 3881L2435 3761L2609 3761L2609 3001L2783 3001L2783 3761L2957 3761L2957 3881L3130 3881L3130 2881L3304 2881L3304 3761L3478 3761L3478 3721L3652 3721L3652 3161L3826 3161L3826 3441L4000 3441L4000 3841L4000 1959L4000 1599L3826 1599L3826 1839L3652 1839L3652 2519L3478 2519L3478 2959L3304 2959L3304 639L3130 639L3130 1679L2957 1679L2957 2999L2783 2999L2783 2439L2609 2439L2609 2639L2435 2639L2435 2559L2261 2559L2261 1999L2087 1999L2087 719L1913 719L1913 679L1739 679L1739 959L1565 959L1565 1039L1391 1039L1391 3079L1217 3079L1217 1639L1043 1639L1043 1999L870 1999L870 1679L696 1679L696 2199L522 2199L522 1679L348 1679L348 1439L174 1439L174 1159L0 1159Z" fill="#e99fd8"></path><path className="absolute" d="M0 4001L174 4001L174 4001L348 4001L348 4001L522 4001L522 4001L696 4001L696 4001L870 4001L870 4001L1043 4001L1043 4001L1217 4001L1217 4001L1391 4001L1391 4001L1565 4001L1565 4001L1739 4001L1739 4001L1913 4001L1913 4001L2087 4001L2087 4001L2261 4001L2261 4001L2435 4001L2435 4001L2609 4001L2609 4001L2783 4001L2783 4001L2957 4001L2957 4001L3130 4001L3130 4001L3304 4001L3304 4001L3478 4001L3478 4001L3652 4001L3652 4001L3826 4001L3826 4001L4000 4001L4000 4001L4000 3839L4000 3439L3826 3439L3826 3159L3652 3159L3652 3719L3478 3719L3478 3759L3304 3759L3304 2879L3130 2879L3130 3879L2957 3879L2957 3759L2783 3759L2783 2999L2609 2999L2609 3759L2435 3759L2435 3879L2261 3879L2261 3359L2087 3359L2087 3799L1913 3799L1913 3919L1739 3919L1739 3039L1565 3039L1565 3799L1391 3799L1391 3759L1217 3759L1217 2799L1043 2799L1043 3319L870 3319L870 3039L696 3039L696 3559L522 3559L522 3799L348 3799L348 3399L174 3399L174 3759L0 3759Z" fill="#fd87aa"></path></svg>
          <div>
          </div>
        </div>
      </div>
    )
  }
}


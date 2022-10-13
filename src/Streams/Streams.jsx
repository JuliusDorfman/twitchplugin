import React from 'react';
import './Streams.sass';
import axios from 'axios';
import chalk from 'chalk';
import noImageFound from '../Assets/piano_falling.jpg'
import Spinner from '../Components/';
// import { callPythonScript } from '../../server/stable-diffusion/testnode'; 
const api = axios.create({
    baseURL: `http://localhost:7000/` || process.env.PORT
});
export default class Streams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageRerender: false,
            games: [],
            streams: [],
            chatInput: [],
            showRenderButton: 'render-art-available',
            artImageFileName: '',
            loadingArt: false
        }
    }

    // handleDummyFunction = () => {
    //     console.log('dummmmy')
    // }

    // handleGetTest = (e) => {
    //     e.preventDefault();
    //     console.log('handleGetTest');
    //     let chatInput = ["Fema%%!le Ali!@#)($(*%&*^^en runn2ing through",  "forest m51ade of broc^$#!olli"];
    //     chatInput = chatInput.join(" ");
    //     const regexCharCheck = /[^A-Za-z0-9 ]/g;
        
    //     chatInput = chatInput.replace(regexCharCheck, '');        
    //     console.log("Post Processing Chat Input: ", chatInput)
    //     api.post('/postRenderChatArt', {
    //         artPrompt: chatInput,
    //     }).then((res)=> {
    //         console.log('handleGetTest res.data: ', res.data)
    //     }).catch(err =>{
    //         throw err;
    //     }) 
    // }

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
 
    // handleSearchForStreamer = () => {
    //  api.get('./getStreamer${searchInput}').then(res => {
        // console.log('Streamer Search: ', res.data);
    // })
    // }

    handleGetTopStreams = () => {
        api.get('/getTopStreams').then(res => {
            chalk.green(console.log('GET TOP STREAMS', res.data));
            let topStreamData = res.data.Message;
            let streamsList = {};
            for (let i = 0; i < topStreamData.length; i++) {
                let streamName = topStreamData[i].user_login;
                let streamViewers = topStreamData[i].viewer_count;
                let streamGame = topStreamData[i].game_name;
                let streamThumbnail = topStreamData[i].thumbnail_url;
                let streamChannel = topStreamData[i].user_name;
                let streamURL = `https://www.twitch.tv/${topStreamData[i].user_login}`;
                let streamerArtImage = '';
                streamsList[streamName] = [streamViewers, streamGame, streamThumbnail, streamChannel, streamerArtImage, streamURL];
            }
            this.setState({streams: streamsList});
        }).catch((exception) => {
            console.log(exception);
        })
    }    
    
    renderTopStreams = () => {
        const streams = this.state.streams;

        return Object.keys(streams).map((streamer, index) => {
            let streamerName = streamer;
            let streamViewers = streams[streamerName][0];
            let streamGame = streams[streamerName][1];
            let streamThumbnail = streams[streamerName][2];
            let streamChannel = streams[streamerName][3];
            let streamArtLink = streams[streamerName][4];
            let streamURL = streams[streamerName][5];
            let reWidth = /{width}/gi;
            let reHeight = /{height}/gi;

            streamThumbnail = streamThumbnail.replace(reHeight, (match) => {
                return '190';
            })
            streamThumbnail = streamThumbnail.replace(reWidth, (match) => {
                return '300';
            })
            return (
            <div id={`${streamerName}-${index}`} className="streamer-window">
                <div className="streamer-info-wrapper">
                    <div className="streamer-name"><span className="bolded">{streamChannel}</span></div> 
                    <div className="streamer-game"><span className="smaller-font">Game: </span><span className="bolded">{streamGame}</span></div> 
                    <div className="streamer-viewers"><span className="italicized smaller-font">Current Viewers: {streamViewers}</span></div>
                    <a href={streamURL} target="_blank"><div className="streamer-thumbnail"><img className="streamer-screenshot" alt="streamer-thumbnail" src={streamThumbnail}/></div></a>
                </div>
                <div id={`streamer-art-wrapper-${streamerName}`} className="streamer-art-wrapper">
                    {/* TESTING */}
                {/* {this.state.loadingArt === false */}

                <div>
                    {this.state.loadingArt === false 
                    ?                     
                        <button id={`id-${streamerName}`} buttonvalue={streamerName} className="render-art-button" streamername={streamerName} onClick={this.handleGetArt}>RENDER ART</button>
                    :
                        null
                    }
                    {
                        this.state.streamArtLink !== '' 
                        ?
                        <div id={`art-wrapper-${streamerName}`} className={`art-rendered art-rendered-${streamerName}`}>
                            {this.state.streams[streamerName][4] 
                                ?
                            <img id={`img-${index}`} alt={`art-generated-for-${streamerName}`} src={streamArtLink}/> 
                                :
                                        this.state.loadingArt === false 
                                    ?     
                                        <div>None</div>
                                    :
                                        <Spinner />
                            }
                        </div>
                            :
                        <div>
                        </div>
                    }
                    </div>

                </div>
            </div>
            )
        })
    };

    handleGetTwitchChat = (e) => {
        e.preventDefault();
        chalk.green(console.log("HandleGetTwitchChat: "));
        this.setState({chatInput: []})
        api.post('/getTwitchChat').then(res => {
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
            this.setState({chatInput: chatArtPrompt}, ()=> {
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
        e.preventDefault();
        this.setState({loadingArt: true});
        e.target.style.display = 'none';
        console.log("Streamer Name: ", e.target.getAttribute("streamername"));
        let channelToJoin = e.target.getAttribute("streamername");
        api.post('/getTwitchChat', {
            channelToJoin: channelToJoin
        }).then(res => { 
            if(res.data.noChat === true) {
                const noChatInput = "Sorry! Your channel is dead! There weren't enough chatters!";
                this.setState({loadingArt: false})
                console.log("true no chat", noChatInput);
                return noChatInput;
            }
            let chatArtPrompt = res.data.chatInput
            const regexCharCheck = /[^A-Za-z0-9 ]/g;
        
            chatArtPrompt = chatArtPrompt.map((input, index) => {
                return input = input.replace(regexCharCheck, (input) => { 
                    return '';
                });
            })
            // console.log('DATA PASSED: ', res)
            api.post('/postRenderChatArt', {
                artPrompt: chatArtPrompt,
            }).then((res)=> {
                // HIDDEN WHITESPACE .replace(/\s/g, ""); 10+ hours now go back and fix S3 upload
                let artFileName = res.data.artFileName.replace(/\s/g, "");
                channelToJoin = channelToJoin.replace(/\s/g, "");
                this.setState({artPrompt: []})
                this.setState({artImageFileName: artFileName}, ()=>{
                    console.log('Image filename: ', artFileName)
                    let streams = this.state.streams;
                    // console.log("Streams: ", streams);
                    api.post('/uploadFileAWS', ({fileName: artFileName}), (req, res) => {
                        console.log("res", res);
                    }).then(res=> {
                        console.log('AFTER UPLOAD', res);
                        this.setState({artPrompt: []}, ()=>{
                            // let newLink = `${this.state.artImageFileName}`;
                            let newLink = res.data.s3ImageAddress;
                            let currentStream = this.state.streams[channelToJoin];
                            currentStream[4] = newLink;
                            // console.log("streams[channelToJoin]", streams[channelToJoin])
                            // console.log('currentStream', currentStream)

                            this.setState({[streams[channelToJoin]]: currentStream});
                            this.setState({loadingArt: false})
                        });
                    })
                })
            }).catch(err =>{
                throw err;
            }) 
        }).catch(err => {
            throw err
        })
    }

    spinnerComponent = () => {


        return (
            <div className="spinner-component">
                
            </div>
        )
    }
  
    componentDidMount() {
        this.handleGetTopStreams();
    }

    render(){
        return(
            <div id='streams-component'>
                <div className='streams-wrapper'>
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
            </div>
        )
    }
}


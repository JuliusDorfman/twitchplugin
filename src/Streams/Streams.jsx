import React from 'react';
import './Streams.sass';
import axios from 'axios';
import chalk from 'chalk';
// import { callPythonScript } from '../../server/stable-diffusion/testnode'; 

const api = axios.create({
    baseURL: `http://localhost:7000/` || process.env.PORT
});
export default class Streams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [],
            streams: [],
            chatInput: [],
            // renderTwitchChat: 
        }

        this.handleGetTest = this.handleGetTest.bind(this);
        // this.handleGetTopGames = this.handleGetTopGames(this);
        // this.handleGetTopStreams = this.handleGetTopStreams(this);
        // this.renderTopStreams = this.renderTopStreams(this);
        // this.handleGetTwitchChat = this.handleGetTwitchChat(this);
        // this.renderTwitchChat = this.renderTwitchChat(this);
        // this.handleGetArt = this.handleGetArt(this);
    }

    handleGetTest = (e) => {
        e.preventDefault();
        console.log('handleGetTest');
        // let chatInput = ["Fema%%!le Ali!@#)($(*%&*^^en runn2ing through",  "forest m51ade of broc^$#!olli"];
        let chatInput = ["Fema%%!le Ali!@#"];
        chatInput = chatInput.join(" ");
        const regexCharCheck = /[^A-Za-z0-9 ]/g;
        
        chatInput = chatInput.replace(regexCharCheck, '');        
        console.log("Post Processing Chat Input: ", chatInput)
        api.post('/postRenderChatArt', {
            artPrompt: chatInput,
        }).then((res)=> {
            console.log('handleGetTest res.data: ', res.data)
        }).catch(err =>{
            throw err;
        }) 
    }

    handleGetTopGames = () => {
        api.get('/getTopGames').then(res => {
            console.log('HandleTopGames', res)
            let games = [];
            for (let i = 0; i < res.data.Message.length; i++) {
                games.push(res.data.Message[i].name)
            }
            this.setState({games: [...games]});
        }).catch((exception) => {
            console.log(exception);
        })
    }    
 
    handleGetTopStreams = () => {
        chalk.green(console.log('GET TOP STREAMS'));
        api.get('/getTopStreams').then(res => {
            let topStreamData = res.data.Message;
            let streamsList = {};
            for (let i = 0; i < topStreamData.length; i++) {
                let streamName = topStreamData[i].user_name;
                let streamViewers = topStreamData[i].viewer_count;
                let streamGame = topStreamData[i].game_name;
                let streamThumbnail = topStreamData[i].thumbnail_url;
                streamsList[streamName] = [streamViewers, streamGame, streamThumbnail];
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
            let streamViewers = streams[streamer][0];
            let streamGame = streams[streamer][1];
            let streamThumbnail = streams[streamer][2];
            
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
                <div className="streamer-name">{streamerName}</div> 
                <div className="streamer-viewers">Current Viewers: {streamViewers}</div>
                <div className="streamer-game">Game: {streamGame}</div> 
                <div className="streamer-thumbnail"><img src={streamThumbnail}/></div>
            </div>
            )
        })
    };

    handleGetTwitchChat = (e) => {
        e.preventDefault();
        chalk.green(console.log("HandleGetTwitchChat: "));
        this.setState({chatInput: []})
        api.get('/getTwitchChat').then(res => {
            let chatArtPrompt = res.data.chatInput
            console.log('chatArtPrompt: ', chatArtPrompt.join(" "));
            const regexCharCheck = /[A-Za-z0-9]/g;
            // chatArtPrompt = chatArtPrompt.replace(regexCharCheck, '');
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
        let chatInput = this.state.chatInput;
        chalk.yellow(console.log("handleGetArt PROMPT: ", chatInput));
        api.post('/postRenderChatArt', {
            artPrompt: chatInput,
        }).then((res)=> {
            console.log('handleGetTest res.data: ', res.data)
        }).catch(err =>{
            throw err;
        }) 
    }

  
    componentDidMount() {
        this.handleGetTopStreams();
    }

    render(){
        return(
            <div id='streams-component'>
                <div className='streams-wrapper'>
                    <div className="streamer-windows-wrapper">
                        <button onClick={this.handleGetTest}>GET TEST</button>
                        <button onClick={this.handleGetTopStreams}>getTopStreams BUTTON</button>
                        {this.renderTopStreams()}
                    </div>
                    <div className="art-wrapper">
                        <button onClick={this.handleGetTwitchChat}>getTwitchChat Button</button>
                        <div className="chats-wrapper">
                            {this.renderTwitchChat()}
                        </div>
                        <button onClick={this.handleGetArt}>RENDER ART</button>
                    </div>
                </div>
            </div>
        )
    }
}


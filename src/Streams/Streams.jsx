import React from 'react';
import './Streams.sass';
import axios from 'axios';
import chalk from 'chalk';


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
        }
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
            console.log('HandleTopStreams', res);
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
            <div id={streamerName} className="streamer-window">
                <div className="streamer-name">{streamerName}</div> 
                <div className="streamer-viewers">Current Viewers: {streamViewers}</div>
                <div className="streamer-game">Game: {streamGame}</div> 
                <div className="streamer-thumbnail"><img src={streamThumbnail}/></div>
            </div>
            )
        })
    };

    handleGetTwitchChat = () => {
        chalk.green(console.log("HandleGetTwitchChat: "));
        api.get('/getTwitchChat').then(res => {
            // Wait for 5 chats 
            
            this.setState({chatInput: res.data.chatInput}, ()=> {
                this.renderTwitchChat();
            });
        }).catch((exception) => {
            console.log('handleGetTwitchChat exception: ', exception);
        })
    }    

    renderTwitchChat = () => {
        let chatInput = this.state.chatInput;
        console.log("after set state", chatInput);
        // send to stable diffusion bot
     
        return chatInput.map((chat, index) => {

            return (
                <div id={`${chat} - ${index}`} className="ind-chat">{chat}</div>
            )
             
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
                        <button onClick={(e)=>{this.handleGetTopStreams(e)}}>getTopStreams BUTTON</button>
                        {this.renderTopStreams()}
                    </div>
                    <div className="art-wrapper">
                        <button onClick={(e)=>{this.handleGetTwitchChat(e)}}>getTwitchChat Button</button>
                        <div className="chats-wrapper">
                            {this.renderTwitchChat()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


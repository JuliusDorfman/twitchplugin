import React from 'react';
import './Streams.sass';
import axios from 'axios';


const api = axios.create({
    baseURL: `http://localhost:7000/` || process.env.PORT
});
export default class Streams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [],
            streams: [],
        }
    }

    handleClick = () => {
        api.get('/test').then(res => {
            console.log('Handle Test Front End Event', res)
        }).catch((exception) => {
            console.log(exception);
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

    handleGetTwitchChat = () => {
        api.get('/getTwitchChat').then(res => {
            // Wait for 20 chats 
            // send to stable diffusion bot
           console.log("HAndleGetTwitchChat: ", res.data)
        }).catch((exception) => {
            console.log(exception);
        })
    }    

  
    renderTopStreams = () => {
        const streams = this.state.streams;

        return Object.keys(streams).map((key, index) => {
            console.log("key", key);
            let streamerName = key;
            let streamViewers = streams[key][0];
            let streamGame = streams[key][1];
            let streamThumbnail = streams[key][2];
            
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

    componentDidMount() {
        this.handleGetTopStreams();
        this.renderTopStreams();
    }

    render(){
        // const games = this.state.games;
        
        // const renderGames = () => {
        //     return games.map((name) => {
        //         console.log("name", name);
        //         return (
        //         <div id={`${name}`}>{name}</div>
        //         )
        //     })
        // }
     
        return(
           
            <div id='streams-component'>
                <div className='streams-wrapper'>
                    {/* <button onClick={(e)=>{this.handleClick(e)}}>TEST BUTTON</button> */}
                    {/* <button onClick={(e)=>{this.handleGetTopGames(e)}}>getTopGames BUTTON</button> */}
                    <div className="streamer-windows-wrapper">
                        <button onClick={(e)=>{this.handleGetTopStreams(e)}}>getTopStreams BUTTON</button>
                        {this.renderTopStreams()}
                    </div>
                    {/* <button onClick={(e)=>{this.handleGetTwitchChat(e)}}>getTwitchChat BUTTON</button> */}
                    <div className="art-wrapper">
                        <button onClick={(e)=>{this.handleGetTwitchChat(e)}}>getTwitchChat Button</button>
                    </div>
                </div>
                
            </div>
        )
    }
}


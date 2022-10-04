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
            games: []
        }
    }

    componentDidMount() {
      
    }

    handleClick = () => {
        api.get('/test').then(res => {
            console.log('inside axios', res)
        }).catch((exception) => {
            console.log(exception);
        })
    }

   

    handleGetTopGames = () => {
        console.log('HandleTopGames');
        api.get('/getTopGames').then(res => {
            console.log('inside top games', res)
            let games = [];
            for (let i = 0; i < res.data.Message.length; i++) {
                games.push(res.data.Message[i].name)
            }
            this.setState({games: [...games]});
        }).catch((exception) => {
            console.log(exception);
        })
    }    
   

    names = [
        '1',
        '2',
        '3'
    ]

    render(){
        const games = this.state.games;
        const renderGames = () => {
            return games.map((name) => {
                console.log("name", name);
                return (
                <div id={`${name}`}>{name}</div>
                )
            })
        }
        return(
            <div id='streams-component'>
                <div className='stream-wrapper'>
                    {console.log(this.state.games)}
                    <button onClick={(e)=>{this.handleClick(e)}}>TEST BUTTON</button>
                    <button onClick={(e)=>{this.handleGetTopGames(e)}}>getTopGames BUTTON</button>
                    <div className="here">
                        {renderGames()}
                    </div>
                </div>
            </div>
        )
    }
}


import './Instructions.sass'
import React, { Component } from 'react';

class Instructions extends Component {
    constructor(props) {
      super(props)
      this.state = {
        show: true,
        sliderButton: false
      }
    }

    handleInstructionsToggle = (e) => {
        let show = this.state.show ? false : true;
        let sliderButton = this.state.sliderButton ? false : true;
        this.setState({show: show});
        this.setState({sliderButton: sliderButton}, () => {
            // console.log(this.state.sliderButton)
        });
        
    }

    render() {
        return (
            <div>
                <div className={`instructions-toggle-${this.state.sliderButton}`} onClick={this.handleInstructionsToggle}>
                    Instructions
                </div>
                <div id="instructions-component" className={`instructions-component-${this.state.show}`}>
                    <div className="instructions-wrapper">
                        <h1 className="instructions-title">Instructions</h1>
                        <p className="instructions-instructions">
                            <span className="bolded">How To: </span>
                            <br />
                            Click the create art button associated 
                            with your stream of interest and wait for the art to generate!
                            <br />
                            <br />
                            <span className="bolded">Note:</span> 
                            <br />
                            Art generation and Stable-Diffusion require a bit of computing power.
                            For this reason, please allow up to 15 minutes for your art to generate;
                            only one art piece may be generated at a time. 
                            <br />
                            <br />
                            <span className="bolded">WARNING:</span> 
                            <br />
                            Do not close tab or refresh page or art will not generate. 

                        </p>
                        <div id="hide-instructions-button" onClick={this.handleInstructionsToggle}>
                            <p>I get it!</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Instructions;
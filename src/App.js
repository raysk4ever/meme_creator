import React, { useState, useEffect } from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allMemes: [],
      currentMeme: {
        img: "https://i.imgflip.com/1ur9b0.jpg",
        captions: [
          {
            id: 1,
            text: "Meme Text 1",
            style: {
              backgroundColor: "black",
              color: "white",
              fontSize: 20,
              position: "absolute",
              top: 0,
              left: 0,
              cursor: "move",
            },
          },
          {
            id: 2,
            text: "Meme Text 2",
            style: {
              backgroundColor: "black",
              color: "white",
              fontSize: 20,
              position: "absolute",
              top: 0,
              left: 0,
              cursor: "move",
            },
          },
        ],
      },
      shiftX: 0,
      shiftY: 0,
    };
  }
  componentDidMount() {
    fetch('https://api.imgflip.com/get_memes')
    .then(response => response.json())
    .then(jsonResponse => {
      if(jsonResponse.success){
        this.setState({allMemes: jsonResponse.data.memes})
      }
    })
  }
  handleOnDrag = (e, index) => {
    e.preventDefault();
    let { currentMeme, shiftX, shiftY } = this.state;
    let captionTarget = e.target;
    let currentCaption = Object.assign({}, currentMeme.captions[index]);
    let currentCaptionStyle = {};

    let dragX = e.pageX,
      dragY = e.pageY;
    dragX = dragX - captionTarget.offsetWidth ;
    dragY = dragY - captionTarget.offsetHeight -100;
    // dragX = dragX - shiftX/2;
    // dragY = dragY - shiftY/2;

    currentCaptionStyle.top = dragY;
    currentCaptionStyle.left = dragX;

    currentCaption.style = { ...currentCaption.style, ...currentCaptionStyle };
    currentMeme.captions.splice(index, 1, currentCaption);
    this.setState({ currentMeme });
  };

  handleDragOver = (e) => {
    e.preventDefault();
  };

  handleChange = (e, index) => {
    let text = e.target.value;
    let { currentMeme } = this.state;
    let caption = Object.assign({}, currentMeme.captions[index]);
    caption.text = text;
    currentMeme.captions.splice(index, 1, caption);
    this.setState({ currentMeme });
  };

  handleOnMouseDown = (e) => {
    let {shiftX, shiftY} = this.state;
    // shiftX = e.target.getBoundingClientRect().left
    // shiftY = e.target.getBoundingClientRect().top

    shiftX = e.clientX - e.target.getBoundingClientRect().left
    shiftY = e.clientY - e.target.getBoundingClientRect().top

    this.setState({shiftX, shiftY})
  }

  render() {
    const { currentMeme } = this.state;
    const { img, captions } = currentMeme;
    return (
      <div className="App">
        <div className="nav">MMM</div>
        <div className="main-wrapper">
          <div className="editor">
            <figure className="meme-fig">
              <img
                className="meme-img"
                src={img}
                onDragOver={this.handleDragOver}
              />
              {captions.map((caption, index) => (
                <figcaption
                  key={index}
                  onDrag={(e) => this.handleOnDrag(e, index)}
                  onMouseDown={this.handleOnMouseDown}
                  style={caption.style}
                  draggable="true"
                >
                  {caption.text}
                </figcaption>
              ))}
            </figure>
          </div>
          <div className="editor-tools">
            <span>tools</span>
            <div className='editor-tools-caption-wrapper'>
              {captions.map((caption, index) => (
                <div>
                  <input
                  className='input-primary'
                  key={index}
                  placeholder="enter text here"
                  onChange={(e) => this.handleChange(e, index)}
                  value={caption.text}
                />
                <button className='btn btn-danger'>-</button>
                </div>
              ))}
              <button className='btn btn-success'>+</button>
            </div>

            <button>Ok</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

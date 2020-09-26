import React from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey: "0ecb00e894d2410993253b104e5b6378"
 });

const particlesParams = {
  particles: {
    number: {
      density: {
        enable: true,
        value_area: 900
      },
      value: 120
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState(state => ({
      imageUrl: state.input
    }));
  
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl)
   .then(response => {
    console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
   })
   .catch(err => {
    console.log(err);
   });
  }    

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesParams} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;




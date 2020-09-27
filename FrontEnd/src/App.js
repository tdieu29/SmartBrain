import React from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
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
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState(state => ({
      imageUrl: state.input
    }));
  
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
   .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
   .catch(err => console.log(err));
  }    

  onRouteChange = (inputRoute) => {
    if (inputRoute === 'signout') {
      this.setState({isSignedIn: false});
    } else if (inputRoute === 'home') {
      this.setState({isSignedIn: true});
    }

    this.setState({route: inputRoute});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesParams} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
          ? <div> 
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition imageUrl={imageUrl} box={box}/>
            </div>
          : (route === 'signin' 
            ? <SignIn onRouteChange={this.onRouteChange} /> 
            : <Register onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;




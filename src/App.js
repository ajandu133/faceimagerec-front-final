import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/navigation';
import Signin from './components/signin/signin';
import Register from './components/register/register';
import Logo from './components/logo/logo';
import ImageLinkForm from './components/imagelinkform/imagelinkform'
import Rank from './components/rank/rank'
import FaceRecognition from './components/facerecognition/facerecognition'
import './App.css';

const app = new Clarifai.App({
 apiKey: 'd6afa98dbace44d28f6590a30fdeebd1'
});

const particlesOptions = {
  'particles': {
    'number': {
        "value": 150
        },
    "size": {
        "value": 3
        },
    "link_linked": {
      "enable_auto": true
        }
      },
    "interactivity": {
    "events": {
        "onhover": {
            "enable": true,
            "mode": "repulse"
            }
          }
        }
      }

const initialState = {
  input: '',
  imageUrl:'',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
}}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (response) => {
    // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    const clarifaiFace = response.outputs[0].data.regions[0].region_info.bounding_box;
    // console.log(clarifaiFace);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      // .then(response => console.log(response.outputs[0].data.regions[0].region_info.bounding_box))
      .then(response => {
        if (response) {
          fetch('https://thawing-eyrie-54756.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const {isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
        ?<div>
          <Logo className="logoposition"/>
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm 
             onInputChange={this.onInputChange} 
              onSubmit={this.onSubmit} />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        :(
          route === 'signin' ?
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
        )
     }
      </div>
    );
  }
}

export default App;



// ------------------------
// const particlesOptions ={
//   particles: {
//     line_linked: {
//       shadow: {
//         enable: true,
//         color: "#3CA9D1",
//         blur: 5
//       }
//     }
//   }
// }

// 

// onSubmit = () => {
//   this.setState({imageUrl: this.state.input});
//   app.models.predict(
//     Clarifai.FACE_DETECT_MODEL, 
//     this.state.input)
//     .then(
//       function(response) {
//         console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
//           },
//       function(err) {
//     // there was an error
//           }
//   );
// }
import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <WebView
      domStorageEnabled={true}
      originWhitelist={['*']}
      source={{          
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.0"></script>
</head>

<body>

<style>
  .custom-file-upload {
      border: 1px solid #ccc;
      display: inline-block;
      padding: 6px 12px;
      cursor: pointer;
  }
    
    input[type="file"] {
      display: none;
  }
    
    img {
      max-width: 300px;
      width: 100%;
      height: auto;
    }
    
    canvas {
      max-width: 300px;
      width: 100%;
      height: auto;
    }
    
    #wrapper {
      position: relative;
      border: 1px solid #9C9898;
      width: 100%;
      height: auto;
    }

    #buttonWrapper {
      position: absolute;
      width: 30px;
      top: 2px;
      right: 2px;
    }
    
    input[type =
    "button"] {
      padding: 5px;
      width: 30px;
      margin: 0px 0px 2px 0px;
    }
</style>

<div class="jumbotron text-center">
  <h1>Select an image</h1>
  <label class="custom-file-upload">
    <input type="file" accept=".jpg, .jpeg, .png"/>
     Select
  </label>
</div>
  
<div class="container">
  <div class="row">
    <div class="col-sm-4" style="text-align: center;">
      <h3>Selected Image</h3>
      <img id="imagemOriginal" class="mb-4" alt="" width="300" height="300">
    </div>
    <div id="divHidden" class="col-sm-4 hidden" style="text-align: center;">
      <h3>Image Without Background</h3>
      <div id="wrapper">
        <canvas id="myCanvas" width="300" >
        </canvas>
        <div id="buttonWrapper">
          <input type="button" id="plus" value="+"><input type="button" id="minus" value="-">
        </div>
      </div>
    </div>
    
  </div>
</div>

<script>
  const input = document.querySelector('input');
  const preview = document.getElementById('imagemOriginal');
  var imageAux;
  input.addEventListener('change', updateImageDisplay);

  function updateImageDisplay() {
    const file = input.files[0]; 
    preview.src = URL.createObjectURL(file);
    document.getElementById("divHidden").classList.add("hidden"); 
    loadImage(URL.createObjectURL(file));    
  }
  
  var scale = 1.0;

  // add button event listeners
  document.getElementById("plus").addEventListener("click", function(){
    scale += 0.1;
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');      
	ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.drawImage(imagedata_to_image(imageAux), 0, 0);
    ctx.restore();
  }, false);

  document.getElementById("minus").addEventListener("click", function(){
    scale -=  0.1;
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');      
	ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.drawImage(imagedata_to_image(imageAux), 0, 0);
    ctx.restore();
  }, false);
  
  const loadImage = (src) => {
    const img =  new Image()
    img.src = src
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
	ctx.clearRect(0,0,canvas.width,canvas.height);
    
    img.addEventListener('load', () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      backgroundRemoval()
    })
  }

  const backgroundRemoval = async () => {
    const canvas = document.querySelector('canvas')

    const net = await bodyPix.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 1.0,
      quantBytes: 4
    })
    const segmentation = await net.segmentPerson(canvas, {
      internalResolution: 'medium',
      segmentationThreshold: 0.7,
      scoreTreshold: 0.7
    })

    const ctx = canvas.getContext('2d')
    
    const { data: imgData } = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const newImg = ctx.createImageData(canvas.width, canvas.height)
    const newImgData = newImg.data

    segmentation.data.forEach((segment, i) => {
      if (segment == 1) {
        newImgData[i * 4] = imgData[i * 4]
        newImgData[i * 4 + 1] = imgData[i * 4 + 1]
        newImgData[i * 4 + 2] = imgData[i * 4 + 2]
        newImgData[i * 4 + 3] = imgData[i * 4 + 3]
      }
    })
	imageAux = newImg;
    ctx.putImageData(newImg, 0, 0)
    document.getElementById("divHidden").classList.remove("hidden"); 
  }
  
  function imagedata_to_image(imagedata) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);

    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
  }
  
  </script>

</body>
</html>
`
          }}
        />
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

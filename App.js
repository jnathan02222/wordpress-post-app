import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, Pressable, Dimensions, ScrollView } from 'react-native';
import { Component } from 'react';
import { NavigationContainer, NavigationContext } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios'
import { WebView } from 'react-native-webview';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={FeedScreen} options={{headerShown: false,}}/>
        <Stack.Screen name="News" component={ArticleScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


class FeedScreen extends Component{
  constructor(props){
    super(props);
    this.state = {title: ["Filler", "Filler", "Filler", "Filler", "Filler", "Filler", "Filler", "Filler"], 
    errorMessage: "none",
    contents: ["Filler", "Filler", "Filler", "Filler", "Filler", "Filler", "Filler", "Filler"]}
  }
  componentDidMount(){
    this.getPosts();
  }

  getPosts(){
    console.log("Fetching data");
    const Url = "https://nguyencloth.com/wp-json/wp/v2/posts";
    this.setState({title: ["Filler", "Filler", "Filler", "Filler", "Filler", "Filler", "Filler", "Filler"], 
    contents: ["Filler", "Filler", "Filler", "Filler", "Filler", "Filler", "Filler", "Filler"]});

    const titles = [];
    const contents = [];
    axios.get(Url)
    .then(data=> {
      const websitePosts = JSON.parse(data.request.response);
      for(const article in websitePosts){
        titles.push(websitePosts[article]["title"]["rendered"]);

        const date = new Date(websitePosts[article]["date"]);
        contents.push("<h1>" + websitePosts[article]["title"]["rendered"] + "</h1>" + "<p>" + date.toDateString() + "</p>"+ websitePosts[article]["content"]["rendered"]);
        
      }
      while(titles.length < 8){
        titles.push("Filler");
      }
      while(contents.length < 8){
        contents.push("Filler");
      }
      this.setState({title: titles});
      this.setState({errorMessage: "none"});
      this.setState({contents: contents});
      console.log("Data recieved");
    })
    .catch(err=> {
      this.setState({errorMessage: "flex"});
      console.log("Data not recieved");
    })
  }

  render(){
    const nav = this.props.navigation;

    return(
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.stream}>
          <Image style={styles.logo}source={require('./images/logo.png')}></Image>
          <Button style={styles.button} onPress={() => {this.getPosts()}} text="Refresh ⟳"></Button>
          <ErrorMessage display={this.state.errorMessage}></ErrorMessage>
          <Article text={this.state.title[0]} content={this.state.contents[0]} onPress={() => nav.navigate('News', {content: this.state.contents[0]})}></Article>
          <Article text={this.state.title[1]} content={this.state.contents[1]} onPress={() => nav.navigate('News', {content: this.state.contents[1]})}></Article> 
          <Article text={this.state.title[2]} content={this.state.contents[2]} onPress={() => nav.navigate('News', {content: this.state.contents[2]})}></Article>
          <Article text={this.state.title[3]} content={this.state.contents[3]} onPress={() => nav.navigate('News', {content: this.state.contents[3]})}></Article>
          <Article text={this.state.title[4]} content={this.state.contents[4]} onPress={() => nav.navigate('News', {content: this.state.contents[4]})}></Article>
          <Article text={this.state.title[5]} content={this.state.contents[5]} onPress={() => nav.navigate('News', {content: this.state.contents[5]})}></Article>
          <Article text={this.state.title[6]} content={this.state.contents[6]} onPress={() => nav.navigate('News', {content: this.state.contents[6]})}></Article>
          <Article text={this.state.title[7]} content={this.state.contents[7]} onPress={() => nav.navigate('News', {content: this.state.contents[7]})}></Article>
        </View>
      </ScrollView>
    </View> )
  };
};

class ErrorMessage extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <Text style={{display: this.props.display}}>Nothing to see here. Check your internet connection</Text>
    )
  }
}

const ArticleScreen = ({ route, navigation }) => {
  const { content } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.articleStream}>
        <WebView
          originWhitelist={['*']}
          source={{ html: "<div class=\"article\">" + content + "</div>" + "<style> .article{margin: 20pt 30pt;} figure{margin: 0px;} img {width: 100%; height: auto; margin: 0px; border-radius: 30px} h1 {font-family: \"Roboto\"; font-size: 3.8rem; font-weight: normal;} p {font-family: \"Roboto\"; font-size: 2.7rem;} li {font-family: \"Roboto\"; font-size: 2.7rem; line-height: 200%;} a {font-family: \"Roboto\"; font-size: 2.7rem;} </style> <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"> <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin> <link href=\"https://fonts.googleapis.com/css2?family=Roboto&display=swap\" rel=\"stylesheet\">"}}
        />
      </View>
    </View>
  )
}

class Article extends Component {

  constructor(props){
    super(props);

    this.state = {backgroundColor: "#FFFFFF", display: "none"};

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  getImage(title){
    var index = title.length % 8 + 1;
    if(index == 1){
      return require('./images/article1.png');
    }
    else if(index == 2){
      return require('./images/article2.png');
    }
    else if(index == 3){
      return require('./images/article3.png');
    }
    else if(index == 4){
      return require('./images/article4.png');
    }
    else if(index == 5){
      return require('./images/article5.png');
    }
    else if(index == 6){
      return require('./images/article6.png');
    }
    else if(index == 7){
      return require('./images/article7.png');
    }
    return require('./images/article8.png');
      
  }

  componentDidUpdate(prevProps){
    if(this.props.text === prevProps.text && this.props.content === prevProps.content){
      return;
    }
    
    if(this.props.text != "Filler")
      this.setState({display: "flex", backgroundImage: this.getImage(this.props.text)});
    else{
      this.setState({display: "none"});
    }

    if(this.props.content != "Filler"){
      this.getImageFromString(this.props.content);
    }
  }

  getImageFromString(str){
    if(str.indexOf("<img") != -1){
      str = str.substring(str.indexOf("<img"));
      str = str.substring(str.indexOf("src=\"") + 5);
      this.setState({backgroundImage: {uri: str.substring(0, str.indexOf("\""))}});
    }
  }

  handleMouseOver(){
    this.setState({backgroundColor: "rgba(0, 0, 0, 0.05)"});
  }

  handleMouseLeave(){
    this.setState({backgroundColor: "#FFFFFF"});
  }

  render(){
    return (
    <Pressable style={[styles.article, {backgroundColor: this.state.backgroundColor, display: this.state.display}]} onPressIn={this.handleMouseOver} onPressOut={this.handleMouseLeave} onPress={this.props.onPress}> 
      <Text style={styles.articleText}>{this.props.text}</Text>
      <ImageBackground source={this.state.backgroundImage} resizeMode="cover" style={[styles.backgroundImage, {backgroundColor: this.state.backgroundColor}]} imageStyle={styles.backgroundImage}>
      </ImageBackground>
    </Pressable> 
    )

  }
}

class Button extends Component {
  constructor(props){
    super(props);
    this.state = {backgroundColor: "#FFFFFF"};
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseOver(){
    this.setState({backgroundColor: "rgba(0, 0, 0, 0.05)"});
  }

  handleMouseLeave(){
    this.setState({backgroundColor: "#FFFFFF"});
  }

  render(){
    return <Pressable onPressIn={this.handleMouseOver} onPressOut={this.handleMouseLeave} style={[styles.button, {backgroundColor: this.state.backgroundColor}]} onPress={this.props.onPress}><Text style={styles.buttonText}>{this.props.text}</Text></Pressable>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  stream: {
    backgroundColor: '#f0f0f0',
    width: Dimensions.get('window').width,
    minHeight: Dimensions.get('window').height,
    padding: 20,
  },
  logo:{
    width: 174, 
    height: 59,
    marginBottom: 20,
    marginTop: 30,
  },
  article:{
    backgroundColor: '#fff',
    height: 150,
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
  },  
  articleText:{
    width: '100%',
    marginBottom: 10,
  },
  articleStream: {
    flex: 1,
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
  
 
  },
  backgroundImage:{
    flex: 1,
    justifyContent: "center",
    borderRadius: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
  },
  buttonText: {
    color: "black",
  },
});

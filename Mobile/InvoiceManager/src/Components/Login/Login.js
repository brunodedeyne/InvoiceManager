import React from 'react';
import { 
    View, 
    Image, 
    StyleSheet
} from 'react-native';
import Logo from '../../assets/img/logo.png';
import { 
  TextInput,
  Button,
  Text
} from 'react-native-paper';

import * as firebase from 'firebase';

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      enableLogin: true,
      tempEmailErrorText: '',
      tempPasswordErrorText: '',
      errorCode: '',
    }

    this.handleSignIn = this.handleSignIn.bind(this);
  }

  async handleSignIn () {
    let errorCode = '';
    let tempEmailErrorText;
    let tempPasswordErrorText;
    await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
        errorCode = error.code;
    });
    console.log(errorCode);
    if (errorCode === "auth/invalid-email") tempEmailErrorText = "Controleer Email!";
    if (errorCode === "auth/user-not-found") tempEmailErrorText = "Geen geldige gebruiker!";
    if (errorCode === "auth/wrong-password") tempPasswordErrorText = "Controleer Wachtwoord!";
    if (errorCode == "") tempEmailErrorText = "Logged in";

    this.setState({
        emailErrorText: tempEmailErrorText,
        passwordErrorText: tempPasswordErrorText
    })
    this.setState({loggedInEmail: tempEmailErrorText, loggedInPassword: tempPasswordErrorText})
  }  

  render() {
    return (
      <View style={styles.container}>
        <Image
            style={styles.logo}
            source={Logo}
        />
        <TextInput
          label='Email'
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          style={styles.textInput}
        />
        <TextInput
          label='Wachtwoord'
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          style={styles.textInput}
          secureTextEntry={true}
        />
        <Button 
          raised 
          disabled={!this.state.enableLogin}
          onPress={this.handleSignIn}
        >
          Inloggen
        </Button>
        <Text>
          email: {this.state.emailErrorText}
        </Text>
        <Text>
          password: {this.state.passwordErrorText}
        </Text>       
        <Text>
          eroro: {this.state.errorCode}
        </Text>   
        <View style={styles.bottomContainer}>
          <Button 
            flat 
            primary={true}
            style={styles.forgotPasswordButton}
          >
            Wachtwoord vergeten
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      alignItems: 'center',
    },
    logo: {
        marginTop: 180,
        width: 200,
        height: 100,
    },
    textInput: {
      width: 200,
    },
    forgotPasswordButton: {

    }
});

export default Login;
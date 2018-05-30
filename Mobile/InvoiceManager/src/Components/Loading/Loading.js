import React from 'react';
import { 
    View, 
    Image, 
    StyleSheet
} from 'react-native';
import Logo from '../../assets/img/logo.png';

class Loading extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
            style={styles.logo}
            source={Logo}
        />
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
});

export default Loading;
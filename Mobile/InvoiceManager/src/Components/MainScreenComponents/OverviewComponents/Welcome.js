import React from 'react';
import { 
    View,
    Text,
    StyleSheet
} from 'react-native';




class Welcome extends React.Component {
  render() {
    return (
      <View 
        style={styles.container}
      >
        <Text 
            style={styles.description}
        >
            WELCOMEqsdqsdqs
            q
            qds
            qds

            d


        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black'
    },
    description: {
        fontSize: 20,
        textAlign: 'center',
        color: 'green'
    },
});

export default Welcome;
import React from 'react';
import { 
    View,
    Text,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'red'
    },
    description: {
        fontSize: 50,
        textAlign: 'center',
        color: 'green'
    },
});


class More extends React.Component {
  render() {
    return (
      <View 
        style={styles.container}
      >
        <Text 
            style={styles.description}
        >
            WELCOME
        </Text>
      </View>
    );
  }
}

export default More;
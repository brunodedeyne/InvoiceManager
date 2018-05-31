import React from 'react';
import {Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Toolbar } from 'react-native-material-ui';

class DetailClients extends React.Component {
    render() {
        const { navigation } = this.props;
        const fullName = navigation.getParam('fullName', 'no Name');
        return (
            <View>
                <Toolbar
                    key="toolbar"
                    leftElement="back"
                    onLeftElementPress={() => this.props.navigation.goBack()}
                    centerElement="arrow-left"
                    searchable={{
                        autoFocus: true,
                        placeholder: 'Search',
                        onChangeText: value => this.setState({ searchText: value }),
                        onSearchClosed: () => this.setState({ searchText: '' }),
                    }}
                />
            <Text>Detail Clients</Text>
            <Text>{(fullName)}</Text>
            </View>
        );
    }
  }

export default DetailClients;
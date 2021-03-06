/**
 * GreenUpVermont React Native App
 * https://github.com/johnneed/GreenUpVermont
 * @flow
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Image, Text, ScrollView, View} from 'react-native';
import * as actions from './actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {defaultStyles} from '../../styles/default-styles';

const myStyles = {messageHeader: {margin: 5}};

const combinedStyles = Object.assign({}, defaultStyles, myStyles);
const styles = StyleSheet.create(combinedStyles);

class MessageDetails extends Component {
    static propTypes = {
        actions: PropTypes.object,
        messages: PropTypes.object,
        navigation: PropTypes.object,
        teams: PropTypes.object
    };

    static navigationOptions = {
        title: 'Message Details'
    };

    constructor(props) {
        super(props);
    }

    render() {
        const message = this.props.messages[this.props.navigation.state.params.messageId];
        const teamId = message.teamId;
        const team = this.props.teams[teamId] || {};
        return (
            <View style={styles.frame}>
                {!message
                    ? (<Text>{message || 'Oops, sorry.  We could not find that message'}</Text>)
                    : (
                        <View style={{flex: 1}}>
                            <View style={{
                                borderBottomColor: '#CCC',
                                borderBottomWidth: 1,
                                height: 70
                            }}>
                                <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                                    <Image
                                        style={{width: 50, height: 50, marginRight: 10}}
                                        source={{uri: message.sender.photoURL}}
                                    />
                                    <View>
                                        <Text style={{height: 30}}>
                                            <Text style={styles.label}>{'From: '}</Text>
                                            <Text style={styles.data}>{message.sender.displayName}</Text>
                                        </Text>
                                        <Text>
                                            <Text style={styles.label}>{'To: '}</Text>
                                            <Text style={styles.data}>{team.name}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <ScrollView style={{
                                padding: 10,
                                backgroundColor: '#EEE'
                            }}>
                                <Text style={[styles.textDark, {fontSize: 14, paddingBottom: 10}]}>{message.text}</Text>
                            </ScrollView>
                        </View>
                    )
                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    const teams = state.teams.teams;
    return {messages: state.messages.messages, teams: teams};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDetails);

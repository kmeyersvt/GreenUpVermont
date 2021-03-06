/**
 * GreenUpVermont React Native App
 * https://github.com/johnneed/GreenUpVermont
 * @flow
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    ImageBackground,
    TouchableOpacity,
    View,
    FlatList
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as messageTypes from '../../constants/message-types';
import * as actions from './actions';
import {defaultStyles} from '../../styles/default-styles';
import {Message} from '../../models/message';
import coveredBridge from '../../assets/images/covered-bridge2.jpg';
import ThinkingGreenThoughts from '../loading-screen/thinking-green-thoughts';

const myStyles = {
    message: {
        marginBottom: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: '#888',
        borderStyle: 'solid'
    },
    unread: {
        color: '#111',
        fontSize: 12,
        shadowColor: '#FFF',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 1,
        shadowRadius: 1
    },
    read: {
        color: '#888',
        fontSize: 12,
        shadowColor: '#FFF',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 1,
        shadowRadius: 1
    },
    oldMsg:{
        color: '#888',
        fontSize: 16,
        shadowColor: '#FFF',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 1,
        shadowRadius: 1
    },
    newMsg: {
        fontWeight: 'bold',
        color: '#111',
        fontSize: 16,
        shadowColor: '#FFF',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 1,
        shadowRadius: 1
    },
    loadingScreen: {
        justifyContent: 'center',
        alignItems: 'center'
    }
};
const combinedStyles = Object.assign({}, defaultStyles, myStyles);
const styles = StyleSheet.create(combinedStyles);

class MessageItem extends Component {
    static propTypes = {
        item: PropTypes.object
    };


    render() {
        const item = this.props.item;
        return (
            <TouchableOpacity key={item.key} onPress={item.toDetail}>
                <View style={[styles.row, {height: 85}]}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Image
                            style={{width: 50, height: 50, marginRight: 10}}
                            source={{uri: item.sender.photoURL}}
                        />
                        <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
                            <Text style={[item.read ? styles.read : styles.unread,{
                                fontSize: 10,
                                textAlign: 'left',
                                fontWeight: 'bold'
                            }]}
                            >{item.teamName}</Text>
                            <Text style={[{height: 40}, item.read
                                ? styles.oldMsg : styles.newMsg]}>
                                {item.text.length > 80
                                    ? `${item.text.slice(0, 80)}...`
                                    : item.text}
                            </Text>
                            <Text style={[item.read ? styles.read : styles.unread, {
                                fontSize: 10,
                                textAlign: 'right'
                            }]}>
                                {`--${item.sender.displayName || item.sender.email}`}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}


class Messages extends Component {
    static propTypes = {
        actions: PropTypes.object,
        currentUser: PropTypes.object,
        invitations: PropTypes.object,
        invitationsLoaded: PropTypes.bool,
        messages: PropTypes.object,
        navigation: PropTypes.object,
        userHasTeams: PropTypes.bool,
        teamMembersLoaded: PropTypes.bool,
        teamsLoaded: PropTypes.bool,
        messagesLoaded: PropTypes.bool,
        teams: PropTypes.object
    };

    static navigationOptions = {
        title: 'Message Board',
        tabBarLabel: 'Messages'
    };

    constructor(props) {
        super(props);
        this.toMessageDetail = this.toMessageDetail.bind(this);
        this.toSendMessage = this.toSendMessage.bind(this);
    }

    // Stopping the redirect for now, this is causing issue with some of the new code. (JN)
    // componentWillUpdate(nextProps) {
    // if (nextProps.teamsLoaded === true && nextProps.userHasTeams !== true) {
    //     this.props.navigation.navigate('Teams');
    // }
    // }

    toSendMessage() {
        return () => {
            this.props.navigation.navigate('SendMessage');
        };
    }

    toMessageDetail(message) {
        const userId = this.props.currentUser.uid;
        switch (message.type) {
            case messageTypes.INVITATION :
                return () => {
                    // this.props.actions.readMessage(message, userId);
                    this.props.actions.selectTeamById(message.teamId);
                    this.props.navigation.navigate('TeamDetails');
                };
            case messageTypes.REQUEST_TO_JOIN :
                return () => {
                    const membershipId = message.sender.email.toLowerCase().replace(/\./g, ':');
                    const teamId = message.teamId;
                    this.props.actions.readMessage(message, userId);
                    this.props.navigation.navigate('TeamMemberDetails', {teamId, membershipId});
                };
            default :
                return () => {
                    // mark message as read
                    this.props.actions.readMessage(message, userId);
                    // navigate to details screen
                    this.props.navigation.navigate('MessageDetails', {messageId: message.uid});
                };
        }
    }

    render() {
        if (this.props.teamMembersLoaded && this.props.teamsLoaded && this.props.messagesLoaded && this.props.invitationsLoaded) {
            const invitations = this.props.invitations;
            const invitationMessages = Object.keys(invitations).reduce((obj, key) => (
                Object.assign({}, obj, {
                    [key]: Message.create(
                        {
                            uid: key,
                            text: `${invitations[key].sender.displayName} has invited you to join team : ${invitations[key].team.name}`,
                            sender: invitations[key].sender,
                            teamId: key,
                            read: false,
                            active: true,
                            type: messageTypes.INVITATION
                        }
                    )
                })
            ), {});
            const messages = Object.assign({}, this.props.messages, invitationMessages);
            const messageKeys = Object.keys(messages || {}).filter(key => Boolean(!messages[key].teamId || this.props.teams[messages[key].teamId]));
            const sortedKeys = messageKeys.sort((key1, key2) => (
                messages[key2].created.valueOf() - messages[key1].created.valueOf()
            ));
            const myMessages = sortedKeys.map(key => ({
                key,
                toDetail: this.toMessageDetail(messages[key]),
                teamName: ((this.props.teams[messages[key].teamId] || {}).name || '').trim(),
                ...(messages[key] || {})
            }));

            return this.props.userHasTeams ? (
                <View style={styles.frame}>
                    <View style={styles.singleButtonHeader}>
                        <TouchableHighlight
                            style={styles.headerButton}
                            onPress={() => {
                                this.props.navigation.navigate('NewMessage');
                            }}>
                            <Text style={styles.headerButtonText}>{'New Message'}</Text>
                        </TouchableHighlight>
                    </View>
                    {myMessages.length > 0
                        ? (
                            <ScrollView style={styles.scroll}>
                                <View style={styles.infoBlockContainer}>
                                    <FlatList
                                        data={myMessages}
                                        renderItem={({item}) => (<MessageItem item={item}/>)}
                                        style={styles.infoBlockContainer}
                                    />
                                </View>
                            </ScrollView>
                        )
                        : (
                            <ImageBackground source={coveredBridge} style={styles.backgroundImage}>
                                <View style={{
                                    marginTop: '20%',
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    paddingTop: 50,
                                    paddingBottom: 50,
                                    backgroundColor: 'rgba(255,255,255, 0.85)'
                                }}>
                                    <Text style={styles.textDark}>{'Sorry, no messages yet.'}</Text>
                                    <Text
                                        style={styles.textDark}>{'Try sending one to your teammates.'}</Text>
                                </View>
                            </ImageBackground>
                        )}
                </View>
            ) : (
                <View style={styles.frame}>
                    <ImageBackground source={coveredBridge} style={styles.backgroundImage}>
                        <View style={{
                            marginTop: '20%',
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 50,
                            paddingBottom: 50,
                            backgroundColor: 'rgba(255,255,255, 0.85)'
                        }}>
                            <Text style={[styles.textDark, {textAlign: 'justify'}]}>
                                {'All your messages will be listed here.'}
                            </Text>
                            <Text style={[styles.textDark, {textAlign: 'justify'}]}>
                                {'Before you can send or receive messages you will need to join or create a team.'}
                            </Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    this.props.navigation.navigate('Teams');
                                }}
                            >
                                <Text style={styles.buttonText}>{'Go to "My Teams" >'}</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            );
        }

        return (
            <ThinkingGreenThoughts/>
        );
    }
}

function mapStateToProps(state) {
    const members = state.teams.teamMembers || {};
    let canMessage = false;
    const memKeys = Object.keys(members);

    if (memKeys.length > 0) {
        memKeys.forEach(mem => {
            if (members[mem]) {
                const status = members[mem][Object.keys(members[mem])[0]].memberStatus;

                if (status === 'OWNER' || status === 'ACCEPTED') {
                    canMessage = true;
                }
            }
        });
    }

    return {
        currentUser: state.login.user,
        invitations: state.teams.invitations || {},
        invitationsLoaded: state.messages.invitationsLoaded,
        messages: state.messages.messages || {},
        messagesLoaded: state.messages.loaded,
        userHasTeams: canMessage,
        teamsLoaded: state.messages.teamsLoaded,
        teamMembersLoaded: state.loading.teamMembersLoaded,
        teams: state.teams.teams
    };
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);

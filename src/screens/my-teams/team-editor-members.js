/**
 * GreenUpVermont React Native App
 * https://github.com/johnneed/GreenUpVermont
 * @flow
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, TouchableHighlight, View, TextInput} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import * as teamActions from './team-actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: '100%'
    },
    teams: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    text: {
        fontSize: 30,
        textAlign: 'left',
        margin: 10
    }
});
class TeamEditorMembers extends Component {
    static propTypes = {
        actions: PropTypes.object,
        teams: PropTypes.array,
        stackNav: PropTypes.object
    };

    static navigationOptions = {
        title: 'Team Members',
        tabBarLabel: 'Members',
        // Note: By default the icon is only shown on iOS. Search the showIcon option below.
        tabBarIcon: ({tintColor}) => (<FontAwesome name='users' size={24} color='blue'/>)
    };
    constructor(props) {
        super(props);
        this.options = [
            {
                label: 'Public',
                value: 'public'
            }, {
                label: 'Private',
                value: 'private'
            }
        ];
        this.setTeamValue = this.setTeamValue.bind(this);
        this.setSelectedOption = this.setSelectedOption.bind(this);
        this.saveTeam = this.saveTeam.bind(this);
        this.state = {
            selectedOption: this.options[0],
            selectedTeam: {}
        };
    }

    componentWillMount() {
        this.setState({selectedTeam: this.props.selectedTeam});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({selectedTeam: nextProps.selectedTeam});
    }
    setSelectedOption(option) {
        console.log(option);
        this.setState({selectedOption: option});
    }

    saveTeam() {
        this.props.actions.saveTeam(this.state.selectedTeam);
    }

    setTeamValue(key) {
        let newState = {};
        return (value) => {
            newState[key] = value;
            this.setState({selectedTeam: Object.assign({}, this.state.selectedTeam, newState)});
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Team Editor Members Screen</Text>
                <Text>Members:</Text>
                <TextInput keyBoardType={'default'} onChangeText={this.setTeamValue('members')} placeholder={'Members'} style={{
                    width: '80%'
                }} value={this.state.selectedTeam.members[0].lastName}/>
                <Button onPress={this.inviteContacts} title='Invite Contacts'/>
                <Button onPress={this.inviteForm} title='Invite to Team'/>
            </View>

        );
    }
}

function mapStateToProps(state, ownProps) {
    return {selectedTeam: state.teamReducers.selectedTeam};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(teamActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamEditorMembers);

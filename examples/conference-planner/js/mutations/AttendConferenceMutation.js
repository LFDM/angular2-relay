import Relay from 'generic-relay';

export default class AttendConferenceMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{ attendConference }`;
  }

  getVariables() {
    const { id } = this.props.conference;
    return {
      conferenceId: id,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AttendConferencePayload {
        conference {
          going,
          userIsAttending
        },
        user {
          conferences
        },
        conferenceEdge {
          node
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { conference: this.props.conference.id },
    }, {
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'conferences',
      edgeName: 'conferenceEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
}

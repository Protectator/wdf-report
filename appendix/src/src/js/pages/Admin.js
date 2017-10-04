import React from "react";
import {Card, CardText} from 'material-ui/Card';

export default class Admin extends React.Component {
  render() {
    console.log(this.props);
    return (
      <Card className="fullWidth">
        <CardText>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--12-col">
              Coming in a future version.
            </div>
          </div>
        </CardText>
      </Card>
    );
  }
}

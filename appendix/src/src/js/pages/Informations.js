import React from "react";

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import * as Color from 'material-ui/styles/colors';

const styles = {
    title: {
        backgroundColor: Color.blueGrey700
    },
    block: {
        maxWidth: "50%",
    },
    button: {
        margin: 12,
        color: Color.greenA400
    },
    filterLineInput: {
        verticalAlign: "text-bottom"
    }
};

export default class Informations extends React.Component {
  render() {
      return (
          <Card className="fullWidth">
              <CardText>
                  <div className="mdl-grid">
                      <div className="mdl-cell mdl-cell--12-col">
                          VisMed est une application de visualisation de données médicales. Elle permet de naviguer parmi les informations médicales des patients, et des cas de l'hôtpial orthopédique du CHUV.

                          VisMed est développée en collaboration avec HumanTech.
                      </div>
                  </div>
              </CardText>
          </Card>
      );
  }
}

import React from "react";
import CaseStore from "../stores/CaseStore";


const styles = {
    title: {
        color: '#37474F'
    }
};


export default class Header extends React.Component {

    constructor(props) {
        super(props);
        let id;
        let title;
        if (props.match)
        {
            if (props.match.params.id) {
                id = parseInt(props.match.params.id)
            }
        }
        if (id) {
            title = props.title + ' ' +id;
        } else {
            title = props.title;
        }
        this.state = {
            id: id,
            title: title
        };
        this.changeTitle = this.changeTitle.bind(this);
    }

    changeTitle() {
        this.setState({
            id: '',
            title: CaseStore.getTitle()
        });
    }

    componentWillMount() {
        CaseStore.on('changeHeaderTitle', this.changeTitle);
    }

    componentWillUnmount() {
        CaseStore.removeListener('changeHeaderTitle', this.changeTitle);
    }

  render() {
      return (
          <div>
              <div className="mdl-layout__header-row">
                  <div className="mdl-grid">
                      <div className="mdl-cell mdl-cell--2-col">
                          <span className="mdl-layout-title" style={styles.title}>{this.state.title}</span>
                      </div>
                  </div>
              </div>
          </div>
      );
  }
}

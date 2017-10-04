import React from "react";

export default class Measures extends React.Component {
  render() {
    const { query } = this.props.location;
    const { params } = this.props;
    const { article } = params;
    const { date, filter } = query;
    console.log(this.props);
    return (
      <div>
        <h1>Measures ({this.props.params.article})</h1>
        <h4>date: {date}, filter: {filter}</h4>
      </div>
    );
  }
}

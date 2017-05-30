import React from 'react';

class Cell extends React.Component {
  constructor(props) {
    super(props);
  }

  toggleLiving() {
    if (this.props.living) {
      this.props.living = false
    } else {
      this.props.living = true
    }
  }

  render() {
    if (this.props.living) {
      var cellClass = "cells living"
    } else {
      var cellClass = "cells"
    }

    return (
      <div className={cellClass} onClick={() => this.props.onClick()}>
      </div>
    )
  }
}

export default Cell;

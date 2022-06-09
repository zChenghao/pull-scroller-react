import React, { PureComponent } from 'react';

export default function createRefresher(Refresher) {
  return class extends PureComponent {
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <Refresher {...this.props} />;
    }
  };
}

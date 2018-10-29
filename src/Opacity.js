import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
};
const defaultProps = {
  type: 'timing',
};

class Opacity extends PureComponent {
  constructor(props) {
    super(props);

    const { value } = props;

    this.state = {
      opacityValue: new Animated.Value(value),
    };
  }
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    if (value !== nextProps.value) {
      this.move(nextProps);
    }
  }
  move = props => {
    const { value, style, type, ...rest } = props;
    const { opacityValue } = this.state;

    Animated[type](opacityValue, {
      toValue: value,
      ...rest,
    }).start();
  };
  render() {
    const { style, children, ...rest } = this.props;
    const { opacityValue } = this.state;

    const animatedStyle = {
      opacity: opacityValue,
    };

    return (
      <Animated.View style={[style, animatedStyle]} {...rest}>
        {children}
      </Animated.View>
    );
  }
}

Opacity.propTypes = propTypes;
Opacity.defaultProps = defaultProps;

export default Opacity;

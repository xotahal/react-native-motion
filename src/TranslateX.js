import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
};
const defaultProps = {
  type: 'timing',
};

class TranslateX extends PureComponent {
  constructor(props) {
    super(props);

    const { value } = props;

    this.state = {
      translateXValue: new Animated.Value(value),
    };
  }
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    if (value !== nextProps.value) {
      this.move(nextProps.value);
    }
  }
  move = toValue => {
    const { style, type, ...rest } = this.props;
    const { translateXValue } = this.state;

    Animated[type](translateXValue, {
      toValue,
      ...rest,
    }).start();
  };
  render() {
    const { style, children } = this.props;
    const { translateXValue } = this.state;

    const animatedStyle = {
      transform: [{ translateX: translateXValue }],
    };

    return (
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    );
  }
}

TranslateX.propTypes = propTypes;
TranslateX.defaultProps = defaultProps;

export default TranslateX;

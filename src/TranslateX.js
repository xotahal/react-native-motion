import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
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
    if (this.props.value !== nextProps.value) {
      this.move(nextProps.value);
    }
  }
  move = toValue => {
    const { style, type, ...rest } = this.props;

    Animated[type](this.state.translateXValue, {
      toValue,
      ...rest,
    }).start();
  };
  render() {
    const { style, children } = this.props;

    const animatedStyle = {
      transform: [{ translateX: this.state.translateXValue }],
    };

    return (
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    );
  }
}

TranslateX.propTypes = propTypes;
TranslateX.defaultProps = defaultProps;

export default TranslateX;

import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
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
    if (this.props.value !== nextProps.value) {
      this.move(nextProps);
    }
  }
  move = props => {
    const { value, style, type, ...rest } = props;

    Animated[type](this.state.opacityValue, {
      toValue: value,
      ...rest,
    }).start();
  };
  render() {
    const { style, children, ...rest } = this.props;

    const animatedStyle = {
      opacity: this.state.opacityValue,
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

import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
  value: PropTypes.number,
  initialValue: PropTypes.number,
  startOnDidMount: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
};
const defaultProps = {
  type: 'timing',
  value: 0,
  initialValue: 0,
  startOnDidMount: false,
  useNativeDriver: true,
};

class TranslateX extends PureComponent {
  constructor(props) {
    super(props);

    const { value, initialValue } = props;

    this.state = {
      translateXValue: new Animated.Value(initialValue || value),
    };
  }
  componentDidMount() {
    const { startOnDidMount } = this.props;
    if (startOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.move(this.props.value);
      });
    }
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
      ...rest
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

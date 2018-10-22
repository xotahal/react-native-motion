import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
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

class TranslateY extends PureComponent {
  constructor(props) {
    super(props);

    const { value, initialValue } = props;

    this.state = {
      translateYValue: new Animated.Value(initialValue || value),
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
    if (this.props.value !== nextProps.value) {
      this.move(nextProps.value);
    }
  }
  move = toValue => {
    const { style, type, ...rest } = this.props;

    Animated[type](this.state.translateYValue, {
      toValue,
      ...rest
    }).start();
  };
  render() {
    const { style, children } = this.props;

    const animatedStyle = {
      transform: [{ translateY: this.state.translateYValue }],
    };

    return (
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    );
  }
}

TranslateY.propTypes = propTypes;
TranslateY.defaultProps = defaultProps;

export default TranslateY;

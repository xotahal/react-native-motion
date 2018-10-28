import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
  animateOnDidMount: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
};
const defaultProps = {
  type: 'timing',
  animateOnDidMount: false,
  useNativeDriver: true,
};

class Scale extends PureComponent {
  constructor(props) {
    super(props);

    const { value, initValue } = props;

    this.state = {
      scaleValue: new Animated.Value(initValue || value),
    };
  }
  componentDidMount() {
    if (this.props.animateOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.move(this.props);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.move(nextProps);
    }
  }
  move = props => {
    const { value, type, onShowComplete, ...rest } = props;
    const { scaleValue } = this.state;

    Animated[type](scaleValue, {
      toValue: value,
      ...rest,
    }).start(() => {
      if (onShowComplete) {
        onShowComplete(props);
      }
    });
  };
  render() {
    const { style, children } = this.props;
    const { scaleValue } = this.state;

    const animatedStyle = {
      transform: [{ scale: scaleValue }],
    };

    return (
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    );
  }
}

Scale.propTypes = propTypes;
Scale.defaultProps = defaultProps;

export default Scale;

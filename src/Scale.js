import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  animateOnDidMount: PropTypes.bool,
  useNativeDriver: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
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

    this.interaction = null;

    this.state = {
      scaleValue: new Animated.Value(initValue || value),
    };
  }
  componentDidMount() {
    const { animateOnDidMount } = this.props;

    if (animateOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.move(this.props);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    if (value !== nextProps.value) {
      if (this.interaction) {
        this.interaction.cancel();
      }

      if (nextProps.runAfterInteractions) {
        this.interaction = InteractionManager.runAfterInteractions(() => {
          this.interaction = null;
          this.move(nextProps);
        });
      } else {
        this.move(nextProps);
      }
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

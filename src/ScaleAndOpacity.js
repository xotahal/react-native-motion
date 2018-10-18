import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string,
  opacityMin: PropTypes.number,
  scaleMin: PropTypes.number,
  duration: PropTypes.number,
  animateOnDidMount: PropTypes.bool,
  isHidden: PropTypes.bool,
  delay: PropTypes.number,
  useNativeDriver: PropTypes.bool,
};
const defaultProps = {
  type: 'timing',
  opacityMin: 0,
  scaleMin: 0.8,
  duration: 500,
  animateOnDidMount: false,
  isHidden: true,
  delay: 0,
  useNativeDriver: true,
};

class ScaleAndOpacity extends PureComponent {
  constructor(props) {
    super(props);

    const { opacityMin, scaleMin, isHidden } = props;

    this.state = {
      opacityValue: new Animated.Value(isHidden ? opacityMin : 1),
      scaleValue: new Animated.Value(isHidden ? scaleMin : 1),
    };
  }
  componentDidMount() {
    if (this.props.animateOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.show(this.props);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.isHidden && nextProps.isHidden) {
      this.hide(nextProps);
    }
    if (this.props.isHidden && !nextProps.isHidden) {
      this.show(nextProps);
    }
  }
  hide = props => {
    const { scaleValue, opacityValue } = this.state;
    const { type, scaleMin, opacityMin, onHideComplete, ...rest } = props;

    Animated.parallel([
      Animated[type](scaleValue, {
        toValue: scaleMin,
        ...rest
      }),
      Animated[type](opacityValue, {
        toValue: opacityMin,
        ...rest
      }),
    ]).start(() => {
      if (onHideComplete) {
        onHideComplete(props);
      }
    });
  };
  show = props => {
    const { scaleValue, opacityValue } = this.state;
    const { type, onShowComplete, ...rest } = props;

    Animated.parallel([
      Animated[type](scaleValue, {
        toValue: 1,
        ...rest
      }),
      Animated[type](opacityValue, {
        toValue: 1,
        ...rest
      }),
    ]).start(() => {
      if (onShowComplete) {
        onShowComplete(props);
      }
    });
  };
  render() {
    const { style, children } = this.props;
    const { opacityValue, scaleValue } = this.state;

    const animatedStyle = {
      opacity: opacityValue,
      transform: [
        {
          scale: scaleValue,
        },
      ],
    };

    return (
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    );
  }
}

ScaleAndOpacity.propTypes = propTypes;
ScaleAndOpacity.defaultProps = defaultProps;

export default ScaleAndOpacity;

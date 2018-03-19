import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';

class ScaleAndOpacity extends PureComponent {
  constructor(props) {
    super(props);

    const { animateOnDidMount } = props;

    this.state = {
      opacityValue: new Animated.Value(animateOnDidMount ? 0 : 1),
      scaleValue: new Animated.Value(animateOnDidMount ? 0.8 : 1),
    };
  }
  componentDidMount() {
    if (this.props.animateOnDidMount) {
      InteractionManager.runAfterInteractions().then(() => {
        this.showAnimation();
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.isHidden && nextProps.isHidden) {
      this.hideAnimation();
    }
    if (this.props.isHidden && !nextProps.isHidden) {
      this.showAnimation();
    }
  }
  hideAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.scaleValue, {
        toValue: 0.8,
        useNativeDriver: true,
        duration: 250,
      }),
      Animated.timing(this.state.opacityValue, {
        toValue: 0,
        useNativeDriver: true,
        duration: 250,
      }),
    ]).start();
  };
  showAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: 250,
      }),
      Animated.timing(this.state.opacityValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: 250,
      }),
    ]).start();
  };
  render() {
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
      <Animated.View style={animatedStyle}>{this.props.children}</Animated.View>
    );
  }
}

export default ScaleAndOpacity;

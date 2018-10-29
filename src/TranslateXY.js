import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

const propTypes = {
  type: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  useNativeDriver: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  x: PropTypes.number,
  y: PropTypes.number,
};
const defaultProps = {
  type: 'timing',
  useNativeDriver: true,
  x: 0,
  y: 0,
};

class TranslateXY extends PureComponent {
  constructor(props) {
    super(props);

    const { x, y } = props;

    this.state = {
      translateValue: new Animated.ValueXY({ x, y }),
    };
  }
  componentWillReceiveProps(nextProps) {
    const { x, y } = this.props;

    if (x !== nextProps.x || y !== nextProps.y) {
      this.move(nextProps);
    }
  }
  move = props => {
    const { translateValue } = this.state;
    const { style, type, x, y, ...rest } = props;

    Animated[type](translateValue, {
      toValue: { x, y },
      ...rest,
    }).start();
  };
  render() {
    const { translateValue } = this.state;
    const { style, children } = this.props;

    const animatedStyle = {
      transform: translateValue.getTranslateTransform(),
    };

    return (
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    );
  }
}

TranslateXY.propTypes = propTypes;
TranslateXY.defaultProps = defaultProps;

export default TranslateXY;

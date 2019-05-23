# React Native Motion
Change your application from the left one to the right one! Animate it!  **Easily!** [Animated Transition Article](http://bit.ly/animated-transition) or [Animated Graph Article](http://bit.ly/animated-graph)

<img src="https://github.com/xotahal/ui-interactions-detail-view/blob/master/assets/Final%20-%20Without%20animation.gif" width="240"><img src="https://github.com/xotahal/ui-interactions-detail-view/blob/master/assets/Final.gif" width="240">

### Getting Started
```bash
$ yarn add react-native-motion
```

### Usage of SharedElement
We need to specify source and destination for shared element. This library then will move the shared element from source position to destination position.

```js
class Main extends Component {
  render() {
    return (
      <SharedElementRenderer>
        <App />
      </SharedElementRenderer>
    );
  }
}
```
```js
// List items page with source of SharedElement
import { SharedElement } from 'react-native-motion';

class ListPage extends Component {
  render() {
    return (
      <SharedElement id="source">
        <View>{listItemNode}</View>
      </SharedElement>
    );
  }
}
```
```js
// Detail page with a destination shared element
import { SharedElement } from 'react-native-motion';

class DetailPage extends Component {
  render() {
    return (
      <SharedElement sourceId="source">
        <View>{listItemNode}</View>
      </SharedElement>
    );
  }
}
```
### Playground for **react-native-motion** library

- [react-native-motion-playground](https://github.com/xotahal/react-native-motion-playground) repository
- [expo app](https://expo.io/@xotahal/react-native-motion-example)

## Author
- [Let me help you](http://link.xotahal.cz/research) with animations in React Native 🤙 
- [Facebook Group](https://www.facebook.com/groups/react.native.motion/) about animation in React Native
- [Publication](https://medium.com/react-native-motion) about animation in React Native 🚗
- Personal [Medium Account](https://medium.com/@xotahal) about programming 😍
- Subscribe a [blog](https://blog.xotahal.cz) 📝
- Follow me on [Twitter](http://bit.ly/t-xotahal) 🐦


| Jiri Otahal                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- |
| [<img src="https://avatars3.githubusercontent.com/u/3531955?v=4" width="100px;" style="border-radius:50px"/>](http://bit.ly/t-xotahal) |


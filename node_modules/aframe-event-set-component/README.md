## aframe-event-set-component

An [A-Frame](https://aframe.io) component to register event listeners that set
properties. Intended to be an alternative to the undocumented Declarative
Events API in A-Frame 0.2.0.

### Properties

The Event Set component can register multiple event handlers that set multiple
properties. Comma-delimited syntax:

```html
<a-entity event-set="_event: click; material.color: red; scale: 2 2 2,
                     _event: mouseenter: material.color: blue">
```

| Property | Description                                           | Default Value |
| -------- | -----------                                           | ------------- |
| _event   | Event name.                                           | ''            |
| _target  | Query selector if setting property on another entity. | ''            |

`_event` and `_target` are prefixed with underscores to avoid name collisions
if case another component has `event` or `target` properties. Any key-value
property pairs provided beyond `_event` and `_target` will be what is set once
the event is emitted.

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.2.0/aframe.min.js"></script>
  <script src="https://rawgit.com/ngokevin/aframe-event-set-component/master/dist/aframe-event-set-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity geometry="primitive: box" material="color: green"
              event-set="_event: click; material.color: red; scale: 2 2 2,
                         _event: mouseenter: material.color: blue"></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-event-set-component
```

Then register and use.

```js
require('aframe');
require('aframe-event-set-component');
```

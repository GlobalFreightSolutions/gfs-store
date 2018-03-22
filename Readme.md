[![Build Status](https://travis-ci.org/GlobalFreightSolutions/gfs-store.svg?branch=master)](https://travis-ci.org/GlobalFreightSolutions/gfs-store)


# &lt;gfs-store&gt;

The `gfs-store` widget is used to show the available stores on the map.

## Install

```bash
# via bower
$ bower install --save gfs-store
```

## Usage

1. Import Web Components' polyfill:

```html
<script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
```

2. Import Custom Element:

```html
<link rel="import" href="bower_components/gfs-store/gfs-store.html">
```

3. Start using it!

<!---
```
<custom-element-demo>
    <template>
        <script src="../webcomponentsjs/webcomponents-lite.js"></script>
        <link rel="import" href="gfs-store.html">
        <next-code-block></next-code-block>
    </template>
</custom-element-demo>
```
-->

```html
<gfs-store
    container-class="dp-card"
    show-opening-hours="true"
    button-type="standard"
    store-data='{"droppointId":"DPD-123","isStore":true,"providerName":"DPD","distanceInMeters":888,"localizedDistance":"888 meters","droppointDescription":"The Pharmacy at Mayfair (Numark)","geoLocation":{"addressLines":["Shepherd Market"],"town":"London","postCode":"W1J 7UD","countryCode":"GB","directions":"The Pharmacy at Mayfair (Numark)"},"collectionSlots":[{"collectionDate":"2016-11-10T00:00:00Z","timeSlots":[{"from":"09:30","to":"17:00"}]}]}'>
</gfs-store>
```

More info, demo and all the available properties can be found at [GFS widget portal](http://developer.justshoutgfs.com/info/documentation/gfs-checkout/the-gfs-checkout-widgets/store-widget/ "The Store Widget")


## License

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)

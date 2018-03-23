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
    store-data='{"droppointDays":[],"droppointId":"3281-160","isStore":true,"providerName":"GFS","providerId":3281,"providerLogo":null,"contactDetails":{"email":"devsupport@justshoutgfs.com","telephone":"0333 241 3076","mobile":null,"name":null},"distanceInMeters":0,"localizedDistance":"10 meters","droppointDescription":"new-Northcote Road","geoLocation":{"coordinates":{"latitude":51.4554169,"longitude":-0.1650017},"addressLines":["Northcote Road 144"],"town":"London","county":"United Kingdom","postCode":"SW11 6RD","countryCode":"GB","directions":null},"collectionSlots":[{"collectionDate":"2018-03-23T00:00:00","timeSlots":[{"from":"10:05","to":"18:05"}]},{"collectionDate":"2018-03-24T00:00:00","timeSlots":[{"from":"10:06","to":"18:06"}]},{"collectionDate":"2018-03-25T00:00:00","timeSlots":[{"from":"09:07","to":"13:07"}]},{"collectionDate":"2018-03-26T00:00:00","timeSlots":[{"from":"11:01","to":"17:01"}]},{"collectionDate":"2018-03-27T00:00:00","timeSlots":[{"from":"10:02","to":"18:02"}]},{"collectionDate":"2018-03-28T00:00:00","timeSlots":[{"from":"10:03","to":"18:03"}]},{"collectionDate":"2018-03-29T00:00:00","timeSlots":[{"from":"10:04","to":"18:04"}]},{"collectionDate":"2018-03-30T00:00:00","timeSlots":[{"from":"10:05","to":"18:05"}]},{"collectionDate":"2018-03-31T00:00:00","timeSlots":[{"from":"10:06","to":"18:06"}]},{"collectionDate":"2018-04-01T00:00:00","timeSlots":[{"from":"09:07","to":"13:07"}]},{"collectionDate":"2018-04-02T00:00:00","timeSlots":[{"from":"11:01","to":"17:01"}]},{"collectionDate":"2018-04-03T00:00:00","timeSlots":[{"from":"10:02","to":"18:02"}]},{"collectionDate":"2018-04-04T00:00:00","timeSlots":[{"from":"10:03","to":"18:03"}]},{"collectionDate":"2018-04-05T00:00:00","timeSlots":[{"from":"10:04","to":"18:04"}]},{"collectionDate":"2018-04-06T00:00:00","timeSlots":[{"from":"10:05","to":"18:05"}]}]}'>
</gfs-store>
```

More info, demo and all the available properties can be found at [GFS widget portal](http://developer.justshoutgfs.com/info/documentation/gfs-checkout/the-gfs-checkout-widgets/store-widget/ "The Store Widget")


## License

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)

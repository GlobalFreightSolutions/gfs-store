[![Build Status](https://travis-ci.org/GlobalFreightSolutions/gfs-store.svg?branch=master)](https://travis-ci.org/GlobalFreightSolutions/gfs-store)


### Install

```bash
$ npm i --save gfs-store
```

### Import In a HTML file:

```html
<html>
    <head>
        <script type="module">
            import '@gfsdeliver/gfs-store/gfs-store.js';
        </script>
    </head>
    <body>
        <gfs-store
            container-class="dp-card"
            show-opening-hours="true"
            button-type="standard"
            store-data='{"id":"393","title":"all day working, except user holidays","address":["Northcote Road 144","sw110rd","GB"],"geo":{"lat":51.4570808410644,"long":-0.16344328224659,"distance":224},"detail":"/api/stores/393","provider":"GFS","countryCode":"GB","isDroppoint":false,"isStore":true,"marker":"","storeDescription":"all day working, except user holidays","weekCollection":[{"dayOfWeek":"sunday","slots":[{"from":"09:07","to":"13:07","fromTime":"09:07","toTime":"13:07"}]},{"dayOfWeek":"monday","slots":[{"from":"11:01","to":"17:01","fromTime":"11:01","toTime":"17:01"}]},{"dayOfWeek":"tuesday","slots":[{"from":"10:02","to":"18:02","fromTime":"10:02","toTime":"18:02"}]},{"dayOfWeek":"wednesday","slots":[{"from":"10:03","to":"18:03","fromTime":"10:03","toTime":"18:03"}]},{"dayOfWeek":"thursday","slots":[{"from":"10:04","to":"18:04","fromTime":"10:04","toTime":"18:04"}]},{"dayOfWeek":"friday","slots":[{"from":"10:05","to":"18:05","fromTime":"10:05","toTime":"18:05"}]},{"dayOfWeek":"saturday","slots":[{"from":"10:06","to":"18:06","fromTime":"10:06","toTime":"18:06"}]}]}'>
        </gfs-store>
    </body>
</html>
```

### In a Polymer 3 element
```js
import { PolymerElement, html } from '@polymer/polymer';
import '@gfsdeliver/gfs-droppoint/gfs-droppoint.js';

class CustomElement extends PolymerElement {
    static get template() {
        return html`
            <gfs-store
                container-class="dp-card"
                show-opening-hours="true"
                button-type="standard"
                store-data='{"id":"393","title":"all day working, except user holidays","address":["Northcote Road 144","sw110rd","GB"],"geo":{"lat":51.4570808410644,"long":-0.16344328224659,"distance":224},"detail":"/api/stores/393","provider":"GFS","countryCode":"GB","isDroppoint":false,"isStore":true,"marker":"","storeDescription":"all day working, except user holidays","weekCollection":[{"dayOfWeek":"sunday","slots":[{"from":"09:07","to":"13:07","fromTime":"09:07","toTime":"13:07"}]},{"dayOfWeek":"monday","slots":[{"from":"11:01","to":"17:01","fromTime":"11:01","toTime":"17:01"}]},{"dayOfWeek":"tuesday","slots":[{"from":"10:02","to":"18:02","fromTime":"10:02","toTime":"18:02"}]},{"dayOfWeek":"wednesday","slots":[{"from":"10:03","to":"18:03","fromTime":"10:03","toTime":"18:03"}]},{"dayOfWeek":"thursday","slots":[{"from":"10:04","to":"18:04","fromTime":"10:04","toTime":"18:04"}]},{"dayOfWeek":"friday","slots":[{"from":"10:05","to":"18:05","fromTime":"10:05","toTime":"18:05"}]},{"dayOfWeek":"saturday","slots":[{"from":"10:06","to":"18:06","fromTime":"10:06","toTime":"18:06"}]}]}'>
            </gfs-store>
        `;
    }
}
customElements.define('custom-element', CustomElement);
```

More info, demo and all the available properties can be found at [GFS widget portal](http://developer.justshoutgfs.com/info/documentation/gfs-checkout/the-gfs-checkout-widgets/store-widget/ "The Store Widget")


## License

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)

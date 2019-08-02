import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@gfsdeliver/gfs-toast/gfs-toast.js';
import '@gfsdeliver/gfs-button/gfs-button.js';
import './gfs-store-styles';

export class GfsStoreMap extends PolymerElement {
    static get template() {
        return html`
            <style include="gfs-store-styles">
                :host {
                    width: 100%;
                    display: block;
                    position: relative;
                }
            </style>

            <iron-ajax id="getStoreInfo"
                        method="GET" handle-as="json"
                        content-type="application/json"
                        on-response="_handleStoreInfoResponse"
                        on-error="_handleError"
                        timeout="10000">
            </iron-ajax>

            <iron-ajax id="ajaxGetPostcode"
                        method="GET"
                        handle-as="json"
                        content-type="application/json"
                        on-response="_handleGetPostcodeResponse"
                        on-error="_handleError"
                        timeout="10000">
            </iron-ajax>

            <iron-ajax id="ajaxPostPostcode"
                        method="POST"
                        handle-as="json"
                        content-type="application/json"
                        on-response="_handlePostPostcodeResponse">
            </iron-ajax>

            <div id="dropPointLocation">
                <div id="droppointMap" style="height: {{mapHeight}}px"></div>
            </div>

            <div class="hidden">
                <div id="droppointInfoWindow">
                    <div id="loader">
                        <paper-spinner active></paper-spinner>
                    </div>

                    <div class="carrier-icon">
                        <img src="{{carrierIcon}}" />
                    </div>
                    <div id="dp-address">
                        <div class="store-name-map">
                            {{droppointData.title}}
                        </div>
                        <div class="store-address-wrap">
                            <iron-icon icon="maps:my-location"></iron-icon>
                            <dom-repeat items="{{droppointData.address}}">
                                <template>
                                    <div class="store-address-map">
                                        {{item}},
                                    </div>
                                </template>
                            </dom-repeat>

                            <div class="store-location-map">
                                {{droppointData.town}}, {{droppointData.zip}}
                            </div>
                        </div>
                    </div>

                    <gfs-button class="default choose-droppoint map-btn" on-click="_showStoreDetails">View Opening Times</gfs-button>
                </div>
            </div>

            <div id="dropPointDetails" class$="{{_droppointDetailsClass}}">
                <div id="droppoint_overlay" style="height: {{mapHeight}}px; display: block">
                    <div id="droppoint_overlay_close" on-click="_hideStoreDetails">
                        <img src="//gfswidgetcdn.azurewebsites.net/images/widgets/x.png" alt="close" />
                    </div>
                    <gfs-droppoint id="overlay-droppoint" checkout-token="[[checkoutToken]]" droppoint-data="{{_selectedStore}}" container-class="overlay" show-opening-hours></gfs-droppoint>
                </div>
            </div>

            <gfs-toast error id="notificationError"></gfs-toast>
        `;
    }

    static get properties() {
        return {
            token: String,

            countryCode: String,

            postCode: String,

            carrierIcon: String,

            droppointData: {
                type: Object,
                value: {}
            },

            /* Array of carriers to display drop points for */
            carriers: {
                type: Array,
                value: function() {
                    return []
                }
            },

            searchResultText: {
                type: String,
                value: "Last searched postcode:"
            },

            map: Object,

            mapHeight: {
                type: String,
                value: 500
            },

            startingZoomLevel: {
                type: Number,
                value: 14
            },

            endingZoomLevel: {
                type: Number,
                value: 4
            },

            storeMapIcon: String,

            checkoutToken: {
                type: String,
                value: ""
            },

            checkoutRequest: String,

            _infoWindow: Object,

            _droppointDetailsClass: {
                type: String,
                value: "hidden"
            },

            _markers: {
                type: Array,
                value: []
            },

            _droppointMarkers: {
                type: Array,
                value: []
            },

            _storeMarkers: {
                type: Array,
                value: []
            },

            droppointUri: {
                type: String,
                value: "https://test-connect2.gfsdeliver.com"
            },

            checkoutToken: {
                type: String,
                value: ""
            }
        }
    }

    static get observers() {
        return [

        ]
    }

    connectedCallback() {
        super.connectedCallback();

        window.addEventListener('newStores', this._loadMarkers.bind(this));
        window.addEventListener('clearMarkers', this._clearMarkers.bind(this));
        window.addEventListener('loadStoreMarkers', this._loadMarkers.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        window.removeEventListener('newStores', this._loadMarkers.bind(this));
        window.removeEventListener('clearMarkers', this._clearMarkers.bind(this));
        window.removeEventListener('loadStoreMarkers', this._loadMarkers.bind(this));
    }

    ready() {
        super.ready();

        this.buildStoreMap();
    }

    buildStoreMap() {
        var elem = this;

        var mapOptions = {
            zoom: this.startingZoomLevel,
            minZoom: this.startingZoomLevel - this.endingZoomLevel,

            // type of map (ROADMAP, SATELLITE, TERRAIN, HYBRID)
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            streetViewControl: false,
            disableDefaultUI: false,
            mapTypeControl: true,

            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT,
            },

            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.TOP_RIGHT
            },

            // remove points of interest from the map so as not to interfere
            styles: [{
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            }]
        };

        this._infoWindow = new google.maps.InfoWindow({
            content: elem.$.droppointInfoWindow
        });

        this._map = new google.maps.Map(this.shadowRoot.querySelector('#droppointMap'), mapOptions);

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            componentRestrictions: {
                country: this.countryCode,
                postalCode: this.postCode
            }
        }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                let homeMarkerConfig = {
                    position: results[0].geometry.location,
                    animation: google.maps.Animation.DROP,
                    title: 'Home',
                    html: 'Home',
                    icon: this._getHomeIcon()
                };

                let marker = new google.maps.Marker(homeMarkerConfig);

                this._map.setCenter(homeMarkerConfig.position);
                marker.setMap(this._map);
            }
            else {
                console.log('Google Maps API ERROR - Geocode was not successful for the following reason: ' + status);
                this.$.notificationError.text = 'Google Maps API ERROR - Geocode was not successful for the following reason: ' + status;
                this.$.notificationError.duration = 5000;
                this.$.notificationError.open();
            }
        });
    }

    _getHomeIcon() {
        if (this.homeIcon) {
            return this.homeIcon;
        }
        else {
            return this.resolveUrl('//gfswidgetcdn.azurewebsites.net/images/widgets2.0/home.png');
        }
    }

    _loadMarkers(checkoutData) {
        let _elem = this;
        let markers = checkoutData.detail.data;
        let isDroppoint = checkoutData.detail.droppoint;
        let isStore = checkoutData.detail.store;

        markers.forEach((pointItem) => {
            let getCountryCode = _elem.countryCode;
            pointItem.countryCode = _elem.countryCode;
            pointItem.isDroppoint = isDroppoint;
            pointItem.isStore = isStore;

            let markerConfig = {
                position: new google.maps.LatLng(pointItem.geo.lat, pointItem.geo.long),
                map: this._map,
                animation: google.maps.Animation.vn,
                title: pointItem.title,
                customData: pointItem,
                icon: isDroppoint ? this._droppointMapIco(getCountryCode) + '/' + pointItem.provider.toLowerCase() + '.png' : this._storeIcon(),
                zIndex: google.maps.Marker.MAX_ZINDEX + 1
            };

            let marker = new google.maps.Marker(markerConfig);
            isDroppoint ? this.push('_droppointMarkers', marker) : this.push('_storeMarkers', marker);


            marker.addListener('click', function(elem) {
                _elem._selectStore(this, isDroppoint, isStore);

                const icon = isDroppoint ? _elem._droppointMapIco(getCountryCode) + '/' + pointItem.provider.toLowerCase() + '-selected.png' : _elem._storeIcon();
                this.setIcon(icon);

                _elem._getStoresDetails(this.customData.id, isDroppoint);
                _elem._infoWindow.open(_elem._map, this);
                _elem._map.panTo(this.customData.marker.getPosition());
                _elem.$.loader.style.display = 'block';
            });

            // add a link to the marker to get to it from the droppoint, need to animate and centre the marker if selecting from list view
            pointItem.marker = marker;
        });

        google.maps.event.addListener(this._map, 'click', () => {
            this._unselectStore();
        });

        google.maps.event.addListener(this._infoWindow,'closeclick', () => {
            this._unselectStore();
         });
    }

    _droppointMapIco(countryCode) {
        var url = this.resolveUrl('//gfswidgetcdn.azurewebsites.net/images/widgets2.0/carriers/');

        switch (countryCode) {
            case "DE":
                return url + 'DE';
            case "FR":
            case "BE":
            case "ES":
                return url + 'FR';
            default:
                return url + 'GB';
        }
    }

    _droppointInfoWindowIco(countryCode, provider) {
        let url;

        if (provider === 'DPD') {
            provider = 'dpdpickup'
        }

        if (provider === 'dpdpickup' || provider === 'HERMES' || provider === 'DODDLE' || provider === 'COLLECT PLUS' || provider === 'INPOST') {
            url = this.resolveUrl('//gfswidgetcdn.azurewebsites.net/images/widgets/carriers');

            switch(countryCode) {
                case "DE":
                    return url + '/DE/' + provider.toLowerCase() + '.png';
                case "FR":
                case "BE":
                case "ES":
                    return url + '/FR/' + provider.toLowerCase() + '.png';
                default:
                    return url + '/GB/' + provider.toLowerCase() + '.png';
            }
        }
        else {
            if (!!this.storeMapIcon) {
                return url = this.resolveUrl(this.storeMapIcon);
            }
            else {
                return url = this.resolveUrl('//gfswidgetcdn.azurewebsites.net/images/widgets2.0/store-map-icon.png');
            }
        }
    }

    _selectStore(marker, isDroppoint, isStore) {
        marker.customData.chosen = true;
        this._selectedStore = marker.customData;

        this._hideStoreDetails();
        this._fire("droppoint-changed", marker.customData, isDroppoint, isStore);
    }

    _unselectStore() {
        if (this._selectedStore) {
            this._selectedStore.chosen = false;

            if (this._selectedStore.isDroppoint) {
                let icon = this._droppointMapIco(this.countryCode) + '/' + this._selectedStore.provider.toLowerCase() + '.png';
                this._selectedStore.marker.setIcon(icon)
            }

            this._fire("droppoint-changed", this._selectedStore);

            if (this._currentMarker) {
                this._currentMarker.setAnimation(null);
            }

            if (this._infoWindow) {
                this._infoWindow.close();
            }
        }
    }

    _searchPostcode(e, gfsCheckoutElem) {
        e.preventDefault();
        const target = e.currentTarget;
        const elem = e.currentTarget.id;
        var ddSearchTerms = e.target.parentElement.parentElement.querySelector('#droppointAddress').value;

        if (this.useDroppointsStores) {
            this.shadowRoot.querySelector('#toggleStoreOnMap').checked = false;
            this.shadowRoot.querySelector('#toggleDroppointsOnMap').checked = false;
            this._storeDetailsClass = "fade-out";
            this._droppointDetailsClass = "fade-out";
        }

        this._fire('hide-collectionInfo');

        switch (elem) {
            case "droppointSubmit":
                return [
                    e.target.parentElement.parentElement.querySelector('#lastddPostcode').innerText = this.searchResultText + " " + ddSearchTerms,
                    this._returnPostcode(ddSearchTerms, "dropPoint", target, gfsCheckoutElem),
                    ddSearchTerms = ""
                ];
            case "storeSubmit":
                return [
                    e.target.parentElement.parentElement.querySelector('#lastStorePostcode').innerText = "Last searched postcode: " + this.$.storeAddress.value,
                    this._returnPostcode(this.$.storeAddress, "store", target, gfsCheckoutElem),
                    this.$.storeAddress = ""
                ];
            default:
        }
    }

    _returnPostcode(postcode, deliveryType, target, gfsCheckoutElem) {
        var emptyPostcode = new RegExp(/^\s\s*/);

        if (postcode === "" || postcode.match(emptyPostcode)) {
            this.$.notificationError.text = "Please enter a valid postcode";
            this.$.notificationError.fitInto = this.$.gfsMapCanvas;
            this.$.notificationError.duration = 5000;
            this.$.notificationError.open();
            return;
        }

        if (!!this._droppointMarkers && deliveryType === 'dropPoint') {
            this._clearMarkers(this._droppointMarkers, 'dropPointMap');

            if (this.useDroppointsStores) {
                this._clearMarkers(this._storeMarkers, 'dropPointMap');
            }
        }
        else {
            this._clearMarkers(this._storeMarkers, 'storeMap');
        }

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            componentRestrictions: {
                country: this.countryCode,
                postalCode: postcode
            }
        }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                var position = results[0].geometry.location;

                if (deliveryType === 'dropPoint') {
                    this._map.setCenter(position);
                }
                else {
                    this._storeMap.setCenter(position);
                }

                const checkoutRequest = JSON.parse(atob(gfsCheckoutElem.checkoutRequest));
                checkoutRequest.order.delivery.destination.zip = postcode;
                gfsCheckoutElem.checkoutRequest = btoa(JSON.stringify(checkoutRequest));
            }
            else {
                console.log('Google Maps API ERROR - Geocode was not successful for the following reason: ' + status);
                this.$.notificationError.text = "Postcode not found in " + this.countryCode;
                this.$.notificationError.classList.remove('fit-top');
                this.$.notificationError.horizontalAlign = "left";
                this.$.notificationError.verticalAlign = "top";

                if (deliveryType === 'dropPoint') {
                    this.$.notificationError.fitInto = this.$.droppointMap;
                }
                else {
                    this.$.notificationError.fitInto = this.$.storeMapCanvas;
                }

                this.$.notificationError.duration = 5000;
                this.$.notificationError.open();
                target.disabled = false;
                return;
            }
            target.disabled = false;
        });
    }

    _hideDropPoints(obj, val) {
        this._clearMarkers(obj, val);
    }

    _showStores() {
        if (this.$$('#toggleStoreOnMap').checked) {
            if (!this.useStores) {
                this._showStoreList = true;
                this._loadStoreMarkers(this._stores, this._map);
            }
        }
        else {
            this._removeStoreMarkers();
            this._showStoreList = false;
        }
    }

    _storeIcon() {
        var icon;

        if (!!this.storeMapIcon) {
            icon = this.resolveUrl(this.storeMapIcon);
        }
        else {
            icon = this.resolveUrl('//gfswidgetcdn.azurewebsites.net/images/widgets2.0/store-map-icon.png');
        }
        return icon;
    }

    _clearMarkers(obj) {
        let markers;
        let isDroppoint = obj.detail.droppoint;

        if (isDroppoint) {
            markers = this._droppointMarkers;

            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        }
        else {
            markers = this._storeMarkers;

            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        }
    }

    _showDroppointDetails() {
        if (this._selectedDroppoint.isDroppoint) {
            this.mapHeight = this.$.droppointMap.clientHeight;
            this._storeDetailsClass = "fade-out";
            this._droppointDetailsClass = "fade-in";
            this._fire('show-opening-hours', this._selectedDroppoint);
        }
    }

    _hideDroppointDetails() {
        this._droppointDetailsClass = "fade-out";
    }

    _getDroppointsDetails(droppointID, isDroppoint) {
        let createSession = this.$.getDroppointInfo;
        createSession.url = this.droppointUri + (isDroppoint ? '/api/droppoints/' : '/api/stores/') + droppointID;
        createSession.headers = this._getBearerToken();
        createSession.generateRequest();
    }

    _fixMapMarker(delivery) {
        let elem = this;

        switch (delivery) {
            case 'droppoint':
                if (this.$.toggleDropPointsView.checked && !!this._selectedDropPoint) {
                    if (!!this._currentMarker) {
                        this._currentMarker.setAnimation(null);
                    }
                    this._currentMarker = this._droppointById(this._selectedDropPoint.providerId, this._selectedDropPoint.droppointId).marker;
                    this._infoWindow.open(this._map, this._currentMarker);
                    this._infoWindow.opened = true;

                    if (!!this._storeInfoWindow && this._storeInfoWindow.opened) {
                        this._storeInfoWindow.close();
                    }

                    if (this.markerAmimation) {
                        this._currentMarker.setAnimation(google.maps.Animation.BOUNCE);
                    }

                    this.$.dropPointRadio.setAttribute('checked', 'true');
                    this._map.panTo(this._currentMarker.getPosition());
                }
                break;
            case 'store':
                if (!!this._selectedStore) {
                    if (!!this._currentMarker) {
                        this._currentMarker.setAnimation(null);
                    }
                    this._currentMarker = this._storeById(this._selectedStore.providerId, this._selectedStore.droppointId).marker;

                    if (!!this.$.storeMapCanvas.map) {
                        this._storeInfoWindow.open(this._storeMap, this._currentMarker);
                        this._storeInfoWindow.opened = true;
                    }
                    else {
                        if (!!this._storeInfoWindow) {
                            this._storeInfoWindow.close()
                        }
                        else {
                            this._storeInfoWindow = new google.maps.InfoWindow({
                                content: elem.$.store_info
                            });
                        }
                        this._storeInfoWindow.open(this._map, this._currentMarker);
                        this._storeInfoWindow.opened = true;

                        if (!!this._infoWindow && this._infoWindow.opened) {
                            this._infoWindow.close();
                        }
                    }

                    if (this.markerAmimation) {
                        this._currentMarker.setAnimation(google.maps.Animation.BOUNCE);
                    }

                    this.$.storeRadio.setAttribute('checked', 'true');

                    if (!!this.$.storeMapCanvas.map) {
                        this._storeMap.panTo(this._currentMarker.getPosition());
                    }
                    else {
                        this._map.panTo(this._currentMarker.getPosition());
                    }
                }
                break;
            default:
                this.$.errorNotification.text = "No delivery option was passed."
                this.$.errorNotification.open();
        }
    }

    _fire(ev, el, isDroppoint, isStore) {
        this.dispatchEvent(new CustomEvent(ev, {
            bubbles: true,
            composed: true,
            detail: {
                data: el,
                droppoint: isDroppoint,
                store: isStore
            }
        }));
    }

    _getBearerToken() {
        return { "Authorization": "Bearer " + atob(this.checkoutToken) };
    }

    _handleDroppointInfoResponse(e) {
        this.droppointData = e.detail.response;
        this.carrierIcon = this._droppointInfoWindowIco(e.detail.response.country, e.detail.response.provider);
        this.$.loader.style.display = 'none';
    }

    _handleError(e) {
        if (e.detail.error.type === "timeout") {
            this.$.notificationError.text = "Server Took Too Long To Respond";
            this.$.notificationError.classList.add('fit-top');
            this.$.notificationError.open();
            this.$.loader.style.display = 'none';
        }
        else {
            console.error('Error: ', e.detail.error.message);
            this.$.notificationError.text = e.detail.error.message;
            this.$.notificationError.classList.add('fit-top');
            this.$.notificationError.open();
            this.$.loader.style.display = 'none';
        }
    }
}
window.customElements.define('gfs-store-map', GfsStoreMap);

import { a as fieldTagNames, c as photometricInterpretations, i as arrayFields, l as __commonJSMin, o as fieldTypes, s as geoKeyNames, t as ExtraSamplesValues, u as __toESM } from "./globals-CBKQINfx.js";
import { t as TileState_default } from "./TileState-CGIWeHVJ.js";
import { C as linearFindNearest, E as EventType_default, T as Disposable, a as listenOnce, d as BaseEvent, g as toPromise, i as listen, l as getUid, o as unlistenByKey } from "./Object-DCW2lR92.js";
import { n as isEmpty } from "./obj-DsDkrhYV.js";
import { i as Tile, r as ImageTile } from "./TileRange-DC3cm2EC.js";
import { h as WORKER_OFFSCREEN_CANVAS, t as createCanvasContext2D } from "./dom-CA7wKpw3.js";
import { a as asImageLike, i as asArrayLike, n as LRUCache, o as toArray, r as DataTile, t as TileLayer } from "./Tile-DeGnwBPD.js";
import { a as decode, c as ImageState_default, i as ImageWrapper, n as scale$1, r as toSize } from "./size-DoDW2Qys.js";
import { B as getTopRight, D as getBottomLeft, E as getArea, H as intersects, K as scaleFromCenter, M as getForViewAndSize, N as getHeight, P as getIntersection, V as getWidth, W as isEmpty$1, c as containsExtent, d as createEmpty, i as buffer$1, k as getCenter, m as createOrUpdateFromCoordinate, q as wrapAndSliceX, s as containsCoordinate, t as applyTransform, v as equals, y as extend, z as getTopLeft } from "./extent-Ct519ZT-.js";
import { A as transform, D as toUserCoordinate, E as toLonLat, F as Projection, G as error, H as scale$2, L as fromCode, O as toUserExtent, R as add, S as getTransformFromProjections, W as compareVersions, _ as fromUserExtent, f as createTransformFromCoordinateTransform, m as equivalent, y as get } from "./proj-CpbG7wpi.js";
import { a as modulo, n as clamp, o as round, r as floor, t as ceil } from "./math-BWMiNrVo.js";
import { c as Triangulation, d as render$1, l as calculateSourceExtentResolution, n as getKeyZXY, r as hash, s as ERROR_THRESHOLD, t as createOrUpdate, u as calculateSourceResolution } from "./tilecoord-BsHpr1JL.js";
import { t as assert } from "./asserts-gRk-GPA6.js";
import { a as apply, l as makeInverse, o as compose, s as create$1, u as multiply } from "./contains-DqIevFtL.js";
import { t as Layer } from "./Layer-T-jctcZ0.js";
import { t as CanvasLayerRenderer } from "./Layer-BWEuKMy_.js";
import { s as ViewHint_default } from "./View-C0XRG2uC.js";
import { i as Point } from "./Polygon-CmUxCsnH.js";
import { o as Feature } from "./Feature-CclFINmX.js";
import { r as loadFeaturesXhr, t as VectorSource } from "./Vector-CiDSfYvb.js";
import { t as Source } from "./Source-DWcSo24T.js";
import { n as VectorRenderTile, r as ImageCanvas, t as VectorTile$1 } from "./VectorTile-Dfy3xrBl.js";
import { t as TileQueue } from "./TileQueue-BEtu2y85.js";
import { _ as TileGrid, a as TileSource, c as createFromTileUrlFunctions, d as expandUrl, f as pickUrl, g as getForProjection, h as extentFromProjection, i as TileEventType_default, l as nullTileUrlFunction, m as createXYZ, n as TileImage, o as TileSourceEvent, p as renderXYZTemplate, r as UrlTile, s as createFromTemplates, t as XYZ, u as appendParams } from "./XYZ-B6p4ltVS.js";
import OSM, { ATTRIBUTION } from "./ol_source_OSM__js.js";
//#region node_modules/ol/source/BingMaps.js
/**
* @module ol/source/BingMaps
*/
/**
* @param {import('../tilecoord.js').TileCoord} tileCoord Tile coord.
* @return {string} Quad key.
*/
function quadKey(tileCoord) {
	const z = tileCoord[0];
	const digits = new Array(z);
	let mask = 1 << z - 1;
	let i, charCode;
	for (i = 0; i < z; ++i) {
		charCode = 48;
		if (tileCoord[1] & mask) charCode += 1;
		if (tileCoord[2] & mask) charCode += 2;
		digits[i] = String.fromCharCode(charCode);
		mask >>= 1;
	}
	return digits.join("");
}
/**
* The attribution containing a link to the Microsoft® Bing™ Maps Platform APIs’
* Terms Of Use.
* @const
* @type {string}
*/
var TOS_ATTRIBUTION = "<a class=\"ol-attribution-bing-tos\" href=\"https://www.microsoft.com/maps/product/terms.html\" target=\"_blank\">Terms of Use</a>";
/**
* @typedef {Object} Options
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {boolean} [hidpi=false] If `true` hidpi tiles will be requested.
* @property {string} [culture='en-us'] Culture code.
* @property {string} key Bing Maps API key. Get yours at https://www.bingmapsportal.com/.
* @property {string} imagerySet Type of imagery.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {number} [maxZoom=21] Max zoom. Default is what's advertized by the BingMaps service.
* @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
* Higher values can increase reprojection performance, but decrease precision.
* @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
* ```js
* function(imageTile, src) {
*   imageTile.getImage().src = src;
* };
* ```
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* @property {number} [transition] Duration of the opacity transition for rendering.
* To disable the opacity transition, pass `transition: 0`.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
* @property {boolean} [placeholderTiles] Whether to show BingMaps placeholder tiles when zoomed past the maximum level provided in an area. When `false`, requests beyond
* the maximum zoom level will return no tile. When `true`, the placeholder tile will be returned. When not set, the default behaviour of the imagery set takes place,
* which is unique for each imagery set in BingMaps.
*/
/**
* @typedef {Object} BingMapsImageryMetadataResponse
* @property {number} statusCode The response status code
* @property {string} statusDescription The response status description
* @property {string} authenticationResultCode The authentication result code
* @property {Array<ResourceSet>} resourceSets The array of resource sets
*/
/**
* @typedef {Object} ResourceSet
* @property {Array<Resource>} resources Resources.
*/
/**
* @typedef {Object} Resource
* @property {number} imageHeight The image height
* @property {number} imageWidth The image width
* @property {number} zoomMin The minimum zoom level
* @property {number} zoomMax The maximum zoom level
* @property {string} imageUrl The image URL
* @property {Array<string>} imageUrlSubdomains The image URL subdomains for rotation
* @property {Array<ImageryProvider>} [imageryProviders] The array of ImageryProviders
*/
/**
* @typedef {Object} ImageryProvider
* @property {Array<CoverageArea>} coverageAreas The coverage areas
* @property {string} [attribution] The attribution
*/
/**
* @typedef {Object} CoverageArea
* @property {number} zoomMin The minimum zoom
* @property {number} zoomMax The maximum zoom
* @property {Array<number>} bbox The coverage bounding box
*/
/**
* @classdesc
* Layer source for Bing Maps tile data.
* @api
*/
var BingMaps = class extends TileImage {
	/**
	* @param {Options} options Bing Maps options.
	*/
	constructor(options) {
		const hidpi = options.hidpi !== void 0 ? options.hidpi : false;
		super({
			cacheSize: options.cacheSize,
			crossOrigin: "anonymous",
			interpolate: options.interpolate,
			projection: get("EPSG:3857"),
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			state: "loading",
			tileLoadFunction: options.tileLoadFunction,
			tilePixelRatio: hidpi ? 2 : 1,
			wrapX: options.wrapX !== void 0 ? options.wrapX : true,
			transition: options.transition,
			zDirection: options.zDirection
		});
		/**
		* @private
		* @type {boolean}
		*/
		this.hidpi_ = hidpi;
		/**
		* @private
		* @type {string}
		*/
		this.culture_ = options.culture !== void 0 ? options.culture : "en-us";
		/**
		* @private
		* @type {number}
		*/
		this.maxZoom_ = options.maxZoom !== void 0 ? options.maxZoom : -1;
		/**
		* @private
		* @type {string}
		*/
		this.apiKey_ = options.key;
		/**
		* @private
		* @type {string}
		*/
		this.imagerySet_ = options.imagerySet;
		/**
		* @private
		* @type {boolean|undefined}
		*/
		this.placeholderTiles_ = options.placeholderTiles;
		const url = "https://dev.virtualearth.net/REST/v1/Imagery/Metadata/" + this.imagerySet_ + "?uriScheme=https&include=ImageryProviders&key=" + this.apiKey_ + "&c=" + this.culture_;
		fetch(url).then((response) => response.json()).then((json) => this.handleImageryMetadataResponse(json));
	}
	/**
	* Get the api key used for this source.
	*
	* @return {string} The api key.
	* @api
	*/
	getApiKey() {
		return this.apiKey_;
	}
	/**
	* Get the imagery set associated with this source.
	*
	* @return {string} The imagery set.
	* @api
	*/
	getImagerySet() {
		return this.imagerySet_;
	}
	/**
	* @param {BingMapsImageryMetadataResponse} response Response.
	*/
	handleImageryMetadataResponse(response) {
		if (response.statusCode != 200 || response.statusDescription != "OK" || response.authenticationResultCode != "ValidCredentials" || response.resourceSets.length != 1 || response.resourceSets[0].resources.length != 1) {
			this.setState("error");
			return;
		}
		const resource = response.resourceSets[0].resources[0];
		const maxZoom = this.maxZoom_ == -1 ? resource.zoomMax : this.maxZoom_;
		const extent = extentFromProjection(this.getProjection());
		const scale = this.hidpi_ ? 2 : 1;
		const tileSize = resource.imageWidth == resource.imageHeight ? resource.imageWidth / scale : [resource.imageWidth / scale, resource.imageHeight / scale];
		this.tileGrid = createXYZ({
			extent,
			minZoom: resource.zoomMin,
			maxZoom,
			tileSize
		});
		const culture = this.culture_;
		const hidpi = this.hidpi_;
		const placeholderTiles = this.placeholderTiles_;
		this.tileUrlFunction = createFromTileUrlFunctions(resource.imageUrlSubdomains.map(function(subdomain) {
			/** @type {import('../tilecoord.js').TileCoord} */
			const quadKeyTileCoord = [
				0,
				0,
				0
			];
			const imageUrl = resource.imageUrl.replace("{subdomain}", subdomain).replace("{culture}", culture);
			return (function(tileCoord, pixelRatio, projection) {
				if (!tileCoord) return;
				createOrUpdate(tileCoord[0], tileCoord[1], tileCoord[2], quadKeyTileCoord);
				const url = new URL(imageUrl.replace("{quadkey}", quadKey(quadKeyTileCoord)));
				const params = url.searchParams;
				if (hidpi) {
					params.set("dpi", "d1");
					params.set("device", "mobile");
				}
				if (placeholderTiles === true) params.delete("n");
				else if (placeholderTiles === false) params.set("n", "z");
				return url.toString();
			});
		}));
		if (resource.imageryProviders) {
			const transform = getTransformFromProjections(get("EPSG:4326"), this.getProjection());
			this.setAttributions((frameState) => {
				const attributions = [];
				const viewState = frameState.viewState;
				const tileGrid = this.getTileGrid();
				const z = tileGrid.getZForResolution(viewState.resolution, this.zDirection);
				const zoom = tileGrid.getTileCoordForCoordAndZ(viewState.center, z)[0];
				resource.imageryProviders.map(function(imageryProvider) {
					let intersecting = false;
					const coverageAreas = imageryProvider.coverageAreas;
					for (let i = 0, ii = coverageAreas.length; i < ii; ++i) {
						const coverageArea = coverageAreas[i];
						if (zoom >= coverageArea.zoomMin && zoom <= coverageArea.zoomMax) {
							const bbox = coverageArea.bbox;
							if (intersects(applyTransform([
								bbox[1],
								bbox[0],
								bbox[3],
								bbox[2]
							], transform), frameState.extent)) {
								intersecting = true;
								break;
							}
						}
					}
					if (intersecting) attributions.push(imageryProvider.attribution);
				});
				attributions.push(TOS_ATTRIBUTION);
				return attributions;
			});
		}
		this.setState("ready");
	}
};
//#endregion
//#region node_modules/ol/source/CartoDB.js
/**
* @module ol/source/CartoDB
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {import("../proj.js").ProjectionLike} [projection='EPSG:3857'] Projection.
* @property {number} [maxZoom=18] Max zoom.
* @property {number} [minZoom] Minimum zoom.
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* @property {Object} [config] If using anonymous maps, the CartoDB config to use. See
* https://carto.com/developers/maps-api/guides/anonymous-maps/
* for more detail.
* If using named maps, a key-value lookup with the template parameters.
* See https://carto.com/developers/maps-api/guides/named-maps/
* for more detail.
* @property {string} [map] If using named maps, this will be the name of the template to load.
* See https://carto.com/developers/maps-api/guides/named-maps/
* for more detail.
* @property {string} [account] Username as used to access public Carto dashboard at https://{username}.carto.com/.
* @property {number} [transition=250] Duration of the opacity transition for rendering.
* To disable the opacity transition, pass `transition: 0`.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
/**
* @typedef {Object} CartoDBLayerInfo
* @property {string} layergroupid The layer group ID
* @property {{https: string}} cdn_url The CDN URL
*/
/**
* @classdesc
* Layer source for the CartoDB Maps API.
* @api
*/
var CartoDB = class extends XYZ {
	/**
	* @param {Options} options CartoDB options.
	*/
	constructor(options) {
		super({
			attributions: options.attributions,
			cacheSize: options.cacheSize,
			crossOrigin: options.crossOrigin,
			maxZoom: options.maxZoom !== void 0 ? options.maxZoom : 18,
			minZoom: options.minZoom,
			projection: options.projection,
			transition: options.transition,
			wrapX: options.wrapX,
			zDirection: options.zDirection
		});
		/**
		* @type {string}
		* @private
		*/
		this.account_ = options.account;
		/**
		* @type {string}
		* @private
		*/
		this.mapId_ = options.map || "";
		/**
		* @type {!Object}
		* @private
		*/
		this.config_ = options.config || {};
		/**
		* @type {!Object<string, CartoDBLayerInfo>}
		* @private
		*/
		this.templateCache_ = {};
		this.initializeMap_();
	}
	/**
	* Returns the current config.
	* @return {!Object} The current configuration.
	* @api
	*/
	getConfig() {
		return this.config_;
	}
	/**
	* Updates the carto db config.
	* @param {Object} config a key-value lookup. Values will replace current values
	*     in the config.
	* @api
	*/
	updateConfig(config) {
		Object.assign(this.config_, config);
		this.initializeMap_();
	}
	/**
	* Sets the CartoDB config
	* @param {Object} config In the case of anonymous maps, a CartoDB configuration
	*     object.
	* If using named maps, a key-value lookup with the template parameters.
	* @api
	*/
	setConfig(config) {
		this.config_ = config || {};
		this.initializeMap_();
	}
	/**
	* Issue a request to initialize the CartoDB map.
	* @private
	*/
	initializeMap_() {
		const paramHash = JSON.stringify(this.config_);
		if (this.templateCache_[paramHash]) {
			this.applyTemplate_(this.templateCache_[paramHash]);
			return;
		}
		let mapUrl = "https://" + this.account_ + ".carto.com/api/v1/map";
		if (this.mapId_) mapUrl += "/named/" + this.mapId_;
		const client = new XMLHttpRequest();
		client.addEventListener("load", this.handleInitResponse_.bind(this, paramHash));
		client.addEventListener("error", this.handleInitError_.bind(this));
		client.open("POST", mapUrl);
		client.setRequestHeader("Content-type", "application/json");
		client.send(JSON.stringify(this.config_));
	}
	/**
	* Handle map initialization response.
	* @param {string} paramHash a hash representing the parameter set that was used
	*     for the request
	* @param {Event} event Event.
	* @private
	*/
	handleInitResponse_(paramHash, event) {
		const client = event.target;
		if (!client.status || client.status >= 200 && client.status < 300) {
			let response;
			try {
				response = JSON.parse(client.responseText);
			} catch {
				this.setState("error");
				return;
			}
			this.applyTemplate_(response);
			this.templateCache_[paramHash] = response;
			this.setState("ready");
		} else this.setState("error");
	}
	/**
	* @private
	* @param {Event} event Event.
	*/
	handleInitError_(event) {
		this.setState("error");
	}
	/**
	* Apply the new tile urls returned by carto db
	* @param {CartoDBLayerInfo} data Result of carto db call.
	* @private
	*/
	applyTemplate_(data) {
		const tilesUrl = "https://" + data.cdn_url.https + "/" + this.account_ + "/api/v1/map/" + data.layergroupid + "/{z}/{x}/{y}.png";
		this.setUrl(tilesUrl);
	}
};
//#endregion
//#region node_modules/ol/source/Cluster.js
/**
* @module ol/source/Cluster
*/
/**
* @template {import("../Feature.js").FeatureLike} [FeatureType=import("../Feature.js").FeatureLike]
* @typedef {(feature: FeatureType) => (Point|null)} GeometryFunction
*/
/**
* @template {import("../Feature.js").FeatureLike} [FeatureType=import("../Feature.js").default]
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {number} [distance=20] Distance in pixels within which features will
* be clustered together.
* @property {number} [minDistance=0] Minimum distance in pixels between clusters.
* Will be capped at the configured distance.
* By default no minimum distance is guaranteed. This config can be used to avoid
* overlapping icons. As a tradoff, the cluster feature's position will no longer be
* the center of all its features.
* @property {GeometryFunction<FeatureType>} [geometryFunction]
* Function that takes a {@link module:ol/Feature~Feature} as argument and returns a
* {@link module:ol/geom/Point~Point} as cluster calculation point for the feature. When a
* feature should not be considered for clustering, the function should return
* `null`. The default, which works when the underlying source contains point
* features only, is
* ```js
* function(feature) {
*   return feature.getGeometry();
* }
* ```
* See {@link module:ol/geom/Polygon~Polygon#getInteriorPoint} for a way to get a cluster
* calculation point for polygons.
* @property {function(Point, Array<FeatureType>):Feature} [createCluster]
* Function that takes the cluster's center {@link module:ol/geom/Point~Point} and an array
* of {@link module:ol/Feature~Feature} included in this cluster. Must return a
* {@link module:ol/Feature~Feature} that will be used to render. Default implementation is:
* ```js
* function(point, features) {
*   return new Feature({
*     geometry: point,
*     features: features
*   });
* }
* ```
* @property {VectorSource<FeatureType>} [source=null] Source.
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
*/
/**
* @classdesc
* Layer source to cluster vector data. Works out of the box with point
* geometries. For other geometry types, or if not all geometries should be
* considered for clustering, a custom `geometryFunction` can be defined.
*
* If the instance is disposed without also disposing the underlying
* source `setSource(null)` has to be called to remove the listener reference
* from the wrapped source.
* @api
* @template {import('../Feature.js').FeatureLike} [FeatureType=import('../Feature.js').default]
* @extends {VectorSource<Feature<import("../geom/Geometry.js").default>>}
*/
var Cluster = class extends VectorSource {
	/**
	* @param {Options<FeatureType>} [options] Cluster options.
	*/
	constructor(options) {
		options = options || {};
		super({
			attributions: options.attributions,
			wrapX: options.wrapX
		});
		/**
		* @type {number|undefined}
		* @protected
		*/
		this.resolution = void 0;
		/**
		* @type {number}
		* @protected
		*/
		this.distance = options.distance !== void 0 ? options.distance : 20;
		/**
		* @type {number}
		* @protected
		*/
		this.minDistance = options.minDistance || 0;
		/**
		* @type {number}
		* @protected
		*/
		this.interpolationRatio = 0;
		/**
		* @type {Array<Feature>}
		* @protected
		*/
		this.features = [];
		/**
		* @type {GeometryFunction<import("../Feature.js").FeatureLike>}
		* @protected
		*/
		this.geometryFunction = options.geometryFunction || function(feature) {
			const geometry = feature.getGeometry();
			assert(!geometry || geometry.getType() === "Point", "The default `geometryFunction` can only handle `Point` or null geometries");
			return geometry;
		};
		/**
		* @type {function(Point, Array<FeatureType>):Feature}
		* @private
		*/
		this.createCustomCluster_ = options.createCluster;
		/**
		* @type {VectorSource<FeatureType>|null}
		* @protected
		*/
		this.source = null;
		/**
		* @private
		*/
		this.boundRefresh_ = this.refresh.bind(this);
		this.updateDistance(this.distance, this.minDistance);
		this.setSource(options.source || null);
	}
	/**
	* Remove all features from the source.
	* @param {boolean} [fast] Skip dispatching of {@link module:ol/source/VectorEventType~VectorEventType#removefeature} events.
	* @api
	* @override
	*/
	clear(fast) {
		this.features.length = 0;
		super.clear(fast);
	}
	/**
	* Get the distance in pixels between clusters.
	* @return {number} Distance.
	* @api
	*/
	getDistance() {
		return this.distance;
	}
	/**
	* Get a reference to the wrapped source.
	* @return {VectorSource<FeatureType>|null} Source.
	* @api
	*/
	getSource() {
		return this.source;
	}
	/**
	* @param {import("../extent.js").Extent} extent Extent.
	* @param {number} resolution Resolution.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @override
	*/
	loadFeatures(extent, resolution, projection) {
		this.source?.loadFeatures(extent, resolution, projection);
		if (resolution !== this.resolution) {
			this.resolution = resolution;
			this.refresh();
		}
	}
	/**
	* Set the distance within which features will be clusterd together.
	* @param {number} distance The distance in pixels.
	* @api
	*/
	setDistance(distance) {
		this.updateDistance(distance, this.minDistance);
	}
	/**
	* Set the minimum distance between clusters. Will be capped at the
	* configured distance.
	* @param {number} minDistance The minimum distance in pixels.
	* @api
	*/
	setMinDistance(minDistance) {
		this.updateDistance(this.distance, minDistance);
	}
	/**
	* The configured minimum distance between clusters.
	* @return {number} The minimum distance in pixels.
	* @api
	*/
	getMinDistance() {
		return this.minDistance;
	}
	/**
	* Replace the wrapped source.
	* @param {VectorSource<FeatureType>|null} source The new source for this instance.
	* @api
	*/
	setSource(source) {
		if (this.source) this.source.removeEventListener(EventType_default.CHANGE, this.boundRefresh_);
		this.source = source;
		if (source) source.addEventListener(EventType_default.CHANGE, this.boundRefresh_);
		this.refresh();
	}
	/**
	* Handle the source changing.
	* @override
	*/
	refresh() {
		this.clear();
		this.cluster();
		this.addFeatures(this.features);
	}
	/**
	* Update the distances and refresh the source if necessary.
	* @param {number} distance The new distance.
	* @param {number} minDistance The new minimum distance.
	*/
	updateDistance(distance, minDistance) {
		const ratio = distance === 0 ? 0 : Math.min(minDistance, distance) / distance;
		const changed = distance !== this.distance || this.interpolationRatio !== ratio;
		this.distance = distance;
		this.minDistance = minDistance;
		this.interpolationRatio = ratio;
		if (changed) this.refresh();
	}
	/**
	* @protected
	*/
	cluster() {
		if (this.resolution === void 0 || !this.source) return;
		const extent = createEmpty();
		const mapDistance = this.distance * this.resolution;
		const features = this.source.getFeatures();
		/** @type {Object<string, true>} */
		const clustered = {};
		for (let i = 0, ii = features.length; i < ii; i++) {
			const feature = features[i];
			if (!(getUid(feature) in clustered)) {
				const geometry = this.geometryFunction(feature);
				if (geometry) {
					createOrUpdateFromCoordinate(geometry.getCoordinates(), extent);
					buffer$1(extent, mapDistance, extent);
					const neighbors = this.source.getFeaturesInExtent(extent).filter(function(neighbor) {
						const uid = getUid(neighbor);
						if (uid in clustered) return false;
						clustered[uid] = true;
						return true;
					});
					this.features.push(this.createCluster(neighbors, extent));
				}
			}
		}
	}
	/**
	* @param {Array<FeatureType>} features Features
	* @param {import("../extent.js").Extent} extent The searched extent for these features.
	* @return {Feature} The cluster feature.
	* @protected
	*/
	createCluster(features, extent) {
		const centroid = [0, 0];
		for (let i = features.length - 1; i >= 0; --i) {
			const geometry = this.geometryFunction(features[i]);
			if (geometry) add(centroid, geometry.getCoordinates());
			else features.splice(i, 1);
		}
		scale$2(centroid, 1 / features.length);
		const searchCenter = getCenter(extent);
		const ratio = this.interpolationRatio;
		const geometry = new Point([centroid[0] * (1 - ratio) + searchCenter[0] * ratio, centroid[1] * (1 - ratio) + searchCenter[1] * ratio]);
		if (this.createCustomCluster_) return this.createCustomCluster_(geometry, features);
		return new Feature({
			geometry,
			features
		});
	}
};
//#endregion
//#region node_modules/ol/vec/mat4.js
/**
* @module ol/vec/mat4
*/
/** @typedef {Array<number>} Mat4 */
/**
* @return {Mat4} "4x4 matrix representing a 3D identity transform."
*/
function create() {
	return [
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1
	];
}
/**
* Generates a orthogonal projection matrix with the given bounds
*
* @param {number} left Left bound of the frustum
* @param {number} right Right bound of the frustum
* @param {number} bottom Bottom bound of the frustum
* @param {number} top Top bound of the frustum
* @param {number} near Near bound of the frustum
* @param {number} far Far bound of the frustum
* @param {Mat4} [out] mat4 frustum matrix will be written into
* @return {Mat4} out
*/
function orthographic(left, right, bottom, top, near, far, out) {
	out = out ?? create();
	const lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
	out[0] = -2 * lr;
	out[1] = 0;
	out[2] = 0;
	out[3] = 0;
	out[4] = 0;
	out[5] = -2 * bt;
	out[6] = 0;
	out[7] = 0;
	out[8] = 0;
	out[9] = 0;
	out[10] = 2 * nf;
	out[11] = 0;
	out[12] = (left + right) * lr;
	out[13] = (top + bottom) * bt;
	out[14] = (far + near) * nf;
	out[15] = 1;
	return out;
}
/**
* Scales the mat4 by the dimensions in the given vec3
*
* @param {Mat4} m The matrix to scale.
* @param {number} x How much to scale in the x direction.
* @param {number} y How much to scale in the y direction.
* @param {number} z How much to scale in the z direction.
* @param {Mat4} [out] The matrix to write to.
* @return {Mat4} out
*/
function scale(m, x, y, z, out) {
	out = out ?? create();
	out[0] = m[0] * x;
	out[1] = m[1] * x;
	out[2] = m[2] * x;
	out[3] = m[3] * x;
	out[4] = m[4] * y;
	out[5] = m[5] * y;
	out[6] = m[6] * y;
	out[7] = m[7] * y;
	out[8] = m[8] * z;
	out[9] = m[9] * z;
	out[10] = m[10] * z;
	out[11] = m[11] * z;
	out[12] = m[12];
	out[13] = m[13];
	out[14] = m[14];
	out[15] = m[15];
	return out;
}
/**
* Translate a matrix.
*
* @param {Mat4} m the matrix to translate
* @param {number} x How much to translate in the x direction.
* @param {number} y How much to translate in the y direction.
* @param {number} z How much to translate in the z direction.
* @param {Mat4} [out] the receiving matrix
* @return {Mat4} out
*/
function translate(m, x, y, z, out) {
	out = out ?? create();
	let a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
	if (m === out) {
		out[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
		out[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
		out[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
		out[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
	} else {
		a00 = m[0];
		a01 = m[1];
		a02 = m[2];
		a03 = m[3];
		a10 = m[4];
		a11 = m[5];
		a12 = m[6];
		a13 = m[7];
		a20 = m[8];
		a21 = m[9];
		a22 = m[10];
		a23 = m[11];
		out[0] = a00;
		out[1] = a01;
		out[2] = a02;
		out[3] = a03;
		out[4] = a10;
		out[5] = a11;
		out[6] = a12;
		out[7] = a13;
		out[8] = a20;
		out[9] = a21;
		out[10] = a22;
		out[11] = a23;
		out[12] = a00 * x + a10 * y + a20 * z + m[12];
		out[13] = a01 * x + a11 * y + a21 * z + m[13];
		out[14] = a02 * x + a12 * y + a22 * z + m[14];
		out[15] = a03 * x + a13 * y + a23 * z + m[15];
	}
	return out;
}
/**
* @param {number} x x translation.
* @param {number} y y translation.
* @param {number} z z translation.
* @param {Mat4} [out] optional matrix to store result
* @return {Mat4} out
*/
function translation(x, y, z, out) {
	out = out ?? create();
	out[0] = 1;
	out[1] = 0;
	out[2] = 0;
	out[3] = 0;
	out[4] = 0;
	out[5] = 1;
	out[6] = 0;
	out[7] = 0;
	out[8] = 0;
	out[9] = 0;
	out[10] = 1;
	out[11] = 0;
	out[12] = x;
	out[13] = y;
	out[14] = z;
	out[15] = 1;
	return out;
}
//#endregion
//#region node_modules/ol/webgl/Canvas.js
/**
* @module ol/webgl/Canvas
*/
var VERTEX_SHADER = `
  attribute vec4 a_position;
  attribute vec4 a_texcoord;

  uniform mat4 u_matrix;
  uniform mat4 u_textureMatrix;

  varying vec2 v_texcoord;

  void main() {
    gl_Position = u_matrix * a_position;
    vec2 texcoord = (u_textureMatrix * a_texcoord).xy;
    v_texcoord = texcoord;
  }
`;
var FRAGMENT_SHADER = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;

  void main() {
    if (
      v_texcoord.x < 0.0 ||
      v_texcoord.y < 0.0 ||
      v_texcoord.x > 1.0 ||
      v_texcoord.y > 1.0
    ) {
      discard;
    }
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;
/** @typedef {import("../transform.js").Transform} Matrix */
/**
* Canvas-like operations implemented in webgl.
*/
var Canvas = class {
	/**
	* @param {WebGLRenderingContext} gl Context to render in.
	*/
	constructor(gl) {
		/**
		* @private
		* @type {WebGLRenderingContext}
		*/
		this.gl_ = gl;
		/**
		* @private
		* @type {WebGLProgram}
		*/
		this.program_ = createProgram(gl, FRAGMENT_SHADER, VERTEX_SHADER);
		this.positionLocation = gl.getAttribLocation(this.program_, "a_position");
		this.texcoordLocation = gl.getAttribLocation(this.program_, "a_texcoord");
		this.matrixLocation = gl.getUniformLocation(this.program_, "u_matrix");
		this.textureMatrixLocation = gl.getUniformLocation(this.program_, "u_textureMatrix");
		this.textureLocation = gl.getUniformLocation(this.program_, "u_texture");
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		this.positions = [
			0,
			0,
			0,
			1,
			1,
			0,
			1,
			0,
			0,
			1,
			1,
			1
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
		this.texcoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
		this.texcoords = [
			0,
			0,
			0,
			1,
			1,
			0,
			1,
			0,
			0,
			1,
			1,
			1
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.STATIC_DRAW);
	}
	/**
	* 2dContext drawImage call implemented in webgl.
	* Unlike images, textures do not have a width and height associated
	* with them so we'll pass in the width and height of the texture.
	*
	* @param {WebGLTexture} tex Image to draw.
	* @param {number} texWidth Image width.
	* @param {number} texHeight Image height.
	* @param {number} srcX Top-left x-point to read src image.
	* @param {number} srcY Top-left y-point to read src image.
	* @param {number} [srcWidth] Width of source to read.
	* @param {number} [srcHeight] Height of source to read.
	* @param {number} [dstX] Top-left x-point of destination.
	* @param {number} [dstY] Top-left y-point of destination.
	* @param {number} [dstWidth] Width of written image in destination.
	* @param {number} [dstHeight] Height of written image in destination.
	* @param {number} [width] Width of canvas.
	* @param {number} [height] Height of canvas.
	*/
	drawImage(tex, texWidth, texHeight, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, width, height) {
		const gl = this.gl_;
		if (dstX === void 0) dstX = srcX;
		if (dstY === void 0) dstY = srcY;
		if (srcWidth === void 0) srcWidth = texWidth;
		if (srcHeight === void 0) srcHeight = texHeight;
		if (dstWidth === void 0) dstWidth = srcWidth;
		if (dstHeight === void 0) dstHeight = srcHeight;
		if (width === void 0) width = gl.canvas.width;
		if (height === void 0) height = gl.canvas.height;
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.useProgram(this.program_);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.enableVertexAttribArray(this.positionLocation);
		gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
		gl.enableVertexAttribArray(this.texcoordLocation);
		gl.vertexAttribPointer(this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);
		let matrix = orthographic(0, width, 0, height, -1, 1);
		matrix = translate(matrix, dstX, dstY, 0);
		matrix = scale(matrix, dstWidth, dstHeight, 1);
		gl.uniformMatrix4fv(this.matrixLocation, false, matrix);
		let texMatrix = translation(srcX / texWidth, srcY / texHeight, 0);
		texMatrix = scale(texMatrix, srcWidth / texWidth, srcHeight / texHeight, 1);
		gl.uniformMatrix4fv(this.textureMatrixLocation, false, texMatrix);
		gl.uniform1i(this.textureLocation, 0);
		gl.drawArrays(gl.TRIANGLES, 0, this.positions.length / 2);
	}
};
/**
* @param {WebGLRenderingContext} gl Rendering Context.
* @param {GLenum} type Type of shader.
* @param {string} source source of shader.
* @return {WebGLShader} [progam] The program.
*/
function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	if (shader === null) throw new Error("Shader compilation failed");
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const log = gl.getShaderInfoLog(shader);
		if (log === null) throw new Error("Shader info log creation failed");
		throw new Error(log);
	}
	return shader;
}
/**
* @param {WebGLRenderingContext} gl Rendering Context.
* @param {string} fragmentSource Fragment shader source.
* @param {string} vertexSource Vertex shader source.
* @return {WebGLProgram} [progam] The program.
*/
function createProgram(gl, fragmentSource, vertexSource) {
	const program = gl.createProgram();
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
	if (program === null) throw new Error("Program creation failed");
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		if (gl.getProgramInfoLog(program) === null) throw new Error("Program info log creation failed");
		throw new Error();
	}
	return program;
}
//#endregion
//#region node_modules/ol/reproj/glreproj.js
/**
* @module ol/reproj/glreproj
*/
var EDGE_VERTEX_SHADER = `
  attribute vec4 a_position;

  uniform mat4 u_matrix;

  void main() {
     gl_Position = u_matrix * a_position;
  }
`;
var EDGE_FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec4 u_val;
  void main() {
     gl_FragColor = u_val;
  }
`;
var TRIANGLE_VERTEX_SHADER = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;

  varying vec2 v_texcoord;

  uniform mat4 u_matrix;

  void main() {
     gl_Position = u_matrix * a_position;
     v_texcoord = a_texcoord;
  }
`;
var TRIANGLE_FRAGMENT_SHADER = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;

  void main() {
    if (v_texcoord.x < 0.0 || v_texcoord.x > 1.0 || v_texcoord.y < 0.0 || v_texcoord.y > 1.0) {
      discard;
    }
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`;
/**
* Create an html canvas element and returns its webgl context.
* @param {number} [width] Canvas width.
* @param {number} [height] Canvas height.
* @param {Array<HTMLCanvasElement | OffscreenCanvas>} [canvasPool] Canvas pool to take existing canvas from.
* @param {WebGLContextAttributes} [settings] CanvasRenderingContext2DSettings
* @return {WebGLRenderingContext} The context.
*/
function createCanvasContextWebGL(width, height, canvasPool, settings) {
	/** @type {HTMLCanvasElement|OffscreenCanvas} */
	let canvas;
	if (canvasPool && canvasPool.length) canvas = canvasPool.shift();
	else if (WORKER_OFFSCREEN_CANVAS) canvas = new OffscreenCanvas(width || 300, height || 300);
	else canvas = document.createElement("canvas");
	if (width) canvas.width = width;
	if (height) canvas.height = height;
	return canvas.getContext("webgl", settings);
}
/**
* Releases canvas memory to avoid exceeding memory limits in Safari.
* See https://pqina.nl/blog/total-canvas-memory-use-exceeds-the-maximum-limit/
* @param {WebGLRenderingContext} gl Context.
*/
function releaseGLCanvas(gl) {
	const canvas = gl.canvas;
	canvas.width = 1;
	canvas.height = 1;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
}
/**
* @type {Array<HTMLCanvasElement | OffscreenCanvas>}
*/
var canvasGLPool = [];
/**
* @typedef {Object} ImageExtent
* @property {import("../extent.js").Extent} extent Extent.
* @property {import("../extent.js").Extent} [clipExtent] Clip extent.
* @property {WebGLTexture} texture Texture.
* @property {number} width Width of texture.
* @property {number} height Height of texture.
*/
/**
* Renders the source data into new canvas based on the triangulation.
*
* @param {WebGLRenderingContext} gl the context to render in.
* @param {number} width_ Width of the canvas.
* @param {number} height_ Height of the canvas.
* @param {number} pixelRatio Pixel ratio.
* @param {number} sourceResolution Source resolution.
* @param {number} targetResolution Target resolution.
* @param {import("../extent.js").Extent} targetExtent Target extent (tile).
* @param {import("../reproj/Triangulation.js").default} triangulation Calculated triangulation.
* @param {Array<ImageExtent>} sources Array of sources.
* @param {number} gutter Gutter of the sources.
* @param {number} dataType What kind of data is the textures, must be gl.FLOAT or gl.UNSIGNED_BYTE
* TODO: Allow setting renderEdges value in the data as this is done in "data-space".
* @param {boolean | Array<number>} [renderEdges] Render reprojection edges.
* @param {boolean} [interpolate] Use linear interpolation when resampling.
* @param {boolean} [drawSingle] Draw single source images directly without stitchTexture.
* @return {{framebuffer: WebGLFramebuffer, width: number, height: number, texture: WebGLTexture}} Canvas with reprojected data.
*/
function render(gl, width_, height_, pixelRatio, sourceResolution, targetResolution, targetExtent, triangulation, sources, gutter, dataType, renderEdges, interpolate, drawSingle) {
	const width = Math.round(pixelRatio * width_);
	const height = Math.round(pixelRatio * height_);
	gl.canvas.width = width;
	gl.canvas.height = height;
	/** @type {WebGLFramebuffer | null} */
	let resultFrameBuffer;
	/** @type {WebGLTexture | null} */
	let resultTexture;
	resultTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, resultTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	if (interpolate) {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	}
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, dataType, null);
	resultFrameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, resultFrameBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, resultTexture, 0);
	if (resultFrameBuffer === null) throw new Error("Could not create framebuffer");
	if (resultTexture === null) throw new Error("Could not create texture");
	if (sources.length === 0) return {
		width,
		height,
		framebuffer: resultFrameBuffer,
		texture: resultTexture
	};
	const sourceDataExtent = createEmpty();
	sources.forEach(function(src, i, arr) {
		extend(sourceDataExtent, src.extent);
	});
	/** @type {WebGLTexture | null} */
	let stitchTexture;
	/** @type {number} */
	let stitchWidth;
	/** @type {number} */
	let stitchHeight;
	const stitchScale = 1 / sourceResolution;
	if (!drawSingle || sources.length !== 1 || gutter !== 0) {
		stitchTexture = gl.createTexture();
		if (resultTexture === null) throw new Error("Could not create texture");
		stitchWidth = Math.round(getWidth(sourceDataExtent) * stitchScale);
		stitchHeight = Math.round(getHeight(sourceDataExtent) * stitchScale);
		const maxTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
		const largeSide = Math.max(stitchWidth, stitchHeight);
		const scaleFactor = largeSide > maxTexSize ? maxTexSize / largeSide : 1;
		const stitchWidthFixed = Math.round(stitchWidth * scaleFactor);
		const stitchHeightFixed = Math.round(stitchHeight * scaleFactor);
		gl.bindTexture(gl.TEXTURE_2D, stitchTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		if (interpolate) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		}
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, stitchWidthFixed, stitchHeightFixed, 0, gl.RGBA, dataType, null);
		const fb = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, stitchTexture, 0);
		const webGLCanvas = new Canvas(gl);
		sources.forEach(function(src, i, arr) {
			const xPos = (src.extent[0] - sourceDataExtent[0]) * stitchScale * scaleFactor;
			const yPos = -(src.extent[3] - sourceDataExtent[3]) * stitchScale * scaleFactor;
			const srcWidth = getWidth(src.extent) * stitchScale * scaleFactor;
			const srcHeight = getHeight(src.extent) * stitchScale * scaleFactor;
			gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
			gl.viewport(0, 0, stitchWidthFixed, stitchHeightFixed);
			if (src.clipExtent) {
				const xPos = (src.clipExtent[0] - sourceDataExtent[0]) * stitchScale * scaleFactor;
				const yPos = -(src.clipExtent[3] - sourceDataExtent[3]) * stitchScale * scaleFactor;
				const width = getWidth(src.clipExtent) * stitchScale * scaleFactor;
				const height = getHeight(src.clipExtent) * stitchScale * scaleFactor;
				gl.enable(gl.SCISSOR_TEST);
				gl.scissor(interpolate ? xPos : Math.round(xPos), interpolate ? yPos : Math.round(yPos), interpolate ? width : Math.round(xPos + width) - Math.round(xPos), interpolate ? height : Math.round(yPos + height) - Math.round(yPos));
			}
			webGLCanvas.drawImage(src.texture, src.width, src.height, gutter, gutter, src.width - 2 * gutter, src.height - 2 * gutter, interpolate ? xPos : Math.round(xPos), interpolate ? yPos : Math.round(yPos), interpolate ? srcWidth : Math.round(xPos + srcWidth) - Math.round(xPos), interpolate ? srcHeight : Math.round(yPos + srcHeight) - Math.round(yPos), stitchWidthFixed, stitchHeightFixed);
			gl.disable(gl.SCISSOR_TEST);
		});
		gl.deleteFramebuffer(fb);
	} else {
		stitchTexture = sources[0].texture;
		stitchWidth = sources[0].width;
		stitchHeight = sources[0].width;
	}
	const targetTopLeft = getTopLeft(targetExtent);
	const sourceTopLeft = getTopLeft(sourceDataExtent);
	const getUVs = (target) => {
		const u0 = (target[0][0] - targetTopLeft[0]) / targetResolution * pixelRatio;
		const v0 = -(target[0][1] - targetTopLeft[1]) / targetResolution * pixelRatio;
		return {
			u1: (target[1][0] - targetTopLeft[0]) / targetResolution * pixelRatio,
			v1: -(target[1][1] - targetTopLeft[1]) / targetResolution * pixelRatio,
			u0,
			v0,
			u2: (target[2][0] - targetTopLeft[0]) / targetResolution * pixelRatio,
			v2: -(target[2][1] - targetTopLeft[1]) / targetResolution * pixelRatio
		};
	};
	gl.bindFramebuffer(gl.FRAMEBUFFER, resultFrameBuffer);
	gl.viewport(0, 0, width, height);
	{
		/** @type {Array<number>} */
		const vertices = [];
		/** @type {Array<number>} */
		const texcoords = [];
		const triProgram = createProgram(gl, TRIANGLE_FRAGMENT_SHADER, TRIANGLE_VERTEX_SHADER);
		gl.useProgram(triProgram);
		const textureLocation = gl.getUniformLocation(triProgram, "u_texture");
		gl.bindTexture(gl.TEXTURE_2D, stitchTexture);
		gl.uniform1i(textureLocation, 0);
		triangulation.getTriangles().forEach(function(triangle, i, arr) {
			const source = triangle.source;
			const target = triangle.target;
			const { u1, v1, u0, v0, u2, v2 } = getUVs(target);
			const su0 = (source[0][0] - sourceTopLeft[0]) / sourceResolution / stitchWidth;
			const sv0 = -(source[0][1] - sourceTopLeft[1]) / sourceResolution / stitchHeight;
			const su1 = (source[1][0] - sourceTopLeft[0]) / sourceResolution / stitchWidth;
			const sv1 = -(source[1][1] - sourceTopLeft[1]) / sourceResolution / stitchHeight;
			const su2 = (source[2][0] - sourceTopLeft[0]) / sourceResolution / stitchWidth;
			const sv2 = -(source[2][1] - sourceTopLeft[1]) / sourceResolution / stitchHeight;
			vertices.push(u1, v1, u0, v0, u2, v2);
			texcoords.push(su1, sv1, su0, sv0, su2, sv2);
		});
		const matrix = orthographic(0, width, height, 0, -1, 1);
		const matrixLocation = gl.getUniformLocation(triProgram, "u_matrix");
		gl.uniformMatrix4fv(matrixLocation, false, matrix);
		const positionLocation = gl.getAttribLocation(triProgram, "a_position");
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(positionLocation);
		const texcoordLocation = gl.getAttribLocation(triProgram, "a_texcoord");
		const texcoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
		gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(texcoordLocation);
		gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
	}
	if (renderEdges) {
		const edgeProgram = createProgram(gl, EDGE_FRAGMENT_SHADER, EDGE_VERTEX_SHADER);
		gl.useProgram(edgeProgram);
		const matrix = orthographic(0, width, height, 0, -1, 1);
		const matrixLocation = gl.getUniformLocation(edgeProgram, "u_matrix");
		gl.uniformMatrix4fv(matrixLocation, false, matrix);
		const burnval = Array.isArray(renderEdges) ? renderEdges : [
			0,
			0,
			0,
			255
		];
		const burnvalLocation = gl.getUniformLocation(edgeProgram, "u_val");
		gl.uniform4fv(burnvalLocation, burnval);
		const positionLocation = gl.getAttribLocation(edgeProgram, "a_position");
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(positionLocation);
		/** @type {Array<number>} */
		const lines = triangulation.getTriangles().reduce(function(lines, triangle) {
			const target = triangle.target;
			const { u1, v1, u0, v0, u2, v2 } = getUVs(target);
			return lines.concat([
				u1,
				v1,
				u0,
				v0,
				u0,
				v0,
				u2,
				v2,
				u2,
				v2,
				u1,
				v1
			]);
		}, []);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
		gl.drawArrays(gl.LINES, 0, lines.length / 2);
	}
	return {
		width,
		height,
		framebuffer: resultFrameBuffer,
		texture: resultTexture
	};
}
//#endregion
//#region node_modules/ol/reproj/DataTile.js
/**
* @module ol/reproj/DataTile
*/
/**
* @typedef {function(number, number, number, number) : import("../DataTile.js").default} TileGetter
*/
/**
* @typedef {Object} TileOffset
* @property {DataTile} tile Tile.
* @property {number} offset Offset.
*/
/**
* @typedef {Object} Options
* @property {import("../proj/Projection.js").default} sourceProj Source projection.
* @property {import("../tilegrid/TileGrid.js").default} sourceTileGrid Source tile grid.
* @property {import("../proj/Projection.js").default} targetProj Target projection.
* @property {import("../tilegrid/TileGrid.js").default} targetTileGrid Target tile grid.
* @property {import("../tilecoord.js").TileCoord} tileCoord Coordinate of the tile.
* @property {import("../tilecoord.js").TileCoord} [wrappedTileCoord] Coordinate of the tile wrapped in X.
* @property {number} pixelRatio Pixel ratio.
* @property {number} gutter Gutter of the source tiles.
* @property {TileGetter} getTileFunction Function returning source tiles (z, x, y, pixelRatio).
* @property {boolean} [interpolate=false] Use interpolated values when resampling.  By default,
* the nearest neighbor is used when resampling.
* @property {number} [errorThreshold] Acceptable reprojection error (in px).
* @property {number} [transition=250] A duration for tile opacity
* transitions in milliseconds. A duration of 0 disables the opacity transition.
* @property {import("../transform.js").Transform} [transformMatrix] Source transform matrix.
* @property {boolean} [renderEdges] Render reprojection edges.
*/
/**
* @classdesc
* Class encapsulating single reprojected data tile.
* See {@link module:ol/source/DataTile~DataTileSource}.
*
*/
var ReprojDataTile = class extends DataTile {
	/**
	* @param {Options} options Tile options.
	*/
	constructor(options) {
		super({
			tileCoord: options.tileCoord,
			loader: () => Promise.resolve(new Uint8ClampedArray(4)),
			interpolate: options.interpolate,
			transition: options.transition
		});
		/**
		* @private
		* @type {boolean | Array<number>}
		*/
		this.renderEdges_ = options.renderEdges !== void 0 ? options.renderEdges : false;
		/**
		* @private
		* @type {number}
		*/
		this.pixelRatio_ = options.pixelRatio;
		/**
		* @private
		* @type {number}
		*/
		this.gutter_ = options.gutter;
		/**
		* @type {import("../DataTile.js").Data}
		* @private
		*/
		this.reprojData_ = null;
		/**
		* @type {Error}
		* @private
		*/
		this.reprojError_ = null;
		/**
		* @type {import('../size.js').Size}
		* @private
		*/
		this.reprojSize_ = void 0;
		/**
		* @private
		* @type {import("../tilegrid/TileGrid.js").default}
		*/
		this.sourceTileGrid_ = options.sourceTileGrid;
		/**
		* @private
		* @type {import("../tilegrid/TileGrid.js").default}
		*/
		this.targetTileGrid_ = options.targetTileGrid;
		/**
		* @private
		* @type {import("../tilecoord.js").TileCoord}
		*/
		this.wrappedTileCoord_ = options.wrappedTileCoord || options.tileCoord;
		/**
		* @private
		* @type {!Array<TileOffset>}
		*/
		this.sourceTiles_ = [];
		/**
		* @private
		* @type {?Array<import("../events.js").EventsKey>}
		*/
		this.sourcesListenerKeys_ = null;
		/**
		* @private
		* @type {number}
		*/
		this.sourceZ_ = 0;
		const sourceProj = options.sourceProj;
		const sourceProjExtent = sourceProj.getExtent();
		const sourceTileGridExtent = options.sourceTileGrid.getExtent();
		/**
		* @private
		* @type {import("../extent.js").Extent}
		*/
		this.clipExtent_ = sourceProj.canWrapX() ? sourceTileGridExtent ? getIntersection(sourceProjExtent, sourceTileGridExtent) : sourceProjExtent : sourceTileGridExtent;
		const targetExtent = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);
		const maxTargetExtent = this.targetTileGrid_.getExtent();
		let maxSourceExtent = this.sourceTileGrid_.getExtent();
		const limitedTargetExtent = maxTargetExtent ? getIntersection(targetExtent, maxTargetExtent) : targetExtent;
		if (getArea(limitedTargetExtent) === 0) {
			this.state = TileState_default.EMPTY;
			return;
		}
		if (sourceProjExtent) if (!maxSourceExtent) maxSourceExtent = sourceProjExtent;
		else maxSourceExtent = getIntersection(maxSourceExtent, sourceProjExtent);
		const targetResolution = this.targetTileGrid_.getResolution(this.wrappedTileCoord_[0]);
		const targetProj = options.targetProj;
		const sourceResolution = calculateSourceExtentResolution(sourceProj, targetProj, limitedTargetExtent, targetResolution);
		if (!isFinite(sourceResolution) || sourceResolution <= 0) {
			this.state = TileState_default.EMPTY;
			return;
		}
		const errorThresholdInPixels = options.errorThreshold !== void 0 ? options.errorThreshold : ERROR_THRESHOLD;
		/**
		* @private
		* @type {!import("./Triangulation.js").default}
		*/
		this.triangulation_ = new Triangulation(sourceProj, targetProj, limitedTargetExtent, maxSourceExtent, sourceResolution * errorThresholdInPixels, targetResolution, options.transformMatrix);
		if (this.triangulation_.getTriangles().length === 0) {
			this.state = TileState_default.EMPTY;
			return;
		}
		this.sourceZ_ = this.sourceTileGrid_.getZForResolution(sourceResolution);
		let sourceExtent = this.triangulation_.calculateSourceExtent();
		if (maxSourceExtent) if (sourceProj.canWrapX()) {
			sourceExtent[1] = clamp(sourceExtent[1], maxSourceExtent[1], maxSourceExtent[3]);
			sourceExtent[3] = clamp(sourceExtent[3], maxSourceExtent[1], maxSourceExtent[3]);
		} else sourceExtent = getIntersection(sourceExtent, maxSourceExtent);
		if (!getArea(sourceExtent)) this.state = TileState_default.EMPTY;
		else {
			let worldWidth = 0;
			let worldsAway = 0;
			if (sourceProj.canWrapX()) {
				worldWidth = getWidth(sourceProjExtent);
				worldsAway = Math.floor((sourceExtent[0] - sourceProjExtent[0]) / worldWidth);
			}
			wrapAndSliceX(sourceExtent.slice(), sourceProj, true).forEach((extent) => {
				const sourceRange = this.sourceTileGrid_.getTileRangeForExtentAndZ(extent, this.sourceZ_);
				const getTile = options.getTileFunction;
				for (let srcX = sourceRange.minX; srcX <= sourceRange.maxX; srcX++) for (let srcY = sourceRange.minY; srcY <= sourceRange.maxY; srcY++) {
					const tile = getTile(this.sourceZ_, srcX, srcY, this.pixelRatio_);
					if (tile) {
						const offset = worldsAway * worldWidth;
						this.sourceTiles_.push({
							tile,
							offset
						});
					}
				}
				++worldsAway;
			});
			if (this.sourceTiles_.length === 0) this.state = TileState_default.EMPTY;
		}
	}
	/**
	* Get the tile size.
	* @return {import('../size.js').Size} Tile size.
	* @override
	*/
	getSize() {
		return this.reprojSize_;
	}
	/**
	* Get the data for the tile.
	* @return {import("../DataTile.js").Data} Tile data.
	* @override
	*/
	getData() {
		return this.reprojData_;
	}
	/**
	* Get any loading error.
	* @return {Error} Loading error.
	* @override
	*/
	getError() {
		return this.reprojError_;
	}
	/**
	* @private
	*/
	reproject_() {
		const dataSources = [];
		let imageLike = false;
		this.sourceTiles_.forEach((source) => {
			const tile = source.tile;
			if (!tile || tile.getState() !== TileState_default.LOADED) return;
			const size = tile.getSize();
			const gutter = this.gutter_;
			/**
			* @type {import("../DataTile.js").ArrayLike}
			*/
			let tileData;
			const arrayData = asArrayLike(tile.getData());
			if (arrayData) tileData = arrayData;
			else {
				imageLike = true;
				tileData = toArray(asImageLike(tile.getData()));
			}
			const pixelSize = [size[0] + 2 * gutter, size[1] + 2 * gutter];
			const isFloat = tileData instanceof Float32Array;
			const pixelCount = pixelSize[0] * pixelSize[1];
			const DataType = isFloat ? Float32Array : Uint8ClampedArray;
			const tileDataR = new DataType(tileData.buffer);
			const bytesPerElement = DataType.BYTES_PER_ELEMENT;
			const bytesPerPixel = bytesPerElement * tileDataR.length / pixelCount;
			const bytesPerRow = tileDataR.byteLength / pixelSize[1];
			const bandCount = Math.floor(bytesPerRow / bytesPerElement / pixelSize[0]);
			const extent = this.sourceTileGrid_.getTileCoordExtent(tile.tileCoord);
			extent[0] += source.offset;
			extent[2] += source.offset;
			const clipExtent = this.clipExtent_?.slice();
			if (clipExtent) {
				clipExtent[0] += source.offset;
				clipExtent[2] += source.offset;
			}
			dataSources.push({
				extent,
				clipExtent,
				data: tileDataR,
				dataType: DataType,
				bytesPerPixel,
				pixelSize,
				bandCount
			});
		});
		this.sourceTiles_.length = 0;
		if (dataSources.length === 0) {
			this.state = TileState_default.ERROR;
			this.changed();
			return;
		}
		const z = this.wrappedTileCoord_[0];
		const size = this.targetTileGrid_.getTileSize(z);
		const targetWidth = typeof size === "number" ? size : size[0];
		const targetHeight = typeof size === "number" ? size : size[1];
		const outWidth = targetWidth * this.pixelRatio_;
		const outHeight = targetHeight * this.pixelRatio_;
		const targetResolution = this.targetTileGrid_.getResolution(z);
		const sourceResolution = this.sourceTileGrid_.getResolution(this.sourceZ_);
		const targetExtent = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);
		const bandCount = dataSources[0].bandCount;
		const dataR = new dataSources[0].dataType(bandCount * outWidth * outHeight);
		const gl = createCanvasContextWebGL(outWidth, outHeight, canvasGLPool, {
			premultipliedAlpha: false,
			antialias: false
		});
		let willInterpolate;
		const format = gl.RGBA;
		let textureType;
		if (dataSources[0].dataType == Float32Array) {
			textureType = gl.FLOAT;
			gl.getExtension("WEBGL_color_buffer_float");
			gl.getExtension("OES_texture_float");
			gl.getExtension("EXT_float_blend");
			willInterpolate = gl.getExtension("OES_texture_float_linear") !== null && this.interpolate;
		} else {
			textureType = gl.UNSIGNED_BYTE;
			willInterpolate = this.interpolate;
		}
		const BANDS_PR_REPROJ = 4;
		const reprojs = Math.ceil(bandCount / BANDS_PR_REPROJ);
		for (let reproj = reprojs - 1; reproj >= 0; --reproj) {
			const sources = [];
			for (let i = 0, len = dataSources.length; i < len; ++i) {
				const dataSource = dataSources[i];
				const pixelSize = dataSource.pixelSize;
				const width = pixelSize[0];
				const height = pixelSize[1];
				const data = new dataSource.dataType(BANDS_PR_REPROJ * width * height);
				const dataS = dataSource.data;
				let offset = reproj * BANDS_PR_REPROJ;
				for (let j = 0, len = data.length; j < len; j += BANDS_PR_REPROJ) {
					data[j] = dataS[offset];
					data[j + 1] = dataS[offset + 1];
					data[j + 2] = dataS[offset + 2];
					data[j + 3] = dataS[offset + 3];
					offset += bandCount;
				}
				const texture = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, texture);
				if (willInterpolate) {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				} else {
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				}
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, textureType, data);
				sources.push({
					extent: dataSource.extent,
					clipExtent: dataSource.clipExtent,
					texture,
					width,
					height
				});
			}
			const { framebuffer, width, height } = render(gl, targetWidth, targetHeight, this.pixelRatio_, sourceResolution, targetResolution, targetExtent, this.triangulation_, sources, this.gutter_, textureType, this.renderEdges_, willInterpolate);
			const rows = width;
			const cols = height * BANDS_PR_REPROJ;
			const data = new dataSources[0].dataType(rows * cols);
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
			gl.readPixels(0, 0, width, height, gl.RGBA, textureType, data);
			let offset = reproj * BANDS_PR_REPROJ;
			for (let i = 0, len = data.length; i < len; i += BANDS_PR_REPROJ) {
				const flipY = (rows - 1 - (i / cols | 0)) * cols + i % cols;
				dataR[offset] = data[flipY];
				dataR[offset + 1] = data[flipY + 1];
				dataR[offset + 2] = data[flipY + 2];
				dataR[offset + 3] = data[flipY + 3];
				offset += bandCount;
			}
		}
		releaseGLCanvas(gl);
		canvasGLPool.push(gl.canvas);
		if (imageLike) {
			const context = createCanvasContext2D(targetWidth, targetHeight);
			const imageData = new ImageData(dataR, targetWidth);
			context.putImageData(imageData, 0, 0);
			this.reprojData_ = context.canvas;
		} else this.reprojData_ = dataR;
		this.reprojSize_ = [Math.round(outWidth), Math.round(outHeight)];
		this.state = TileState_default.LOADED;
		this.changed();
	}
	/**
	* Load not yet loaded URI.
	* @override
	*/
	load() {
		if (this.state !== TileState_default.IDLE && this.state !== TileState_default.ERROR) return;
		this.state = TileState_default.LOADING;
		this.changed();
		let leftToLoad = 0;
		this.sourcesListenerKeys_ = [];
		this.sourceTiles_.forEach(({ tile }) => {
			const state = tile.getState();
			if (state !== TileState_default.IDLE && state !== TileState_default.LOADING) return;
			leftToLoad++;
			const sourceListenKey = listen(tile, EventType_default.CHANGE, () => {
				const state = tile.getState();
				if (state == TileState_default.LOADED || state == TileState_default.ERROR || state == TileState_default.EMPTY) {
					unlistenByKey(sourceListenKey);
					leftToLoad--;
					if (leftToLoad === 0) {
						this.unlistenSources_();
						this.reproject_();
					}
				}
			});
			this.sourcesListenerKeys_.push(sourceListenKey);
		});
		if (leftToLoad === 0) setTimeout(this.reproject_.bind(this), 0);
		else this.sourceTiles_.forEach(function({ tile }) {
			if (tile.getState() == TileState_default.IDLE) tile.load();
		});
	}
	/**
	* @private
	*/
	unlistenSources_() {
		this.sourcesListenerKeys_.forEach(unlistenByKey);
		this.sourcesListenerKeys_ = null;
	}
};
//#endregion
//#region node_modules/ol/source/DataTile.js
/**
* @module ol/source/DataTile
*/
/**
* @typedef {'anonymous'|'use-credentials'} CrossOriginAttribute
*/
/**
* @typedef {Object} LoaderOptions
* @property {AbortSignal} signal An abort controller signal.
* @property {CrossOriginAttribute} [crossOrigin] The cross-origin attribute for images.
* @property {number} [maxY] The maximum y coordinate at the given z level.  Will be undefined if the
* underlying tile grid does not have a known extent.
*/
/**
* Data tile loading function.  The function is called with z, x, and y tile coordinates and
* returns {@link import("../DataTile.js").Data data} for a tile or a promise for the same.
* @typedef {function(number, number, number, LoaderOptions) : (import("../DataTile.js").Data|Promise<import("../DataTile.js").Data>)} Loader
*/
/**
* @typedef {Object} Options
* @property {Loader} [loader] Data loader.  Called with z, x, and y tile coordinates.
* Returns {@link import("../DataTile.js").Data data} for a tile or a promise for the same.
* For loaders that generate images, the promise should not resolve until the image is loaded.
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
* @property {number} [maxZoom=42] Optional max zoom level. Not used if `tileGrid` is provided.
* @property {number} [minZoom=0] Optional min zoom level. Not used if `tileGrid` is provided.
* @property {number|import("../size.js").Size} [tileSize=[256, 256]] The pixel width and height of the source tiles.
* This may be different than the rendered pixel size if a `tileGrid` is provided.
* @property {number} [gutter=0] The size in pixels of the gutter around data tiles to ignore.
* This allows artifacts of rendering at tile edges to be ignored.
* Supported data should be wider and taller than the tile size by a value of `2 x gutter`.
* @property {number} [maxResolution] Optional tile grid resolution at level zero. Not used if `tileGrid` is provided.
* @property {import("../proj.js").ProjectionLike} [projection='EPSG:3857'] Tile projection.
* @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid.
* @property {import("./Source.js").State} [state] The source state.
* @property {boolean} [wrapX=false] Render tiles beyond the antimeridian.
* @property {number} [transition] Transition time when fading in new tiles (in milliseconds).
* @property {number} [bandCount=4] Number of bands represented in the data.
* @property {boolean} [interpolate=false] Use interpolated values when resampling.  By default,
* the nearest neighbor is used when resampling.
* @property {CrossOriginAttribute} [crossOrigin='anonymous'] The crossOrigin property to pass to loaders for image data.
* @property {string} [key] Key for use in caching tiles.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
/**
* @classdesc
* A source for typed array data tiles.
*
* @fires import("./Tile.js").TileSourceEvent
* @template {import("../Tile.js").default} [TileType=DataTile]
* @extends TileSource<TileType>
* @api
*/
var DataTileSource = class extends TileSource {
	/**
	* @param {Options} options DataTile source options.
	*/
	constructor(options) {
		const projection = options.projection === void 0 ? "EPSG:3857" : options.projection;
		let tileGrid = options.tileGrid;
		if (tileGrid === void 0 && projection) tileGrid = createXYZ({
			extent: extentFromProjection(projection),
			maxResolution: options.maxResolution,
			maxZoom: options.maxZoom,
			minZoom: options.minZoom,
			tileSize: options.tileSize
		});
		super({
			cacheSize: .1,
			attributions: options.attributions,
			attributionsCollapsible: options.attributionsCollapsible,
			projection,
			tileGrid,
			state: options.state,
			wrapX: options.wrapX,
			transition: options.transition,
			interpolate: options.interpolate,
			key: options.key,
			zDirection: options.zDirection
		});
		/**
		* @private
		* @type {number}
		*/
		this.gutter_ = options.gutter !== void 0 ? options.gutter : 0;
		/**
		* @private
		* @type {import('../size.js').Size|null}
		*/
		this.tileSize_ = options.tileSize ? toSize(options.tileSize) : null;
		/**
		* @private
		* @type {Array<import('../size.js').Size>|null}
		*/
		this.tileSizes_ = null;
		/**
		* @private
		* @type {!Object<string, boolean>}
		*/
		this.tileLoadingKeys_ = {};
		/**
		* @private
		*/
		this.loader_ = options.loader;
		/**
		* @private
		*/
		this.handleTileChange_ = this.handleTileChange_.bind(this);
		/**
		* @type {number}
		*/
		this.bandCount = options.bandCount === void 0 ? 4 : options.bandCount;
		/**
		* @private
		* @type {!Object<string, import("../tilegrid/TileGrid.js").default>}
		*/
		this.tileGridForProjection_ = {};
		/**
		* @private
		* @type {CrossOriginAttribute}
		*/
		this.crossOrigin_ = options.crossOrigin || "anonymous";
		/**
		* @type {import("../transform.js").Transform|null}
		*/
		this.transformMatrix = null;
	}
	/**
	* Set the source tile sizes.  The length of the array is expected to match the number of
	* levels in the tile grid.
	* @protected
	* @param {Array<import('../size.js').Size>} tileSizes An array of tile sizes.
	*/
	setTileSizes(tileSizes) {
		this.tileSizes_ = tileSizes;
	}
	/**
	* Get the source tile size at the given zoom level.  This may be different than the rendered tile
	* size.
	* @protected
	* @param {number} z Tile zoom level.
	* @return {import('../size.js').Size} The source tile size.
	*/
	getTileSize(z) {
		if (this.tileSizes_) return this.tileSizes_[z];
		if (this.tileSize_) return this.tileSize_;
		const tileGrid = this.getTileGrid();
		return tileGrid ? toSize(tileGrid.getTileSize(z)) : [256, 256];
	}
	/**
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {number} Gutter.
	* @override
	*/
	getGutterForProjection(projection) {
		const thisProj = this.getProjection();
		if ((!thisProj || equivalent(thisProj, projection)) && !this.transformMatrix) return this.gutter_;
		return 0;
	}
	/**
	* @param {Loader} loader The data loader.
	* @protected
	*/
	setLoader(loader) {
		this.loader_ = loader;
	}
	/**
	* @param {number} z Tile coordinate z.
	* @param {number} x Tile coordinate x.
	* @param {number} y Tile coordinate y.
	* @param {import("../proj/Projection.js").default} targetProj The output projection.
	* @param {import("../proj/Projection.js").default} sourceProj The input projection.
	* @return {!TileType} Tile.
	*/
	getReprojTile_(z, x, y, targetProj, sourceProj) {
		const sourceTileGrid = this.tileGrid || this.getTileGridForProjection(sourceProj || targetProj);
		const reprojTilePixelRatio = Math.max.apply(null, sourceTileGrid.getResolutions().map((r, z) => {
			const tileSize = toSize(sourceTileGrid.getTileSize(z));
			const textureSize = this.getTileSize(z);
			return Math.max(textureSize[0] / tileSize[0], textureSize[1] / tileSize[1]);
		}));
		const targetTileGrid = this.getTileGridForProjection(targetProj);
		const tileCoord = [
			z,
			x,
			y
		];
		const wrappedTileCoord = this.getTileCoordForTileUrlFunction(tileCoord, targetProj);
		const tile = new ReprojDataTile(Object.assign({
			sourceProj: sourceProj || targetProj,
			sourceTileGrid,
			targetProj,
			targetTileGrid,
			tileCoord,
			wrappedTileCoord,
			pixelRatio: reprojTilePixelRatio,
			gutter: this.gutter_,
			getTileFunction: (z, x, y, pixelRatio) => this.getTile(z, x, y, pixelRatio),
			transformMatrix: this.transformMatrix
		}, this.tileOptions));
		tile.key = this.getKey();
		return tile;
	}
	/**
	* @param {number} z Tile coordinate z.
	* @param {number} x Tile coordinate x.
	* @param {number} y Tile coordinate y.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} [projection] Projection.
	* @return {TileType|null} Tile (or null if outside source extent).
	* @override
	*/
	getTile(z, x, y, pixelRatio, projection) {
		const sourceProjection = this.getProjection();
		if (projection && (sourceProjection && !equivalent(sourceProjection, projection) || this.transformMatrix)) return this.getReprojTile_(z, x, y, projection, sourceProjection);
		const size = this.getTileSize(z);
		const sourceLoader = this.loader_;
		const controller = new AbortController();
		/**
		* @type {LoaderOptions}
		*/
		const loaderOptions = {
			signal: controller.signal,
			crossOrigin: this.crossOrigin_
		};
		const tileCoord = this.getTileCoordForTileUrlFunction([
			z,
			x,
			y
		]);
		if (!tileCoord) return null;
		const requestZ = tileCoord[0];
		const requestX = tileCoord[1];
		const requestY = tileCoord[2];
		const range = this.getTileGrid()?.getFullTileRange(requestZ);
		if (range) loaderOptions.maxY = range.getHeight() - 1;
		function loader() {
			return toPromise(function() {
				return sourceLoader(requestZ, requestX, requestY, loaderOptions);
			});
		}
		const tile = new DataTile(Object.assign({
			tileCoord: [
				z,
				x,
				y
			],
			loader,
			size,
			controller
		}, this.tileOptions));
		tile.key = this.getKey();
		tile.addEventListener(EventType_default.CHANGE, this.handleTileChange_);
		return tile;
	}
	/**
	* Handle tile change events.
	* @param {import("../events/Event.js").default} event Event.
	*/
	handleTileChange_(event) {
		const tile = event.target;
		const uid = getUid(tile);
		const tileState = tile.getState();
		let type;
		if (tileState == TileState_default.LOADING) {
			this.tileLoadingKeys_[uid] = true;
			type = TileEventType_default.TILELOADSTART;
		} else if (uid in this.tileLoadingKeys_) {
			delete this.tileLoadingKeys_[uid];
			type = tileState == TileState_default.ERROR ? TileEventType_default.TILELOADERROR : tileState == TileState_default.LOADED ? TileEventType_default.TILELOADEND : void 0;
		}
		if (type) this.dispatchEvent(new TileSourceEvent(type, tile));
	}
	/**
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
	* @override
	*/
	getTileGridForProjection(projection) {
		const thisProj = this.getProjection();
		if (this.tileGrid && (!thisProj || equivalent(thisProj, projection)) && !this.transformMatrix) return this.tileGrid;
		const projKey = getUid(projection);
		if (!(projKey in this.tileGridForProjection_)) this.tileGridForProjection_[projKey] = getForProjection(projection);
		return this.tileGridForProjection_[projKey];
	}
	/**
	* Sets the tile grid to use when reprojecting the tiles to the given
	* projection instead of the default tile grid for the projection.
	*
	* This can be useful when the default tile grid cannot be created
	* (e.g. projection has no extent defined) or
	* for optimization reasons (custom tile size, resolutions, ...).
	*
	* @param {import("../proj.js").ProjectionLike} projection Projection.
	* @param {import("../tilegrid/TileGrid.js").default} tilegrid Tile grid to use for the projection.
	* @api
	*/
	setTileGridForProjection(projection, tilegrid) {
		const proj = get(projection);
		if (proj) {
			const projKey = getUid(proj);
			if (!(projKey in this.tileGridForProjection_)) this.tileGridForProjection_[projKey] = tilegrid;
		}
	}
};
//#endregion
//#region node_modules/@petamoriken/float16/src/_util/primordials.mjs
/** @type {<T extends (...args: any) => any>(target: T) => (thisArg: ThisType<T>, ...args: any[]) => any} */
function uncurryThis(target) {
	return (thisArg, ...args) => {
		return ReflectApply(target, thisArg, args);
	};
}
/** @type {(target: any, key: string | symbol) => (thisArg: any, ...args: any[]) => any} */
function uncurryThisGetter(target, key) {
	return uncurryThis(ReflectGetOwnPropertyDescriptor(target, key).get);
}
var { apply: ReflectApply, construct: ReflectConstruct, defineProperty: ReflectDefineProperty, get: ReflectGet, getOwnPropertyDescriptor: ReflectGetOwnPropertyDescriptor, getPrototypeOf: ReflectGetPrototypeOf, has: ReflectHas, ownKeys: ReflectOwnKeys, set: ReflectSet, setPrototypeOf: ReflectSetPrototypeOf } = Reflect;
var { EPSILON, MAX_SAFE_INTEGER, isFinite: NumberIsFinite, isNaN: NumberIsNaN } = Number;
var { iterator: SymbolIterator, species: SymbolSpecies, toStringTag: SymbolToStringTag, for: SymbolFor } = Symbol;
var NativeObject = Object;
var { create: ObjectCreate, defineProperty: ObjectDefineProperty, freeze: ObjectFreeze, is: ObjectIs } = NativeObject;
var ObjectPrototype = NativeObject.prototype;
ObjectPrototype.__lookupGetter__ && uncurryThis(
	/** @type {any} */
	ObjectPrototype.__lookupGetter__
);
NativeObject.hasOwn || uncurryThis(ObjectPrototype.hasOwnProperty);
var NativeArray = Array;
NativeArray.isArray;
var ArrayPrototype = NativeArray.prototype;
uncurryThis(ArrayPrototype.join);
uncurryThis(ArrayPrototype.push);
uncurryThis(ArrayPrototype.toLocaleString);
var NativeArrayPrototypeSymbolIterator = ArrayPrototype[SymbolIterator];
/** @type {<T>(array: T[]) => IterableIterator<T>} */
var ArrayPrototypeSymbolIterator = uncurryThis(NativeArrayPrototypeSymbolIterator);
var { abs: MathAbs, trunc: MathTrunc } = Math;
var NativeArrayBuffer = ArrayBuffer;
NativeArrayBuffer.isView;
var ArrayBufferPrototype = NativeArrayBuffer.prototype;
uncurryThis(ArrayBufferPrototype.slice);
uncurryThisGetter(ArrayBufferPrototype, "byteLength");
var NativeSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : null;
NativeSharedArrayBuffer && uncurryThisGetter(NativeSharedArrayBuffer.prototype, "byteLength");
/** @typedef {Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array} TypedArray */
/** @type {any} */
var TypedArray = ReflectGetPrototypeOf(Uint8Array);
TypedArray.from;
var TypedArrayPrototype = TypedArray.prototype;
TypedArrayPrototype[SymbolIterator];
uncurryThis(TypedArrayPrototype.keys);
uncurryThis(TypedArrayPrototype.values);
uncurryThis(TypedArrayPrototype.entries);
uncurryThis(TypedArrayPrototype.set);
uncurryThis(TypedArrayPrototype.reverse);
uncurryThis(TypedArrayPrototype.fill);
uncurryThis(TypedArrayPrototype.copyWithin);
uncurryThis(TypedArrayPrototype.sort);
uncurryThis(TypedArrayPrototype.slice);
uncurryThis(TypedArrayPrototype.subarray);
uncurryThisGetter(TypedArrayPrototype, "buffer");
uncurryThisGetter(TypedArrayPrototype, "byteOffset");
uncurryThisGetter(TypedArrayPrototype, "length");
uncurryThisGetter(TypedArrayPrototype, SymbolToStringTag);
var NativeUint8Array = Uint8Array;
var NativeUint16Array = Uint16Array;
var NativeUint32Array = Uint32Array;
var NativeFloat32Array = Float32Array;
/** @type {any} */
var ArrayIteratorPrototype = ReflectGetPrototypeOf([][SymbolIterator]());
/** @type {<T>(arrayIterator: IterableIterator<T>) => IteratorResult<T>} */
var ArrayIteratorPrototypeNext = uncurryThis(ArrayIteratorPrototype.next);
/** @type {<T = unknown, TReturn = any, TNext = unknown>(generator: Generator<T, TReturn, TNext>, value?: TNext) => T} */
var GeneratorPrototypeNext = uncurryThis((function* () {})().next);
var IteratorPrototype = ReflectGetPrototypeOf(ArrayIteratorPrototype);
var DataViewPrototype = DataView.prototype;
/** @type {(dataView: DataView, byteOffset: number, littleEndian?: boolean) => number} */
var DataViewPrototypeGetUint16 = uncurryThis(DataViewPrototype.getUint16);
uncurryThis(DataViewPrototype.setUint16);
var WeakSetPrototype = WeakSet.prototype;
uncurryThis(WeakSetPrototype.add);
uncurryThis(WeakSetPrototype.has);
/**
* Do not construct with arguments to avoid calling the "set" method
* @type {{new <K extends {}, V>(): WeakMap<K, V>}}
*/
var NativeWeakMap = WeakMap;
var WeakMapPrototype = NativeWeakMap.prototype;
/** @type {<K extends {}, V>(weakMap: WeakMap<K, V>, key: K) => V} */
var WeakMapPrototypeGet = uncurryThis(WeakMapPrototype.get);
uncurryThis(WeakMapPrototype.has);
/** @type {<K extends {}, V>(weakMap: WeakMap<K, V>, key: K, value: V) => WeakMap} */
var WeakMapPrototypeSet = uncurryThis(WeakMapPrototype.set);
//#endregion
//#region node_modules/@petamoriken/float16/src/_util/arrayIterator.mjs
/** @type {WeakMap<{}, IterableIterator<any>>} */
var arrayIterators = new NativeWeakMap();
var SafeIteratorPrototype = ObjectCreate(null, {
	next: { value: function next() {
		return ArrayIteratorPrototypeNext(WeakMapPrototypeGet(arrayIterators, this));
	} },
	[SymbolIterator]: { value: function values() {
		return this;
	} }
});
/**
* Wrap the Array around the SafeIterator If Array.prototype [@@iterator] has been modified
* @type {<T>(array: T[]) => Iterable<T>}
*/
function safeIfNeeded(array) {
	if (array[SymbolIterator] === NativeArrayPrototypeSymbolIterator && ArrayIteratorPrototype.next === ArrayIteratorPrototypeNext) return array;
	const safe = ObjectCreate(SafeIteratorPrototype);
	WeakMapPrototypeSet(arrayIterators, safe, ArrayPrototypeSymbolIterator(array));
	return safe;
}
/** @type {WeakMap<{}, Generator<any>>} */
var generators = new NativeWeakMap();
/** @see https://tc39.es/ecma262/#sec-%arrayiteratorprototype%-object */
var DummyArrayIteratorPrototype = ObjectCreate(IteratorPrototype, { next: {
	value: function next() {
		return GeneratorPrototypeNext(WeakMapPrototypeGet(generators, this));
	},
	writable: true,
	configurable: true
} });
for (const key of ReflectOwnKeys(ArrayIteratorPrototype)) {
	if (key === "next") continue;
	ObjectDefineProperty(DummyArrayIteratorPrototype, key, ReflectGetOwnPropertyDescriptor(ArrayIteratorPrototype, key));
}
//#endregion
//#region node_modules/@petamoriken/float16/src/_util/converter.mjs
var INVERSE_OF_EPSILON = 1 / EPSILON;
var FLOAT16_MIN_VALUE = 6103515625e-14;
var FLOAT16_EPSILON = .0009765625;
FLOAT16_EPSILON * FLOAT16_MIN_VALUE;
FLOAT16_EPSILON * INVERSE_OF_EPSILON;
var buffer = new NativeArrayBuffer(4);
var floatView = new NativeFloat32Array(buffer);
var uint32View = new NativeUint32Array(buffer);
var baseTable = new NativeUint16Array(512);
var shiftTable = new NativeUint8Array(512);
for (let i = 0; i < 256; ++i) {
	const e = i - 127;
	if (e < -24) {
		baseTable[i] = 0;
		baseTable[i | 256] = 32768;
		shiftTable[i] = 24;
		shiftTable[i | 256] = 24;
	} else if (e < -14) {
		baseTable[i] = 1024 >> -e - 14;
		baseTable[i | 256] = 1024 >> -e - 14 | 32768;
		shiftTable[i] = -e - 1;
		shiftTable[i | 256] = -e - 1;
	} else if (e <= 15) {
		baseTable[i] = e + 15 << 10;
		baseTable[i | 256] = e + 15 << 10 | 32768;
		shiftTable[i] = 13;
		shiftTable[i | 256] = 13;
	} else if (e < 128) {
		baseTable[i] = 31744;
		baseTable[i | 256] = 64512;
		shiftTable[i] = 24;
		shiftTable[i | 256] = 24;
	} else {
		baseTable[i] = 31744;
		baseTable[i | 256] = 64512;
		shiftTable[i] = 13;
		shiftTable[i | 256] = 13;
	}
}
var mantissaTable = new NativeUint32Array(2048);
for (let i = 1; i < 1024; ++i) {
	let m = i << 13;
	let e = 0;
	while ((m & 8388608) === 0) {
		m <<= 1;
		e -= 8388608;
	}
	m &= -8388609;
	e += 947912704;
	mantissaTable[i] = m | e;
}
for (let i = 1024; i < 2048; ++i) mantissaTable[i] = 939524096 + (i - 1024 << 13);
var exponentTable = new NativeUint32Array(64);
for (let i = 1; i < 31; ++i) exponentTable[i] = i << 23;
exponentTable[31] = 1199570944;
exponentTable[32] = 2147483648;
for (let i = 33; i < 63; ++i) exponentTable[i] = 2147483648 + (i - 32 << 23);
exponentTable[63] = 3347054592;
var offsetTable = new NativeUint16Array(64);
for (let i = 1; i < 64; ++i) if (i !== 32) offsetTable[i] = 1024;
/**
* convert a half float number bits to a number
* @param {number} float16bits - half float number bits
* @returns {number} double float
*/
function convertToNumber(float16bits) {
	const i = float16bits >> 10;
	uint32View[0] = mantissaTable[offsetTable[i] + (float16bits & 1023)] + exponentTable[i];
	return floatView[0];
}
//#endregion
//#region node_modules/@petamoriken/float16/src/DataView.mjs
/**
* returns an unsigned 16-bit float at the specified byte offset from the start of the DataView
* @param {DataView} dataView
* @param {number} byteOffset
* @param {[boolean]} opts
* @returns {number}
*/
function getFloat16(dataView, byteOffset, ...opts) {
	return convertToNumber(DataViewPrototypeGetUint16(dataView, byteOffset, ...safeIfNeeded(opts)));
}
//#endregion
//#region node_modules/xml-utils/get-attribute.js
var require_get_attribute = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function getAttribute(tag, attributeName, options) {
		const debug = options && options.debug || false;
		if (debug) console.log("[xml-utils] getting " + attributeName + " in " + tag);
		const xml = typeof tag === "object" ? tag.outer : tag;
		const opening = xml.slice(0, xml.indexOf(">") + 1);
		const quotechars = ["\"", "'"];
		for (let i = 0; i < quotechars.length; i++) {
			const char = quotechars[i];
			const pattern = attributeName + "\\=" + char + "([^" + char + "]*)" + char;
			if (debug) console.log("[xml-utils] pattern:", pattern);
			const match = new RegExp(pattern).exec(opening);
			if (debug) console.log("[xml-utils] match:", match);
			if (match) return match[1];
		}
	}
	module.exports = getAttribute;
	module.exports.default = getAttribute;
}));
//#endregion
//#region node_modules/xml-utils/index-of-match.js
var require_index_of_match = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function indexOfMatch(xml, pattern, startIndex) {
		const match = new RegExp(pattern).exec(xml.slice(startIndex));
		if (match) return startIndex + match.index;
		else return -1;
	}
	module.exports = indexOfMatch;
	module.exports.default = indexOfMatch;
}));
//#endregion
//#region node_modules/xml-utils/index-of-match-end.js
var require_index_of_match_end = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function indexOfMatchEnd(xml, pattern, startIndex) {
		const match = new RegExp(pattern).exec(xml.slice(startIndex));
		if (match) return startIndex + match.index + match[0].length - 1;
		else return -1;
	}
	module.exports = indexOfMatchEnd;
	module.exports.default = indexOfMatchEnd;
}));
//#endregion
//#region node_modules/xml-utils/count-substring.js
var require_count_substring = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function countSubstring(string, substring) {
		const pattern = new RegExp(substring, "g");
		const match = string.match(pattern);
		return match ? match.length : 0;
	}
	module.exports = countSubstring;
	module.exports.default = countSubstring;
}));
//#endregion
//#region node_modules/xml-utils/find-tag-by-name.js
var require_find_tag_by_name = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var indexOfMatch = require_index_of_match();
	var indexOfMatchEnd = require_index_of_match_end();
	var countSubstring = require_count_substring();
	function findTagByName(xml, tagName, options) {
		const debug = options && options.debug || false;
		const startIndex = options && options.startIndex || 0;
		if (debug) console.log("[xml-utils] starting findTagByName with", tagName, " and ", options);
		const start = indexOfMatch(xml, `\<${tagName}[ \n\>\/]`, startIndex);
		if (debug) console.log("[xml-utils] start:", start);
		if (start === -1) return void 0;
		const afterStart = xml.slice(start + tagName.length);
		let relativeEnd = indexOfMatchEnd(afterStart, "^[^<]*[ /]>", 0);
		const selfClosing = relativeEnd !== -1 && afterStart[relativeEnd - 1] === "/";
		if (debug) console.log("[xml-utils] selfClosing:", selfClosing);
		if (selfClosing === false) {
			let startIndex = 0;
			let openings = 1;
			let closings = 0;
			while ((relativeEnd = indexOfMatchEnd(afterStart, "[ /]" + tagName + ">", startIndex)) !== -1) {
				const clip = afterStart.substring(startIndex, relativeEnd + 1);
				openings += countSubstring(clip, "<" + tagName + "[ \n	>]");
				closings += countSubstring(clip, "</" + tagName + ">");
				if (closings >= openings) break;
				startIndex = relativeEnd;
			}
		}
		const end = start + tagName.length + relativeEnd + 1;
		if (debug) console.log("[xml-utils] end:", end);
		if (end === -1) return void 0;
		const outer = xml.slice(start, end);
		let inner;
		if (selfClosing) inner = null;
		else inner = outer.slice(outer.indexOf(">") + 1, outer.lastIndexOf("<"));
		return {
			inner,
			outer,
			start,
			end
		};
	}
	module.exports = findTagByName;
	module.exports.default = findTagByName;
}));
//#endregion
//#region node_modules/geotiff/dist-module/rgb.js
var import_find_tags_by_name = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var findTagByName = require_find_tag_by_name();
	function findTagsByName(xml, tagName, options) {
		const tags = [];
		const debug = options && options.debug || false;
		const nested = options && typeof options.nested === "boolean" ? options.nested : true;
		let startIndex = options && options.startIndex || 0;
		let tag;
		while (tag = findTagByName(xml, tagName, {
			debug,
			startIndex
		})) {
			if (nested) startIndex = tag.start + 1 + tagName.length;
			else startIndex = tag.end;
			tags.push(tag);
		}
		if (debug) console.log("findTagsByName found", tags.length, "tags");
		return tags;
	}
	module.exports = findTagsByName;
	module.exports.default = findTagsByName;
})))(), 1);
var import_get_attribute = /* @__PURE__ */ __toESM(require_get_attribute(), 1);
function fromWhiteIsZero(raster, max) {
	const { width, height } = raster;
	const rgbRaster = new Uint8Array(width * height * 3);
	let value;
	for (let i = 0, j = 0; i < raster.length; ++i, j += 3) {
		value = 256 - raster[i] / max * 256;
		rgbRaster[j] = value;
		rgbRaster[j + 1] = value;
		rgbRaster[j + 2] = value;
	}
	return rgbRaster;
}
function fromBlackIsZero(raster, max) {
	const { width, height } = raster;
	const rgbRaster = new Uint8Array(width * height * 3);
	let value;
	for (let i = 0, j = 0; i < raster.length; ++i, j += 3) {
		value = raster[i] / max * 256;
		rgbRaster[j] = value;
		rgbRaster[j + 1] = value;
		rgbRaster[j + 2] = value;
	}
	return rgbRaster;
}
function fromPalette(raster, colorMap) {
	const { width, height } = raster;
	const rgbRaster = new Uint8Array(width * height * 3);
	const greenOffset = colorMap.length / 3;
	const blueOffset = colorMap.length / 3 * 2;
	for (let i = 0, j = 0; i < raster.length; ++i, j += 3) {
		const mapIndex = raster[i];
		rgbRaster[j] = colorMap[mapIndex] / 65536 * 256;
		rgbRaster[j + 1] = colorMap[mapIndex + greenOffset] / 65536 * 256;
		rgbRaster[j + 2] = colorMap[mapIndex + blueOffset] / 65536 * 256;
	}
	return rgbRaster;
}
function fromCMYK(cmykRaster) {
	const { width, height } = cmykRaster;
	const rgbRaster = new Uint8Array(width * height * 3);
	for (let i = 0, j = 0; i < cmykRaster.length; i += 4, j += 3) {
		const c = cmykRaster[i];
		const m = cmykRaster[i + 1];
		const y = cmykRaster[i + 2];
		const k = cmykRaster[i + 3];
		rgbRaster[j] = 255 * ((255 - c) / 256) * ((255 - k) / 256);
		rgbRaster[j + 1] = 255 * ((255 - m) / 256) * ((255 - k) / 256);
		rgbRaster[j + 2] = 255 * ((255 - y) / 256) * ((255 - k) / 256);
	}
	return rgbRaster;
}
function fromYCbCr(yCbCrRaster) {
	const { width, height } = yCbCrRaster;
	const rgbRaster = new Uint8ClampedArray(width * height * 3);
	for (let i = 0, j = 0; i < yCbCrRaster.length; i += 3, j += 3) {
		const y = yCbCrRaster[i];
		const cb = yCbCrRaster[i + 1];
		const cr = yCbCrRaster[i + 2];
		rgbRaster[j] = y + 1.402 * (cr - 128);
		rgbRaster[j + 1] = y - .34414 * (cb - 128) - .71414 * (cr - 128);
		rgbRaster[j + 2] = y + 1.772 * (cb - 128);
	}
	return rgbRaster;
}
var Xn = .95047;
var Yn = 1;
var Zn = 1.08883;
function fromCIELab(cieLabRaster) {
	const { width, height } = cieLabRaster;
	const rgbRaster = new Uint8Array(width * height * 3);
	for (let i = 0, j = 0; i < cieLabRaster.length; i += 3, j += 3) {
		const L = cieLabRaster[i + 0];
		const a_ = cieLabRaster[i + 1] << 24 >> 24;
		const b_ = cieLabRaster[i + 2] << 24 >> 24;
		let y = (L + 16) / 116;
		let x = a_ / 500 + y;
		let z = y - b_ / 200;
		let r;
		let g;
		let b;
		x = Xn * (x * x * x > .008856 ? x * x * x : (x - 16 / 116) / 7.787);
		y = Yn * (y * y * y > .008856 ? y * y * y : (y - 16 / 116) / 7.787);
		z = Zn * (z * z * z > .008856 ? z * z * z : (z - 16 / 116) / 7.787);
		r = x * 3.2406 + y * -1.5372 + z * -.4986;
		g = x * -.9689 + y * 1.8758 + z * .0415;
		b = x * .0557 + y * -.204 + z * 1.057;
		r = r > .0031308 ? 1.055 * r ** (1 / 2.4) - .055 : 12.92 * r;
		g = g > .0031308 ? 1.055 * g ** (1 / 2.4) - .055 : 12.92 * g;
		b = b > .0031308 ? 1.055 * b ** (1 / 2.4) - .055 : 12.92 * b;
		rgbRaster[j] = Math.max(0, Math.min(1, r)) * 255;
		rgbRaster[j + 1] = Math.max(0, Math.min(1, g)) * 255;
		rgbRaster[j + 2] = Math.max(0, Math.min(1, b)) * 255;
	}
	return rgbRaster;
}
//#endregion
//#region node_modules/geotiff/dist-module/compression/index.js
var registry = /* @__PURE__ */ new Map();
function addDecoder(cases, importFn) {
	if (!Array.isArray(cases)) cases = [cases];
	cases.forEach((c) => registry.set(c, importFn));
}
async function getDecoder(fileDirectory) {
	const importFn = registry.get(fileDirectory.Compression);
	if (!importFn) throw new Error(`Unknown compression method identifier: ${fileDirectory.Compression}`);
	return new (await (importFn()))(fileDirectory);
}
addDecoder([void 0, 1], () => import("./raw-BNzPnVTP.js").then((m) => m.default));
addDecoder(5, () => import("./lzw-D1T738Q8.js").then((m) => m.default));
addDecoder(6, () => {
	throw new Error("old style JPEG compression is not supported.");
});
addDecoder(7, () => import("./jpeg-B_KJXJLL.js").then((m) => m.default));
addDecoder([8, 32946], () => import("./deflate--D88LroD.js").then((m) => m.default));
addDecoder(32773, () => import("./packbits-CHlXLyoD.js").then((m) => m.default));
addDecoder(34887, () => import("./lerc-B_ALGHd8.js").then(async (m) => {
	await m.zstd.init();
	return m;
}).then((m) => m.default));
addDecoder(50001, () => import("./webimage-DwVm1b7j.js").then((m) => m.default));
//#endregion
//#region node_modules/geotiff/dist-module/resample.js
/**
* @module resample
*/
function copyNewSize(array, width, height, samplesPerPixel = 1) {
	return new (Object.getPrototypeOf(array)).constructor(width * height * samplesPerPixel);
}
/**
* Resample the input arrays using nearest neighbor value selection.
* @param {TypedArray[]} valueArrays The input arrays to resample
* @param {number} inWidth The width of the input rasters
* @param {number} inHeight The height of the input rasters
* @param {number} outWidth The desired width of the output rasters
* @param {number} outHeight The desired height of the output rasters
* @returns {TypedArray[]} The resampled rasters
*/
function resampleNearest(valueArrays, inWidth, inHeight, outWidth, outHeight) {
	const relX = inWidth / outWidth;
	const relY = inHeight / outHeight;
	return valueArrays.map((array) => {
		const newArray = copyNewSize(array, outWidth, outHeight);
		for (let y = 0; y < outHeight; ++y) {
			const cy = Math.min(Math.round(relY * y), inHeight - 1);
			for (let x = 0; x < outWidth; ++x) {
				const cx = Math.min(Math.round(relX * x), inWidth - 1);
				const value = array[cy * inWidth + cx];
				newArray[y * outWidth + x] = value;
			}
		}
		return newArray;
	});
}
function lerp(v0, v1, t) {
	return (1 - t) * v0 + t * v1;
}
/**
* Resample the input arrays using bilinear interpolation.
* @param {TypedArray[]} valueArrays The input arrays to resample
* @param {number} inWidth The width of the input rasters
* @param {number} inHeight The height of the input rasters
* @param {number} outWidth The desired width of the output rasters
* @param {number} outHeight The desired height of the output rasters
* @returns {TypedArray[]} The resampled rasters
*/
function resampleBilinear(valueArrays, inWidth, inHeight, outWidth, outHeight) {
	const relX = inWidth / outWidth;
	const relY = inHeight / outHeight;
	return valueArrays.map((array) => {
		const newArray = copyNewSize(array, outWidth, outHeight);
		for (let y = 0; y < outHeight; ++y) {
			const rawY = relY * y;
			const yl = Math.floor(rawY);
			const yh = Math.min(Math.ceil(rawY), inHeight - 1);
			for (let x = 0; x < outWidth; ++x) {
				const rawX = relX * x;
				const tx = rawX % 1;
				const xl = Math.floor(rawX);
				const xh = Math.min(Math.ceil(rawX), inWidth - 1);
				const ll = array[yl * inWidth + xl];
				const hl = array[yl * inWidth + xh];
				const lh = array[yh * inWidth + xl];
				const hh = array[yh * inWidth + xh];
				const value = lerp(lerp(ll, hl, tx), lerp(lh, hh, tx), rawY % 1);
				newArray[y * outWidth + x] = value;
			}
		}
		return newArray;
	});
}
/**
* Resample the input arrays using the selected resampling method.
* @param {TypedArray[]} valueArrays The input arrays to resample
* @param {number} inWidth The width of the input rasters
* @param {number} inHeight The height of the input rasters
* @param {number} outWidth The desired width of the output rasters
* @param {number} outHeight The desired height of the output rasters
* @param {string} [method = 'nearest'] The desired resampling method
* @returns {TypedArray[]} The resampled rasters
*/
function resample(valueArrays, inWidth, inHeight, outWidth, outHeight, method = "nearest") {
	switch (method.toLowerCase()) {
		case "nearest": return resampleNearest(valueArrays, inWidth, inHeight, outWidth, outHeight);
		case "bilinear":
		case "linear": return resampleBilinear(valueArrays, inWidth, inHeight, outWidth, outHeight);
		default: throw new Error(`Unsupported resampling method: '${method}'`);
	}
}
/**
* Resample the pixel interleaved input array using nearest neighbor value selection.
* @param {TypedArray} valueArrays The input arrays to resample
* @param {number} inWidth The width of the input rasters
* @param {number} inHeight The height of the input rasters
* @param {number} outWidth The desired width of the output rasters
* @param {number} outHeight The desired height of the output rasters
* @param {number} samples The number of samples per pixel for pixel
*                         interleaved data
* @returns {TypedArray} The resampled raster
*/
function resampleNearestInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples) {
	const relX = inWidth / outWidth;
	const relY = inHeight / outHeight;
	const newArray = copyNewSize(valueArray, outWidth, outHeight, samples);
	for (let y = 0; y < outHeight; ++y) {
		const cy = Math.min(Math.round(relY * y), inHeight - 1);
		for (let x = 0; x < outWidth; ++x) {
			const cx = Math.min(Math.round(relX * x), inWidth - 1);
			for (let i = 0; i < samples; ++i) {
				const value = valueArray[cy * inWidth * samples + cx * samples + i];
				newArray[y * outWidth * samples + x * samples + i] = value;
			}
		}
	}
	return newArray;
}
/**
* Resample the pixel interleaved input array using bilinear interpolation.
* @param {TypedArray} valueArrays The input arrays to resample
* @param {number} inWidth The width of the input rasters
* @param {number} inHeight The height of the input rasters
* @param {number} outWidth The desired width of the output rasters
* @param {number} outHeight The desired height of the output rasters
* @param {number} samples The number of samples per pixel for pixel
*                         interleaved data
* @returns {TypedArray} The resampled raster
*/
function resampleBilinearInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples) {
	const relX = inWidth / outWidth;
	const relY = inHeight / outHeight;
	const newArray = copyNewSize(valueArray, outWidth, outHeight, samples);
	for (let y = 0; y < outHeight; ++y) {
		const rawY = relY * y;
		const yl = Math.floor(rawY);
		const yh = Math.min(Math.ceil(rawY), inHeight - 1);
		for (let x = 0; x < outWidth; ++x) {
			const rawX = relX * x;
			const tx = rawX % 1;
			const xl = Math.floor(rawX);
			const xh = Math.min(Math.ceil(rawX), inWidth - 1);
			for (let i = 0; i < samples; ++i) {
				const ll = valueArray[yl * inWidth * samples + xl * samples + i];
				const hl = valueArray[yl * inWidth * samples + xh * samples + i];
				const lh = valueArray[yh * inWidth * samples + xl * samples + i];
				const hh = valueArray[yh * inWidth * samples + xh * samples + i];
				const value = lerp(lerp(ll, hl, tx), lerp(lh, hh, tx), rawY % 1);
				newArray[y * outWidth * samples + x * samples + i] = value;
			}
		}
	}
	return newArray;
}
/**
* Resample the pixel interleaved input array using the selected resampling method.
* @param {TypedArray} valueArray The input array to resample
* @param {number} inWidth The width of the input rasters
* @param {number} inHeight The height of the input rasters
* @param {number} outWidth The desired width of the output rasters
* @param {number} outHeight The desired height of the output rasters
* @param {number} samples The number of samples per pixel for pixel
*                                 interleaved data
* @param {string} [method = 'nearest'] The desired resampling method
* @returns {TypedArray} The resampled rasters
*/
function resampleInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples, method = "nearest") {
	switch (method.toLowerCase()) {
		case "nearest": return resampleNearestInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples);
		case "bilinear":
		case "linear": return resampleBilinearInterleaved(valueArray, inWidth, inHeight, outWidth, outHeight, samples);
		default: throw new Error(`Unsupported resampling method: '${method}'`);
	}
}
//#endregion
//#region node_modules/geotiff/dist-module/geotiffimage.js
/** @module geotiffimage */
/**
* @typedef {Object} ReadRasterOptions
* @property {Array<number>} [window=whole window] the subset to read data from in pixels.
* @property {Array<number>} [bbox=whole image] the subset to read data from in
*                                           geographical coordinates.
* @property {Array<number>} [samples=all samples] the selection of samples to read from. Default is all samples.
* @property {boolean} [interleave=false] whether the data shall be read
*                                             in one single array or separate
*                                             arrays.
* @property {Pool} [pool=null] The optional decoder pool to use.
* @property {number} [width] The desired width of the output. When the width is not the
*                                 same as the images, resampling will be performed.
* @property {number} [height] The desired height of the output. When the width is not the
*                                  same as the images, resampling will be performed.
* @property {string} [resampleMethod='nearest'] The desired resampling method.
* @property {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
*                                       to be aborted
* @property {number|number[]} [fillValue] The value to use for parts of the image
*                                              outside of the images extent. When multiple
*                                              samples are requested, an array of fill values
*                                              can be passed.
*/
/** @typedef {import("./geotiff.js").TypedArray} TypedArray */
/** @typedef {import("./geotiff.js").ReadRasterResult} ReadRasterResult */
function sum(array, start, end) {
	let s = 0;
	for (let i = start; i < end; ++i) s += array[i];
	return s;
}
function arrayForType(format, bitsPerSample, size) {
	switch (format) {
		case 1:
			if (bitsPerSample <= 8) return new Uint8Array(size);
			else if (bitsPerSample <= 16) return new Uint16Array(size);
			else if (bitsPerSample <= 32) return new Uint32Array(size);
			break;
		case 2:
			if (bitsPerSample === 8) return new Int8Array(size);
			else if (bitsPerSample === 16) return new Int16Array(size);
			else if (bitsPerSample === 32) return new Int32Array(size);
			break;
		case 3:
			switch (bitsPerSample) {
				case 16:
				case 32: return new Float32Array(size);
				case 64: return new Float64Array(size);
				default: break;
			}
			break;
		default: break;
	}
	throw Error("Unsupported data format/bitsPerSample");
}
function needsNormalization(format, bitsPerSample) {
	if ((format === 1 || format === 2) && bitsPerSample <= 32 && bitsPerSample % 8 === 0) return false;
	else if (format === 3 && (bitsPerSample === 16 || bitsPerSample === 32 || bitsPerSample === 64)) return false;
	return true;
}
function normalizeArray(inBuffer, format, planarConfiguration, samplesPerPixel, bitsPerSample, tileWidth, tileHeight) {
	const view = new DataView(inBuffer);
	const outSize = planarConfiguration === 2 ? tileHeight * tileWidth : tileHeight * tileWidth * samplesPerPixel;
	const samplesToTransfer = planarConfiguration === 2 ? 1 : samplesPerPixel;
	const outArray = arrayForType(format, bitsPerSample, outSize);
	const bitMask = parseInt("1".repeat(bitsPerSample), 2);
	if (format === 1) {
		let pixelBitSkip;
		if (planarConfiguration === 1) pixelBitSkip = samplesPerPixel * bitsPerSample;
		else pixelBitSkip = bitsPerSample;
		let bitsPerLine = tileWidth * pixelBitSkip;
		if ((bitsPerLine & 7) !== 0) bitsPerLine = bitsPerLine + 7 & -8;
		for (let y = 0; y < tileHeight; ++y) {
			const lineBitOffset = y * bitsPerLine;
			for (let x = 0; x < tileWidth; ++x) {
				const pixelBitOffset = lineBitOffset + x * samplesToTransfer * bitsPerSample;
				for (let i = 0; i < samplesToTransfer; ++i) {
					const bitOffset = pixelBitOffset + i * bitsPerSample;
					const outIndex = (y * tileWidth + x) * samplesToTransfer + i;
					const byteOffset = Math.floor(bitOffset / 8);
					const innerBitOffset = bitOffset % 8;
					if (innerBitOffset + bitsPerSample <= 8) outArray[outIndex] = view.getUint8(byteOffset) >> 8 - bitsPerSample - innerBitOffset & bitMask;
					else if (innerBitOffset + bitsPerSample <= 16) outArray[outIndex] = view.getUint16(byteOffset) >> 16 - bitsPerSample - innerBitOffset & bitMask;
					else if (innerBitOffset + bitsPerSample <= 24) outArray[outIndex] = (view.getUint16(byteOffset) << 8 | view.getUint8(byteOffset + 2)) >> 24 - bitsPerSample - innerBitOffset & bitMask;
					else outArray[outIndex] = view.getUint32(byteOffset) >> 32 - bitsPerSample - innerBitOffset & bitMask;
				}
			}
		}
	} else if (format === 3) {}
	return outArray.buffer;
}
/**
* GeoTIFF sub-file image.
*/
var GeoTIFFImage = class {
	/**
	* @constructor
	* @param {Object} fileDirectory The parsed file directory
	* @param {Object} geoKeys The parsed geo-keys
	* @param {DataView} dataView The DataView for the underlying file.
	* @param {Boolean} littleEndian Whether the file is encoded in little or big endian
	* @param {Boolean} cache Whether or not decoded tiles shall be cached
	* @param {import('./source/basesource').BaseSource} source The datasource to read from
	*/
	constructor(fileDirectory, geoKeys, dataView, littleEndian, cache, source) {
		this.fileDirectory = fileDirectory;
		this.geoKeys = geoKeys;
		this.dataView = dataView;
		this.littleEndian = littleEndian;
		this.tiles = cache ? {} : null;
		this.isTiled = !fileDirectory.StripOffsets;
		const planarConfiguration = fileDirectory.PlanarConfiguration;
		this.planarConfiguration = typeof planarConfiguration === "undefined" ? 1 : planarConfiguration;
		if (this.planarConfiguration !== 1 && this.planarConfiguration !== 2) throw new Error("Invalid planar configuration.");
		this.source = source;
	}
	/**
	* Returns the associated parsed file directory.
	* @returns {Object} the parsed file directory
	*/
	getFileDirectory() {
		return this.fileDirectory;
	}
	/**
	* Returns the associated parsed geo keys.
	* @returns {Object} the parsed geo keys
	*/
	getGeoKeys() {
		return this.geoKeys;
	}
	/**
	* Returns the width of the image.
	* @returns {Number} the width of the image
	*/
	getWidth() {
		return this.fileDirectory.ImageWidth;
	}
	/**
	* Returns the height of the image.
	* @returns {Number} the height of the image
	*/
	getHeight() {
		return this.fileDirectory.ImageLength;
	}
	/**
	* Returns the number of samples per pixel.
	* @returns {Number} the number of samples per pixel
	*/
	getSamplesPerPixel() {
		return typeof this.fileDirectory.SamplesPerPixel !== "undefined" ? this.fileDirectory.SamplesPerPixel : 1;
	}
	/**
	* Returns the width of each tile.
	* @returns {Number} the width of each tile
	*/
	getTileWidth() {
		return this.isTiled ? this.fileDirectory.TileWidth : this.getWidth();
	}
	/**
	* Returns the height of each tile.
	* @returns {Number} the height of each tile
	*/
	getTileHeight() {
		if (this.isTiled) return this.fileDirectory.TileLength;
		if (typeof this.fileDirectory.RowsPerStrip !== "undefined") return Math.min(this.fileDirectory.RowsPerStrip, this.getHeight());
		return this.getHeight();
	}
	getBlockWidth() {
		return this.getTileWidth();
	}
	getBlockHeight(y) {
		if (this.isTiled || (y + 1) * this.getTileHeight() <= this.getHeight()) return this.getTileHeight();
		else return this.getHeight() - y * this.getTileHeight();
	}
	/**
	* Calculates the number of bytes for each pixel across all samples. Only full
	* bytes are supported, an exception is thrown when this is not the case.
	* @returns {Number} the bytes per pixel
	*/
	getBytesPerPixel() {
		let bytes = 0;
		for (let i = 0; i < this.fileDirectory.BitsPerSample.length; ++i) bytes += this.getSampleByteSize(i);
		return bytes;
	}
	getSampleByteSize(i) {
		if (i >= this.fileDirectory.BitsPerSample.length) throw new RangeError(`Sample index ${i} is out of range.`);
		return Math.ceil(this.fileDirectory.BitsPerSample[i] / 8);
	}
	getReaderForSample(sampleIndex) {
		const format = this.fileDirectory.SampleFormat ? this.fileDirectory.SampleFormat[sampleIndex] : 1;
		const bitsPerSample = this.fileDirectory.BitsPerSample[sampleIndex];
		switch (format) {
			case 1:
				if (bitsPerSample <= 8) return DataView.prototype.getUint8;
				else if (bitsPerSample <= 16) return DataView.prototype.getUint16;
				else if (bitsPerSample <= 32) return DataView.prototype.getUint32;
				break;
			case 2:
				if (bitsPerSample <= 8) return DataView.prototype.getInt8;
				else if (bitsPerSample <= 16) return DataView.prototype.getInt16;
				else if (bitsPerSample <= 32) return DataView.prototype.getInt32;
				break;
			case 3:
				switch (bitsPerSample) {
					case 16: return function(offset, littleEndian) {
						return getFloat16(this, offset, littleEndian);
					};
					case 32: return DataView.prototype.getFloat32;
					case 64: return DataView.prototype.getFloat64;
					default: break;
				}
				break;
			default: break;
		}
		throw Error("Unsupported data format/bitsPerSample");
	}
	getSampleFormat(sampleIndex = 0) {
		return this.fileDirectory.SampleFormat ? this.fileDirectory.SampleFormat[sampleIndex] : 1;
	}
	getBitsPerSample(sampleIndex = 0) {
		return this.fileDirectory.BitsPerSample[sampleIndex];
	}
	getArrayForSample(sampleIndex, size) {
		return arrayForType(this.getSampleFormat(sampleIndex), this.getBitsPerSample(sampleIndex), size);
	}
	/**
	* Returns the decoded strip or tile.
	* @param {Number} x the strip or tile x-offset
	* @param {Number} y the tile y-offset (0 for stripped images)
	* @param {Number} sample the sample to get for separated samples
	* @param {import("./geotiff").Pool|import("./geotiff").BaseDecoder} poolOrDecoder the decoder or decoder pool
	* @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
	*                               to be aborted
	* @returns {Promise.<ArrayBuffer>}
	*/
	async getTileOrStrip(x, y, sample, poolOrDecoder, signal) {
		const numTilesPerRow = Math.ceil(this.getWidth() / this.getTileWidth());
		const numTilesPerCol = Math.ceil(this.getHeight() / this.getTileHeight());
		let index;
		const { tiles } = this;
		if (this.planarConfiguration === 1) index = y * numTilesPerRow + x;
		else if (this.planarConfiguration === 2) index = sample * numTilesPerRow * numTilesPerCol + y * numTilesPerRow + x;
		let offset;
		let byteCount;
		if (this.isTiled) {
			offset = this.fileDirectory.TileOffsets[index];
			byteCount = this.fileDirectory.TileByteCounts[index];
		} else {
			offset = this.fileDirectory.StripOffsets[index];
			byteCount = this.fileDirectory.StripByteCounts[index];
		}
		const slice = (await this.source.fetch([{
			offset,
			length: byteCount
		}], signal))[0];
		let request;
		if (tiles === null || !tiles[index]) {
			request = (async () => {
				let data = await poolOrDecoder.decode(this.fileDirectory, slice);
				const sampleFormat = this.getSampleFormat();
				const bitsPerSample = this.getBitsPerSample();
				if (needsNormalization(sampleFormat, bitsPerSample)) data = normalizeArray(data, sampleFormat, this.planarConfiguration, this.getSamplesPerPixel(), bitsPerSample, this.getTileWidth(), this.getBlockHeight(y));
				return data;
			})();
			if (tiles !== null) tiles[index] = request;
		} else request = tiles[index];
		return {
			x,
			y,
			sample,
			data: await request
		};
	}
	/**
	* Internal read function.
	* @private
	* @param {Array} imageWindow The image window in pixel coordinates
	* @param {Array} samples The selected samples (0-based indices)
	* @param {TypedArray|TypedArray[]} valueArrays The array(s) to write into
	* @param {Boolean} interleave Whether or not to write in an interleaved manner
	* @param {import("./geotiff").Pool|AbstractDecoder} poolOrDecoder the decoder or decoder pool
	* @param {number} width the width of window to be read into
	* @param {number} height the height of window to be read into
	* @param {number} resampleMethod the resampling method to be used when interpolating
	* @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
	*                               to be aborted
	* @returns {Promise<ReadRasterResult>}
	*/
	async _readRaster(imageWindow, samples, valueArrays, interleave, poolOrDecoder, width, height, resampleMethod, signal) {
		const tileWidth = this.getTileWidth();
		const tileHeight = this.getTileHeight();
		const imageWidth = this.getWidth();
		const imageHeight = this.getHeight();
		const minXTile = Math.max(Math.floor(imageWindow[0] / tileWidth), 0);
		const maxXTile = Math.min(Math.ceil(imageWindow[2] / tileWidth), Math.ceil(imageWidth / tileWidth));
		const minYTile = Math.max(Math.floor(imageWindow[1] / tileHeight), 0);
		const maxYTile = Math.min(Math.ceil(imageWindow[3] / tileHeight), Math.ceil(imageHeight / tileHeight));
		const windowWidth = imageWindow[2] - imageWindow[0];
		let bytesPerPixel = this.getBytesPerPixel();
		const srcSampleOffsets = [];
		const sampleReaders = [];
		for (let i = 0; i < samples.length; ++i) {
			if (this.planarConfiguration === 1) srcSampleOffsets.push(sum(this.fileDirectory.BitsPerSample, 0, samples[i]) / 8);
			else srcSampleOffsets.push(0);
			sampleReaders.push(this.getReaderForSample(samples[i]));
		}
		const promises = [];
		const { littleEndian } = this;
		for (let yTile = minYTile; yTile < maxYTile; ++yTile) for (let xTile = minXTile; xTile < maxXTile; ++xTile) {
			let getPromise;
			if (this.planarConfiguration === 1) getPromise = this.getTileOrStrip(xTile, yTile, 0, poolOrDecoder, signal);
			for (let sampleIndex = 0; sampleIndex < samples.length; ++sampleIndex) {
				const si = sampleIndex;
				const sample = samples[sampleIndex];
				if (this.planarConfiguration === 2) {
					bytesPerPixel = this.getSampleByteSize(sample);
					getPromise = this.getTileOrStrip(xTile, yTile, sample, poolOrDecoder, signal);
				}
				const promise = getPromise.then((tile) => {
					const buffer = tile.data;
					const dataView = new DataView(buffer);
					const blockHeight = this.getBlockHeight(tile.y);
					const firstLine = tile.y * tileHeight;
					const firstCol = tile.x * tileWidth;
					const lastLine = firstLine + blockHeight;
					const lastCol = (tile.x + 1) * tileWidth;
					const reader = sampleReaders[si];
					const ymax = Math.min(blockHeight, blockHeight - (lastLine - imageWindow[3]), imageHeight - firstLine);
					const xmax = Math.min(tileWidth, tileWidth - (lastCol - imageWindow[2]), imageWidth - firstCol);
					for (let y = Math.max(0, imageWindow[1] - firstLine); y < ymax; ++y) for (let x = Math.max(0, imageWindow[0] - firstCol); x < xmax; ++x) {
						const pixelOffset = (y * tileWidth + x) * bytesPerPixel;
						const value = reader.call(dataView, pixelOffset + srcSampleOffsets[si], littleEndian);
						let windowCoordinate;
						if (interleave) {
							windowCoordinate = (y + firstLine - imageWindow[1]) * windowWidth * samples.length + (x + firstCol - imageWindow[0]) * samples.length + si;
							valueArrays[windowCoordinate] = value;
						} else {
							windowCoordinate = (y + firstLine - imageWindow[1]) * windowWidth + x + firstCol - imageWindow[0];
							valueArrays[si][windowCoordinate] = value;
						}
					}
				});
				promises.push(promise);
			}
		}
		await Promise.all(promises);
		if (width && imageWindow[2] - imageWindow[0] !== width || height && imageWindow[3] - imageWindow[1] !== height) {
			let resampled;
			if (interleave) resampled = resampleInterleaved(valueArrays, imageWindow[2] - imageWindow[0], imageWindow[3] - imageWindow[1], width, height, samples.length, resampleMethod);
			else resampled = resample(valueArrays, imageWindow[2] - imageWindow[0], imageWindow[3] - imageWindow[1], width, height, resampleMethod);
			resampled.width = width;
			resampled.height = height;
			return resampled;
		}
		valueArrays.width = width || imageWindow[2] - imageWindow[0];
		valueArrays.height = height || imageWindow[3] - imageWindow[1];
		return valueArrays;
	}
	/**
	* Reads raster data from the image. This function reads all selected samples
	* into separate arrays of the correct type for that sample or into a single
	* combined array when `interleave` is set. When provided, only a subset
	* of the raster is read for each sample.
	*
	* @param {ReadRasterOptions} [options={}] optional parameters
	* @returns {Promise<ReadRasterResult>} the decoded arrays as a promise
	*/
	async readRasters({ window: wnd, samples = [], interleave, pool = null, width, height, resampleMethod, fillValue, signal } = {}) {
		const imageWindow = wnd || [
			0,
			0,
			this.getWidth(),
			this.getHeight()
		];
		if (imageWindow[0] > imageWindow[2] || imageWindow[1] > imageWindow[3]) throw new Error("Invalid subsets");
		const numPixels = (imageWindow[2] - imageWindow[0]) * (imageWindow[3] - imageWindow[1]);
		const samplesPerPixel = this.getSamplesPerPixel();
		if (!samples || !samples.length) for (let i = 0; i < samplesPerPixel; ++i) samples.push(i);
		else for (let i = 0; i < samples.length; ++i) if (samples[i] >= samplesPerPixel) return Promise.reject(/* @__PURE__ */ new RangeError(`Invalid sample index '${samples[i]}'.`));
		let valueArrays;
		if (interleave) {
			valueArrays = arrayForType(this.fileDirectory.SampleFormat ? Math.max.apply(null, this.fileDirectory.SampleFormat) : 1, Math.max.apply(null, this.fileDirectory.BitsPerSample), numPixels * samples.length);
			if (fillValue) valueArrays.fill(fillValue);
		} else {
			valueArrays = [];
			for (let i = 0; i < samples.length; ++i) {
				const valueArray = this.getArrayForSample(samples[i], numPixels);
				if (Array.isArray(fillValue) && i < fillValue.length) valueArray.fill(fillValue[i]);
				else if (fillValue && !Array.isArray(fillValue)) valueArray.fill(fillValue);
				valueArrays.push(valueArray);
			}
		}
		const poolOrDecoder = pool || await getDecoder(this.fileDirectory);
		return await this._readRaster(imageWindow, samples, valueArrays, interleave, poolOrDecoder, width, height, resampleMethod, signal);
	}
	/**
	* Reads raster data from the image as RGB. The result is always an
	* interleaved typed array.
	* Colorspaces other than RGB will be transformed to RGB, color maps expanded.
	* When no other method is applicable, the first sample is used to produce a
	* grayscale image.
	* When provided, only a subset of the raster is read for each sample.
	*
	* @param {Object} [options] optional parameters
	* @param {Array<number>} [options.window] the subset to read data from in pixels.
	* @param {boolean} [options.interleave=true] whether the data shall be read
	*                                             in one single array or separate
	*                                             arrays.
	* @param {import("./geotiff").Pool} [options.pool=null] The optional decoder pool to use.
	* @param {number} [options.width] The desired width of the output. When the width is no the
	*                                 same as the images, resampling will be performed.
	* @param {number} [options.height] The desired height of the output. When the width is no the
	*                                  same as the images, resampling will be performed.
	* @param {string} [options.resampleMethod='nearest'] The desired resampling method.
	* @param {boolean} [options.enableAlpha=false] Enable reading alpha channel if present.
	* @param {AbortSignal} [options.signal] An AbortSignal that may be signalled if the request is
	*                                       to be aborted
	* @returns {Promise<ReadRasterResult>} the RGB array as a Promise
	*/
	async readRGB({ window, interleave = true, pool = null, width, height, resampleMethod, enableAlpha = false, signal } = {}) {
		const imageWindow = window || [
			0,
			0,
			this.getWidth(),
			this.getHeight()
		];
		if (imageWindow[0] > imageWindow[2] || imageWindow[1] > imageWindow[3]) throw new Error("Invalid subsets");
		const pi = this.fileDirectory.PhotometricInterpretation;
		if (pi === photometricInterpretations.RGB) {
			let s = [
				0,
				1,
				2
			];
			if (!(this.fileDirectory.ExtraSamples === ExtraSamplesValues.Unspecified) && enableAlpha) {
				s = [];
				for (let i = 0; i < this.fileDirectory.BitsPerSample.length; i += 1) s.push(i);
			}
			return this.readRasters({
				window,
				interleave,
				samples: s,
				pool,
				width,
				height,
				resampleMethod,
				signal
			});
		}
		let samples;
		switch (pi) {
			case photometricInterpretations.WhiteIsZero:
			case photometricInterpretations.BlackIsZero:
			case photometricInterpretations.Palette:
				samples = [0];
				break;
			case photometricInterpretations.CMYK:
				samples = [
					0,
					1,
					2,
					3
				];
				break;
			case photometricInterpretations.YCbCr:
			case photometricInterpretations.CIELab:
				samples = [
					0,
					1,
					2
				];
				break;
			default: throw new Error("Invalid or unsupported photometric interpretation.");
		}
		const subOptions = {
			window: imageWindow,
			interleave: true,
			samples,
			pool,
			width,
			height,
			resampleMethod,
			signal
		};
		const { fileDirectory } = this;
		const raster = await this.readRasters(subOptions);
		const max = 2 ** this.fileDirectory.BitsPerSample[0];
		let data;
		switch (pi) {
			case photometricInterpretations.WhiteIsZero:
				data = fromWhiteIsZero(raster, max);
				break;
			case photometricInterpretations.BlackIsZero:
				data = fromBlackIsZero(raster, max);
				break;
			case photometricInterpretations.Palette:
				data = fromPalette(raster, fileDirectory.ColorMap);
				break;
			case photometricInterpretations.CMYK:
				data = fromCMYK(raster);
				break;
			case photometricInterpretations.YCbCr:
				data = fromYCbCr(raster);
				break;
			case photometricInterpretations.CIELab:
				data = fromCIELab(raster);
				break;
			default: throw new Error("Unsupported photometric interpretation.");
		}
		if (!interleave) {
			const red = new Uint8Array(data.length / 3);
			const green = new Uint8Array(data.length / 3);
			const blue = new Uint8Array(data.length / 3);
			for (let i = 0, j = 0; i < data.length; i += 3, ++j) {
				red[j] = data[i];
				green[j] = data[i + 1];
				blue[j] = data[i + 2];
			}
			data = [
				red,
				green,
				blue
			];
		}
		data.width = raster.width;
		data.height = raster.height;
		return data;
	}
	/**
	* Returns an array of tiepoints.
	* @returns {Object[]}
	*/
	getTiePoints() {
		if (!this.fileDirectory.ModelTiepoint) return [];
		const tiePoints = [];
		for (let i = 0; i < this.fileDirectory.ModelTiepoint.length; i += 6) tiePoints.push({
			i: this.fileDirectory.ModelTiepoint[i],
			j: this.fileDirectory.ModelTiepoint[i + 1],
			k: this.fileDirectory.ModelTiepoint[i + 2],
			x: this.fileDirectory.ModelTiepoint[i + 3],
			y: this.fileDirectory.ModelTiepoint[i + 4],
			z: this.fileDirectory.ModelTiepoint[i + 5]
		});
		return tiePoints;
	}
	/**
	* Returns the parsed GDAL metadata items.
	*
	* If sample is passed to null, dataset-level metadata will be returned.
	* Otherwise only metadata specific to the provided sample will be returned.
	*
	* @param {number} [sample=null] The sample index.
	* @returns {Object}
	*/
	getGDALMetadata(sample = null) {
		const metadata = {};
		if (!this.fileDirectory.GDAL_METADATA) return null;
		const string = this.fileDirectory.GDAL_METADATA;
		let items = (0, import_find_tags_by_name.default)(string, "Item");
		if (sample === null) items = items.filter((item) => (0, import_get_attribute.default)(item, "sample") === void 0);
		else items = items.filter((item) => Number((0, import_get_attribute.default)(item, "sample")) === sample);
		for (let i = 0; i < items.length; ++i) {
			const item = items[i];
			metadata[(0, import_get_attribute.default)(item, "name")] = item.inner;
		}
		return metadata;
	}
	/**
	* Returns the GDAL nodata value
	* @returns {number|null}
	*/
	getGDALNoData() {
		if (!this.fileDirectory.GDAL_NODATA) return null;
		const string = this.fileDirectory.GDAL_NODATA;
		return Number(string.substring(0, string.length - 1));
	}
	/**
	* Returns the image origin as a XYZ-vector. When the image has no affine
	* transformation, then an exception is thrown.
	* @returns {Array<number>} The origin as a vector
	*/
	getOrigin() {
		const tiePoints = this.fileDirectory.ModelTiepoint;
		const modelTransformation = this.fileDirectory.ModelTransformation;
		if (tiePoints && tiePoints.length === 6) return [
			tiePoints[3],
			tiePoints[4],
			tiePoints[5]
		];
		if (modelTransformation) return [
			modelTransformation[3],
			modelTransformation[7],
			modelTransformation[11]
		];
		throw new Error("The image does not have an affine transformation.");
	}
	/**
	* Returns the image resolution as a XYZ-vector. When the image has no affine
	* transformation, then an exception is thrown.
	* @param {GeoTIFFImage} [referenceImage=null] A reference image to calculate the resolution from
	*                                             in cases when the current image does not have the
	*                                             required tags on its own.
	* @returns {Array<number>} The resolution as a vector
	*/
	getResolution(referenceImage = null) {
		const modelPixelScale = this.fileDirectory.ModelPixelScale;
		const modelTransformation = this.fileDirectory.ModelTransformation;
		if (modelPixelScale) return [
			modelPixelScale[0],
			-modelPixelScale[1],
			modelPixelScale[2]
		];
		if (modelTransformation) {
			if (modelTransformation[1] === 0 && modelTransformation[4] === 0) return [
				modelTransformation[0],
				-modelTransformation[5],
				modelTransformation[10]
			];
			return [
				Math.sqrt(modelTransformation[0] * modelTransformation[0] + modelTransformation[4] * modelTransformation[4]),
				-Math.sqrt(modelTransformation[1] * modelTransformation[1] + modelTransformation[5] * modelTransformation[5]),
				modelTransformation[10]
			];
		}
		if (referenceImage) {
			const [refResX, refResY, refResZ] = referenceImage.getResolution();
			return [
				refResX * referenceImage.getWidth() / this.getWidth(),
				refResY * referenceImage.getHeight() / this.getHeight(),
				refResZ * referenceImage.getWidth() / this.getWidth()
			];
		}
		throw new Error("The image does not have an affine transformation.");
	}
	/**
	* Returns whether or not the pixels of the image depict an area (or point).
	* @returns {Boolean} Whether the pixels are a point
	*/
	pixelIsArea() {
		return this.geoKeys.GTRasterTypeGeoKey === 1;
	}
	/**
	* Returns the image bounding box as an array of 4 values: min-x, min-y,
	* max-x and max-y. When the image has no affine transformation, then an
	* exception is thrown.
	* @param {boolean} [tilegrid=false] If true return extent for a tilegrid
	*                                   without adjustment for ModelTransformation.
	* @returns {Array<number>} The bounding box
	*/
	getBoundingBox(tilegrid = false) {
		const height = this.getHeight();
		const width = this.getWidth();
		if (this.fileDirectory.ModelTransformation && !tilegrid) {
			const [a, b, c, d, e, f, g, h] = this.fileDirectory.ModelTransformation;
			const projected = [
				[0, 0],
				[0, height],
				[width, 0],
				[width, height]
			].map(([I, J]) => [d + a * I + b * J, h + e * I + f * J]);
			const xs = projected.map((pt) => pt[0]);
			const ys = projected.map((pt) => pt[1]);
			return [
				Math.min(...xs),
				Math.min(...ys),
				Math.max(...xs),
				Math.max(...ys)
			];
		} else {
			const origin = this.getOrigin();
			const resolution = this.getResolution();
			const x1 = origin[0];
			const y1 = origin[1];
			const x2 = x1 + resolution[0] * width;
			const y2 = y1 + resolution[1] * height;
			return [
				Math.min(x1, x2),
				Math.min(y1, y2),
				Math.max(x1, x2),
				Math.max(y1, y2)
			];
		}
	}
};
//#endregion
//#region node_modules/geotiff/dist-module/dataview64.js
var DataView64 = class {
	constructor(arrayBuffer) {
		this._dataView = new DataView(arrayBuffer);
	}
	get buffer() {
		return this._dataView.buffer;
	}
	getUint64(offset, littleEndian) {
		const left = this.getUint32(offset, littleEndian);
		const right = this.getUint32(offset + 4, littleEndian);
		let combined;
		if (littleEndian) {
			combined = left + 2 ** 32 * right;
			if (!Number.isSafeInteger(combined)) throw new Error(`${combined} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);
			return combined;
		}
		combined = 2 ** 32 * left + right;
		if (!Number.isSafeInteger(combined)) throw new Error(`${combined} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);
		return combined;
	}
	getInt64(offset, littleEndian) {
		let value = 0;
		const isNegative = (this._dataView.getUint8(offset + (littleEndian ? 7 : 0)) & 128) > 0;
		let carrying = true;
		for (let i = 0; i < 8; i++) {
			let byte = this._dataView.getUint8(offset + (littleEndian ? i : 7 - i));
			if (isNegative) if (carrying) {
				if (byte !== 0) {
					byte = ~(byte - 1) & 255;
					carrying = false;
				}
			} else byte = ~byte & 255;
			value += byte * 256 ** i;
		}
		if (isNegative) value = -value;
		return value;
	}
	getUint8(offset, littleEndian) {
		return this._dataView.getUint8(offset, littleEndian);
	}
	getInt8(offset, littleEndian) {
		return this._dataView.getInt8(offset, littleEndian);
	}
	getUint16(offset, littleEndian) {
		return this._dataView.getUint16(offset, littleEndian);
	}
	getInt16(offset, littleEndian) {
		return this._dataView.getInt16(offset, littleEndian);
	}
	getUint32(offset, littleEndian) {
		return this._dataView.getUint32(offset, littleEndian);
	}
	getInt32(offset, littleEndian) {
		return this._dataView.getInt32(offset, littleEndian);
	}
	getFloat16(offset, littleEndian) {
		return getFloat16(this._dataView, offset, littleEndian);
	}
	getFloat32(offset, littleEndian) {
		return this._dataView.getFloat32(offset, littleEndian);
	}
	getFloat64(offset, littleEndian) {
		return this._dataView.getFloat64(offset, littleEndian);
	}
};
//#endregion
//#region node_modules/geotiff/dist-module/dataslice.js
var DataSlice = class {
	constructor(arrayBuffer, sliceOffset, littleEndian, bigTiff) {
		this._dataView = new DataView(arrayBuffer);
		this._sliceOffset = sliceOffset;
		this._littleEndian = littleEndian;
		this._bigTiff = bigTiff;
	}
	get sliceOffset() {
		return this._sliceOffset;
	}
	get sliceTop() {
		return this._sliceOffset + this.buffer.byteLength;
	}
	get littleEndian() {
		return this._littleEndian;
	}
	get bigTiff() {
		return this._bigTiff;
	}
	get buffer() {
		return this._dataView.buffer;
	}
	covers(offset, length) {
		return this.sliceOffset <= offset && this.sliceTop >= offset + length;
	}
	readUint8(offset) {
		return this._dataView.getUint8(offset - this._sliceOffset, this._littleEndian);
	}
	readInt8(offset) {
		return this._dataView.getInt8(offset - this._sliceOffset, this._littleEndian);
	}
	readUint16(offset) {
		return this._dataView.getUint16(offset - this._sliceOffset, this._littleEndian);
	}
	readInt16(offset) {
		return this._dataView.getInt16(offset - this._sliceOffset, this._littleEndian);
	}
	readUint32(offset) {
		return this._dataView.getUint32(offset - this._sliceOffset, this._littleEndian);
	}
	readInt32(offset) {
		return this._dataView.getInt32(offset - this._sliceOffset, this._littleEndian);
	}
	readFloat32(offset) {
		return this._dataView.getFloat32(offset - this._sliceOffset, this._littleEndian);
	}
	readFloat64(offset) {
		return this._dataView.getFloat64(offset - this._sliceOffset, this._littleEndian);
	}
	readUint64(offset) {
		const left = this.readUint32(offset);
		const right = this.readUint32(offset + 4);
		let combined;
		if (this._littleEndian) {
			combined = left + 2 ** 32 * right;
			if (!Number.isSafeInteger(combined)) throw new Error(`${combined} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);
			return combined;
		}
		combined = 2 ** 32 * left + right;
		if (!Number.isSafeInteger(combined)) throw new Error(`${combined} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);
		return combined;
	}
	readInt64(offset) {
		let value = 0;
		const isNegative = (this._dataView.getUint8(offset + (this._littleEndian ? 7 : 0)) & 128) > 0;
		let carrying = true;
		for (let i = 0; i < 8; i++) {
			let byte = this._dataView.getUint8(offset + (this._littleEndian ? i : 7 - i));
			if (isNegative) if (carrying) {
				if (byte !== 0) {
					byte = ~(byte - 1) & 255;
					carrying = false;
				}
			} else byte = ~byte & 255;
			value += byte * 256 ** i;
		}
		if (isNegative) value = -value;
		return value;
	}
	readOffset(offset) {
		if (this._bigTiff) return this.readUint64(offset);
		return this.readUint32(offset);
	}
};
//#endregion
//#region node_modules/geotiff/dist-module/pool.js
var defaultPoolSize = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 2 : 2;
/**
* @module pool
*/
/**
* Pool for workers to decode chunks of the images.
*/
var Pool = class {
	/**
	* @constructor
	* @param {Number} [size] The size of the pool. Defaults to the number of CPUs
	*                      available. When this parameter is `null` or 0, then the
	*                      decoding will be done in the main thread.
	* @param {function(): Worker} [createWorker] A function that creates the decoder worker.
	* Defaults to a worker with all decoders that ship with geotiff.js. The `createWorker()`
	* function is expected to return a `Worker` compatible with Web Workers. For code that
	* runs in Node, [web-worker](https://www.npmjs.com/package/web-worker) is a good choice.
	*
	* A worker that uses a custom lzw decoder would look like this `my-custom-worker.js` file:
	* ```js
	* import { addDecoder, getDecoder } from 'geotiff';
	* addDecoder(5, () => import ('./my-custom-lzw').then((m) => m.default));
	* self.addEventListener('message', async (e) => {
	*   const { id, fileDirectory, buffer } = e.data;
	*   const decoder = await getDecoder(fileDirectory);
	*   const decoded = await decoder.decode(fileDirectory, buffer);
	*   self.postMessage({ decoded, id }, [decoded]);
	* });
	* ```
	* The way the above code is built into a worker by the `createWorker()` function
	* depends on the used bundler. For most bundlers, something like this will work:
	* ```js
	* function createWorker() {
	*   return new Worker(new URL('./my-custom-worker.js', import.meta.url));
	* }
	* ```
	*/
	constructor(size = defaultPoolSize, createWorker) {
		this.workers = null;
		this._awaitingDecoder = null;
		this.size = size;
		this.messageId = 0;
		if (size) {
			this._awaitingDecoder = createWorker ? Promise.resolve(createWorker) : new Promise((resolve) => {
				import("./decoder-gXbYZNIs.js").then((module) => {
					resolve(module.create);
				});
			});
			this._awaitingDecoder.then((create) => {
				this._awaitingDecoder = null;
				this.workers = [];
				for (let i = 0; i < size; i++) this.workers.push({
					worker: create(),
					idle: true
				});
			});
		}
	}
	/**
	* Decode the given block of bytes with the set compression method.
	* @param {ArrayBuffer} buffer the array buffer of bytes to decode.
	* @returns {Promise<ArrayBuffer>} the decoded result as a `Promise`
	*/
	async decode(fileDirectory, buffer) {
		if (this._awaitingDecoder) await this._awaitingDecoder;
		return this.size === 0 ? getDecoder(fileDirectory).then((decoder) => decoder.decode(fileDirectory, buffer)) : new Promise((resolve) => {
			const worker = this.workers.find((candidate) => candidate.idle) || this.workers[Math.floor(Math.random() * this.size)];
			worker.idle = false;
			const id = this.messageId++;
			const onMessage = (e) => {
				if (e.data.id === id) {
					worker.idle = true;
					resolve(e.data.decoded);
					worker.worker.removeEventListener("message", onMessage);
				}
			};
			worker.worker.addEventListener("message", onMessage);
			worker.worker.postMessage({
				fileDirectory,
				buffer,
				id
			}, [buffer]);
		});
	}
	destroy() {
		if (this.workers) {
			this.workers.forEach((worker) => {
				worker.worker.terminate();
			});
			this.workers = null;
		}
	}
};
//#endregion
//#region node_modules/geotiff/dist-module/source/httputils.js
var CRLFCRLF = "\r\n\r\n";
function itemsToObject(items) {
	if (typeof Object.fromEntries !== "undefined") return Object.fromEntries(items);
	const obj = {};
	for (const [key, value] of items) obj[key.toLowerCase()] = value;
	return obj;
}
/**
* Parse HTTP headers from a given string.
* @param {String} text the text to parse the headers from
* @returns {Object} the parsed headers with lowercase keys
*/
function parseHeaders(text) {
	return itemsToObject(text.split("\r\n").map((line) => {
		const kv = line.split(":").map((str) => str.trim());
		kv[0] = kv[0].toLowerCase();
		return kv;
	}));
}
/**
* Parse a 'Content-Type' header value to the content-type and parameters
* @param {String} rawContentType the raw string to parse from
* @returns {Object} the parsed content type with the fields: type and params
*/
function parseContentType(rawContentType) {
	const [type, ...rawParams] = rawContentType.split(";").map((s) => s.trim());
	return {
		type,
		params: itemsToObject(rawParams.map((param) => param.split("=")))
	};
}
/**
* Parse a 'Content-Range' header value to its start, end, and total parts
* @param {String} rawContentRange the raw string to parse from
* @returns {Object} the parsed parts
*/
function parseContentRange(rawContentRange) {
	let start;
	let end;
	let total;
	if (rawContentRange) {
		[, start, end, total] = rawContentRange.match(/bytes (\d+)-(\d+)\/(\d+)/);
		start = parseInt(start, 10);
		end = parseInt(end, 10);
		total = parseInt(total, 10);
	}
	return {
		start,
		end,
		total
	};
}
/**
* Parses a list of byteranges from the given 'multipart/byteranges' HTTP response.
* Each item in the list has the following properties:
* - headers: the HTTP headers
* - data: the sliced ArrayBuffer for that specific part
* - offset: the offset of the byterange within its originating file
* - length: the length of the byterange
* @param {ArrayBuffer} responseArrayBuffer the response to be parsed and split
* @param {String} boundary the boundary string used to split the sections
* @returns {Object[]} the parsed byteranges
*/
function parseByteRanges(responseArrayBuffer, boundary) {
	let offset = null;
	const decoder = new TextDecoder("ascii");
	const out = [];
	const startBoundary = `--${boundary}`;
	const endBoundary = `${startBoundary}--`;
	for (let i = 0; i < 10; ++i) if (decoder.decode(new Uint8Array(responseArrayBuffer, i, startBoundary.length)) === startBoundary) offset = i;
	if (offset === null) throw new Error("Could not find initial boundary");
	while (offset < responseArrayBuffer.byteLength) {
		const text = decoder.decode(new Uint8Array(responseArrayBuffer, offset, Math.min(startBoundary.length + 1024, responseArrayBuffer.byteLength - offset)));
		if (text.length === 0 || text.startsWith(endBoundary)) break;
		if (!text.startsWith(startBoundary)) throw new Error("Part does not start with boundary");
		const innerText = text.substr(startBoundary.length + 2);
		if (innerText.length === 0) break;
		const endOfHeaders = innerText.indexOf(CRLFCRLF);
		const headers = parseHeaders(innerText.substr(0, endOfHeaders));
		const { start, end, total } = parseContentRange(headers["content-range"]);
		const startOfData = offset + startBoundary.length + endOfHeaders + 4;
		const length = parseInt(end, 10) + 1 - parseInt(start, 10);
		out.push({
			headers,
			data: responseArrayBuffer.slice(startOfData, startOfData + length),
			offset: start,
			length,
			fileSize: total
		});
		offset = startOfData + length + 4;
	}
	return out;
}
//#endregion
//#region node_modules/geotiff/dist-module/source/basesource.js
/**
* @typedef Slice
* @property {number} offset
* @property {number} length
*/
var BaseSource = class {
	/**
	*
	* @param {Slice[]} slices
	* @returns {ArrayBuffer[]}
	*/
	async fetch(slices, signal = void 0) {
		return Promise.all(slices.map((slice) => this.fetchSlice(slice, signal)));
	}
	/**
	*
	* @param {Slice} slice
	* @returns {ArrayBuffer}
	*/
	async fetchSlice(slice) {
		throw new Error(`fetching of slice ${slice} not possible, not implemented`);
	}
	/**
	* Returns the filesize if already determined and null otherwise
	*/
	get fileSize() {
		return null;
	}
	async close() {}
};
//#endregion
//#region node_modules/quick-lru/index.js
var QuickLRU = class extends Map {
	constructor(options = {}) {
		super();
		if (!(options.maxSize && options.maxSize > 0)) throw new TypeError("`maxSize` must be a number greater than 0");
		if (typeof options.maxAge === "number" && options.maxAge === 0) throw new TypeError("`maxAge` must be a number greater than 0");
		this.maxSize = options.maxSize;
		this.maxAge = options.maxAge || Number.POSITIVE_INFINITY;
		this.onEviction = options.onEviction;
		this.cache = /* @__PURE__ */ new Map();
		this.oldCache = /* @__PURE__ */ new Map();
		this._size = 0;
	}
	_emitEvictions(cache) {
		if (typeof this.onEviction !== "function") return;
		for (const [key, item] of cache) this.onEviction(key, item.value);
	}
	_deleteIfExpired(key, item) {
		if (typeof item.expiry === "number" && item.expiry <= Date.now()) {
			if (typeof this.onEviction === "function") this.onEviction(key, item.value);
			return this.delete(key);
		}
		return false;
	}
	_getOrDeleteIfExpired(key, item) {
		if (this._deleteIfExpired(key, item) === false) return item.value;
	}
	_getItemValue(key, item) {
		return item.expiry ? this._getOrDeleteIfExpired(key, item) : item.value;
	}
	_peek(key, cache) {
		const item = cache.get(key);
		return this._getItemValue(key, item);
	}
	_set(key, value) {
		this.cache.set(key, value);
		this._size++;
		if (this._size >= this.maxSize) {
			this._size = 0;
			this._emitEvictions(this.oldCache);
			this.oldCache = this.cache;
			this.cache = /* @__PURE__ */ new Map();
		}
	}
	_moveToRecent(key, item) {
		this.oldCache.delete(key);
		this._set(key, item);
	}
	*_entriesAscending() {
		for (const item of this.oldCache) {
			const [key, value] = item;
			if (!this.cache.has(key)) {
				if (this._deleteIfExpired(key, value) === false) yield item;
			}
		}
		for (const item of this.cache) {
			const [key, value] = item;
			if (this._deleteIfExpired(key, value) === false) yield item;
		}
	}
	get(key) {
		if (this.cache.has(key)) {
			const item = this.cache.get(key);
			return this._getItemValue(key, item);
		}
		if (this.oldCache.has(key)) {
			const item = this.oldCache.get(key);
			if (this._deleteIfExpired(key, item) === false) {
				this._moveToRecent(key, item);
				return item.value;
			}
		}
	}
	set(key, value, { maxAge = this.maxAge } = {}) {
		const expiry = typeof maxAge === "number" && maxAge !== Number.POSITIVE_INFINITY ? Date.now() + maxAge : void 0;
		if (this.cache.has(key)) this.cache.set(key, {
			value,
			expiry
		});
		else this._set(key, {
			value,
			expiry
		});
		return this;
	}
	has(key) {
		if (this.cache.has(key)) return !this._deleteIfExpired(key, this.cache.get(key));
		if (this.oldCache.has(key)) return !this._deleteIfExpired(key, this.oldCache.get(key));
		return false;
	}
	peek(key) {
		if (this.cache.has(key)) return this._peek(key, this.cache);
		if (this.oldCache.has(key)) return this._peek(key, this.oldCache);
	}
	delete(key) {
		const deleted = this.cache.delete(key);
		if (deleted) this._size--;
		return this.oldCache.delete(key) || deleted;
	}
	clear() {
		this.cache.clear();
		this.oldCache.clear();
		this._size = 0;
	}
	resize(newSize) {
		if (!(newSize && newSize > 0)) throw new TypeError("`maxSize` must be a number greater than 0");
		const items = [...this._entriesAscending()];
		const removeCount = items.length - newSize;
		if (removeCount < 0) {
			this.cache = new Map(items);
			this.oldCache = /* @__PURE__ */ new Map();
			this._size = items.length;
		} else {
			if (removeCount > 0) this._emitEvictions(items.slice(0, removeCount));
			this.oldCache = new Map(items.slice(removeCount));
			this.cache = /* @__PURE__ */ new Map();
			this._size = 0;
		}
		this.maxSize = newSize;
	}
	*keys() {
		for (const [key] of this) yield key;
	}
	*values() {
		for (const [, value] of this) yield value;
	}
	*[Symbol.iterator]() {
		for (const item of this.cache) {
			const [key, value] = item;
			if (this._deleteIfExpired(key, value) === false) yield [key, value.value];
		}
		for (const item of this.oldCache) {
			const [key, value] = item;
			if (!this.cache.has(key)) {
				if (this._deleteIfExpired(key, value) === false) yield [key, value.value];
			}
		}
	}
	*entriesDescending() {
		let items = [...this.cache];
		for (let i = items.length - 1; i >= 0; --i) {
			const [key, value] = items[i];
			if (this._deleteIfExpired(key, value) === false) yield [key, value.value];
		}
		items = [...this.oldCache];
		for (let i = items.length - 1; i >= 0; --i) {
			const [key, value] = items[i];
			if (!this.cache.has(key)) {
				if (this._deleteIfExpired(key, value) === false) yield [key, value.value];
			}
		}
	}
	*entriesAscending() {
		for (const [key, value] of this._entriesAscending()) yield [key, value.value];
	}
	get size() {
		if (!this._size) return this.oldCache.size;
		let oldCacheSize = 0;
		for (const key of this.oldCache.keys()) if (!this.cache.has(key)) oldCacheSize++;
		return Math.min(this._size + oldCacheSize, this.maxSize);
	}
	entries() {
		return this.entriesAscending();
	}
	forEach(callbackFunction, thisArgument = this) {
		for (const [key, value] of this.entriesAscending()) callbackFunction.call(thisArgument, value, key, this);
	}
	get [Symbol.toStringTag]() {
		return JSON.stringify([...this.entriesAscending()]);
	}
};
//#endregion
//#region node_modules/geotiff/dist-module/utils.js
async function wait(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
function zip(a, b) {
	const A = Array.isArray(a) ? a : Array.from(a);
	const B = Array.isArray(b) ? b : Array.from(b);
	return A.map((k, i) => [k, B[i]]);
}
var AbortError = class AbortError extends Error {
	constructor(params) {
		super(params);
		if (Error.captureStackTrace) Error.captureStackTrace(this, AbortError);
		this.name = "AbortError";
	}
};
var CustomAggregateError = class extends Error {
	constructor(errors, message) {
		super(message);
		this.errors = errors;
		this.message = message;
		this.name = "AggregateError";
	}
};
var AggregateError = CustomAggregateError;
//#endregion
//#region node_modules/geotiff/dist-module/source/blockedsource.js
var Block = class {
	/**
	*
	* @param {number} offset
	* @param {number} length
	* @param {ArrayBuffer} [data]
	*/
	constructor(offset, length, data = null) {
		this.offset = offset;
		this.length = length;
		this.data = data;
	}
	/**
	* @returns {number} the top byte border
	*/
	get top() {
		return this.offset + this.length;
	}
};
var BlockGroup = class {
	/**
	*
	* @param {number} offset
	* @param {number} length
	* @param {number[]} blockIds
	*/
	constructor(offset, length, blockIds) {
		this.offset = offset;
		this.length = length;
		this.blockIds = blockIds;
	}
};
var BlockedSource = class extends BaseSource {
	/**
	*
	* @param {BaseSource} source The underlying source that shall be blocked and cached
	* @param {object} options
	* @param {number} [options.blockSize]
	* @param {number} [options.cacheSize]
	*/
	constructor(source, { blockSize = 65536, cacheSize = 100 } = {}) {
		super();
		this.source = source;
		this.blockSize = blockSize;
		this.blockCache = new QuickLRU({
			maxSize: cacheSize,
			onEviction: (blockId, block) => {
				this.evictedBlocks.set(blockId, block);
			}
		});
		/** @type {Map<number, Block>} */
		this.evictedBlocks = /* @__PURE__ */ new Map();
		this.blockRequests = /* @__PURE__ */ new Map();
		this.blockIdsToFetch = /* @__PURE__ */ new Set();
		this.abortedBlockIds = /* @__PURE__ */ new Set();
	}
	get fileSize() {
		return this.source.fileSize;
	}
	/**
	*
	* @param {import("./basesource").Slice[]} slices
	*/
	async fetch(slices, signal) {
		const blockRequests = [];
		const missingBlockIds = [];
		const allBlockIds = [];
		this.evictedBlocks.clear();
		for (const { offset, length } of slices) {
			let top = offset + length;
			const { fileSize } = this;
			if (fileSize !== null) top = Math.min(top, fileSize);
			const firstBlockOffset = Math.floor(offset / this.blockSize) * this.blockSize;
			for (let current = firstBlockOffset; current < top; current += this.blockSize) {
				const blockId = Math.floor(current / this.blockSize);
				if (!this.blockCache.has(blockId) && !this.blockRequests.has(blockId)) {
					this.blockIdsToFetch.add(blockId);
					missingBlockIds.push(blockId);
				}
				if (this.blockRequests.has(blockId)) blockRequests.push(this.blockRequests.get(blockId));
				allBlockIds.push(blockId);
			}
		}
		await wait();
		this.fetchBlocks(signal);
		const missingRequests = [];
		for (const blockId of missingBlockIds) if (this.blockRequests.has(blockId)) missingRequests.push(this.blockRequests.get(blockId));
		await Promise.allSettled(blockRequests);
		await Promise.allSettled(missingRequests);
		const abortedBlockRequests = [];
		const abortedBlockIds = allBlockIds.filter((id) => this.abortedBlockIds.has(id) || !this.blockCache.has(id));
		abortedBlockIds.forEach((id) => this.blockIdsToFetch.add(id));
		if (abortedBlockIds.length > 0 && signal && !signal.aborted) {
			this.fetchBlocks(null);
			for (const blockId of abortedBlockIds) {
				const block = this.blockRequests.get(blockId);
				if (!block) throw new Error(`Block ${blockId} is not in the block requests`);
				abortedBlockRequests.push(block);
			}
			await Promise.allSettled(abortedBlockRequests);
		}
		if (signal && signal.aborted) throw new AbortError("Request was aborted");
		const blocks = allBlockIds.map((id) => this.blockCache.get(id) || this.evictedBlocks.get(id));
		const failedBlocks = blocks.filter((i) => !i);
		if (failedBlocks.length) throw new AggregateError(failedBlocks, "Request failed");
		const requiredBlocks = new Map(zip(allBlockIds, blocks));
		return this.readSliceData(slices, requiredBlocks);
	}
	/**
	*
	* @param {AbortSignal} signal
	*/
	fetchBlocks(signal) {
		if (this.blockIdsToFetch.size > 0) {
			const groups = this.groupBlocks(this.blockIdsToFetch);
			const groupRequests = this.source.fetch(groups, signal);
			for (let groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
				const group = groups[groupIndex];
				for (const blockId of group.blockIds) this.blockRequests.set(blockId, (async () => {
					try {
						const response = (await groupRequests)[groupIndex];
						const blockOffset = blockId * this.blockSize;
						const o = blockOffset - response.offset;
						const t = Math.min(o + this.blockSize, response.data.byteLength);
						const data = response.data.slice(o, t);
						const block = new Block(blockOffset, data.byteLength, data, blockId);
						this.blockCache.set(blockId, block);
						this.abortedBlockIds.delete(blockId);
					} catch (err) {
						if (err.name === "AbortError") {
							err.signal = signal;
							this.blockCache.delete(blockId);
							this.abortedBlockIds.add(blockId);
						} else throw err;
					} finally {
						this.blockRequests.delete(blockId);
					}
				})());
			}
			this.blockIdsToFetch.clear();
		}
	}
	/**
	*
	* @param {Set} blockIds
	* @returns {BlockGroup[]}
	*/
	groupBlocks(blockIds) {
		const sortedBlockIds = Array.from(blockIds).sort((a, b) => a - b);
		if (sortedBlockIds.length === 0) return [];
		let current = [];
		let lastBlockId = null;
		const groups = [];
		for (const blockId of sortedBlockIds) if (lastBlockId === null || lastBlockId + 1 === blockId) {
			current.push(blockId);
			lastBlockId = blockId;
		} else {
			groups.push(new BlockGroup(current[0] * this.blockSize, current.length * this.blockSize, current));
			current = [blockId];
			lastBlockId = blockId;
		}
		groups.push(new BlockGroup(current[0] * this.blockSize, current.length * this.blockSize, current));
		return groups;
	}
	/**
	*
	* @param {import("./basesource").Slice[]} slices
	* @param {Map} blocks
	*/
	readSliceData(slices, blocks) {
		return slices.map((slice) => {
			let top = slice.offset + slice.length;
			if (this.fileSize !== null) top = Math.min(this.fileSize, top);
			const blockIdLow = Math.floor(slice.offset / this.blockSize);
			const blockIdHigh = Math.floor(top / this.blockSize);
			const sliceData = new ArrayBuffer(slice.length);
			const sliceView = new Uint8Array(sliceData);
			for (let blockId = blockIdLow; blockId <= blockIdHigh; ++blockId) {
				const block = blocks.get(blockId);
				const delta = block.offset - slice.offset;
				const topDelta = block.top - top;
				let blockInnerOffset = 0;
				let rangeInnerOffset = 0;
				let usedBlockLength;
				if (delta < 0) blockInnerOffset = -delta;
				else if (delta > 0) rangeInnerOffset = delta;
				if (topDelta < 0) usedBlockLength = block.length - blockInnerOffset;
				else usedBlockLength = top - block.offset - blockInnerOffset;
				const blockView = new Uint8Array(block.data, blockInnerOffset, usedBlockLength);
				sliceView.set(blockView, rangeInnerOffset);
			}
			return sliceData;
		});
	}
};
//#endregion
//#region node_modules/geotiff/dist-module/source/client/base.js
var BaseResponse = class {
	/**
	* Returns whether the response has an ok'ish status code
	*/
	get ok() {
		return this.status >= 200 && this.status <= 299;
	}
	/**
	* Returns the status code of the response
	*/
	get status() {
		throw new Error("not implemented");
	}
	/**
	* Returns the value of the specified header
	* @param {string} headerName the header name
	* @returns {string} the header value
	*/
	getHeader(headerName) {
		throw new Error("not implemented");
	}
	/**
	* @returns {ArrayBuffer} the response data of the request
	*/
	async getData() {
		throw new Error("not implemented");
	}
};
var BaseClient = class {
	constructor(url) {
		this.url = url;
	}
	/**
	* Send a request with the options
	* @param {{headers: HeadersInit, signal: AbortSignal}} [options={}]
	* @returns {Promise<BaseResponse>}
	*/
	async request({ headers, signal } = {}) {
		throw new Error("request is not implemented");
	}
};
//#endregion
//#region node_modules/geotiff/dist-module/source/client/fetch.js
var FetchResponse = class extends BaseResponse {
	/**
	* BaseResponse facade for fetch API Response
	* @param {Response} response
	*/
	constructor(response) {
		super();
		this.response = response;
	}
	get status() {
		return this.response.status;
	}
	getHeader(name) {
		return this.response.headers.get(name);
	}
	async getData() {
		return this.response.arrayBuffer ? await this.response.arrayBuffer() : (await this.response.buffer()).buffer;
	}
};
var FetchClient = class extends BaseClient {
	constructor(url, credentials) {
		super(url);
		this.credentials = credentials;
	}
	/**
	* @param {{headers: HeadersInit, signal: AbortSignal}} [options={}]
	* @returns {Promise<FetchResponse>}
	*/
	async request({ headers, signal } = {}) {
		return new FetchResponse(await fetch(this.url, {
			headers,
			credentials: this.credentials,
			signal
		}));
	}
};
//#endregion
//#region node_modules/geotiff/dist-module/source/client/xhr.js
var XHRResponse = class extends BaseResponse {
	/**
	* BaseResponse facade for XMLHttpRequest
	* @param {XMLHttpRequest} xhr
	* @param {ArrayBuffer} data
	*/
	constructor(xhr, data) {
		super();
		this.xhr = xhr;
		this.data = data;
	}
	get status() {
		return this.xhr.status;
	}
	getHeader(name) {
		return this.xhr.getResponseHeader(name);
	}
	async getData() {
		return this.data;
	}
};
var XHRClient = class extends BaseClient {
	constructRequest(headers, signal) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", this.url);
			xhr.responseType = "arraybuffer";
			for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value);
			xhr.onload = () => {
				const data = xhr.response;
				resolve(new XHRResponse(xhr, data));
			};
			xhr.onerror = reject;
			xhr.onabort = () => reject(new AbortError("Request aborted"));
			xhr.send();
			if (signal) {
				if (signal.aborted) xhr.abort();
				signal.addEventListener("abort", () => xhr.abort());
			}
		});
	}
	async request({ headers, signal } = {}) {
		return await this.constructRequest(headers, signal);
	}
};
//#endregion
//#region browser-external:http
var require_browser_external_http = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Object.create(new Proxy({}, { get(_, key) {
		if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") console.warn(`Module "http" has been externalized for browser compatibility. Cannot access "http.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
	} }));
}));
//#endregion
//#region browser-external:https
var require_browser_external_https = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Object.create(new Proxy({}, { get(_, key) {
		if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") console.warn(`Module "https" has been externalized for browser compatibility. Cannot access "https.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
	} }));
}));
//#endregion
//#region browser-external:url
var require_browser_external_url = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Object.create(new Proxy({}, { get(_, key) {
		if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") console.warn(`Module "url" has been externalized for browser compatibility. Cannot access "url.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
	} }));
}));
//#endregion
//#region node_modules/geotiff/dist-module/source/client/http.js
var import_browser_external_http = /* @__PURE__ */ __toESM(require_browser_external_http(), 1);
var import_browser_external_https = /* @__PURE__ */ __toESM(require_browser_external_https(), 1);
var import_browser_external_url = /* @__PURE__ */ __toESM(require_browser_external_url(), 1);
var HttpResponse = class extends BaseResponse {
	/**
	* BaseResponse facade for node HTTP/HTTPS API Response
	* @param {http.ServerResponse} response
	*/
	constructor(response, dataPromise) {
		super();
		this.response = response;
		this.dataPromise = dataPromise;
	}
	get status() {
		return this.response.statusCode;
	}
	getHeader(name) {
		return this.response.headers[name];
	}
	async getData() {
		return await this.dataPromise;
	}
};
var HttpClient = class extends BaseClient {
	constructor(url) {
		super(url);
		this.parsedUrl = import_browser_external_url.default.parse(this.url);
		this.httpApi = this.parsedUrl.protocol === "http:" ? import_browser_external_http.default : import_browser_external_https.default;
	}
	constructRequest(headers, signal) {
		return new Promise((resolve, reject) => {
			const request = this.httpApi.get({
				...this.parsedUrl,
				headers
			}, (response) => {
				resolve(new HttpResponse(response, new Promise((resolveData) => {
					const chunks = [];
					response.on("data", (chunk) => {
						chunks.push(chunk);
					});
					response.on("end", () => {
						const data = Buffer.concat(chunks).buffer;
						resolveData(data);
					});
					response.on("error", reject);
				})));
			});
			request.on("error", reject);
			if (signal) {
				if (signal.aborted) request.destroy(new AbortError("Request aborted"));
				signal.addEventListener("abort", () => request.destroy(new AbortError("Request aborted")));
			}
		});
	}
	async request({ headers, signal } = {}) {
		return await this.constructRequest(headers, signal);
	}
};
//#endregion
//#region node_modules/geotiff/dist-module/source/remote.js
var RemoteSource = class extends BaseSource {
	/**
	*
	* @param {BaseClient} client
	* @param {object} headers
	* @param {numbers} maxRanges
	* @param {boolean} allowFullFile
	*/
	constructor(client, headers, maxRanges, allowFullFile) {
		super();
		this.client = client;
		this.headers = headers;
		this.maxRanges = maxRanges;
		this.allowFullFile = allowFullFile;
		this._fileSize = null;
	}
	/**
	*
	* @param {Slice[]} slices
	*/
	async fetch(slices, signal) {
		if (this.maxRanges >= slices.length) return this.fetchSlices(slices, signal);
		else if (this.maxRanges > 0 && slices.length > 1) {}
		return Promise.all(slices.map((slice) => this.fetchSlice(slice, signal)));
	}
	async fetchSlices(slices, signal) {
		const response = await this.client.request({
			headers: {
				...this.headers,
				Range: `bytes=${slices.map(({ offset, length }) => `${offset}-${offset + length}`).join(",")}`
			},
			signal
		});
		if (!response.ok) throw new Error("Error fetching data.");
		else if (response.status === 206) {
			const { type, params } = parseContentType(response.getHeader("content-type"));
			if (type === "multipart/byteranges") {
				const byteRanges = parseByteRanges(await response.getData(), params.boundary);
				this._fileSize = byteRanges[0].fileSize || null;
				return byteRanges;
			}
			const data = await response.getData();
			const { start, end, total } = parseContentRange(response.getHeader("content-range"));
			this._fileSize = total || null;
			const first = [{
				data,
				offset: start,
				length: end - start
			}];
			if (slices.length > 1) {
				const others = await Promise.all(slices.slice(1).map((slice) => this.fetchSlice(slice, signal)));
				return first.concat(others);
			}
			return first;
		} else {
			if (!this.allowFullFile) throw new Error("Server responded with full file");
			const data = await response.getData();
			this._fileSize = data.byteLength;
			return [{
				data,
				offset: 0,
				length: data.byteLength
			}];
		}
	}
	async fetchSlice(slice, signal) {
		const { offset, length } = slice;
		const response = await this.client.request({
			headers: {
				...this.headers,
				Range: `bytes=${offset}-${offset + length}`
			},
			signal
		});
		if (!response.ok) throw new Error("Error fetching data.");
		else if (response.status === 206) {
			const data = await response.getData();
			const { total } = parseContentRange(response.getHeader("content-range"));
			this._fileSize = total || null;
			return {
				data,
				offset,
				length
			};
		} else {
			if (!this.allowFullFile) throw new Error("Server responded with full file");
			const data = await response.getData();
			this._fileSize = data.byteLength;
			return {
				data,
				offset: 0,
				length: data.byteLength
			};
		}
	}
	get fileSize() {
		return this._fileSize;
	}
};
function maybeWrapInBlockedSource(source, { blockSize, cacheSize }) {
	if (blockSize === null) return source;
	return new BlockedSource(source, {
		blockSize,
		cacheSize
	});
}
function makeFetchSource(url, { headers = {}, credentials, maxRanges = 0, allowFullFile = false, ...blockOptions } = {}) {
	return maybeWrapInBlockedSource(new RemoteSource(new FetchClient(url, credentials), headers, maxRanges, allowFullFile), blockOptions);
}
function makeXHRSource(url, { headers = {}, maxRanges = 0, allowFullFile = false, ...blockOptions } = {}) {
	return maybeWrapInBlockedSource(new RemoteSource(new XHRClient(url), headers, maxRanges, allowFullFile), blockOptions);
}
function makeHttpSource(url, { headers = {}, maxRanges = 0, allowFullFile = false, ...blockOptions } = {}) {
	return maybeWrapInBlockedSource(new RemoteSource(new HttpClient(url), headers, maxRanges, allowFullFile), blockOptions);
}
/**
*
* @param {string} url
* @param {object} options
*/
function makeRemoteSource(url, { forceXHR = false, ...clientOptions } = {}) {
	if (typeof fetch === "function" && !forceXHR) return makeFetchSource(url, clientOptions);
	if (typeof XMLHttpRequest !== "undefined") return makeXHRSource(url, clientOptions);
	return makeHttpSource(url, clientOptions);
}
//#endregion
//#region node_modules/geotiff/dist-module/source/filereader.js
var FileReaderSource = class extends BaseSource {
	constructor(file) {
		super();
		this.file = file;
	}
	async fetchSlice(slice, signal) {
		return new Promise((resolve, reject) => {
			const blob = this.file.slice(slice.offset, slice.offset + slice.length);
			const reader = new FileReader();
			reader.onload = (event) => resolve(event.target.result);
			reader.onerror = reject;
			reader.onabort = reject;
			reader.readAsArrayBuffer(blob);
			if (signal) signal.addEventListener("abort", () => reader.abort());
		});
	}
};
/**
* Create a new source from a given file/blob.
* @param {Blob} file The file or blob to read from.
* @returns The constructed source
*/
function makeFileReaderSource(file) {
	return new FileReaderSource(file);
}
//#endregion
//#region node_modules/geotiff/dist-module/geotiff.js
/** @module geotiff */
/**
* @typedef {Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | Float32Array | Float64Array}
* TypedArray
*/
/**
* @typedef {{ height:number, width: number }} Dimensions
*/
/**
* The autogenerated docs are a little confusing here. The effective type is:
*
* `TypedArray & { height: number; width: number}`
* @typedef {TypedArray & Dimensions} TypedArrayWithDimensions
*/
/**
* The autogenerated docs are a little confusing here. The effective type is:
*
* `TypedArray[] & { height: number; width: number}`
* @typedef {TypedArray[] & Dimensions} TypedArrayArrayWithDimensions
*/
/**
*  The autogenerated docs are a little confusing here. The effective type is:
*
* `(TypedArray | TypedArray[]) & { height: number; width: number}`
* @typedef {TypedArrayWithDimensions | TypedArrayArrayWithDimensions} ReadRasterResult
*/
function getFieldTypeLength(fieldType) {
	switch (fieldType) {
		case fieldTypes.BYTE:
		case fieldTypes.ASCII:
		case fieldTypes.SBYTE:
		case fieldTypes.UNDEFINED: return 1;
		case fieldTypes.SHORT:
		case fieldTypes.SSHORT: return 2;
		case fieldTypes.LONG:
		case fieldTypes.SLONG:
		case fieldTypes.FLOAT:
		case fieldTypes.IFD: return 4;
		case fieldTypes.RATIONAL:
		case fieldTypes.SRATIONAL:
		case fieldTypes.DOUBLE:
		case fieldTypes.LONG8:
		case fieldTypes.SLONG8:
		case fieldTypes.IFD8: return 8;
		default: throw new RangeError(`Invalid field type: ${fieldType}`);
	}
}
function parseGeoKeyDirectory(fileDirectory) {
	const rawGeoKeyDirectory = fileDirectory.GeoKeyDirectory;
	if (!rawGeoKeyDirectory) return null;
	const geoKeyDirectory = {};
	for (let i = 4; i <= rawGeoKeyDirectory[3] * 4; i += 4) {
		const key = geoKeyNames[rawGeoKeyDirectory[i]];
		const location = rawGeoKeyDirectory[i + 1] ? fieldTagNames[rawGeoKeyDirectory[i + 1]] : null;
		const count = rawGeoKeyDirectory[i + 2];
		const offset = rawGeoKeyDirectory[i + 3];
		let value = null;
		if (!location) value = offset;
		else {
			value = fileDirectory[location];
			if (typeof value === "undefined" || value === null) throw new Error(`Could not get value of geoKey '${key}'.`);
			else if (typeof value === "string") value = value.substring(offset, offset + count - 1);
			else if (value.subarray) {
				value = value.subarray(offset, offset + count);
				if (count === 1) value = value[0];
			}
		}
		geoKeyDirectory[key] = value;
	}
	return geoKeyDirectory;
}
function getValues(dataSlice, fieldType, count, offset) {
	let values = null;
	let readMethod = null;
	const fieldTypeLength = getFieldTypeLength(fieldType);
	switch (fieldType) {
		case fieldTypes.BYTE:
		case fieldTypes.ASCII:
		case fieldTypes.UNDEFINED:
			values = new Uint8Array(count);
			readMethod = dataSlice.readUint8;
			break;
		case fieldTypes.SBYTE:
			values = new Int8Array(count);
			readMethod = dataSlice.readInt8;
			break;
		case fieldTypes.SHORT:
			values = new Uint16Array(count);
			readMethod = dataSlice.readUint16;
			break;
		case fieldTypes.SSHORT:
			values = new Int16Array(count);
			readMethod = dataSlice.readInt16;
			break;
		case fieldTypes.LONG:
		case fieldTypes.IFD:
			values = new Uint32Array(count);
			readMethod = dataSlice.readUint32;
			break;
		case fieldTypes.SLONG:
			values = new Int32Array(count);
			readMethod = dataSlice.readInt32;
			break;
		case fieldTypes.LONG8:
		case fieldTypes.IFD8:
			values = new Array(count);
			readMethod = dataSlice.readUint64;
			break;
		case fieldTypes.SLONG8:
			values = new Array(count);
			readMethod = dataSlice.readInt64;
			break;
		case fieldTypes.RATIONAL:
			values = new Uint32Array(count * 2);
			readMethod = dataSlice.readUint32;
			break;
		case fieldTypes.SRATIONAL:
			values = new Int32Array(count * 2);
			readMethod = dataSlice.readInt32;
			break;
		case fieldTypes.FLOAT:
			values = new Float32Array(count);
			readMethod = dataSlice.readFloat32;
			break;
		case fieldTypes.DOUBLE:
			values = new Float64Array(count);
			readMethod = dataSlice.readFloat64;
			break;
		default: throw new RangeError(`Invalid field type: ${fieldType}`);
	}
	if (!(fieldType === fieldTypes.RATIONAL || fieldType === fieldTypes.SRATIONAL)) for (let i = 0; i < count; ++i) values[i] = readMethod.call(dataSlice, offset + i * fieldTypeLength);
	else for (let i = 0; i < count; i += 2) {
		values[i] = readMethod.call(dataSlice, offset + i * fieldTypeLength);
		values[i + 1] = readMethod.call(dataSlice, offset + (i * fieldTypeLength + 4));
	}
	if (fieldType === fieldTypes.ASCII) return new TextDecoder("utf-8").decode(values);
	return values;
}
/**
* Data class to store the parsed file directory, geo key directory and
* offset to the next IFD
*/
var ImageFileDirectory = class {
	constructor(fileDirectory, geoKeyDirectory, nextIFDByteOffset) {
		this.fileDirectory = fileDirectory;
		this.geoKeyDirectory = geoKeyDirectory;
		this.nextIFDByteOffset = nextIFDByteOffset;
	}
};
/**
* Error class for cases when an IFD index was requested, that does not exist
* in the file.
*/
var GeoTIFFImageIndexError = class extends Error {
	constructor(index) {
		super(`No image at index ${index}`);
		this.index = index;
	}
};
var GeoTIFFBase = class {
	/**
	* (experimental) Reads raster data from the best fitting image. This function uses
	* the image with the lowest resolution that is still a higher resolution than the
	* requested resolution.
	* When specified, the `bbox` option is translated to the `window` option and the
	* `resX` and `resY` to `width` and `height` respectively.
	* Then, the [readRasters]{@link GeoTIFFImage#readRasters} method of the selected
	* image is called and the result returned.
	* @see GeoTIFFImage.readRasters
	* @param {import('./geotiffimage').ReadRasterOptions} [options={}] optional parameters
	* @returns {Promise<ReadRasterResult>} the decoded array(s), with `height` and `width`, as a promise
	*/
	async readRasters(options = {}) {
		const { window: imageWindow, width, height } = options;
		let { resX, resY, bbox } = options;
		const firstImage = await this.getImage();
		let usedImage = firstImage;
		const imageCount = await this.getImageCount();
		const imgBBox = firstImage.getBoundingBox();
		if (imageWindow && bbox) throw new Error("Both \"bbox\" and \"window\" passed.");
		if (width || height) {
			if (imageWindow) {
				const [oX, oY] = firstImage.getOrigin();
				const [rX, rY] = firstImage.getResolution();
				bbox = [
					oX + imageWindow[0] * rX,
					oY + imageWindow[1] * rY,
					oX + imageWindow[2] * rX,
					oY + imageWindow[3] * rY
				];
			}
			const usedBBox = bbox || imgBBox;
			if (width) {
				if (resX) throw new Error("Both width and resX passed");
				resX = (usedBBox[2] - usedBBox[0]) / width;
			}
			if (height) {
				if (resY) throw new Error("Both width and resY passed");
				resY = (usedBBox[3] - usedBBox[1]) / height;
			}
		}
		if (resX || resY) {
			const allImages = [];
			for (let i = 0; i < imageCount; ++i) {
				const image = await this.getImage(i);
				const { SubfileType: subfileType, NewSubfileType: newSubfileType } = image.fileDirectory;
				if (i === 0 || subfileType === 2 || newSubfileType & 1) allImages.push(image);
			}
			allImages.sort((a, b) => a.getWidth() - b.getWidth());
			for (let i = 0; i < allImages.length; ++i) {
				const image = allImages[i];
				const imgResX = (imgBBox[2] - imgBBox[0]) / image.getWidth();
				const imgResY = (imgBBox[3] - imgBBox[1]) / image.getHeight();
				usedImage = image;
				if (resX && resX > imgResX || resY && resY > imgResY) break;
			}
		}
		let wnd = imageWindow;
		if (bbox) {
			const [oX, oY] = firstImage.getOrigin();
			const [imageResX, imageResY] = usedImage.getResolution(firstImage);
			wnd = [
				Math.round((bbox[0] - oX) / imageResX),
				Math.round((bbox[1] - oY) / imageResY),
				Math.round((bbox[2] - oX) / imageResX),
				Math.round((bbox[3] - oY) / imageResY)
			];
			wnd = [
				Math.min(wnd[0], wnd[2]),
				Math.min(wnd[1], wnd[3]),
				Math.max(wnd[0], wnd[2]),
				Math.max(wnd[1], wnd[3])
			];
		}
		return usedImage.readRasters({
			...options,
			window: wnd
		});
	}
};
/**
* @typedef {Object} GeoTIFFOptions
* @property {boolean} [cache=false] whether or not decoded tiles shall be cached.
*/
/**
* The abstraction for a whole GeoTIFF file.
* @augments GeoTIFFBase
*/
var GeoTIFF = class GeoTIFF extends GeoTIFFBase {
	/**
	* @constructor
	* @param {*} source The datasource to read from.
	* @param {boolean} littleEndian Whether the image uses little endian.
	* @param {boolean} bigTiff Whether the image uses bigTIFF conventions.
	* @param {number} firstIFDOffset The numeric byte-offset from the start of the image
	*                                to the first IFD.
	* @param {GeoTIFFOptions} [options] further options.
	*/
	constructor(source, littleEndian, bigTiff, firstIFDOffset, options = {}) {
		super();
		this.source = source;
		this.littleEndian = littleEndian;
		this.bigTiff = bigTiff;
		this.firstIFDOffset = firstIFDOffset;
		this.cache = options.cache || false;
		this.ifdRequests = [];
		this.ghostValues = null;
	}
	async getSlice(offset, size) {
		const fallbackSize = this.bigTiff ? 4048 : 1024;
		return new DataSlice((await this.source.fetch([{
			offset,
			length: typeof size !== "undefined" ? size : fallbackSize
		}]))[0], offset, this.littleEndian, this.bigTiff);
	}
	/**
	* Instructs to parse an image file directory at the given file offset.
	* As there is no way to ensure that a location is indeed the start of an IFD,
	* this function must be called with caution (e.g only using the IFD offsets from
	* the headers or other IFDs).
	* @param {number} offset the offset to parse the IFD at
	* @returns {Promise<ImageFileDirectory>} the parsed IFD
	*/
	async parseFileDirectoryAt(offset) {
		const entrySize = this.bigTiff ? 20 : 12;
		const offsetSize = this.bigTiff ? 8 : 2;
		let dataSlice = await this.getSlice(offset);
		const numDirEntries = this.bigTiff ? dataSlice.readUint64(offset) : dataSlice.readUint16(offset);
		const byteSize = numDirEntries * entrySize + (this.bigTiff ? 16 : 6);
		if (!dataSlice.covers(offset, byteSize)) dataSlice = await this.getSlice(offset, byteSize);
		const fileDirectory = {};
		let i = offset + (this.bigTiff ? 8 : 2);
		for (let entryCount = 0; entryCount < numDirEntries; i += entrySize, ++entryCount) {
			const fieldTag = dataSlice.readUint16(i);
			const fieldType = dataSlice.readUint16(i + 2);
			const typeCount = this.bigTiff ? dataSlice.readUint64(i + 4) : dataSlice.readUint32(i + 4);
			let fieldValues;
			let value;
			const fieldTypeLength = getFieldTypeLength(fieldType);
			const valueOffset = i + (this.bigTiff ? 12 : 8);
			if (fieldTypeLength * typeCount <= (this.bigTiff ? 8 : 4)) fieldValues = getValues(dataSlice, fieldType, typeCount, valueOffset);
			else {
				const actualOffset = dataSlice.readOffset(valueOffset);
				const length = getFieldTypeLength(fieldType) * typeCount;
				if (dataSlice.covers(actualOffset, length)) fieldValues = getValues(dataSlice, fieldType, typeCount, actualOffset);
				else fieldValues = getValues(await this.getSlice(actualOffset, length), fieldType, typeCount, actualOffset);
			}
			if (typeCount === 1 && arrayFields.indexOf(fieldTag) === -1 && !(fieldType === fieldTypes.RATIONAL || fieldType === fieldTypes.SRATIONAL)) value = fieldValues[0];
			else value = fieldValues;
			fileDirectory[fieldTagNames[fieldTag]] = value;
		}
		return new ImageFileDirectory(fileDirectory, parseGeoKeyDirectory(fileDirectory), dataSlice.readOffset(offset + offsetSize + entrySize * numDirEntries));
	}
	async requestIFD(index) {
		if (this.ifdRequests[index]) return this.ifdRequests[index];
		else if (index === 0) {
			this.ifdRequests[index] = this.parseFileDirectoryAt(this.firstIFDOffset);
			return this.ifdRequests[index];
		} else if (!this.ifdRequests[index - 1]) try {
			this.ifdRequests[index - 1] = this.requestIFD(index - 1);
		} catch (e) {
			if (e instanceof GeoTIFFImageIndexError) throw new GeoTIFFImageIndexError(index);
			throw e;
		}
		this.ifdRequests[index] = (async () => {
			const previousIfd = await this.ifdRequests[index - 1];
			if (previousIfd.nextIFDByteOffset === 0) throw new GeoTIFFImageIndexError(index);
			return this.parseFileDirectoryAt(previousIfd.nextIFDByteOffset);
		})();
		return this.ifdRequests[index];
	}
	/**
	* Get the n-th internal subfile of an image. By default, the first is returned.
	*
	* @param {number} [index=0] the index of the image to return.
	* @returns {Promise<GeoTIFFImage>} the image at the given index
	*/
	async getImage(index = 0) {
		const ifd = await this.requestIFD(index);
		return new GeoTIFFImage(ifd.fileDirectory, ifd.geoKeyDirectory, this.dataView, this.littleEndian, this.cache, this.source);
	}
	/**
	* Returns the count of the internal subfiles.
	*
	* @returns {Promise<number>} the number of internal subfile images
	*/
	async getImageCount() {
		let index = 0;
		let hasNext = true;
		while (hasNext) try {
			await this.requestIFD(index);
			++index;
		} catch (e) {
			if (e instanceof GeoTIFFImageIndexError) hasNext = false;
			else throw e;
		}
		return index;
	}
	/**
	* Get the values of the COG ghost area as a parsed map.
	* See https://gdal.org/drivers/raster/cog.html#header-ghost-area for reference
	* @returns {Promise<Object>} the parsed ghost area or null, if no such area was found
	*/
	async getGhostValues() {
		const offset = this.bigTiff ? 16 : 8;
		if (this.ghostValues) return this.ghostValues;
		const detectionString = "GDAL_STRUCTURAL_METADATA_SIZE=";
		const heuristicAreaSize = 130;
		let slice = await this.getSlice(offset, heuristicAreaSize);
		if (detectionString === getValues(slice, fieldTypes.ASCII, 30, offset)) {
			const firstLine = getValues(slice, fieldTypes.ASCII, heuristicAreaSize, offset).split("\n")[0];
			const metadataSize = Number(firstLine.split("=")[1].split(" ")[0]) + firstLine.length;
			if (metadataSize > heuristicAreaSize) slice = await this.getSlice(offset, metadataSize);
			const fullString = getValues(slice, fieldTypes.ASCII, metadataSize, offset);
			this.ghostValues = {};
			fullString.split("\n").filter((line) => line.length > 0).map((line) => line.split("=")).forEach(([key, value]) => {
				this.ghostValues[key] = value;
			});
		}
		return this.ghostValues;
	}
	/**
	* Parse a (Geo)TIFF file from the given source.
	*
	* @param {*} source The source of data to parse from.
	* @param {GeoTIFFOptions} [options] Additional options.
	* @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
	*                               to be aborted
	*/
	static async fromSource(source, options, signal) {
		const headerData = (await source.fetch([{
			offset: 0,
			length: 1024
		}], signal))[0];
		const dataView = new DataView64(headerData);
		const BOM = dataView.getUint16(0, 0);
		let littleEndian;
		if (BOM === 18761) littleEndian = true;
		else if (BOM === 19789) littleEndian = false;
		else throw new TypeError("Invalid byte order value.");
		const magicNumber = dataView.getUint16(2, littleEndian);
		let bigTiff;
		if (magicNumber === 42) bigTiff = false;
		else if (magicNumber === 43) {
			bigTiff = true;
			if (dataView.getUint16(4, littleEndian) !== 8) throw new Error("Unsupported offset byte-size.");
		} else throw new TypeError("Invalid magic number.");
		const firstIFDOffset = bigTiff ? dataView.getUint64(8, littleEndian) : dataView.getUint32(4, littleEndian);
		return new GeoTIFF(source, littleEndian, bigTiff, firstIFDOffset, options);
	}
	/**
	* Closes the underlying file buffer
	* N.B. After the GeoTIFF has been completely processed it needs
	* to be closed but only if it has been constructed from a file.
	*/
	close() {
		if (typeof this.source.close === "function") return this.source.close();
		return false;
	}
};
/**
* Wrapper for GeoTIFF files that have external overviews.
* @augments GeoTIFFBase
*/
var MultiGeoTIFF = class extends GeoTIFFBase {
	/**
	* Construct a new MultiGeoTIFF from a main and several overview files.
	* @param {GeoTIFF} mainFile The main GeoTIFF file.
	* @param {GeoTIFF[]} overviewFiles An array of overview files.
	*/
	constructor(mainFile, overviewFiles) {
		super();
		this.mainFile = mainFile;
		this.overviewFiles = overviewFiles;
		this.imageFiles = [mainFile].concat(overviewFiles);
		this.fileDirectoriesPerFile = null;
		this.fileDirectoriesPerFileParsing = null;
		this.imageCount = null;
	}
	async parseFileDirectoriesPerFile() {
		const requests = [this.mainFile.parseFileDirectoryAt(this.mainFile.firstIFDOffset)].concat(this.overviewFiles.map((file) => file.parseFileDirectoryAt(file.firstIFDOffset)));
		this.fileDirectoriesPerFile = await Promise.all(requests);
		return this.fileDirectoriesPerFile;
	}
	/**
	* Get the n-th internal subfile of an image. By default, the first is returned.
	*
	* @param {number} [index=0] the index of the image to return.
	* @returns {Promise<GeoTIFFImage>} the image at the given index
	*/
	async getImage(index = 0) {
		await this.getImageCount();
		await this.parseFileDirectoriesPerFile();
		let visited = 0;
		let relativeIndex = 0;
		for (let i = 0; i < this.imageFiles.length; i++) {
			const imageFile = this.imageFiles[i];
			for (let ii = 0; ii < this.imageCounts[i]; ii++) {
				if (index === visited) {
					const ifd = await imageFile.requestIFD(relativeIndex);
					return new GeoTIFFImage(ifd.fileDirectory, ifd.geoKeyDirectory, imageFile.dataView, imageFile.littleEndian, imageFile.cache, imageFile.source);
				}
				visited++;
				relativeIndex++;
			}
			relativeIndex = 0;
		}
		throw new RangeError("Invalid image index");
	}
	/**
	* Returns the count of the internal subfiles.
	*
	* @returns {Promise<number>} the number of internal subfile images
	*/
	async getImageCount() {
		if (this.imageCount !== null) return this.imageCount;
		const requests = [this.mainFile.getImageCount()].concat(this.overviewFiles.map((file) => file.getImageCount()));
		this.imageCounts = await Promise.all(requests);
		this.imageCount = this.imageCounts.reduce((count, ifds) => count + ifds, 0);
		return this.imageCount;
	}
};
/**
* Creates a new GeoTIFF from a remote URL.
* @param {string} url The URL to access the image from
* @param {object} [options] Additional options to pass to the source.
*                           See {@link makeRemoteSource} for details.
* @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
*                               to be aborted
* @returns {Promise<GeoTIFF>} The resulting GeoTIFF file.
*/
async function fromUrl(url, options = {}, signal) {
	return GeoTIFF.fromSource(makeRemoteSource(url, options), signal);
}
/**
* Construct a GeoTIFF from an HTML
* [Blob]{@link https://developer.mozilla.org/en-US/docs/Web/API/Blob} or
* [File]{@link https://developer.mozilla.org/en-US/docs/Web/API/File}
* object.
* @param {Blob|File} blob The Blob or File object to read from.
* @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
*                               to be aborted
* @returns {Promise<GeoTIFF>} The resulting GeoTIFF file.
*/
async function fromBlob(blob, signal) {
	return GeoTIFF.fromSource(makeFileReaderSource(blob), signal);
}
/**
* Construct a MultiGeoTIFF from the given URLs.
* @param {string} mainUrl The URL for the main file.
* @param {string[]} overviewUrls An array of URLs for the overview images.
* @param {Object} [options] Additional options to pass to the source.
*                           See [makeRemoteSource]{@link module:source.makeRemoteSource}
*                           for details.
* @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
*                               to be aborted
* @returns {Promise<MultiGeoTIFF>} The resulting MultiGeoTIFF file.
*/
async function fromUrls(mainUrl, overviewUrls = [], options = {}, signal) {
	return new MultiGeoTIFF(await GeoTIFF.fromSource(makeRemoteSource(mainUrl, options), signal), await Promise.all(overviewUrls.map((url) => GeoTIFF.fromSource(makeRemoteSource(url, options)))));
}
//#endregion
//#region node_modules/ol/source/GeoTIFF.js
/**
* @module ol/source/GeoTIFF
*/
/**
* Determine if an image type is a mask.
* See https://www.awaresystems.be/imaging/tiff/tifftags/newsubfiletype.html
* @param {GeoTIFFImage} image The image.
* @return {boolean} The image is a mask.
*/
function isMask(image) {
	return ((image.fileDirectory.NewSubfileType || 0) & 4) === 4;
}
/**
* @param {true|false|'auto'} preference The convertToRGB option.
* @param {GeoTIFFImage} image The image.
* @return {boolean} Use the `image.readRGB()` method.
*/
function readRGB(preference, image) {
	if (!preference) return false;
	if (preference === true) return true;
	if (image.getSamplesPerPixel() !== 3) return false;
	const interpretation = image.fileDirectory.PhotometricInterpretation;
	const interpretations = photometricInterpretations;
	return interpretation === interpretations.CMYK || interpretation === interpretations.YCbCr || interpretation === interpretations.CIELab || interpretation === interpretations.ICCLab;
}
/**
* @typedef {Object} SourceInfo
* @property {string} [url] URL for the source GeoTIFF.
* @property {Array<string>} [overviews] List of any overview URLs, only applies if the url parameter is given.
* @property {Blob} [blob] Blob containing the source GeoTIFF. `blob` and `url` are mutually exclusive.
* @property {number} [min=0] The minimum source data value.  Rendered values are scaled from 0 to 1 based on
* the configured min and max.  If not provided and raster statistics are available, those will be used instead.
* If neither are available, the minimum for the data type will be used.  To disable this behavior, set
* the `normalize` option to `false` in the constructor.
* @property {number} [max] The maximum source data value.  Rendered values are scaled from 0 to 1 based on
* the configured min and max.  If not provided and raster statistics are available, those will be used instead.
* If neither are available, the maximum for the data type will be used.  To disable this behavior, set
* the `normalize` option to `false` in the constructor.
* @property {number} [nodata] Values to discard (overriding any nodata values in the metadata).
* When provided, an additional alpha band will be added to the data.  Often the GeoTIFF metadata
* will include information about nodata values, so you should only need to set this property if
* you find that it is not already extracted from the metadata.
* @property {Array<number>} [bands] Band numbers to be read from (where the first band is `1`). If not provided, all bands will
* be read. For example, if a GeoTIFF has blue (1), green (2), red (3), and near-infrared (4) bands, and you only need the
* near-infrared band, configure `bands: [4]`.
*/
/**
* @typedef {Object} GeoKeys
* @property {number} GTModelTypeGeoKey Model type.
* @property {number} GTRasterTypeGeoKey Raster type.
* @property {number} GeogAngularUnitsGeoKey Angular units.
* @property {number} GeogInvFlatteningGeoKey Inverse flattening.
* @property {number} GeogSemiMajorAxisGeoKey Semi-major axis.
* @property {number} GeographicTypeGeoKey Geographic coordinate system code.
* @property {number} ProjLinearUnitsGeoKey Projected linear unit code.
* @property {number} ProjectedCSTypeGeoKey Projected coordinate system code.
*/
/**
* @typedef {import("geotiff").GeoTIFF} GeoTIFF
*/
/**
* @typedef {import("geotiff").MultiGeoTIFF} MultiGeoTIFF
*/
/**
* @typedef {Object} GDALMetadata
* @property {string} STATISTICS_MINIMUM The minimum value (as a string).
* @property {string} STATISTICS_MAXIMUM The maximum value (as a string).
*/
var STATISTICS_MAXIMUM = "STATISTICS_MAXIMUM";
var STATISTICS_MINIMUM = "STATISTICS_MINIMUM";
var defaultTileSize = 256;
/**
* @typedef {import("geotiff").GeoTIFFImage} GeoTIFFImage
*/
var workerPool;
function getWorkerPool() {
	if (!workerPool) workerPool = new Pool();
	return workerPool;
}
/**
* Get the bounding box of an image.  If the image does not have an affine transform,
* the pixel bounds are returned.
* @param {GeoTIFFImage} image The image.
* @return {Array<number>} The image bounding box.
*/
function getBoundingBox(image) {
	try {
		return image.getBoundingBox(true);
	} catch {
		return [
			0,
			0,
			image.getWidth(),
			image.getHeight()
		];
	}
}
/**
* Get the origin of an image.  If the image does not have an affine transform,
* the top-left corner of the pixel bounds is returned.
* @param {GeoTIFFImage} image The image.
* @return {Array<number>} The image origin.
*/
function getOrigin(image) {
	try {
		return image.getOrigin().slice(0, 2);
	} catch {
		return [0, image.getHeight()];
	}
}
/**
* Get the resolution of an image.  If the image does not have an affine transform,
* the width of the image is compared with the reference image.
* @param {GeoTIFFImage} image The image.
* @param {GeoTIFFImage} referenceImage The reference image.
* @return {Array<number>} The map x and y units per pixel.
*/
function getResolutions(image, referenceImage) {
	try {
		return image.getResolution(referenceImage);
	} catch {
		return [referenceImage.getWidth() / image.getWidth(), referenceImage.getHeight() / image.getHeight()];
	}
}
/**
* @param {GeoTIFFImage} image A GeoTIFF.
* @return {import("../proj/Projection.js").default} The image projection.
*/
function getProjection(image) {
	const geoKeys = image.geoKeys;
	if (!geoKeys) return null;
	if (geoKeys.ProjectedCSTypeGeoKey && geoKeys.ProjectedCSTypeGeoKey !== 32767) {
		const code = "EPSG:" + geoKeys.ProjectedCSTypeGeoKey;
		let projection = get(code);
		if (!projection) {
			const units = fromCode(geoKeys.ProjLinearUnitsGeoKey);
			if (units) projection = new Projection({
				code,
				units
			});
		}
		return projection;
	}
	if (geoKeys.GeographicTypeGeoKey && geoKeys.GeographicTypeGeoKey !== 32767) {
		const code = "EPSG:" + geoKeys.GeographicTypeGeoKey;
		let projection = get(code);
		if (!projection) {
			const units = fromCode(geoKeys.GeogAngularUnitsGeoKey);
			if (units) projection = new Projection({
				code,
				units
			});
		}
		return projection;
	}
	return null;
}
/**
* @param {GeoTIFF|MultiGeoTIFF} tiff A GeoTIFF.
* @return {Promise<Array<GeoTIFFImage>>} Resolves to a list of images.
*/
function getImagesForTIFF(tiff) {
	return tiff.getImageCount().then(function(count) {
		const requests = new Array(count);
		for (let i = 0; i < count; ++i) requests[i] = tiff.getImage(i);
		return Promise.all(requests);
	});
}
/**
* @param {SourceInfo} source The GeoTIFF source.
* @param {Object} options Options for the GeoTIFF source.
* @return {Promise<Array<GeoTIFFImage>>} Resolves to a list of images.
*/
function getImagesForSource(source, options) {
	let request;
	if (source.blob) request = fromBlob(source.blob);
	else if (source.overviews) request = fromUrls(source.url, source.overviews, options);
	else request = fromUrl(source.url, options);
	return request.then(getImagesForTIFF);
}
/**
* @param {number|Array<number>|Array<Array<number>>} expected Expected value.
* @param {number|Array<number>|Array<Array<number>>} got Actual value.
* @param {number} tolerance Accepted tolerance in fraction of expected between expected and got.
* @param {string} message The error message.
* @param {function(Error):void} rejector A function to be called with any error.
*/
function assertEqual(expected, got, tolerance, message, rejector) {
	if (Array.isArray(expected)) {
		const length = expected.length;
		if (!Array.isArray(got) || length != got.length) {
			const error = new Error(message);
			rejector(error);
			throw error;
		}
		for (let i = 0; i < length; ++i) assertEqual(expected[i], got[i], tolerance, message, rejector);
		return;
	}
	got = got;
	if (Math.abs(expected - got) > tolerance * expected) throw new Error(message);
}
/**
* @param {Array} array The data array.
* @return {number} The minimum value.
*/
function getMinForDataType(array) {
	if (array instanceof Int8Array) return -128;
	if (array instanceof Int16Array) return -32768;
	if (array instanceof Int32Array) return -2147483648;
	if (array instanceof Float32Array) return 12e-39;
	return 0;
}
/**
* @param {Array} array The data array.
* @return {number} The maximum value.
*/
function getMaxForDataType(array) {
	if (array instanceof Int8Array) return 127;
	if (array instanceof Uint8Array) return 255;
	if (array instanceof Uint8ClampedArray) return 255;
	if (array instanceof Int16Array) return 32767;
	if (array instanceof Uint16Array) return 65535;
	if (array instanceof Int32Array) return 2147483647;
	if (array instanceof Uint32Array) return 4294967295;
	if (array instanceof Float32Array) return 34e37;
	return 255;
}
/**
* @typedef {Object} GeoTIFFSourceOptions
* @property {boolean} [forceXHR=false] Whether to force the usage of the browsers XMLHttpRequest API.
* @property {Object<string, string>} [headers] additional key-value pairs of headers to be passed with each request. Key is the header name, value the header value.
* @property {string} [credentials] How credentials shall be handled. See
* https://developer.mozilla.org/en-US/docs/Web/API/fetch for reference and possible values
* @property {number} [maxRanges] The maximum amount of ranges to request in a single multi-range request.
* By default only a single range is used.
* @property {boolean} [allowFullFile=false] Whether or not a full file is accepted when only a portion is
* requested. Only use this when you know the source image to be small enough to fit in memory.
* @property {number} [blockSize=65536] The block size to use.
* @property {number} [cacheSize=100] The number of blocks that shall be held in a LRU cache.
*/
/**
* @typedef {Object} Options
* @property {Array<SourceInfo>} sources List of information about GeoTIFF sources.
* Multiple sources can be combined when their resolution sets are equal after applying a scale.
* The list of sources defines a mapping between input bands as they are read from each GeoTIFF and
* the output bands that are provided by data tiles. To control which bands to read from each GeoTIFF,
* use the {@link import("./GeoTIFF.js").SourceInfo bands} property. If, for example, you specify two
* sources, one with 3 bands and {@link import("./GeoTIFF.js").SourceInfo nodata} configured, and
* another with 1 band, the resulting data tiles will have 5 bands: 3 from the first source, 1 alpha
* band from the first source, and 1 band from the second source.
* @property {GeoTIFFSourceOptions} [sourceOptions] Additional options to be passed to [geotiff.js](https://geotiffjs.github.io/geotiff.js/module-geotiff.html)'s `fromUrl` or `fromUrls` methods.
* @property {true|false|'auto'} [convertToRGB=false] By default, bands from the sources are read as-is. When
* reading GeoTIFFs with the purpose of displaying them as RGB images, setting this to `true` will
* convert other color spaces (YCbCr, CMYK) to RGB.  Setting the option to `'auto'` will make it so CMYK, YCbCr,
* CIELab, and ICCLab images will automatically be converted to RGB.
* @property {boolean} [normalize=true] By default, the source data is normalized to values between
* 0 and 1 with scaling factors based on the raster statistics or `min` and `max` properties of each source.
* If instead you want to work with the raw values in a style expression, set this to `false`.  Setting this option
* to `false` will make it so any `min` and `max` properties on sources are ignored.
* @property {import("../proj.js").ProjectionLike} [projection] Source projection.  If not provided, the GeoTIFF metadata
* will be read for projection information.
* @property {number} [transition=250] Duration of the opacity transition for rendering.
* To disable the opacity transition, pass `transition: 0`.
* @property {boolean} [wrapX=false] Render tiles beyond the tile grid extent.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* the linear interpolation is used to resample the data.  If false, nearest neighbor is used.
*/
/**
* @classdesc
* A source for working with GeoTIFF data.
* **Note for users of the full build**: The `GeoTIFF` source requires the
* [geotiff.js](https://github.com/geotiffjs/geotiff.js) library to be loaded as well.
*
* @api
*/
var GeoTIFFSource = class extends DataTileSource {
	/**
	* @param {Options} options Data tile options.
	*/
	constructor(options) {
		super({
			state: "loading",
			tileGrid: null,
			projection: options.projection || null,
			transition: options.transition,
			interpolate: options.interpolate !== false,
			wrapX: options.wrapX
		});
		/**
		* @type {Array<SourceInfo>}
		* @private
		*/
		this.sourceInfo_ = options.sources;
		const numSources = this.sourceInfo_.length;
		/**
		* @type {Object}
		* @private
		*/
		this.sourceOptions_ = options.sourceOptions;
		/**
		* @type {Array<Array<GeoTIFFImage>>}
		* @private
		*/
		this.sourceImagery_ = new Array(numSources);
		/**
		* @type {Array<Array<GeoTIFFImage>>}
		* @private
		*/
		this.sourceMasks_ = new Array(numSources);
		/**
		* @type {Array<number>}
		* @private
		*/
		this.resolutionFactors_ = new Array(numSources);
		/**
		* @type {Array<number>}
		* @private
		*/
		this.samplesPerPixel_;
		/**
		* @type {Array<Array<number>>}
		* @private
		*/
		this.nodataValues_;
		/**
		* @type {Array<Array<GDALMetadata>>}
		* @private
		*/
		this.metadata_;
		/**
		* @type {boolean}
		* @private
		*/
		this.normalize_ = options.normalize !== false;
		/**
		* @type {boolean}
		* @private
		*/
		this.addAlpha_ = false;
		/**
		* @type {Error}
		* @private
		*/
		this.error_ = null;
		/**
		* @type {true|false|'auto'}
		* @private
		*/
		this.convertToRGB_ = options.convertToRGB || false;
		this.setKey(this.sourceInfo_.map((source) => source.url).join(","));
		const self = this;
		const requests = new Array(numSources);
		for (let i = 0; i < numSources; ++i) requests[i] = getImagesForSource(this.sourceInfo_[i], this.sourceOptions_);
		Promise.all(requests).then(function(sources) {
			self.configure_(sources);
		}).catch(function(error$3) {
			error(error$3);
			self.error_ = error$3;
			self.setState("error");
		});
	}
	/**
	* @return {Error} A source loading error. When the source state is `error`, use this function
	* to get more information about the error. To debug a faulty configuration, you may want to use
	* a listener like
	* ```js
	* geotiffSource.on('change', () => {
	*   if (geotiffSource.getState() === 'error') {
	*     console.error(geotiffSource.getError());
	*   }
	* });
	* ```
	*/
	getError() {
		return this.error_;
	}
	/**
	* Determine the projection of the images in this GeoTIFF.
	* The default implementation looks at the ProjectedCSTypeGeoKey and the GeographicTypeGeoKey
	* of each image in turn.
	* You can override this method in a subclass to support more projections.
	*
	* @param {Array<Array<GeoTIFFImage>>} sources Each source is a list of images
	* from a single GeoTIFF.
	*/
	determineProjection(sources) {
		const firstSource = sources[0];
		for (let i = firstSource.length - 1; i >= 0; --i) {
			const image = firstSource[i];
			const projection = getProjection(image);
			if (projection) {
				this.projection = projection;
				break;
			}
		}
	}
	/**
	* Determine any transform matrix for the images in this GeoTIFF.
	*
	* @param {Array<Array<GeoTIFFImage>>} sources Each source is a list of images
	* from a single GeoTIFF.
	*/
	determineTransformMatrix(sources) {
		const firstSource = sources[0];
		for (let i = firstSource.length - 1; i >= 0; --i) {
			const modelTransformation = firstSource[i].fileDirectory.ModelTransformation;
			if (modelTransformation) {
				const [a, b, c, d, e, f, g, h] = modelTransformation;
				this.transformMatrix = multiply(multiply([
					1 / Math.sqrt(a * a + e * e),
					0,
					0,
					-1 / Math.sqrt(b * b + f * f),
					d,
					h
				], [
					a,
					e,
					b,
					f,
					0,
					0
				]), [
					1,
					0,
					0,
					1,
					-d,
					-h
				]);
				this.addAlpha_ = true;
				break;
			}
		}
	}
	/**
	* Configure the tile grid based on images within the source GeoTIFFs.  Each GeoTIFF
	* must have the same internal tiled structure.
	* @param {Array<Array<GeoTIFFImage>>} sources Each source is a list of images
	* from a single GeoTIFF.
	* @private
	*/
	configure_(sources) {
		let extent;
		let origin;
		let commonRenderTileSizes;
		let commonSourceTileSizes;
		let resolutions;
		const samplesPerPixel = new Array(sources.length);
		const nodataValues = new Array(sources.length);
		const metadata = new Array(sources.length);
		let minZoom = 0;
		const sourceCount = sources.length;
		for (let sourceIndex = 0; sourceIndex < sourceCount; ++sourceIndex) {
			const images = [];
			const masks = [];
			sources[sourceIndex].forEach((item) => {
				if (isMask(item)) masks.push(item);
				else images.push(item);
			});
			const imageCount = images.length;
			if (masks.length > 0 && masks.length !== imageCount) throw new Error(`Expected one mask per image found ${masks.length} masks and ${imageCount} images`);
			let sourceExtent;
			let sourceOrigin;
			const sourceTileSizes = new Array(imageCount);
			const renderTileSizes = new Array(imageCount);
			const sourceResolutions = new Array(imageCount);
			nodataValues[sourceIndex] = new Array(imageCount);
			metadata[sourceIndex] = new Array(imageCount);
			for (let imageIndex = 0; imageIndex < imageCount; ++imageIndex) {
				const image = images[imageIndex];
				const nodataValue = image.getGDALNoData();
				metadata[sourceIndex][imageIndex] = image.getGDALMetadata(0);
				nodataValues[sourceIndex][imageIndex] = nodataValue;
				const wantedSamples = this.sourceInfo_[sourceIndex].bands;
				samplesPerPixel[sourceIndex] = wantedSamples ? wantedSamples.length : image.getSamplesPerPixel();
				const level = imageCount - (imageIndex + 1);
				if (!sourceExtent) sourceExtent = getBoundingBox(image);
				if (!sourceOrigin) sourceOrigin = getOrigin(image);
				const imageResolutions = getResolutions(image, images[0]);
				sourceResolutions[level] = imageResolutions[0];
				const sourceTileSize = [image.getTileWidth(), image.getTileHeight()];
				if (sourceTileSize[0] !== sourceTileSize[1] && sourceTileSize[1] < defaultTileSize) {
					sourceTileSize[0] = defaultTileSize;
					sourceTileSize[1] = defaultTileSize;
				}
				sourceTileSizes[level] = sourceTileSize;
				const aspectRatio = imageResolutions[0] / Math.abs(imageResolutions[1]);
				renderTileSizes[level] = [sourceTileSize[0], sourceTileSize[1] / aspectRatio];
			}
			if (!extent) extent = sourceExtent;
			else getIntersection(extent, sourceExtent, extent);
			if (!origin) origin = sourceOrigin;
			else {
				const message = `Origin mismatch for source ${sourceIndex}, got [${sourceOrigin}] but expected [${origin}]`;
				assertEqual(origin, sourceOrigin, 0, message, this.viewRejector);
			}
			if (!resolutions) {
				resolutions = sourceResolutions;
				this.resolutionFactors_[sourceIndex] = 1;
			} else {
				if (resolutions.length - minZoom > sourceResolutions.length) minZoom = resolutions.length - sourceResolutions.length;
				const resolutionFactor = resolutions[resolutions.length - 1] / sourceResolutions[sourceResolutions.length - 1];
				this.resolutionFactors_[sourceIndex] = resolutionFactor;
				const scaledSourceResolutions = sourceResolutions.map((resolution) => resolution *= resolutionFactor);
				const message = `Resolution mismatch for source ${sourceIndex}, got [${scaledSourceResolutions}] but expected [${resolutions}]`;
				assertEqual(resolutions.slice(minZoom, resolutions.length), scaledSourceResolutions, .02, message, this.viewRejector);
			}
			if (!commonRenderTileSizes) commonRenderTileSizes = renderTileSizes;
			else assertEqual(commonRenderTileSizes.slice(minZoom, commonRenderTileSizes.length), renderTileSizes, .01, `Tile size mismatch for source ${sourceIndex}`, this.viewRejector);
			if (!commonSourceTileSizes) commonSourceTileSizes = sourceTileSizes;
			else assertEqual(commonSourceTileSizes.slice(minZoom, commonSourceTileSizes.length), sourceTileSizes, 0, `Tile size mismatch for source ${sourceIndex}`, this.viewRejector);
			this.sourceImagery_[sourceIndex] = images.reverse();
			this.sourceMasks_[sourceIndex] = masks.reverse();
		}
		for (let i = 0, ii = this.sourceImagery_.length; i < ii; ++i) {
			const sourceImagery = this.sourceImagery_[i];
			while (sourceImagery.length < resolutions.length) sourceImagery.unshift(void 0);
		}
		if (!this.getProjection()) this.determineProjection(sources);
		this.determineTransformMatrix(sources);
		this.samplesPerPixel_ = samplesPerPixel;
		this.nodataValues_ = nodataValues;
		this.metadata_ = metadata;
		outer: for (let sourceIndex = 0; sourceIndex < sourceCount; ++sourceIndex) {
			if (this.sourceInfo_[sourceIndex].nodata !== void 0) {
				this.addAlpha_ = true;
				break;
			}
			if (this.sourceMasks_[sourceIndex].length) {
				this.addAlpha_ = true;
				break;
			}
			const values = nodataValues[sourceIndex];
			const bands = this.sourceInfo_[sourceIndex].bands;
			if (bands) {
				for (let i = 0; i < bands.length; ++i) if (values[bands[i] - 1] !== null) {
					this.addAlpha_ = true;
					break outer;
				}
				continue;
			}
			for (let imageIndex = 0; imageIndex < values.length; ++imageIndex) if (values[imageIndex] !== null) {
				this.addAlpha_ = true;
				break outer;
			}
		}
		let bandCount = this.addAlpha_ ? 1 : 0;
		for (let sourceIndex = 0; sourceIndex < sourceCount; ++sourceIndex) bandCount += samplesPerPixel[sourceIndex];
		this.bandCount = bandCount;
		this.tileGrid = new TileGrid({
			extent,
			minZoom,
			origin,
			resolutions,
			tileSizes: commonRenderTileSizes
		});
		this.setTileSizes(commonSourceTileSizes);
		this.setLoader(this.loadTile_.bind(this));
		this.setState("ready");
		const zoom = 1;
		if (resolutions.length === 2) resolutions = [
			resolutions[0],
			resolutions[1],
			resolutions[1] / 2
		];
		else if (resolutions.length === 1) resolutions = [
			resolutions[0] * 2,
			resolutions[0],
			resolutions[0] / 2
		];
		let viewExtent = extent;
		if (this.transformMatrix) {
			const matrix = makeInverse(create$1(), this.transformMatrix.slice());
			const transformFn = createTransformFromCoordinateTransform((input) => apply(matrix, input));
			viewExtent = applyTransform(extent, transformFn);
		}
		this.viewResolver({
			showFullExtent: true,
			projection: this.projection,
			resolutions,
			center: toUserCoordinate(getCenter(viewExtent), this.projection),
			extent: toUserExtent(viewExtent, this.projection),
			zoom
		});
	}
	/**
	* @param {number} z The z tile index.
	* @param {number} x The x tile index.
	* @param {number} y The y tile index.
	* @param {import('./DataTile.js').LoaderOptions} options The loader options.
	* @return {Promise} The composed tile data.
	* @private
	*/
	loadTile_(z, x, y, options) {
		const sourceTileSize = this.getTileSize(z);
		const sourceCount = this.sourceImagery_.length;
		const requests = new Array(sourceCount * 2);
		const nodataValues = this.nodataValues_;
		const sourceInfo = this.sourceInfo_;
		const pool = getWorkerPool();
		for (let sourceIndex = 0; sourceIndex < sourceCount; ++sourceIndex) {
			const source = sourceInfo[sourceIndex];
			const resolutionFactor = this.resolutionFactors_[sourceIndex];
			const pixelBounds = [
				Math.round(x * (sourceTileSize[0] * resolutionFactor)),
				Math.round(y * (sourceTileSize[1] * resolutionFactor)),
				Math.round((x + 1) * (sourceTileSize[0] * resolutionFactor)),
				Math.round((y + 1) * (sourceTileSize[1] * resolutionFactor))
			];
			const image = this.sourceImagery_[sourceIndex][z];
			let samples;
			if (source.bands) samples = source.bands.map(function(bandNumber) {
				return bandNumber - 1;
			});
			/** @type {number|Array<number>} */
			let fillValue;
			if ("nodata" in source && source.nodata !== null) fillValue = source.nodata;
			else if (!samples) fillValue = nodataValues[sourceIndex];
			else fillValue = samples.map(function(sampleIndex) {
				return nodataValues[sourceIndex][sampleIndex];
			});
			const readOptions = {
				window: pixelBounds,
				width: sourceTileSize[0],
				height: sourceTileSize[1],
				samples,
				fillValue,
				pool,
				interleave: false,
				signal: options.signal
			};
			if (readRGB(this.convertToRGB_, image)) requests[sourceIndex] = image.readRGB(readOptions);
			else requests[sourceIndex] = image.readRasters(readOptions);
			const maskIndex = sourceCount + sourceIndex;
			const mask = this.sourceMasks_[sourceIndex][z];
			if (!mask) {
				requests[maskIndex] = Promise.resolve(null);
				continue;
			}
			requests[maskIndex] = mask.readRasters({
				window: pixelBounds,
				width: sourceTileSize[0],
				height: sourceTileSize[1],
				samples: [0],
				pool,
				interleave: false
			});
		}
		return Promise.all(requests).then(this.composeTile_.bind(this, sourceTileSize)).catch(function(error$4) {
			error(error$4);
			throw error$4;
		});
	}
	/**
	* @param {import("../size.js").Size} sourceTileSize The source tile size.
	* @param {Array} sourceSamples The source samples.
	* @return {import("../DataTile.js").Data} The composed tile data.
	* @private
	*/
	composeTile_(sourceTileSize, sourceSamples) {
		const metadata = this.metadata_;
		const sourceInfo = this.sourceInfo_;
		const sourceCount = this.sourceImagery_.length;
		const bandCount = this.bandCount;
		const samplesPerPixel = this.samplesPerPixel_;
		const nodataValues = this.nodataValues_;
		const normalize = this.normalize_;
		const addAlpha = this.addAlpha_;
		const pixelCount = sourceTileSize[0] * sourceTileSize[1];
		const dataLength = pixelCount * bandCount;
		/** @type {Uint8Array|Float32Array} */
		let data;
		if (normalize) data = new Uint8Array(dataLength);
		else data = new Float32Array(dataLength);
		let dataIndex = 0;
		for (let pixelIndex = 0; pixelIndex < pixelCount; ++pixelIndex) {
			let transparent = addAlpha;
			for (let sourceIndex = 0; sourceIndex < sourceCount; ++sourceIndex) {
				const source = sourceInfo[sourceIndex];
				let min = source.min;
				let max = source.max;
				let gain, bias;
				if (normalize) {
					const stats = metadata[sourceIndex][0];
					if (min === void 0) if (stats && STATISTICS_MINIMUM in stats) min = parseFloat(stats[STATISTICS_MINIMUM]);
					else min = getMinForDataType(sourceSamples[sourceIndex][0]);
					if (max === void 0) if (stats && STATISTICS_MAXIMUM in stats) max = parseFloat(stats[STATISTICS_MAXIMUM]);
					else max = getMaxForDataType(sourceSamples[sourceIndex][0]);
					gain = 255 / (max - min);
					bias = -min * gain;
				}
				for (let sampleIndex = 0; sampleIndex < samplesPerPixel[sourceIndex]; ++sampleIndex) {
					const sourceValue = sourceSamples[sourceIndex][sampleIndex][pixelIndex];
					let value;
					if (normalize) value = clamp(gain * sourceValue + bias, 0, 255);
					else value = sourceValue;
					if (!addAlpha) data[dataIndex] = value;
					else {
						let nodata = source.nodata;
						if (nodata === void 0) {
							let bandIndex;
							if (source.bands) bandIndex = source.bands[sampleIndex] - 1;
							else bandIndex = sampleIndex;
							nodata = nodataValues[sourceIndex][bandIndex];
						}
						const nodataIsNaN = isNaN(nodata);
						if (!nodataIsNaN && sourceValue !== nodata || nodataIsNaN && !isNaN(sourceValue)) {
							transparent = false;
							data[dataIndex] = value;
						}
					}
					dataIndex++;
				}
				if (!transparent) {
					const mask = sourceSamples[sourceCount + sourceIndex];
					if (mask && !mask[0][pixelIndex]) transparent = true;
				}
			}
			if (addAlpha) {
				if (!transparent) data[dataIndex] = 255;
				dataIndex++;
			}
		}
		return data;
	}
};
/**
* Get a promise for view properties based on the source.  Use the result of this function
* as the `view` option in a map constructor.
*
*     const source = new GeoTIFF(options);
*
*     const map = new Map({
*       target: 'map',
*       layers: [
*         new TileLayer({
*           source: source,
*         }),
*       ],
*       view: source.getView(),
*     });
*
* @function
* @return {Promise<import("../View.js").ViewOptions>} A promise for view-related properties.
* @api
*
*/
GeoTIFFSource.prototype.getView;
//#endregion
//#region node_modules/ol/source/Google.js
/**
* @module ol/source/Google
*/
var createSessionUrl = "https://tile.googleapis.com/v1/createSession";
var tileUrl = "https://tile.googleapis.com/v1/2dtiles";
var attributionUrl = "https://tile.googleapis.com/tile/v1/viewport";
var maxZoom = 22;
/**
* @typedef {Object} Options
* @property {string} key Google Map Tiles API key. Get yours at https://developers.google.com/maps/documentation/tile/get-api-key.
* @property {string} [mapType='roadmap'] The type of [base map](https://developers.google.com/maps/documentation/tile/session_tokens#required_fields).
* @property {string} [language='en-US'] An [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) for information displayed on the tiles.
* @property {string} [region='US'] A [Common Locale Data Repository](https://cldr.unicode.org/) (CLDR) region identifier that represents the user location.
* @property {string} [imageFormat] The image format used for the map tiles (e.g. `'jpeg'`, or `'png'`).
* @property {string} [scale] Scale for map elements (`'scaleFactor1x'`, `'scaleFactor2x'`, or `'scaleFactor4x'`).
* @property {boolean} [highDpi=false] Use high-resolution tiles.
* @property {Array<string>} [layerTypes] The layer types added to the map (e.g. `'layerRoadmap'`, `'layerStreetview'`, or `'layerTraffic'`).
* @property {boolean} [overlay=false] Display only the `layerTypes` and not the underlying `mapType` (only works if `layerTypes` is provided).
* @property {Array<Object>} [styles] [Custom styles](https://developers.google.com/maps/documentation/tile/style-reference) applied to the map.
* @property {boolean} [attributionsCollapsible=true] Allow the attributions to be collapsed.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {number} [cacheSize] Initial tile cache size. Will auto-grow to hold at least the number of tiles in the viewport.
* @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
* Higher values can increase reprojection performance, but decrease precision.
* @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
* ```js
* function(imageTile, src) {
*   imageTile.getImage().src = src;
* };
* ```
* @property {Array<string>} [apiOptions] An array of values specifying additional options to apply.
* @property {boolean} [wrapX=true] Wrap the world horizontally.
* @property {number} [transition] Duration of the opacity transition for rendering.
* To disable the opacity transition, pass `transition: 0`.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
/**
* @typedef {Object} SessionTokenRequest
* @property {string} mapType The map type.
* @property {string} language The language.
* @property {string} region The region.
* @property {string} [imageFormat] The image format.
* @property {string} [scale] The scale.
* @property {boolean} [highDpi] Use high resolution tiles.
* @property {Array<string>} [layerTypes] The layer types.
* @property {boolean} [overlay] The overlay.
* @property {Array<Object>} [styles] The styles.
* @property {Array<string>} [apiOptions] An array of values specifying additional options to apply.
*/
/**
* @typedef {Object} SessionTokenResponse
* @property {string} session The session token.
* @property {string} expiry The session token expiry (seconds since the epoch as a string).
* @property {number} tileWidth The tile width.
* @property {number} tileHeight The tile height.
* @property {string} imageFormat The image format.
*/
/**
* @classdesc
* A tile layer source that renders tiles from the Google [Map Tiles API](https://developers.google.com/maps/documentation/tile/overview).
* The constructor takes options that are passed to the request to create a session token.  Refer to the
* [documentation](https://developers.google.com/maps/documentation/tile/session_tokens#required_fields)
* for additional details.
* @api
*/
var Google = class extends TileImage {
	/**
	* @param {Options} options Google Maps options.
	*/
	constructor(options) {
		const highDpi = !!options.highDpi;
		super({
			attributionsCollapsible: options.attributionsCollapsible,
			cacheSize: options.cacheSize,
			crossOrigin: "anonymous",
			interpolate: options.interpolate,
			projection: "EPSG:3857",
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			state: "loading",
			tileLoadFunction: options.tileLoadFunction,
			tilePixelRatio: highDpi ? 2 : 1,
			wrapX: options.wrapX !== void 0 ? options.wrapX : true,
			transition: options.transition,
			zDirection: options.zDirection
		});
		/**
		* @type {string}
		* @private
		*/
		this.apiKey_ = options.key;
		/**
		* @type {Error|null}
		* @private
		*/
		this.error_ = null;
		/**
		* @type {SessionTokenRequest}
		*/
		const sessionTokenRequest = {
			mapType: options.mapType || "roadmap",
			language: options.language || "en-US",
			region: options.region || "US"
		};
		if (options.imageFormat) sessionTokenRequest.imageFormat = options.imageFormat;
		if (options.scale) sessionTokenRequest.scale = options.scale;
		if (highDpi) sessionTokenRequest.highDpi = true;
		if (options.layerTypes) sessionTokenRequest.layerTypes = options.layerTypes;
		if (options.styles) sessionTokenRequest.styles = options.styles;
		if (options.overlay === true) sessionTokenRequest.overlay = true;
		if (options.apiOptions) sessionTokenRequest.apiOptions = options.apiOptions;
		/**
		* @type {SessionTokenRequest}
		* @private
		*/
		this.sessionTokenRequest_ = sessionTokenRequest;
		/**
		* @type {string}
		* @private
		*/
		this.sessionTokenValue_;
		/**
		* @type {ReturnType<typeof setTimeout>}
		* @private
		*/
		this.sessionRefreshId_;
		/**
		* @type {string}
		* @private
		*/
		this.previousViewportAttribution_;
		/**
		* @type {string}
		* @private
		*/
		this.previousViewportExtent_;
		this.createSession_();
	}
	/**
	* @return {Error|null} A source loading error. When the source state is `error`, use this function
	* to get more information about the error. To debug a faulty configuration, you may want to use
	* a listener like
	* ```js
	* source.on('change', () => {
	*   if (source.getState() === 'error') {
	*     console.error(source.getError());
	*   }
	* });
	* ```
	*/
	getError() {
		return this.error_;
	}
	/**
	* Exposed here so it can be overridden in the tests.
	* @param {string} url The URL.
	* @param {RequestInit} config The config.
	* @return {Promise<Response>} A promise that resolves with the response.
	*/
	fetchSessionToken(url, config) {
		return fetch(url, config);
	}
	/**
	* Get or renew a session token for use with tile requests.
	* @private
	*/
	async createSession_() {
		const url = createSessionUrl + "?key=" + this.apiKey_;
		const config = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(this.sessionTokenRequest_)
		};
		const response = await this.fetchSessionToken(url, config);
		if (!response.ok) {
			try {
				const body = await response.json();
				this.error_ = new Error(body.error.message);
			} catch {
				this.error_ = /* @__PURE__ */ new Error("Error fetching session token");
			}
			this.setState("error");
			return;
		}
		/**
		* @type {SessionTokenResponse}
		*/
		const sessionTokenResponse = await response.json();
		const tilePixelRatio = this.getTilePixelRatio(1);
		const tileSize = [sessionTokenResponse.tileWidth / tilePixelRatio, sessionTokenResponse.tileHeight / tilePixelRatio];
		this.tileGrid = createXYZ({
			extent: extentFromProjection(this.getProjection()),
			maxZoom,
			tileSize
		});
		const session = sessionTokenResponse.session;
		this.sessionTokenValue_ = session;
		const key = this.apiKey_;
		this.tileUrlFunction = function(tileCoord, pixelRatio, projection) {
			return `${tileUrl}/${tileCoord[0]}/${tileCoord[1]}/${tileCoord[2]}?session=${session}&key=${key}`;
		};
		const expiry = parseInt(sessionTokenResponse.expiry, 10) * 1e3;
		const timeout = Math.max(expiry - Date.now() - 60 * 1e3, 1);
		this.sessionRefreshId_ = setTimeout(() => this.createSession_(), timeout);
		this.setAttributions(this.fetchAttributions_.bind(this));
		this.setState("ready");
	}
	/**
	* @param {import('../Map.js').FrameState} frameState The frame state.
	* @return {Promise<string>} The attributions.
	* @private
	*/
	async fetchAttributions_(frameState) {
		if (frameState.viewHints[ViewHint_default.ANIMATING] || frameState.viewHints[ViewHint_default.INTERACTING] || frameState.animate) return this.previousViewportAttribution_;
		const [west, south] = toLonLat(getBottomLeft(frameState.extent), frameState.viewState.projection);
		const [east, north] = toLonLat(getTopRight(frameState.extent), frameState.viewState.projection);
		const viewportExtent = `zoom=${this.getTileGrid().getZForResolution(frameState.viewState.resolution, this.zDirection)}&north=${north}&south=${south}&east=${east}&west=${west}`;
		if (this.previousViewportExtent_ == viewportExtent) return this.previousViewportAttribution_;
		this.previousViewportExtent_ = viewportExtent;
		const url = `${attributionUrl}?session=${this.sessionTokenValue_}&key=${this.apiKey_}&${viewportExtent}`;
		this.previousViewportAttribution_ = await fetch(url).then((response) => response.json()).then((json) => json.copyright);
		return this.previousViewportAttribution_;
	}
	/**
	* @override
	*/
	disposeInternal() {
		clearTimeout(this.sessionRefreshId_);
		super.disposeInternal();
	}
};
//#endregion
//#region node_modules/ol/format/IIIFInfo.js
/**
* @typedef {Object} PreferredOptions
* @property {string} [format] Preferred image format. Will be used if the image information
* indicates support for that format.
* @property {string} [quality] IIIF image qualitiy.  Will be used if the image information
* indicates support for that quality.
*/
/**
* @typedef {Object} SupportedFeatures
* @property {Array<string>} [supports] Supported IIIF image size and region
* calculation features.
* @property {Array<string>} [formats] Supported image formats.
* @property {Array<string>} [qualities] Supported IIIF image qualities.
*/
/**
* @typedef {Object} TileInfo
* @property {Array<number>} scaleFactors Supported resolution scaling factors.
* @property {number} width Tile width in pixels.
* @property {number} [height] Tile height in pixels. Same as tile width if height is
* not given.
*/
/**
* @typedef {Object} IiifProfile
* @property {Array<string>} [formats] Supported image formats for the image service.
* @property {Array<string>} [qualities] Supported IIIF image qualities.
* @property {Array<string>} [supports] Supported features.
* @property {number} [maxArea] Maximum area (pixels) available for this image service.
* @property {number} [maxHeight] Maximum height.
* @property {number} [maxWidth] Maximum width.
*/
/**
* @typedef {Object<string,string|number|Array<number|string|IiifProfile|Object<string, number>|TileInfo>>}
*    ImageInformationResponse
*/
/**
* Enum representing the major IIIF Image API versions
* @enum {string}
*/
var Versions = {
	VERSION1: "version1",
	VERSION2: "version2",
	VERSION3: "version3"
};
/**
* Supported image formats, qualities and supported region / size calculation features
* for different image API versions and compliance levels
* @const
* @type {Object<string, Object<string, SupportedFeatures>>}
*/
var IIIF_PROFILE_VALUES = {};
IIIF_PROFILE_VALUES[Versions.VERSION1] = {
	"level0": {
		supports: [],
		formats: [],
		qualities: ["native"]
	},
	"level1": {
		supports: [
			"regionByPx",
			"sizeByW",
			"sizeByH",
			"sizeByPct"
		],
		formats: ["jpg"],
		qualities: ["native"]
	},
	"level2": {
		supports: [
			"regionByPx",
			"regionByPct",
			"sizeByW",
			"sizeByH",
			"sizeByPct",
			"sizeByConfinedWh",
			"sizeByWh"
		],
		formats: ["jpg", "png"],
		qualities: [
			"native",
			"color",
			"grey",
			"bitonal"
		]
	}
};
IIIF_PROFILE_VALUES[Versions.VERSION2] = {
	"level0": {
		supports: [],
		formats: ["jpg"],
		qualities: ["default"]
	},
	"level1": {
		supports: [
			"regionByPx",
			"sizeByW",
			"sizeByH",
			"sizeByPct"
		],
		formats: ["jpg"],
		qualities: ["default"]
	},
	"level2": {
		supports: [
			"regionByPx",
			"regionByPct",
			"sizeByW",
			"sizeByH",
			"sizeByPct",
			"sizeByConfinedWh",
			"sizeByDistortedWh",
			"sizeByWh"
		],
		formats: ["jpg", "png"],
		qualities: ["default", "bitonal"]
	}
};
IIIF_PROFILE_VALUES[Versions.VERSION3] = {
	"level0": {
		supports: [],
		formats: ["jpg"],
		qualities: ["default"]
	},
	"level1": {
		supports: [
			"regionByPx",
			"regionSquare",
			"sizeByW",
			"sizeByH",
			"sizeByWh"
		],
		formats: ["jpg"],
		qualities: ["default"]
	},
	"level2": {
		supports: [
			"regionByPx",
			"regionSquare",
			"regionByPct",
			"sizeByW",
			"sizeByH",
			"sizeByPct",
			"sizeByConfinedWh",
			"sizeByWh"
		],
		formats: ["jpg", "png"],
		qualities: ["default"]
	}
};
IIIF_PROFILE_VALUES["none"] = { "none": {
	supports: [],
	formats: [],
	qualities: []
} };
function generateVersion1Options(iiifInfo) {
	let levelProfile = iiifInfo.getComplianceLevelSupportedFeatures();
	if (levelProfile === void 0) levelProfile = IIIF_PROFILE_VALUES[Versions.VERSION1]["level0"];
	return {
		url: iiifInfo.imageInfo["@id"] === void 0 ? void 0 : iiifInfo.imageInfo["@id"].replace(/\/?(?:info\.json)?$/g, ""),
		supports: levelProfile.supports,
		formats: [...levelProfile.formats, iiifInfo.imageInfo.formats === void 0 ? [] : iiifInfo.imageInfo.formats],
		qualities: [...levelProfile.qualities, iiifInfo.imageInfo.qualities === void 0 ? [] : iiifInfo.imageInfo.qualities],
		resolutions: iiifInfo.imageInfo.scale_factors,
		tileSize: iiifInfo.imageInfo.tile_width !== void 0 ? iiifInfo.imageInfo.tile_height !== void 0 ? [iiifInfo.imageInfo.tile_width, iiifInfo.imageInfo.tile_height] : [iiifInfo.imageInfo.tile_width, iiifInfo.imageInfo.tile_width] : iiifInfo.imageInfo.tile_height != void 0 ? [iiifInfo.imageInfo.tile_height, iiifInfo.imageInfo.tile_height] : void 0
	};
}
function generateVersion2Options(iiifInfo) {
	const levelProfile = iiifInfo.getComplianceLevelSupportedFeatures(), additionalProfile = Array.isArray(iiifInfo.imageInfo.profile) && iiifInfo.imageInfo.profile.length > 1, profileSupports = additionalProfile && iiifInfo.imageInfo.profile[1].supports ? iiifInfo.imageInfo.profile[1].supports : [], profileFormats = additionalProfile && iiifInfo.imageInfo.profile[1].formats ? iiifInfo.imageInfo.profile[1].formats : [], profileQualities = additionalProfile && iiifInfo.imageInfo.profile[1].qualities ? iiifInfo.imageInfo.profile[1].qualities : [];
	return {
		url: iiifInfo.imageInfo["@id"].replace(/\/?(?:info\.json)?$/g, ""),
		sizes: iiifInfo.imageInfo.sizes === void 0 ? void 0 : iiifInfo.imageInfo.sizes.map(function(size) {
			return [size.width, size.height];
		}),
		tileSize: iiifInfo.imageInfo.tiles === void 0 ? void 0 : [iiifInfo.imageInfo.tiles.map(function(tile) {
			return tile.width;
		})[0], iiifInfo.imageInfo.tiles.map(function(tile) {
			return tile.height === void 0 ? tile.width : tile.height;
		})[0]],
		resolutions: iiifInfo.imageInfo.tiles === void 0 ? void 0 : iiifInfo.imageInfo.tiles.map(function(tile) {
			return tile.scaleFactors;
		})[0],
		supports: [...levelProfile.supports, ...profileSupports],
		formats: [...levelProfile.formats, ...profileFormats],
		qualities: [...levelProfile.qualities, ...profileQualities]
	};
}
function generateVersion3Options(iiifInfo) {
	const levelProfile = iiifInfo.getComplianceLevelSupportedFeatures(), formats = iiifInfo.imageInfo.extraFormats === void 0 ? levelProfile.formats : [...levelProfile.formats, ...iiifInfo.imageInfo.extraFormats], preferredFormat = iiifInfo.imageInfo.preferredFormats !== void 0 && Array.isArray(iiifInfo.imageInfo.preferredFormats) && iiifInfo.imageInfo.preferredFormats.length > 0 ? iiifInfo.imageInfo.preferredFormats.filter(function(format) {
		return [
			"jpg",
			"png",
			"gif"
		].includes(format);
	}).reduce(function(acc, format) {
		return acc === void 0 && formats.includes(format) ? format : acc;
	}, void 0) : void 0;
	return {
		url: iiifInfo.imageInfo["id"],
		sizes: iiifInfo.imageInfo.sizes === void 0 ? void 0 : iiifInfo.imageInfo.sizes.map(function(size) {
			return [size.width, size.height];
		}),
		tileSize: iiifInfo.imageInfo.tiles === void 0 ? void 0 : [iiifInfo.imageInfo.tiles.map(function(tile) {
			return tile.width;
		})[0], iiifInfo.imageInfo.tiles.map(function(tile) {
			return tile.height;
		})[0]],
		resolutions: iiifInfo.imageInfo.tiles === void 0 ? void 0 : iiifInfo.imageInfo.tiles.map(function(tile) {
			return tile.scaleFactors;
		})[0],
		supports: iiifInfo.imageInfo.extraFeatures === void 0 ? levelProfile.supports : [...levelProfile.supports, ...iiifInfo.imageInfo.extraFeatures],
		formats,
		qualities: iiifInfo.imageInfo.extraQualities === void 0 ? levelProfile.qualities : [...levelProfile.qualities, ...iiifInfo.imageInfo.extraQualities],
		preferredFormat
	};
}
var versionFunctions = {};
versionFunctions[Versions.VERSION1] = generateVersion1Options;
versionFunctions[Versions.VERSION2] = generateVersion2Options;
versionFunctions[Versions.VERSION3] = generateVersion3Options;
//#endregion
//#region node_modules/ol/source/Zoomify.js
/**
* @module ol/source/Zoomify
*/
/**
* @typedef {'default' | 'truncated'} TierSizeCalculation
*/
var CustomTile$1 = class extends ImageTile {
	/**
	* @param {import("../size.js").Size} tileSize Full tile size.
	* @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
	* @param {import("../TileState.js").default} state State.
	* @param {string} src Image source URI.
	* @param {?string} crossOrigin Cross origin.
	* @param {import("../Tile.js").LoadFunction} tileLoadFunction Tile load function.
	* @param {import("../Tile.js").Options} [options] Tile options.
	*/
	constructor(tileSize, tileCoord, state, src, crossOrigin, tileLoadFunction, options) {
		super(tileCoord, state, src, crossOrigin, tileLoadFunction, options);
		/**
		* @private
		* @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement}
		*/
		this.zoomifyImage_ = null;
		/**
		* @private
		* @type {import("../size.js").Size}
		*/
		this.tileSize_ = tileSize;
	}
	/**
	* Get the image element for this tile.
	* @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
	* @override
	*/
	getImage() {
		if (this.zoomifyImage_) return this.zoomifyImage_;
		const image = super.getImage();
		if (this.state == TileState_default.LOADED) {
			const tileSize = this.tileSize_;
			if (image.width == tileSize[0] && image.height == tileSize[1]) {
				this.zoomifyImage_ = image;
				return image;
			}
			const context = createCanvasContext2D(tileSize[0], tileSize[1]);
			context.drawImage(image, 0, 0);
			this.zoomifyImage_ = context.canvas;
			return context.canvas;
		}
		return image;
	}
};
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value  you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {import("../proj.js").ProjectionLike} [projection] Projection.
* @property {number} [tilePixelRatio] The pixel ratio used by the tile service. For example, if the tile service advertizes 256px by 256px tiles but actually sends 512px by 512px images (for retina/hidpi devices) then `tilePixelRatio` should be set to `2`
* @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
* Higher values can increase reprojection performance, but decrease precision.
* @property {string} url URL template or base URL of the Zoomify service.
* A base URL is the fixed part
* of the URL, excluding the tile group, z, x, and y folder structure, e.g.
* `http://my.zoomify.info/IMAGE.TIF/`. A URL template must include
* `{TileGroup}`, `{x}`, `{y}`, and `{z}` placeholders, e.g.
* `http://my.zoomify.info/IMAGE.TIF/{TileGroup}/{z}-{x}-{y}.jpg`.
* Internet Imaging Protocol (IIP) with JTL extension can be also used with
* `{tileIndex}` and `{z}` placeholders, e.g.
* `http://my.zoomify.info?FIF=IMAGE.TIF&JTL={z},{tileIndex}`.
* A `{?-?}` template pattern, for example `subdomain{a-f}.domain.com`, may be
* used instead of defining each one separately in the `urls` option.
* @property {TierSizeCalculation} [tierSizeCalculation] Tier size calculation method: `default` or `truncated`.
* @property {import("../size.js").Size} size Size.
* @property {import("../extent.js").Extent} [extent] Extent for the TileGrid that is created.
* Default sets the TileGrid in the
* fourth quadrant, meaning extent is `[0, -height, width, 0]`. To change the
* extent to the first quadrant (the default for OpenLayers 2) set the extent
* as `[0, 0, width, height]`.
* @property {number} [transition] Duration of the opacity transition for rendering.
* To disable the opacity transition, pass `transition: 0`.
* @property {number} [tileSize=256] Tile size. Same tile size is used for all zoom levels.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
/**
* @classdesc
* Layer source for tile data in Zoomify format (both Zoomify and Internet
* Imaging Protocol are supported).
* @api
*/
var Zoomify = class extends TileImage {
	/**
	* @param {Options} options Options.
	*/
	constructor(options) {
		const size = options.size;
		const tierSizeCalculation = options.tierSizeCalculation !== void 0 ? options.tierSizeCalculation : "default";
		const tilePixelRatio = options.tilePixelRatio || 1;
		const imageWidth = size[0];
		const imageHeight = size[1];
		const tierSizeInTiles = [];
		const tileSize = options.tileSize || 256;
		let tileSizeForTierSizeCalculation = tileSize * tilePixelRatio;
		switch (tierSizeCalculation) {
			case "default":
				while (imageWidth > tileSizeForTierSizeCalculation || imageHeight > tileSizeForTierSizeCalculation) {
					tierSizeInTiles.push([Math.ceil(imageWidth / tileSizeForTierSizeCalculation), Math.ceil(imageHeight / tileSizeForTierSizeCalculation)]);
					tileSizeForTierSizeCalculation += tileSizeForTierSizeCalculation;
				}
				break;
			case "truncated":
				let width = imageWidth;
				let height = imageHeight;
				while (width > tileSizeForTierSizeCalculation || height > tileSizeForTierSizeCalculation) {
					tierSizeInTiles.push([Math.ceil(width / tileSizeForTierSizeCalculation), Math.ceil(height / tileSizeForTierSizeCalculation)]);
					width >>= 1;
					height >>= 1;
				}
				break;
			default: throw new Error("Unknown `tierSizeCalculation` configured");
		}
		tierSizeInTiles.push([1, 1]);
		tierSizeInTiles.reverse();
		const resolutions = [tilePixelRatio];
		const tileCountUpToTier = [0];
		for (let i = 1, ii = tierSizeInTiles.length; i < ii; i++) {
			resolutions.push(tilePixelRatio << i);
			tileCountUpToTier.push(tierSizeInTiles[i - 1][0] * tierSizeInTiles[i - 1][1] + tileCountUpToTier[i - 1]);
		}
		resolutions.reverse();
		const tileGrid = new TileGrid({
			tileSize,
			extent: options.extent || [
				0,
				-imageHeight,
				imageWidth,
				0
			],
			resolutions
		});
		let url = options.url;
		if (url && !url.includes("{TileGroup}") && !url.includes("{tileIndex}")) url += "{TileGroup}/{z}-{x}-{y}.jpg";
		const urls = expandUrl(url);
		let tileWidth = tileSize * tilePixelRatio;
		/**
		* @param {string} template Template.
		* @return {import("../Tile.js").UrlFunction} Tile URL function.
		*/
		function createFromTemplate(template) {
			return (function(tileCoord, pixelRatio, projection) {
				if (!tileCoord) return;
				const tileCoordZ = tileCoord[0];
				const tileCoordX = tileCoord[1];
				const tileCoordY = tileCoord[2];
				const tileIndex = tileCoordX + tileCoordY * tierSizeInTiles[tileCoordZ][0];
				const tileGroup = (tileIndex + tileCountUpToTier[tileCoordZ]) / tileWidth | 0;
				const localContext = {
					"z": tileCoordZ,
					"x": tileCoordX,
					"y": tileCoordY,
					"tileIndex": tileIndex,
					"TileGroup": "TileGroup" + tileGroup
				};
				return template.replace(/\{(\w+?)\}/g, function(m, p) {
					return localContext[p];
				});
			});
		}
		const tileUrlFunction = createFromTileUrlFunctions(urls.map(createFromTemplate));
		const ZoomifyTileClass = CustomTile$1.bind(null, toSize(tileSize * tilePixelRatio));
		super({
			attributions: options.attributions,
			cacheSize: options.cacheSize,
			crossOrigin: options.crossOrigin,
			interpolate: options.interpolate,
			projection: options.projection,
			tilePixelRatio,
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			tileClass: ZoomifyTileClass,
			tileGrid,
			tileUrlFunction,
			transition: options.transition
		});
		/**
		* @type {number|import("../array.js").NearestDirectionFunction}
		*/
		this.zDirection = options.zDirection;
		const testTileUrl = tileUrlFunction(tileGrid.getTileCoordForCoordAndResolution(getCenter(tileGrid.getExtent()), resolutions[resolutions.length - 1]), 1, null);
		const image = new Image();
		image.addEventListener("error", () => {
			tileWidth = tileSize;
			this.changed();
		});
		image.src = testTileUrl;
	}
};
//#endregion
//#region node_modules/ol/source/IIIF.js
/**
* @module ol/source/IIIF
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {null|string} [crossOrigin] The value for the crossOrigin option of the request.
* @property {import("../extent.js").Extent} [extent=[0, -height, width, 0]] The extent.
* @property {string} [format='jpg'] Requested image format.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {import("../proj.js").ProjectionLike} [projection] Projection.
* @property {string} [quality] Requested IIIF image quality. Default is 'native'
* for version 1, 'default' for versions 2 and 3.
* @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
* Higher values can increase reprojection performance, but decrease precision.
* @property {Array<number>} [resolutions] Supported resolutions as given in IIIF 'scaleFactors'
* @property {import("../size.js").Size} size Size of the image [width, height].
* @property {Array<import("../size.js").Size>} [sizes] Supported scaled image sizes.
* Content of the IIIF info.json 'sizes' property, but as array of Size objects.
* @property {import("./Source.js").State} [state] Source state.
* @property {Array<string>} [supports=[]] Supported IIIF region and size calculation
* features.
* @property {number} [tilePixelRatio] Tile pixel ratio.
* @property {number|import("../size.js").Size} [tileSize] Tile size.
* Same tile size is used for all zoom levels. If tile size is a number,
* a square tile is assumed. If the IIIF image service supports arbitrary
* tiling (sizeByH, sizeByW, sizeByWh or sizeByPct as well as regionByPx or regionByPct
* are supported), the default tilesize is 256.
* @property {number} [transition] Transition.
* @property {string} [url] Base URL of the IIIF Image service.
* This should be the same as the IIIF Image ID.
* @property {import("../format/IIIFInfo.js").Versions} [version=Versions.VERSION2] Service's IIIF Image API version.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
function formatPercentage(percentage) {
	return percentage.toLocaleString("en", { maximumFractionDigits: 10 });
}
/**
* @classdesc
* Layer source for IIIF Image API services.
* @api
*/
var IIIF = class extends TileImage {
	/**
	* @param {Options} [options] Tile source options. Use {@link import("../format/IIIFInfo.js").IIIFInfo}
	* to parse Image API service information responses into constructor options.
	* @api
	*/
	constructor(options) {
		/**
		* @type {Partial<Options>}
		*/
		const partialOptions = options || {};
		let baseUrl = partialOptions.url || "";
		baseUrl = baseUrl + (baseUrl.lastIndexOf("/") === baseUrl.length - 1 || baseUrl === "" ? "" : "/");
		const version = partialOptions.version || Versions.VERSION2;
		const sizes = partialOptions.sizes || [];
		const size = partialOptions.size;
		assert(size != void 0 && Array.isArray(size) && size.length == 2 && !isNaN(size[0]) && size[0] > 0 && !isNaN(size[1]) && size[1] > 0, "Missing or invalid `size`");
		const width = size[0];
		const height = size[1];
		const tileSize = partialOptions.tileSize;
		const tilePixelRatio = partialOptions.tilePixelRatio || 1;
		const format = partialOptions.format || "jpg";
		const quality = partialOptions.quality || (partialOptions.version == Versions.VERSION1 ? "native" : "default");
		let resolutions = partialOptions.resolutions || [];
		const supports = partialOptions.supports || [];
		const extent = partialOptions.extent || [
			0,
			-height,
			width,
			0
		];
		const supportsListedSizes = sizes != void 0 && Array.isArray(sizes) && sizes.length > 0;
		const supportsListedTiles = tileSize !== void 0 && (typeof tileSize === "number" && Number.isInteger(tileSize) && tileSize > 0 || Array.isArray(tileSize) && tileSize.length > 0);
		const supportsArbitraryTiling = supports != void 0 && Array.isArray(supports) && (supports.includes("regionByPx") || supports.includes("regionByPct")) && (supports.includes("sizeByWh") || supports.includes("sizeByH") || supports.includes("sizeByW") || supports.includes("sizeByPct"));
		let tileWidth, tileHeight, maxZoom;
		resolutions.sort(function(a, b) {
			return b - a;
		});
		if (supportsListedTiles || supportsArbitraryTiling) {
			if (tileSize != void 0) {
				if (typeof tileSize === "number" && Number.isInteger(tileSize) && tileSize > 0) {
					tileWidth = tileSize;
					tileHeight = tileSize;
				} else if (Array.isArray(tileSize) && tileSize.length > 0) {
					if (tileSize.length == 1 || tileSize[1] == void 0 && Number.isInteger(tileSize[0])) {
						tileWidth = tileSize[0];
						tileHeight = tileSize[0];
					}
					if (tileSize.length == 2) {
						if (Number.isInteger(tileSize[0]) && Number.isInteger(tileSize[1])) {
							tileWidth = tileSize[0];
							tileHeight = tileSize[1];
						} else if (tileSize[0] == void 0 && Number.isInteger(tileSize[1])) {
							tileWidth = tileSize[1];
							tileHeight = tileSize[1];
						}
					}
				}
			}
			if (tileWidth === void 0 || tileHeight === void 0) {
				tileWidth = 256;
				tileHeight = 256;
			}
			if (resolutions.length == 0) {
				maxZoom = Math.max(Math.ceil(Math.log(width / tileWidth) / Math.LN2), Math.ceil(Math.log(height / tileHeight) / Math.LN2));
				for (let i = maxZoom; i >= 0; i--) resolutions.push(Math.pow(2, i));
			} else {
				const maxScaleFactor = Math.max(...resolutions);
				maxZoom = Math.round(Math.log(maxScaleFactor) / Math.LN2);
			}
		} else {
			tileWidth = width;
			tileHeight = height;
			resolutions = [];
			if (supportsListedSizes) {
				sizes.sort(function(a, b) {
					return a[0] - b[0];
				});
				maxZoom = -1;
				const ignoredSizesIndex = [];
				for (let i = 0; i < sizes.length; i++) {
					const resolution = width / sizes[i][0];
					if (resolutions.length > 0 && resolutions[resolutions.length - 1] == resolution) {
						ignoredSizesIndex.push(i);
						continue;
					}
					resolutions.push(resolution);
					maxZoom++;
				}
				if (ignoredSizesIndex.length > 0) for (let i = 0; i < ignoredSizesIndex.length; i++) sizes.splice(ignoredSizesIndex[i] - i, 1);
			} else {
				resolutions.push(1);
				sizes.push([width, height]);
				maxZoom = 0;
			}
		}
		const tileGrid = new TileGrid({
			tileSize: [tileWidth, tileHeight],
			extent,
			origin: getTopLeft(extent),
			resolutions
		});
		const tileUrlFunction = function(tileCoord, pixelRatio, projection) {
			let regionParam, sizeParam;
			const zoom = tileCoord[0];
			if (zoom > maxZoom) return;
			const tileX = tileCoord[1], tileY = tileCoord[2], scale = resolutions[zoom];
			if (tileX === void 0 || tileY === void 0 || scale === void 0 || tileX < 0 || Math.ceil(width / scale / tileWidth) <= tileX || tileY < 0 || Math.ceil(height / scale / tileHeight) <= tileY) return;
			if (supportsArbitraryTiling || supportsListedTiles) {
				const regionX = tileX * tileWidth * scale, regionY = tileY * tileHeight * scale;
				let regionW = tileWidth * scale, regionH = tileHeight * scale, sizeW = tileWidth, sizeH = tileHeight;
				if (regionX + regionW > width) regionW = width - regionX;
				if (regionY + regionH > height) regionH = height - regionY;
				if (regionX + tileWidth * scale > width) sizeW = Math.floor((width - regionX + scale - 1) / scale);
				if (regionY + tileHeight * scale > height) sizeH = Math.floor((height - regionY + scale - 1) / scale);
				if (regionX == 0 && regionW == width && regionY == 0 && regionH == height) regionParam = "full";
				else if (!supportsArbitraryTiling || supports.includes("regionByPx")) regionParam = regionX + "," + regionY + "," + regionW + "," + regionH;
				else if (supports.includes("regionByPct")) {
					const pctX = formatPercentage(regionX / width * 100), pctY = formatPercentage(regionY / height * 100), pctW = formatPercentage(regionW / width * 100), pctH = formatPercentage(regionH / height * 100);
					regionParam = "pct:" + pctX + "," + pctY + "," + pctW + "," + pctH;
				}
				if (version == Versions.VERSION3 && (!supportsArbitraryTiling || supports.includes("sizeByWh"))) sizeParam = sizeW + "," + sizeH;
				else if (!supportsArbitraryTiling || supports.includes("sizeByW")) sizeParam = sizeW + ",";
				else if (supports.includes("sizeByH")) sizeParam = "," + sizeH;
				else if (supports.includes("sizeByWh")) sizeParam = sizeW + "," + sizeH;
				else if (supports.includes("sizeByPct")) sizeParam = "pct:" + formatPercentage(100 / scale);
			} else {
				regionParam = "full";
				if (supportsListedSizes) {
					const regionWidth = sizes[zoom][0], regionHeight = sizes[zoom][1];
					if (version == Versions.VERSION3) if (regionWidth == width && regionHeight == height) sizeParam = "max";
					else sizeParam = regionWidth + "," + regionHeight;
					else if (regionWidth == width) sizeParam = "full";
					else sizeParam = regionWidth + ",";
				} else sizeParam = version == Versions.VERSION3 ? "max" : "full";
			}
			return baseUrl + regionParam + "/" + sizeParam + "/0/" + quality + "." + format;
		};
		const IiifTileClass = CustomTile$1.bind(null, toSize(tileSize || 256).map(function(size) {
			return size * tilePixelRatio;
		}));
		super({
			attributions: partialOptions.attributions,
			attributionsCollapsible: partialOptions.attributionsCollapsible,
			cacheSize: partialOptions.cacheSize,
			crossOrigin: partialOptions.crossOrigin,
			interpolate: partialOptions.interpolate,
			projection: partialOptions.projection,
			reprojectionErrorThreshold: partialOptions.reprojectionErrorThreshold,
			state: partialOptions.state,
			tileClass: IiifTileClass,
			tileGrid,
			tilePixelRatio: partialOptions.tilePixelRatio,
			tileUrlFunction,
			transition: partialOptions.transition
		});
		/**
		* @type {number|import("../array.js").NearestDirectionFunction}
		*/
		this.zDirection = partialOptions.zDirection;
	}
};
//#endregion
//#region node_modules/ol/resolution.js
/**
* @module ol/resolution
*/
/**
* @typedef {number|Array<number>} ResolutionLike
*/
/**
* @param {ResolutionLike} resolution Resolution.
* @return {number} Resolution.
*/
function fromResolutionLike(resolution) {
	if (Array.isArray(resolution)) return Math.min(...resolution);
	return resolution;
}
//#endregion
//#region node_modules/ol/reproj/Image.js
/**
* @module ol/reproj/Image
*/
/**
* @typedef {function(import("../extent.js").Extent, number, number) : import("../Image.js").default} FunctionType
*/
/**
* @classdesc
* Class encapsulating single reprojected image.
* See {@link module:ol/source/Image~ImageSource}.
*/
var ReprojImage = class extends ImageWrapper {
	/**
	* @param {import("../proj/Projection.js").default} sourceProj Source projection (of the data).
	* @param {import("../proj/Projection.js").default} targetProj Target projection.
	* @param {import("../extent.js").Extent} targetExtent Target extent.
	* @param {number} targetResolution Target resolution.
	* @param {number} pixelRatio Pixel ratio.
	* @param {FunctionType} getImageFunction
	*     Function returning source images (extent, resolution, pixelRatio).
	* @param {boolean} interpolate Use linear interpolation when resampling.
	*/
	constructor(sourceProj, targetProj, targetExtent, targetResolution, pixelRatio, getImageFunction, interpolate) {
		let maxSourceExtent = sourceProj.getExtent();
		if (maxSourceExtent && sourceProj.canWrapX()) {
			maxSourceExtent = maxSourceExtent.slice();
			maxSourceExtent[0] = -Infinity;
			maxSourceExtent[2] = Infinity;
		}
		let maxTargetExtent = targetProj.getExtent();
		if (maxTargetExtent && targetProj.canWrapX()) {
			maxTargetExtent = maxTargetExtent.slice();
			maxTargetExtent[0] = -Infinity;
			maxTargetExtent[2] = Infinity;
		}
		const limitedTargetExtent = maxTargetExtent ? getIntersection(targetExtent, maxTargetExtent) : targetExtent;
		const sourceResolution = calculateSourceResolution(sourceProj, targetProj, getCenter(limitedTargetExtent), targetResolution);
		const triangulation = new Triangulation(sourceProj, targetProj, limitedTargetExtent, maxSourceExtent, sourceResolution * ERROR_THRESHOLD, targetResolution);
		const sourceExtent = triangulation.calculateSourceExtent();
		const sourceImage = isEmpty$1(sourceExtent) ? null : getImageFunction(sourceExtent, sourceResolution, pixelRatio);
		const state = sourceImage ? ImageState_default.IDLE : ImageState_default.EMPTY;
		const sourcePixelRatio = sourceImage ? sourceImage.getPixelRatio() : 1;
		super(targetExtent, targetResolution, sourcePixelRatio, state);
		/**
		* @private
		* @type {import("../proj/Projection.js").default}
		*/
		this.targetProj_ = targetProj;
		/**
		* @private
		* @type {import("../extent.js").Extent}
		*/
		this.maxSourceExtent_ = maxSourceExtent;
		/**
		* @private
		* @type {!import("./Triangulation.js").default}
		*/
		this.triangulation_ = triangulation;
		/**
		* @private
		* @type {number}
		*/
		this.targetResolution_ = targetResolution;
		/**
		* @private
		* @type {import("../extent.js").Extent}
		*/
		this.targetExtent_ = targetExtent;
		/**
		* @private
		* @type {import("../Image.js").default}
		*/
		this.sourceImage_ = sourceImage;
		/**
		* @private
		* @type {number}
		*/
		this.sourcePixelRatio_ = sourcePixelRatio;
		/**
		* @private
		* @type {boolean}
		*/
		this.interpolate_ = interpolate;
		/**
		* @private
		* @type {HTMLCanvasElement}
		*/
		this.canvas_ = null;
		/**
		* @private
		* @type {?import("../events.js").EventsKey}
		*/
		this.sourceListenerKey_ = null;
	}
	/**
	* Clean up.
	* @override
	*/
	disposeInternal() {
		if (this.state == ImageState_default.LOADING) this.unlistenSource_();
		super.disposeInternal();
	}
	/**
	* @return {HTMLCanvasElement} Image.
	* @override
	*/
	getImage() {
		return this.canvas_;
	}
	/**
	* @return {import("../proj/Projection.js").default} Projection.
	*/
	getProjection() {
		return this.targetProj_;
	}
	/**
	* @private
	*/
	reproject_() {
		const sourceState = this.sourceImage_.getState();
		if (sourceState == ImageState_default.LOADED) this.canvas_ = render$1(getWidth(this.targetExtent_) / this.targetResolution_, getHeight(this.targetExtent_) / this.targetResolution_, this.sourcePixelRatio_, fromResolutionLike(this.sourceImage_.getResolution()), this.maxSourceExtent_, this.targetResolution_, this.targetExtent_, this.triangulation_, [{
			extent: this.sourceImage_.getExtent(),
			image: this.sourceImage_.getImage()
		}], 0, void 0, this.interpolate_, true);
		this.state = sourceState;
		this.changed();
	}
	/**
	* Load not yet loaded URI.
	* @override
	*/
	load() {
		if (this.state == ImageState_default.IDLE) {
			this.state = ImageState_default.LOADING;
			this.changed();
			const sourceState = this.sourceImage_.getState();
			if (sourceState == ImageState_default.LOADED || sourceState == ImageState_default.ERROR) this.reproject_();
			else {
				this.sourceListenerKey_ = listen(this.sourceImage_, EventType_default.CHANGE, (e) => {
					const sourceState = this.sourceImage_.getState();
					if (sourceState == ImageState_default.LOADED || sourceState == ImageState_default.ERROR) {
						this.unlistenSource_();
						this.reproject_();
					}
				});
				this.sourceImage_.load();
			}
		}
	}
	/**
	* @private
	*/
	unlistenSource_() {
		unlistenByKey(this.sourceListenerKey_);
		this.sourceListenerKey_ = null;
	}
};
//#endregion
//#region node_modules/ol/source/Image.js
/**
* @module ol/source/Image
*/
/**
* @enum {string}
*/
var ImageSourceEventType = {
	IMAGELOADSTART: "imageloadstart",
	IMAGELOADEND: "imageloadend",
	IMAGELOADERROR: "imageloaderror"
};
/**
* @typedef {'imageloadend'|'imageloaderror'|'imageloadstart'} ImageSourceEventTypes
*/
/**
* @classdesc
* Events emitted by {@link module:ol/source/Image~ImageSource} instances are instances of this
* type.
*/
var ImageSourceEvent = class extends BaseEvent {
	/**
	* @param {string} type Type.
	* @param {import("../Image.js").default} image The image.
	*/
	constructor(type, image) {
		super(type);
		/**
		* The image related to the event.
		* @type {import("../Image.js").default}
		* @api
		*/
		this.image = image;
	}
};
/***
* @template Return
* @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
*   import("../Observable").OnSignature<import("../ObjectEventType").Types, import("../Object").ObjectEvent, Return> &
*   import("../Observable").OnSignature<ImageSourceEventTypes, ImageSourceEvent, Return> &
*   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("../ObjectEventType").Types
*     |ImageSourceEventTypes, Return>} ImageSourceOnSignature
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {import("../Image.js").Loader} [loader] Loader. Can either be a custom loader, or one of the
* loaders created with a `createLoader()` function ({@link module:ol/source/wms.createLoader wms},
* {@link module:ol/source/arcgisRest.createLoader arcgisRest}, {@link module:ol/source/mapguide.createLoader mapguide},
* {@link module:ol/source/static.createLoader static}).
* @property {import("../proj.js").ProjectionLike} [projection] Projection.
* @property {Array<number>} [resolutions] Resolutions.
* @property {import("./Source.js").State} [state] State.
*/
/**
* @classdesc
* Base class for sources providing a single image.
* @fires module:ol/source/Image.ImageSourceEvent
* @api
*/
var ImageSource = class extends Source {
	/**
	* @param {Options} options Single image source options.
	*/
	constructor(options) {
		super({
			attributions: options.attributions,
			projection: options.projection,
			state: options.state,
			interpolate: options.interpolate !== void 0 ? options.interpolate : true
		});
		/***
		* @type {ImageSourceOnSignature<import("../events").EventsKey>}
		*/
		this.on;
		/***
		* @type {ImageSourceOnSignature<import("../events").EventsKey>}
		*/
		this.once;
		/***
		* @type {ImageSourceOnSignature<void>}
		*/
		this.un;
		/**
		* @protected
		* @type {import("../Image.js").Loader}
		*/
		this.loader = options.loader || null;
		/**
		* @private
		* @type {Array<number>|null}
		*/
		this.resolutions_ = options.resolutions !== void 0 ? options.resolutions : null;
		/**
		* @private
		* @type {import("../reproj/Image.js").default}
		*/
		this.reprojectedImage_ = null;
		/**
		* @private
		* @type {number}
		*/
		this.reprojectedRevision_ = 0;
		/**
		* @protected
		* @type {import("../Image.js").default}
		*/
		this.image = null;
		/**
		* @private
		* @type {import("../extent.js").Extent}
		*/
		this.wantedExtent_;
		/**
		* @private
		* @type {number}
		*/
		this.wantedResolution_;
		/**
		* @private
		* @type {boolean}
		*/
		this.static_ = options.loader ? options.loader.length === 0 : false;
		/**
		* @private
		* @type {import("../proj/Projection.js").default}
		*/
		this.wantedProjection_ = null;
	}
	/**
	* @return {Array<number>|null} Resolutions.
	* @override
	*/
	getResolutions() {
		return this.resolutions_;
	}
	/**
	* @param {Array<number>|null} resolutions Resolutions.
	*/
	setResolutions(resolutions) {
		this.resolutions_ = resolutions;
	}
	/**
	* @protected
	* @param {number} resolution Resolution.
	* @return {number} Resolution.
	*/
	findNearestResolution(resolution) {
		const resolutions = this.getResolutions();
		if (resolutions) resolution = resolutions[linearFindNearest(resolutions, resolution, 0)];
		return resolution;
	}
	/**
	* @param {import("../extent.js").Extent} extent Extent.
	* @param {number} resolution Resolution.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {import("../Image.js").default} Single image.
	*/
	getImage(extent, resolution, pixelRatio, projection) {
		const sourceProjection = this.getProjection();
		if (!sourceProjection || !projection || equivalent(sourceProjection, projection)) {
			if (sourceProjection) projection = sourceProjection;
			return this.getImageInternal(extent, resolution, pixelRatio, projection);
		}
		if (this.reprojectedImage_) {
			if (this.reprojectedRevision_ == this.getRevision() && equivalent(this.reprojectedImage_.getProjection(), projection) && this.reprojectedImage_.getResolution() == resolution && equals(this.reprojectedImage_.getExtent(), extent)) return this.reprojectedImage_;
			this.reprojectedImage_.dispose();
			this.reprojectedImage_ = null;
		}
		this.reprojectedImage_ = new ReprojImage(sourceProjection, projection, extent, resolution, pixelRatio, (extent, resolution, pixelRatio) => this.getImageInternal(extent, resolution, pixelRatio, sourceProjection), this.getInterpolate());
		this.reprojectedRevision_ = this.getRevision();
		return this.reprojectedImage_;
	}
	/**
	* @abstract
	* @param {import("../extent.js").Extent} extent Extent.
	* @param {number} resolution Resolution.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {import("../Image.js").default} Single image.
	* @protected
	*/
	getImageInternal(extent, resolution, pixelRatio, projection) {
		if (this.loader) {
			const requestExtent = getRequestExtent(extent, resolution, pixelRatio, 1);
			const requestResolution = this.findNearestResolution(resolution);
			if (this.image && (this.static_ || this.wantedProjection_ === projection && (this.wantedExtent_ && containsExtent(this.wantedExtent_, requestExtent) || containsExtent(this.image.getExtent(), requestExtent)) && (this.wantedResolution_ && fromResolutionLike(this.wantedResolution_) === requestResolution || fromResolutionLike(this.image.getResolution()) === requestResolution))) return this.image;
			this.wantedProjection_ = projection;
			this.wantedExtent_ = requestExtent;
			this.wantedResolution_ = requestResolution;
			this.image = new ImageWrapper(requestExtent, requestResolution, pixelRatio, this.loader);
			this.image.addEventListener(EventType_default.CHANGE, this.handleImageChange.bind(this));
		}
		return this.image;
	}
	/**
	* Handle image change events.
	* @param {import("../events/Event.js").default} event Event.
	* @protected
	*/
	handleImageChange(event) {
		const image = event.target;
		let type;
		switch (image.getState()) {
			case ImageState_default.LOADING:
				this.loading = true;
				type = ImageSourceEventType.IMAGELOADSTART;
				break;
			case ImageState_default.LOADED:
				this.loading = false;
				type = ImageSourceEventType.IMAGELOADEND;
				break;
			case ImageState_default.ERROR:
				this.loading = false;
				type = ImageSourceEventType.IMAGELOADERROR;
				break;
			default: return;
		}
		if (this.hasListener(type)) this.dispatchEvent(new ImageSourceEvent(type, image));
	}
};
/**
* Default image load function for image sources that use import("../Image.js").Image image
* instances.
* @param {import("../Image.js").default} image Image.
* @param {string} src Source.
*/
function defaultImageLoadFunction(image, src) {
	/** @type {HTMLImageElement|HTMLVideoElement} */ image.getImage().src = src;
}
/**
* Adjusts the extent so it aligns with pixel boundaries.
* @param {import("../extent.js").Extent} extent Extent.
* @param {number} resolution Reolution.
* @param {number} pixelRatio Pixel ratio.
* @param {number} ratio Ratio between request size and view size.
* @return {import("../extent.js").Extent} Request extent.
*/
function getRequestExtent(extent, resolution, pixelRatio, ratio) {
	const imageResolution = resolution / pixelRatio;
	const center = getCenter(extent);
	const viewWidth = ceil(getWidth(extent) / imageResolution, 4);
	const viewHeight = ceil(getHeight(extent) / imageResolution, 4);
	return getForViewAndSize(center, imageResolution, 0, [viewWidth + 2 * ceil((ratio - 1) * viewWidth / 2, 4), viewHeight + 2 * ceil((ratio - 1) * viewHeight / 2, 4)]);
}
//#endregion
//#region node_modules/ol/source/arcgisRest.js
/**
* @module ol/source/arcgisRest
*/
/**
* @param {string} baseUrl Base URL for the ArcGIS Rest service.
* @param {import("../extent.js").Extent} extent Extent.
* @param {number} resolution Resolution.
* @param {number} pixelRatio Pixel ratio.
* @param {import("../proj/Projection.js").default} projection Projection.
* @param {Object} params Params.
* @return {string} Request URL.
*/
function getRequestUrl$1(baseUrl, extent, resolution, pixelRatio, projection, params) {
	const srid = projection.getCode().split(/:(?=\d+$)/).pop();
	const imageResolution = resolution / pixelRatio;
	const imageSize = [round(getWidth(extent) / imageResolution, 4), round(getHeight(extent) / imageResolution, 4)];
	params["SIZE"] = imageSize[0] + "," + imageSize[1];
	params["BBOX"] = extent.join(",");
	params["BBOXSR"] = srid;
	params["IMAGESR"] = srid;
	params["DPI"] = Math.round(params["DPI"] ? params["DPI"] * pixelRatio : 90 * pixelRatio);
	return appendParams(baseUrl.replace(/MapServer\/?$/, "MapServer/export").replace(/ImageServer\/?$/, "ImageServer/exportImage"), params);
}
/**
* @typedef {Object} LoaderOptions
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting the image from
* the remote server.
* @property {Object<string,*>} [params] ArcGIS Rest parameters. This field is optional. Service
* defaults will be used for any fields not specified. `FORMAT` is `PNG32` by default. `F` is
* `IMAGE` by default. `TRANSPARENT` is `true` by default.  `BBOX`, `SIZE`, `BBOXSR`, and `IMAGESR`
* will be set dynamically. Set `LAYERS` to override the default service layer visibility. See
* https://developers.arcgis.com/rest/services-reference/export-map.htm
* for further reference.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is 'EPSG:3857'.
* The projection code must contain a numeric end portion separated by :
* or the entire code must form a valid ArcGIS SpatialReference definition.
* @property {number} [ratio=1.5] Ratio. `1` means image requests are the size of the map viewport,
* `2` means twice the size of the map viewport, and so on.
* @property {string} url ArcGIS Rest service URL for a Map Service or Image Service. The url
* should include /MapServer or /ImageServer.
* @property {function(HTMLImageElement, string): Promise<import('../DataTile.js').ImageLike>} [load] Function
* to perform loading of the image. Receives the created `HTMLImageElement` and the desired `src` as argument and
* returns a promise resolving to the loaded or decoded image. Default is {@link module:ol/Image.decode}.
*/
/**
* Creates a loader for ArcGIS Rest images.
* @param {LoaderOptions} options Image ArcGIS Rest Options.
* @return {import('../Image.js').ImageObjectPromiseLoader} ArcGIS Rest image.
* @api
*/
function createLoader(options) {
	const load = options.load ? options.load : decode;
	const projection = get(options.projection || "EPSG:3857");
	const ratio = options.ratio ?? 1.5;
	const crossOrigin = options.crossOrigin ?? null;
	return function(extent, resolution, pixelRatio) {
		pixelRatio = options.hidpi ? pixelRatio : 1;
		const params = {
			"F": "image",
			"FORMAT": "PNG32",
			"TRANSPARENT": true
		};
		Object.assign(params, options.params);
		extent = getRequestExtent(extent, resolution, pixelRatio, ratio);
		const src = getRequestUrl$1(options.url, extent, resolution, pixelRatio, projection, params);
		const image = new Image();
		image.crossOrigin = crossOrigin;
		return load(image, src).then((image) => {
			const resolution = getWidth(extent) / image.width * pixelRatio;
			return {
				image,
				extent,
				resolution,
				pixelRatio
			};
		});
	};
}
//#endregion
//#region node_modules/ol/source/ImageArcGISRest.js
/**
* @module ol/source/ImageArcGISRest
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting the image from
* the remote server.
* @property {import("../Image.js").LoadFunction} [imageLoadFunction] Optional function to load an image given
* a URL.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {Object<string,*>} [params] ArcGIS Rest parameters. This field is optional. Service
* defaults will be used for any fields not specified. `FORMAT` is `PNG32` by default. `F` is
* `IMAGE` by default. `TRANSPARENT` is `true` by default.  `BBOX`, `SIZE`, `BBOXSR`, and `IMAGESR`
* will be set dynamically. Set `LAYERS` to override the default service layer visibility. See
* https://developers.arcgis.com/rest/services-reference/export-map.htm
* for further reference.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
* The projection code must contain a numeric end portion separated by :
* or the entire code must form a valid ArcGIS SpatialReference definition.
* @property {number} [ratio=1.5] Ratio. `1` means image requests are the size of the map viewport,
* `2` means twice the size of the map viewport, and so on.
* @property {Array<number>} [resolutions] Resolutions. If specified, requests will be made for
* these resolutions only.
* @property {string} [url] ArcGIS Rest service URL for a Map Service or Image Service. The url
* should include /MapServer or /ImageServer.
*/
/**
* @classdesc
* Source for data from ArcGIS Rest services providing single, untiled images.
* Useful when underlying map service has labels.
*
* If underlying map service is not using labels,
* take advantage of ol image caching and use
* {@link module:ol/source/TileArcGISRest~TileArcGISRest} data source.
*
* @fires module:ol/source/Image.ImageSourceEvent
* @api
*/
var ImageArcGISRest = class extends ImageSource {
	/**
	* @param {Options} [options] Image ArcGIS Rest Options.
	*/
	constructor(options) {
		options = options ? options : {};
		super({
			attributions: options.attributions,
			interpolate: options.interpolate,
			projection: options.projection,
			resolutions: options.resolutions
		});
		/**
		* @private
		* @type {?string}
		*/
		this.crossOrigin_ = options.crossOrigin !== void 0 ? options.crossOrigin : null;
		/**
		* @private
		* @type {boolean}
		*/
		this.hidpi_ = options.hidpi !== void 0 ? options.hidpi : true;
		/**
		* @private
		* @type {string|undefined}
		*/
		this.url_ = options.url;
		/**
		* @private
		* @type {import("../Image.js").LoadFunction}
		*/
		this.imageLoadFunction_ = options.imageLoadFunction !== void 0 ? options.imageLoadFunction : defaultImageLoadFunction;
		/**
		* @private
		* @type {!Object}
		*/
		this.params_ = Object.assign({}, options.params);
		/**
		* @private
		* @type {import("../size.js").Size}
		*/
		this.imageSize_ = [0, 0];
		/**
		* @private
		* @type {number}
		*/
		this.renderedRevision_ = 0;
		/**
		* @private
		* @type {number}
		*/
		this.ratio_ = options.ratio !== void 0 ? options.ratio : 1.5;
		/**
		* @private
		* @type {import("../proj/Projection.js").default}
		*/
		this.loaderProjection_ = null;
	}
	/**
	* Get the user-provided params, i.e. those passed to the constructor through
	* the "params" option, and possibly updated using the updateParams method.
	* @return {Object} Params.
	* @api
	*/
	getParams() {
		return this.params_;
	}
	/**
	* @param {import("../extent.js").Extent} extent Extent.
	* @param {number} resolution Resolution.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {import("../Image.js").default} Single image.
	* @override
	*/
	getImageInternal(extent, resolution, pixelRatio, projection) {
		if (this.url_ === void 0) return null;
		if (!this.loader || this.loaderProjection_ !== projection) {
			this.loaderProjection_ = projection;
			this.loader = createLoader({
				crossOrigin: this.crossOrigin_,
				params: this.params_,
				projection,
				hidpi: this.hidpi_,
				url: this.url_,
				ratio: this.ratio_,
				load: (image, src) => {
					this.image.setImage(image);
					this.imageLoadFunction_(this.image, src);
					return decode(image);
				}
			});
		}
		return super.getImageInternal(extent, resolution, pixelRatio, projection);
	}
	/**
	* Return the image load function of the source.
	* @return {import("../Image.js").LoadFunction} The image load function.
	* @api
	*/
	getImageLoadFunction() {
		return this.imageLoadFunction_;
	}
	/**
	* Return the URL used for this ArcGIS source.
	* @return {string|undefined} URL.
	* @api
	*/
	getUrl() {
		return this.url_;
	}
	/**
	* Set the image load function of the source.
	* @param {import("../Image.js").LoadFunction} imageLoadFunction Image load function.
	* @api
	*/
	setImageLoadFunction(imageLoadFunction) {
		this.imageLoadFunction_ = imageLoadFunction;
		this.changed();
	}
	/**
	* Set the URL to use for requests.
	* @param {string|undefined} url URL.
	* @api
	*/
	setUrl(url) {
		if (url != this.url_) {
			this.url_ = url;
			this.loader = null;
			this.changed();
		}
	}
	/**
	* Set the user-provided params.
	* @param {Object} params Params.
	* @api
	*/
	setParams(params) {
		this.params_ = Object.assign({}, params);
		this.changed();
	}
	/**
	* Update the user-provided params.
	* @param {Object} params Params.
	* @api
	*/
	updateParams(params) {
		Object.assign(this.params_, params);
		this.changed();
	}
	/**
	* @override
	*/
	changed() {
		this.image = null;
		super.changed();
	}
};
//#endregion
//#region node_modules/ol/source/ImageCanvas.js
/**
* @module ol/source/ImageCanvas
*/
/**
* A function returning the canvas element (`{HTMLCanvasElement}`)
* used by the source as an image. The arguments passed to the function are:
* {@link module:ol/extent~Extent} the image extent, `{number}` the image resolution,
* `{number}` the pixel ratio of the map, {@link module:ol/size~Size} the image size,
* and {@link module:ol/proj/Projection~Projection} the image projection. The canvas returned by
* this function is cached by the source. The this keyword inside the function
* references the {@link module:ol/source/ImageCanvas~ImageCanvasSource}.
*
* @typedef {function(this:import("../ImageCanvas.js").default, import("../extent.js").Extent, number,
*     number, import("../size.js").Size, import("../proj/Projection.js").default): HTMLCanvasElement} FunctionType
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {FunctionType} [canvasFunction] Canvas function.
* The function returning the canvas element used by the source
* as an image. The arguments passed to the function are: {@link import("../extent.js").Extent} the
* image extent, `{number}` the image resolution, `{number}` the pixel ratio of the map,
* {@link import("../size.js").Size} the image size, and {@link import("../proj/Projection.js").default} the image
* projection. The canvas returned by this function is cached by the source. If
* the value returned by the function is later changed then
* `changed` should be called on the source for the source to
* invalidate the current cached image. See: {@link module:ol/Observable~Observable#changed}
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
* @property {number} [ratio=1.5] Ratio. 1 means canvases are the size of the map viewport, 2 means twice the
* width and height of the map viewport, and so on. Must be `1` or higher.
* @property {Array<number>} [resolutions] Resolutions.
* If specified, new canvases will be created for these resolutions
* @property {import("./Source.js").State} [state] Source state.
*/
/**
* @classdesc
* Base class for image sources where a canvas element is the image.
* @api
*/
var ImageCanvasSource = class extends ImageSource {
	/**
	* @param {Options} [options] ImageCanvas options.
	*/
	constructor(options) {
		options = options ? options : {};
		super({
			attributions: options.attributions,
			interpolate: options.interpolate,
			projection: options.projection,
			resolutions: options.resolutions,
			state: options.state
		});
		/**
		* @private
		* @type {FunctionType}
		*/
		this.canvasFunction_ = options.canvasFunction;
		/**
		* @private
		* @type {import("../ImageCanvas.js").default}
		*/
		this.canvas_ = null;
		/**
		* @private
		* @type {number}
		*/
		this.renderedRevision_ = 0;
		/**
		* @private
		* @type {number}
		*/
		this.ratio_ = options.ratio !== void 0 ? options.ratio : 1.5;
	}
	/**
	* @param {import("../extent.js").Extent} extent Extent.
	* @param {number} resolution Resolution.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {import("../ImageCanvas.js").default} Single image.
	* @override
	*/
	getImageInternal(extent, resolution, pixelRatio, projection) {
		resolution = this.findNearestResolution(resolution);
		let canvas = this.canvas_;
		if (canvas && this.renderedRevision_ == this.getRevision() && canvas.getResolution() == resolution && canvas.getPixelRatio() == pixelRatio && containsExtent(canvas.getExtent(), extent)) return canvas;
		extent = extent.slice();
		scaleFromCenter(extent, this.ratio_);
		const width = getWidth(extent) / resolution;
		const height = getHeight(extent) / resolution;
		const size = [width * pixelRatio, height * pixelRatio];
		const canvasElement = this.canvasFunction_.call(this, extent, resolution, pixelRatio, size, projection);
		if (canvasElement) canvas = new ImageCanvas(extent, resolution, pixelRatio, canvasElement);
		this.canvas_ = canvas;
		this.renderedRevision_ = this.getRevision();
		return canvas;
	}
};
//#endregion
//#region node_modules/ol/source/mapguide.js
/**
* @module ol/source/mapguide
*/
/**
* @typedef {Object} LoaderOptions
* @property {string} url The mapagent url.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {number} [displayDpi=96] The display resolution.
* @property {number} [metersPerUnit=1] The meters-per-unit value.
* @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
* the image from the remote server.
* @property {boolean} [useOverlay] If `true`, will use `GETDYNAMICMAPOVERLAYIMAGE`.
* @property {number} [ratio=1] Ratio. `1` means image requests are the size of the map viewport, `2` means
* twice the width and height of the map viewport, and so on. Must be `1` or higher.
* @property {Object} [params] Additional query parameters.
* @property {function(HTMLImageElement, string): Promise<import('../DataTile.js').ImageLike>} [load] Function
* to perform loading of the image. Receives the created `HTMLImageElement` and the desired `src` as argument and
* returns a promise resolving to the loaded or decoded image. Default is {@link module:ol/Image.decode}.
*/
/**
* @param {import("../extent.js").Extent} extent The map extents.
* @param {import("../size.js").Size} size The viewport size.
* @param {number} metersPerUnit The meters-per-unit value.
* @param {number} dpi The display resolution.
* @return {number} The computed map scale.
*/
function getScale(extent, size, metersPerUnit, dpi) {
	const mcsW = getWidth(extent);
	const mcsH = getHeight(extent);
	const devW = size[0];
	const devH = size[1];
	const mpp = .0254 / dpi;
	if (devH * mcsW > devW * mcsH) return mcsW * metersPerUnit / (devW * mpp);
	return mcsH * metersPerUnit / (devH * mpp);
}
/**
* @param {string} baseUrl The mapagent url.
* @param {Object<string, string|number>} params Request parameters.
* @param {import("../extent.js").Extent} extent Extent.
* @param {import("../size.js").Size} size Size.
* @param {boolean} useOverlay If `true`, will use `GETDYNAMICMAPOVERLAYIMAGE`.
* @param {number} metersPerUnit The meters-per-unit value.
* @param {number} displayDpi The display resolution.
* @return {string} The mapagent map image request URL.
*/
function getUrl(baseUrl, params, extent, size, useOverlay, metersPerUnit, displayDpi) {
	const scale = getScale(extent, size, metersPerUnit, displayDpi);
	const center = getCenter(extent);
	const baseParams = {
		"OPERATION": useOverlay ? "GETDYNAMICMAPOVERLAYIMAGE" : "GETMAPIMAGE",
		"VERSION": "2.0.0",
		"LOCALE": "en",
		"CLIENTAGENT": "ol/source/ImageMapGuide source",
		"CLIP": "1",
		"SETDISPLAYDPI": displayDpi,
		"SETDISPLAYWIDTH": Math.round(size[0]),
		"SETDISPLAYHEIGHT": Math.round(size[1]),
		"SETVIEWSCALE": scale,
		"SETVIEWCENTERX": center[0],
		"SETVIEWCENTERY": center[1]
	};
	Object.assign(baseParams, params);
	return appendParams(baseUrl, baseParams);
}
/**
* Creates a loader for MapGuide images.
* @param {LoaderOptions} options Image ArcGIS Rest Options.
* @return {import('../Image.js').ImageObjectPromiseLoader} ArcGIS Rest image.
* @api
*/
function createLoader$1(options) {
	const load = options.load || decode;
	const useOverlay = options.useOverlay ?? false;
	const metersPerUnit = options.metersPerUnit || 1;
	const displayDpi = options.displayDpi || 96;
	const ratio = options.ratio ?? 1;
	const crossOrigin = options.crossOrigin ?? null;
	return function(extent, resolution, pixelRatio) {
		const image = new Image();
		image.crossOrigin = crossOrigin;
		extent = getRequestExtent(extent, resolution, pixelRatio, ratio);
		const width = getWidth(extent) / resolution;
		const height = getHeight(extent) / resolution;
		const size = [width * pixelRatio, height * pixelRatio];
		return load(image, getUrl(options.url, options.params, extent, size, useOverlay, metersPerUnit, displayDpi)).then((image) => ({
			image,
			extent,
			pixelRatio
		}));
	};
}
//#endregion
//#region node_modules/ol/source/ImageMapGuide.js
/**
* @module ol/source/ImageMapGuide
*/
/**
* @typedef {Object} Options
* @property {string} [url] The mapagent url.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {number} [displayDpi=96] The display resolution.
* @property {number} [metersPerUnit=1] The meters-per-unit value.
* @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
* the image from the remote server.
* @property {boolean} [useOverlay] If `true`, will use `GETDYNAMICMAPOVERLAYIMAGE`.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
* @property {number} [ratio=1] Ratio. `1` means image requests are the size of the map viewport, `2` means
* twice the width and height of the map viewport, and so on. Must be `1` or higher.
* @property {Array<number>} [resolutions] Resolutions.
* If specified, requests will be made for these resolutions only.
* @property {import("../Image.js").LoadFunction} [imageLoadFunction] Optional function to load an image given a URL.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {Object} [params] Additional parameters.
*/
/**
* @classdesc
* Source for images from Mapguide servers
*
* @fires module:ol/source/Image.ImageSourceEvent
* @api
*/
var ImageMapGuide = class extends ImageSource {
	/**
	* @param {Options} options ImageMapGuide options.
	*/
	constructor(options) {
		super({
			interpolate: options.interpolate,
			projection: options.projection,
			resolutions: options.resolutions
		});
		/**
		* @private
		* @type {?string}
		*/
		this.crossOrigin_ = options.crossOrigin !== void 0 ? options.crossOrigin : null;
		/**
		* @private
		* @type {number}
		*/
		this.displayDpi_ = options.displayDpi !== void 0 ? options.displayDpi : 96;
		/**
		* @private
		* @type {!Object}
		*/
		this.params_ = Object.assign({}, options.params);
		/**
		* @private
		* @type {string|undefined}
		*/
		this.url_ = options.url;
		/**
		* @private
		* @type {import("../Image.js").LoadFunction}
		*/
		this.imageLoadFunction_ = options.imageLoadFunction !== void 0 ? options.imageLoadFunction : defaultImageLoadFunction;
		/**
		* @private
		* @type {boolean}
		*/
		this.hidpi_ = options.hidpi !== void 0 ? options.hidpi : true;
		/**
		* @private
		* @type {number}
		*/
		this.metersPerUnit_ = options.metersPerUnit !== void 0 ? options.metersPerUnit : 1;
		/**
		* @private
		* @type {number}
		*/
		this.ratio_ = options.ratio !== void 0 ? options.ratio : 1;
		/**
		* @private
		* @type {boolean}
		*/
		this.useOverlay_ = options.useOverlay !== void 0 ? options.useOverlay : false;
		/**
		* @private
		* @type {number}
		*/
		this.renderedRevision_ = 0;
		/**
		* @private
		* @type {import("../proj/Projection.js").default}
		*/
		this.loaderProjection_ = null;
	}
	/**
	* Get the user-provided params, i.e. those passed to the constructor through
	* the "params" option, and possibly updated using the updateParams method.
	* @return {Object} Params.
	* @api
	*/
	getParams() {
		return this.params_;
	}
	/**
	* @param {import("../extent.js").Extent} extent Extent.
	* @param {number} resolution Resolution.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {import("../Image.js").default} Single image.
	* @override
	*/
	getImageInternal(extent, resolution, pixelRatio, projection) {
		if (this.url_ === void 0) return null;
		if (!this.loader || this.loaderProjection_ !== projection) {
			this.loaderProjection_ = projection;
			this.loader = createLoader$1({
				crossOrigin: this.crossOrigin_,
				params: this.params_,
				hidpi: this.hidpi_,
				metersPerUnit: this.metersPerUnit_,
				url: this.url_,
				useOverlay: this.useOverlay_,
				ratio: this.ratio_,
				load: (image, src) => {
					this.image.setImage(image);
					this.imageLoadFunction_(this.image, src);
					return decode(image);
				}
			});
		}
		return super.getImageInternal(extent, resolution, pixelRatio, projection);
	}
	/**
	* Return the image load function of the source.
	* @return {import("../Image.js").LoadFunction} The image load function.
	* @api
	*/
	getImageLoadFunction() {
		return this.imageLoadFunction_;
	}
	/**
	* Set the user-provided params.
	* @param {Object} params Params.
	* @api
	*/
	setParams(params) {
		this.params_ = Object.assign({}, params);
		this.changed();
	}
	/**
	* Update the user-provided params.
	* @param {Object} params Params.
	* @api
	*/
	updateParams(params) {
		Object.assign(this.params_, params);
		this.changed();
	}
	/**
	* Set the image load function of the MapGuide source.
	* @param {import("../Image.js").LoadFunction} imageLoadFunction Image load function.
	* @api
	*/
	setImageLoadFunction(imageLoadFunction) {
		this.imageLoadFunction_ = imageLoadFunction;
		this.changed();
	}
	/**
	* @override
	*/
	changed() {
		this.image = null;
		super.changed();
	}
};
//#endregion
//#region node_modules/ol/source/static.js
/**
* @module ol/source/static
*/
/**
* @typedef {Object} LoaderOptions
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {import("../extent.js").Extent} imageExtent Extent of the image in map coordinates.
* This is the [left, bottom, right, top] map coordinates of your image. When using this loader with an
* `ol/source/Image`, the same extent must be set as `extent` of the `ol/layer/Image`.
* @property {string} url Image URL.
* @property {function(HTMLImageElement, string): Promise<import('../DataTile.js').ImageLike>} [load] Function
* to perform loading of the image. Receives the created `HTMLImageElement` and the desired `src` as argument and
* returns a promise resolving to the loaded or decoded image. Default is {@link module:ol/Image.decode}.
*/
/**
* Creates a loader for static images.
* @param {LoaderOptions} options Loader options.
* @return {import("../Image.js").ImageObjectPromiseLoader} Loader.
* @api
*/
function createLoader$2(options) {
	const load = options.load || decode;
	const extent = options.imageExtent;
	const crossOrigin = options.crossOrigin ?? null;
	return () => {
		const image = new Image();
		image.crossOrigin = crossOrigin;
		return load(image, options.url).then((image) => {
			const resolutionX = getWidth(extent) / image.width;
			const resolutionY = getHeight(extent) / image.height;
			return {
				image,
				extent,
				resolution: resolutionX !== resolutionY ? [resolutionX, resolutionY] : resolutionY,
				pixelRatio: 1
			};
		});
	};
}
//#endregion
//#region node_modules/ol/source/ImageStatic.js
/**
* @module ol/source/ImageStatic
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {import("../extent.js").Extent} imageExtent Extent of the image in map coordinates.
* This is the [left, bottom, right, top] map coordinates of your image.
* @property {import("../Image.js").LoadFunction} [imageLoadFunction] Optional function to load an image given a URL.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
* @property {string} url Image URL.
*/
/**
* @classdesc
* A layer source for displaying a single, static image.
* @api
*/
var Static = class extends ImageSource {
	/**
	* @param {Options} options ImageStatic options.
	*/
	constructor(options) {
		const crossOrigin = options.crossOrigin !== void 0 ? options.crossOrigin : null;
		const imageLoadFunction = options.imageLoadFunction !== void 0 ? options.imageLoadFunction : defaultImageLoadFunction;
		super({
			attributions: options.attributions,
			interpolate: options.interpolate,
			projection: get(options.projection)
		});
		/**
		* @private
		* @type {string}
		*/
		this.url_ = options.url;
		/**
		* @private
		* @type {import("../extent.js").Extent}
		*/
		this.imageExtent_ = options.imageExtent;
		/**
		* @private
		* @type {import("../Image.js").default}
		*/
		this.image = null;
		this.image = new ImageWrapper(this.imageExtent_, void 0, 1, createLoader$2({
			url: options.url,
			imageExtent: options.imageExtent,
			crossOrigin,
			load: (image, src) => {
				this.image.setImage(image);
				imageLoadFunction(this.image, src);
				return decode(image);
			}
		}));
		this.image.addEventListener(EventType_default.CHANGE, this.handleImageChange.bind(this));
	}
	/**
	* Returns the image extent
	* @return {import("../extent.js").Extent} image extent.
	* @api
	*/
	getImageExtent() {
		return this.imageExtent_;
	}
	/**
	* @param {import("../extent.js").Extent} extent Extent.
	* @param {number} resolution Resolution.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {import("../Image.js").default} Single image.
	* @override
	*/
	getImageInternal(extent, resolution, pixelRatio, projection) {
		if (intersects(extent, this.image.getExtent())) return this.image;
		return null;
	}
	/**
	* Return the URL used for this image source.
	* @return {string} URL.
	* @api
	*/
	getUrl() {
		return this.url_;
	}
};
//#endregion
//#region node_modules/ol/source/ImageTile.js
/**
* @module ol/source/ImageTile
*/
/**
* Image tile loading function.  The function is called with z, x, and y tile coordinates and
* returns an {@link import("../DataTile.js").ImageLike image} or a promise for the same.
*
* @typedef {function(number, number, number, import("./DataTile.js").LoaderOptions):(import("../DataTile.js").ImageLike|Promise<import("../DataTile.js").ImageLike>)} Loader
*/
/**
* @typedef {function(number, number, number, import("./DataTile.js").LoaderOptions):string} UrlGetter
*/
/**
* @typedef {string | Array<string> | UrlGetter} UrlLike
*/
/**
* @typedef {Object} Options
* @property {UrlLike} [url] The image URL template.  In addition to a single URL template, an array of URL templates or a function
* can be provided.  If a function is provided, it will be called with z, x, y tile coordinates and loader options and should
* return a URL.
* @property {Loader} [loader] Data loader.  Called with z, x, and y tile coordinates.
* Returns an {@link import("../DataTile.js").ImageLike image} for a tile or a promise for the same.
* The promise should not resolve until the image is loaded.  If the `url` option is provided, a loader will be created.
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
* @property {number} [maxZoom=42] Optional max zoom level. Not used if `tileGrid` is provided.
* @property {number} [minZoom=0] Optional min zoom level. Not used if `tileGrid` is provided.
* @property {number|import("../size.js").Size} [tileSize=[256, 256]] The pixel width and height of the source tiles.
* This may be different than the rendered pixel size if a `tileGrid` is provided.
* @property {number} [gutter=0] The size in pixels of the gutter around data tiles to ignore.
* This allows artifacts of rendering at tile edges to be ignored.
* Supported data should be wider and taller than the tile size by a value of `2 x gutter`.
* @property {number} [maxResolution] Optional tile grid resolution at level zero. Not used if `tileGrid` is provided.
* @property {import("../proj.js").ProjectionLike} [projection='EPSG:3857'] Tile projection.
* @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid.
* @property {import("./Source.js").State} [state] The source state.
* @property {boolean} [wrapX=true] Render tiles beyond the antimeridian.
* @property {number} [transition] Transition time when fading in new tiles (in miliseconds).
* @property {boolean} [interpolate=true] Use interpolated values when resampling.
* @property {import('./DataTile.js').CrossOriginAttribute} [crossOrigin='anonymous'] The crossOrigin property to pass to loaders for image data.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
var loadError = /* @__PURE__ */ new Error("Image failed to load");
/**
* @param {string} template The image url template.
* @param {number} z The tile z coordinate.
* @param {number} x The tile x coordinate.
* @param {number} y The tile y coordinate.
* @param {import('./DataTile.js').LoaderOptions} options The loader options.
* @return {Promise<HTMLImageElement>} Resolves with a loaded image.
*/
function loadImage(template, z, x, y, options) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.crossOrigin = options.crossOrigin ?? null;
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", () => reject(loadError));
		image.src = renderXYZTemplate(template, z, x, y, options.maxY);
	});
}
/**
* @param {Array<string>} templates The url templates.
* @return {Loader} The image loader.
*/
function makeLoaderFromTemplates(templates) {
	return function(z, x, y, options) {
		return loadImage(pickUrl(templates, z, x, y), z, x, y, options);
	};
}
/**
* @param {UrlGetter} getter The url getter.
* @return {Loader} The image loader.
*/
function makeLoaderFromGetter(getter) {
	return function(z, x, y, options) {
		return loadImage(getter(z, x, y, options), z, x, y, options);
	};
}
/**
* @param {UrlLike} url The URL-like option.
* @return {Loader} The tile loader.
*/
function makeLoaderFromUrlLike(url) {
	/**
	* @type {Loader}
	*/
	let loader;
	if (Array.isArray(url)) loader = makeLoaderFromTemplates(url);
	else if (typeof url === "string") loader = makeLoaderFromTemplates(expandUrl(url));
	else if (typeof url === "function") loader = makeLoaderFromGetter(url);
	else throw new Error("The url option must be a single template, an array of templates, or a function for getting a URL");
	return loader;
}
var keyCount = 0;
/**
* @param {UrlLike} url The URL-like option.
* @return {string} A key for the URL.
*/
function keyFromUrlLike(url) {
	if (Array.isArray(url)) return url.join("\n");
	if (typeof url === "string") return url;
	++keyCount;
	return "url-function-key-" + keyCount;
}
/**
* @classdesc
* A source for typed array data tiles.
*
* @extends DataTileSource<import("../ImageTile.js").default>
* @fires import("./Tile.js").TileSourceEvent
* @api
*/
var ImageTileSource = class extends DataTileSource {
	/**
	* @param {Options} [options] DataTile source options.
	*/
	constructor(options) {
		options = options || {};
		/**
		* @type {Loader}
		*/
		let loader = options.loader;
		/**
		* @type {string}
		*/
		let key;
		if (options.url) {
			loader = makeLoaderFromUrlLike(options.url);
			key = keyFromUrlLike(options.url);
		}
		/**
		* @type {import('./Source.js').State}
		*/
		const state = !loader ? "loading" : options.state;
		const wrapX = options.wrapX === void 0 ? true : options.wrapX;
		super({
			loader,
			key,
			attributions: options.attributions,
			attributionsCollapsible: options.attributionsCollapsible,
			maxZoom: options.maxZoom,
			minZoom: options.minZoom,
			tileSize: options.tileSize,
			gutter: options.gutter,
			maxResolution: options.maxResolution,
			projection: options.projection,
			tileGrid: options.tileGrid,
			state,
			wrapX,
			transition: options.transition,
			interpolate: options.interpolate !== false,
			crossOrigin: options.crossOrigin,
			zDirection: options.zDirection
		});
	}
	/**
	* @param {UrlLike} url The new URL.
	* @api
	*/
	setUrl(url) {
		const loader = makeLoaderFromUrlLike(url);
		this.setLoader(loader);
		this.setKey(keyFromUrlLike(url));
		if (this.getState() !== "ready") this.setState("ready");
	}
};
//#endregion
//#region node_modules/ol/source/wms.js
/**
* @module ol/source/wms
*/
/**
* Default WMS version.
* @type {string}
*/
var DEFAULT_VERSION = "1.3.0";
/**
* @const
* @type {import("../size.js").Size}
*/
var GETFEATUREINFO_IMAGE_SIZE = [101, 101];
/**
* @api
* @typedef {'carmentaserver' | 'geoserver' | 'mapserver' | 'qgis'} ServerType
* Set the server type to use implementation-specific parameters beyond the WMS specification.
*  - `'carmentaserver'`: HiDPI support for [Carmenta Server](https://www.carmenta.com/en/products/carmenta-server)
*  - `'geoserver'`: HiDPI support for [GeoServer](https://geoserver.org/)
*  - `'mapserver'`: HiDPI support for [MapServer](https://mapserver.org/)
*  - `'qgis'`: HiDPI support for [QGIS](https://qgis.org/)
*/
/**
* @param {string} baseUrl Base URL.
* @param {import("../extent.js").Extent} extent Extent.
* @param {import("../size.js").Size} size Size.
* @param {import("../proj/Projection.js").default} projection Projection.
* @param {Object} params WMS params. Will be modified in place.
* @return {string} Request URL.
*/
function getRequestUrl(baseUrl, extent, size, projection, params) {
	params["WIDTH"] = size[0];
	params["HEIGHT"] = size[1];
	const axisOrientation = projection.getAxisOrientation();
	const v13 = compareVersions(params["VERSION"], "1.3") >= 0;
	params[v13 ? "CRS" : "SRS"] = projection.getCode();
	params["BBOX"] = (v13 && axisOrientation.startsWith("ne") ? [
		extent[1],
		extent[0],
		extent[3],
		extent[2]
	] : extent).join(",");
	return appendParams(baseUrl, params);
}
/**
* @param {import("../extent").Extent} extent Extent.
* @param {number} resolution Resolution.
* @param {number} pixelRatio pixel ratio.
* @param {import("../proj.js").Projection} projection Projection.
* @param {string} url WMS service url.
* @param {Object} params WMS params.
* @param {import("./wms.js").ServerType} serverType The type of the remote WMS server.
* @return {string} Image src.
*/
function getImageSrc(extent, resolution, pixelRatio, projection, url, params, serverType) {
	params = Object.assign({ REQUEST: "GetMap" }, params);
	const imageResolution = resolution / pixelRatio;
	const imageSize = [round(getWidth(extent) / imageResolution, 4), round(getHeight(extent) / imageResolution, 4)];
	if (pixelRatio != 1) switch (serverType) {
		case "geoserver":
			const dpi = 90 * pixelRatio + .5 | 0;
			if ("FORMAT_OPTIONS" in params) params["FORMAT_OPTIONS"] += ";dpi:" + dpi;
			else params["FORMAT_OPTIONS"] = "dpi:" + dpi;
			break;
		case "mapserver":
			params["MAP_RESOLUTION"] = 90 * pixelRatio;
			break;
		case "carmentaserver":
		case "qgis":
			params["DPI"] = 90 * pixelRatio;
			break;
		default: throw new Error("Unknown `serverType` configured");
	}
	return getRequestUrl(url, extent, imageSize, projection, params);
}
/**
* @param {Object} params WMS params.
* @param {string} request WMS `REQUEST`.
* @return {Object} WMS params with required properties set.
*/
function getRequestParams(params, request) {
	return Object.assign({
		"REQUEST": request,
		"SERVICE": "WMS",
		"VERSION": DEFAULT_VERSION,
		"FORMAT": "image/png",
		"STYLES": "",
		"TRANSPARENT": "TRUE"
	}, params);
}
/**
* @typedef {Object} LoaderOptions
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
* the image from the remote server.
* @property {Object<string,*>} [params] WMS request parameters.
* At least a `LAYERS` param is required. `STYLES` is
* `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT` and `BBOX` will be set
* dynamically. `CRS` (`SRS` for WMS version < 1.3.0) will is derived from the `proection` config.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is 'EPSG:3857'.
* @property {number} [ratio=1.5] Ratio. `1` means image requests are the size of the map viewport, `2` means
* twice the width and height of the map viewport, and so on. Must be `1` or higher.
* @property {import("./wms.js").ServerType} [serverType] The type of
* the remote WMS server: `mapserver`, `geoserver`, `carmentaserver`, or `qgis`.
* Only needed if `hidpi` is `true`.
* @property {string} url WMS service URL.
* @property {function(HTMLImageElement, string): Promise<import('../DataTile.js').ImageLike>} [load] Function
* to perform loading of the image. Receives the created `HTMLImageElement` and the desired `src` as argument and
* returns a promise resolving to the loaded or decoded image. Default is {@link module:ol/Image.decode}.
*/
/**
* Creates a loader for WMS images.
* @param {LoaderOptions} options Loader options.
* @return {import("../Image.js").ImageObjectPromiseLoader} Loader.
* @api
*/
function createLoader$3(options) {
	const hidpi = options.hidpi === void 0 ? true : options.hidpi;
	const projection = get(options.projection || "EPSG:3857");
	const ratio = options.ratio || 1.5;
	const load = options.load || decode;
	const crossOrigin = options.crossOrigin ?? null;
	return (extent, resolution, pixelRatio) => {
		extent = getRequestExtent(extent, resolution, pixelRatio, ratio);
		if (pixelRatio != 1 && (!hidpi || options.serverType === void 0)) pixelRatio = 1;
		const src = getImageSrc(extent, resolution, pixelRatio, projection, options.url, getRequestParams(options.params, "GetMap"), options.serverType);
		const image = new Image();
		image.crossOrigin = crossOrigin;
		return load(image, src).then((image) => ({
			image,
			extent,
			pixelRatio
		}));
	};
}
/**
* Get the GetFeatureInfo URL for the passed coordinate and resolution. Returns `undefined` if the
* GetFeatureInfo URL cannot be constructed.
* @param {LoaderOptions} options Options passed the `createWMSLoader()` function. In addition to
* the params required by the loader, `INFO_FORMAT` should be specified, it defaults to
* `application/json`. If `QUERY_LAYERS` is not provided, then the layers specified in the `LAYERS`
* parameter will be used.
* @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
* @param {number} resolution Resolution.
* @return {string|undefined} GetFeatureInfo URL.
* @api
*/
function getFeatureInfoUrl(options, coordinate, resolution) {
	if (options.url === void 0) return;
	const projectionObj = get(options.projection || "EPSG:3857");
	const extent = getForViewAndSize(coordinate, resolution, 0, GETFEATUREINFO_IMAGE_SIZE);
	const baseParams = {
		"QUERY_LAYERS": options.params["LAYERS"],
		"INFO_FORMAT": "application/json"
	};
	Object.assign(baseParams, getRequestParams(options.params, "GetFeatureInfo"), options.params);
	const x = floor((coordinate[0] - extent[0]) / resolution, 4);
	const y = floor((extent[3] - coordinate[1]) / resolution, 4);
	const v13 = compareVersions(baseParams["VERSION"], "1.3") >= 0;
	baseParams[v13 ? "I" : "X"] = x;
	baseParams[v13 ? "J" : "Y"] = y;
	return getRequestUrl(options.url, extent, GETFEATUREINFO_IMAGE_SIZE, projectionObj, baseParams);
}
/**
* Get the GetLegendGraphic URL, optionally optimized for the passed resolution and possibly
* including any passed specific parameters. Returns `undefined` if the GetLegendGraphic URL
* cannot be constructed.
*
* @param {LoaderOptions} options Options passed the `createWMSLoader()` function.
* @param {number} [resolution] Resolution. If not provided, `SCALE` will not be calculated and
* included in URL.
* @return {string|undefined} GetLegendGraphic URL.
* @api
*/
function getLegendUrl(options, resolution) {
	if (options.url === void 0) return;
	const baseParams = {
		"SERVICE": "WMS",
		"VERSION": DEFAULT_VERSION,
		"REQUEST": "GetLegendGraphic",
		"FORMAT": "image/png"
	};
	if (resolution !== void 0) baseParams["SCALE"] = resolution * (get(options.projection || "EPSG:3857").getMetersPerUnit() || 1) / 28e-5;
	Object.assign(baseParams, options.params);
	if (options.params !== void 0 && baseParams["LAYER"] === void 0) {
		const layers = baseParams["LAYERS"];
		if (!(!Array.isArray(layers) || layers.length !== 1)) return;
		baseParams["LAYER"] = layers;
	}
	return appendParams(options.url, baseParams);
}
//#endregion
//#region node_modules/ol/source/ImageWMS.js
/**
* @module ol/source/ImageWMS
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
* the image from the remote server.
* @property {import("./wms.js").ServerType} [serverType] The type of
* the remote WMS server: `mapserver`, `geoserver`, `carmentaserver`, or `qgis`.
* Only needed if `hidpi` is `true`.
* @property {import("../Image.js").LoadFunction} [imageLoadFunction] Optional function to load an image given a URL.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {Object<string,*>} [params] WMS request parameters.
* At least a `LAYERS` param is required. `STYLES` is
* `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
* and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
* @property {number} [ratio=1.5] Ratio. `1` means image requests are the size of the map viewport, `2` means
* twice the width and height of the map viewport, and so on. Must be `1` or higher.
* @property {Array<number>} [resolutions] Resolutions.
* If specified, requests will be made for these resolutions only.
* @property {string} [url] WMS service URL.
*/
/**
* @classdesc
* Source for WMS servers providing single, untiled images.
*
* @fires module:ol/source/Image.ImageSourceEvent
* @api
*/
var ImageWMS = class extends ImageSource {
	/**
	* @param {Options} [options] ImageWMS options.
	*/
	constructor(options) {
		options = options ? options : {};
		super({
			attributions: options.attributions,
			interpolate: options.interpolate,
			projection: options.projection,
			resolutions: options.resolutions
		});
		/**
		* @private
		* @type {?string}
		*/
		this.crossOrigin_ = options.crossOrigin !== void 0 ? options.crossOrigin : null;
		/**
		* @private
		* @type {string|undefined}
		*/
		this.url_ = options.url;
		/**
		* @private
		* @type {import("../Image.js").LoadFunction}
		*/
		this.imageLoadFunction_ = options.imageLoadFunction !== void 0 ? options.imageLoadFunction : defaultImageLoadFunction;
		/**
		* @private
		* @type {!Object}
		*/
		this.params_ = Object.assign({}, options.params);
		/**
		* @private
		* @type {import("./wms.js").ServerType}
		*/
		this.serverType_ = options.serverType;
		/**
		* @private
		* @type {boolean}
		*/
		this.hidpi_ = options.hidpi !== void 0 ? options.hidpi : true;
		/**
		* @private
		* @type {number}
		*/
		this.renderedRevision_ = 0;
		/**
		* @private
		* @type {number}
		*/
		this.ratio_ = options.ratio !== void 0 ? options.ratio : 1.5;
		/**
		* @private
		* @type {import("../proj/Projection.js").default}
		*/
		this.loaderProjection_ = null;
	}
	/**
	* Return the GetFeatureInfo URL for the passed coordinate, resolution, and
	* projection. Return `undefined` if the GetFeatureInfo URL cannot be
	* constructed.
	* @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
	* @param {number} resolution Resolution.
	* @param {import("../proj.js").ProjectionLike} projection Projection.
	* @param {!Object} params GetFeatureInfo params. `INFO_FORMAT` at least should
	*     be provided. If `QUERY_LAYERS` is not provided then the layers specified
	*     in the `LAYERS` parameter will be used. `VERSION` should not be
	*     specified here.
	* @return {string|undefined} GetFeatureInfo URL.
	* @api
	*/
	getFeatureInfoUrl(coordinate, resolution, projection, params) {
		const projectionObj = get(projection);
		const sourceProjectionObj = this.getProjection();
		if (sourceProjectionObj && sourceProjectionObj !== projectionObj) {
			resolution = calculateSourceResolution(sourceProjectionObj, projectionObj, coordinate, resolution);
			coordinate = transform(coordinate, projectionObj, sourceProjectionObj);
		}
		return getFeatureInfoUrl({
			url: this.url_,
			params: {
				...this.params_,
				...params
			},
			projection: sourceProjectionObj || projectionObj
		}, coordinate, resolution);
	}
	/**
	* Return the GetLegendGraphic URL, optionally optimized for the passed
	* resolution and possibly including any passed specific parameters. Returns
	* `undefined` if the GetLegendGraphic URL cannot be constructed.
	*
	* @param {number} [resolution] Resolution. If set to undefined, `SCALE`
	*     will not be calculated and included in URL.
	* @param {Object} [params] GetLegendGraphic params. If `LAYER` is set, the
	*     request is generated for this wms layer, else it will try to use the
	*     configured wms layer. Default `FORMAT` is `image/png`.
	*     `VERSION` should not be specified here.
	* @return {string|undefined} GetLegendGraphic URL.
	* @api
	*/
	getLegendUrl(resolution, params) {
		return getLegendUrl({
			url: this.url_,
			params: {
				...this.params_,
				...params
			}
		}, resolution);
	}
	/**
	* Get the user-provided params, i.e. those passed to the constructor through
	* the "params" option, and possibly updated using the updateParams method.
	* @return {Object} Params.
	* @api
	*/
	getParams() {
		return this.params_;
	}
	/**
	* @param {import("../extent.js").Extent} extent Extent.
	* @param {number} resolution Resolution.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {import("../Image.js").default} Single image.
	* @override
	*/
	getImageInternal(extent, resolution, pixelRatio, projection) {
		if (this.url_ === void 0) return null;
		if (!this.loader || this.loaderProjection_ !== projection) {
			this.loaderProjection_ = projection;
			this.loader = createLoader$3({
				crossOrigin: this.crossOrigin_,
				params: this.params_,
				projection,
				serverType: this.serverType_,
				hidpi: this.hidpi_,
				url: this.url_,
				ratio: this.ratio_,
				load: (image, src) => {
					this.image.setImage(image);
					this.imageLoadFunction_(this.image, src);
					return decode(image);
				}
			});
		}
		return super.getImageInternal(extent, resolution, pixelRatio, projection);
	}
	/**
	* Return the image load function of the source.
	* @return {import("../Image.js").LoadFunction} The image load function.
	* @api
	*/
	getImageLoadFunction() {
		return this.imageLoadFunction_;
	}
	/**
	* Return the URL used for this WMS source.
	* @return {string|undefined} URL.
	* @api
	*/
	getUrl() {
		return this.url_;
	}
	/**
	* Set the image load function of the source.
	* @param {import("../Image.js").LoadFunction} imageLoadFunction Image load function.
	* @api
	*/
	setImageLoadFunction(imageLoadFunction) {
		this.imageLoadFunction_ = imageLoadFunction;
		this.changed();
	}
	/**
	* Set the URL to use for requests.
	* @param {string|undefined} url URL.
	* @api
	*/
	setUrl(url) {
		if (url != this.url_) {
			this.url_ = url;
			this.loader = null;
			this.changed();
		}
	}
	/**
	* Set the user-provided params.
	* @param {Object} params Params.
	* @api
	*/
	setParams(params) {
		this.params_ = Object.assign({}, params);
		this.changed();
	}
	/**
	* Update the user-provided params.
	* @param {Object} params Params.
	* @api
	*/
	updateParams(params) {
		Object.assign(this.params_, params);
		this.changed();
	}
	/**
	* @override
	*/
	changed() {
		this.image = null;
		super.changed();
	}
};
//#endregion
//#region node_modules/ol/net.js
/**
* @module ol/net
*/
/**
* Simple JSONP helper. Supports error callbacks and a custom callback param.
* The error callback will be called when no JSONP is executed after 10 seconds.
*
* @param {string} url Request url. A 'callback' query parameter will be
*     appended.
* @param {Function} callback Callback on success.
* @param {Function} [errback] Callback on error.
* @param {string} [callbackParam] Custom query parameter for the JSONP
*     callback. Default is 'callback'.
*/
function jsonp(url, callback, errback, callbackParam) {
	const script = document.createElement("script");
	const key = "olc_" + getUid(callback);
	function cleanup() {
		delete window[key];
		script.parentNode.removeChild(script);
	}
	script.async = true;
	script.src = url + (url.includes("?") ? "&" : "?") + (callbackParam || "callback") + "=" + key;
	const timer = setTimeout(function() {
		cleanup();
		if (errback) errback();
	}, 1e4);
	window[key] = function(data) {
		clearTimeout(timer);
		cleanup();
		callback(data);
	};
	document.head.appendChild(script);
}
var ResponseError = class extends Error {
	/**
	* @param {XMLHttpRequest} response The XHR object.
	*/
	constructor(response) {
		const message = "Unexpected response status: " + response.status;
		super(message);
		/**
		* @type {string}
		*/
		this.name = "ResponseError";
		/**
		* @type {XMLHttpRequest}
		*/
		this.response = response;
	}
};
var ClientError = class extends Error {
	/**
	* @param {XMLHttpRequest} client The XHR object.
	*/
	constructor(client) {
		super("Failed to issue request");
		/**
		* @type {string}
		*/
		this.name = "ClientError";
		/**
		* @type {XMLHttpRequest}
		*/
		this.client = client;
	}
};
/**
* @param {string} url The URL.
* @return {Promise<Object>} A promise that resolves to the JSON response.
*/
function getJSON(url) {
	return new Promise(function(resolve, reject) {
		/**
		* @param {ProgressEvent<XMLHttpRequest>} event The load event.
		*/
		function onLoad(event) {
			const client = event.target;
			if (!client.status || client.status >= 200 && client.status < 300) {
				let data;
				try {
					data = JSON.parse(client.responseText);
				} catch (err) {
					const message = "Error parsing response text as JSON: " + err.message;
					reject(new Error(message));
					return;
				}
				resolve(data);
				return;
			}
			reject(new ResponseError(client));
		}
		/**
		* @param {ProgressEvent<XMLHttpRequest>} event The error event.
		*/
		function onError(event) {
			reject(new ClientError(event.target));
		}
		const client = new XMLHttpRequest();
		client.addEventListener("load", onLoad);
		client.addEventListener("error", onError);
		client.open("GET", url);
		client.setRequestHeader("Accept", "application/json");
		client.send();
	});
}
/**
* @param {string} base The base URL.
* @param {string} url The potentially relative URL.
* @return {string} The full URL.
*/
function resolveUrl(base, url) {
	if (url.includes("://")) return url;
	return new URL(url, base).href;
}
//#endregion
//#region node_modules/ol/source/ogcTileUtil.js
/**
* @module ol/source/ogcTileUtil
*/
/**
* See https://ogcapi.ogc.org/tiles/.
*/
/**
* @typedef {'map' | 'vector'} TileType
*/
/**
* @typedef {'topLeft' | 'bottomLeft'} CornerOfOrigin
*/
/**
* @typedef {Object} TileSet
* @property {TileType} dataType Type of data represented in the tileset.
* @property {string} [tileMatrixSetDefinition] Reference to a tile matrix set definition.
* @property {TileMatrixSet} [tileMatrixSet] Tile matrix set definition.
* @property {Array<TileMatrixSetLimit>} [tileMatrixSetLimits] Tile matrix set limits.
* @property {Array<Link>} links Tileset links.
*/
/**
* @typedef {Object} Link
* @property {string} rel The link rel attribute.
* @property {string} href The link URL.
* @property {string} type The link type.
*/
/**
* @typedef {Object} TileMatrixSetLimit
* @property {string} tileMatrix The tile matrix id.
* @property {number} minTileRow The minimum tile row.
* @property {number} maxTileRow The maximum tile row.
* @property {number} minTileCol The minimum tile column.
* @property {number} maxTileCol The maximum tile column.
*/
/**
* @typedef {Object} TileMatrixSet
* @property {string} id The tile matrix set identifier.
* @property {string|CrsUri|CrsWkt|CrsReferenceSystem} crs The coordinate reference system.
* @property {Array<string>} [orderedAxes] Axis order.
* @property {Array<TileMatrix>} tileMatrices Array of tile matrices.
*/
/**
* @typedef {Object} CrsUri
* @property {string} uri Reference to one coordinate reference system (CRS).
*/
/**
* @typedef {Object} CrsWkt
* @property {Object} wkt JSON encoding for WKT representation of CRS 2.0.
*/
/**
* @typedef {Object} CrsReferenceSystem
* @property {Object} referenceSystem Data structure as defined in the MD_ReferenceSystem of the ISO 19115.
*/
/**
* @typedef {Object} TileMatrix
* @property {string} id The tile matrix identifier.
* @property {number} cellSize The pixel resolution (map units per pixel).
* @property {Array<number>} pointOfOrigin The map location of the matrix origin.
* @property {CornerOfOrigin} [cornerOfOrigin='topLeft'] The corner of the matrix that represents the origin ('topLeft' or 'bottomLeft').
* @property {number} matrixWidth The number of columns.
* @property {number} matrixHeight The number of rows.
* @property {number} tileWidth The pixel width of a tile.
* @property {number} tileHeight The pixel height of a tile.
*/
/**
* @type {Object<string, boolean>}
*/
var knownMapMediaTypes = {
	"image/png": true,
	"image/jpeg": true,
	"image/gif": true,
	"image/webp": true
};
/**
* @type {Object<string, boolean>}
*/
var knownVectorMediaTypes = {
	"application/vnd.mapbox-vector-tile": true,
	"application/geo+json": true
};
/**
* @typedef {Object} TileSetInfo
* @property {string} urlTemplate The tile URL template.
* @property {import("../proj/Projection.js").default} projection The source projection.
* @property {import("../tilegrid/TileGrid.js").default} grid The tile grid.
* @property {import("../Tile.js").UrlFunction} urlFunction The tile URL function.
*/
/**
* @typedef {Object} SourceInfo
* @property {string} url The tile set URL.
* @property {string} mediaType The preferred tile media type.
* @property {Array<string>} [supportedMediaTypes] The supported media types.
* @property {import("../proj/Projection.js").default} projection The source projection.
* @property {Object} [context] Optional context for constructing the URL.
* @property {Array<string>} [collections] Optional collections to append the URL with.
*/
/**
* @param {string} tileUrlTemplate Tile URL template.
* @param {Array<string>} collections List of collections to include as query parameter.
* @return {string} The tile URL template with appended collections query parameter.
*/
function appendCollectionsQueryParam(tileUrlTemplate, collections) {
	if (!collections.length) return tileUrlTemplate;
	const url = new URL(tileUrlTemplate, "file:/");
	if (url.pathname.split("/").includes("collections")) {
		error("The \"collections\" query parameter cannot be added to collection endpoints");
		return tileUrlTemplate;
	}
	const encodedCollections = collections.map((c) => encodeURIComponent(c)).join(",");
	url.searchParams.append("collections", encodedCollections);
	return `${tileUrlTemplate.split("?")[0]}?${decodeURIComponent(url.searchParams.toString())}`;
}
/**
* @param {Array<Link>} links Tileset links.
* @param {string} [mediaType] The preferred media type.
* @param {Array<string>} [collections] Optional collections to append the URL with.
* @return {string} The tile URL template.
*/
function getMapTileUrlTemplate(links, mediaType, collections) {
	let tileUrlTemplate;
	let fallbackUrlTemplate;
	for (let i = 0; i < links.length; ++i) {
		const link = links[i];
		if (link.rel === "item") {
			if (link.type === mediaType) {
				tileUrlTemplate = link.href;
				break;
			}
			if (knownMapMediaTypes[link.type]) fallbackUrlTemplate = link.href;
			else if (!fallbackUrlTemplate && link.type.startsWith("image/")) fallbackUrlTemplate = link.href;
		}
	}
	if (!tileUrlTemplate) if (fallbackUrlTemplate) tileUrlTemplate = fallbackUrlTemplate;
	else throw new Error("Could not find \"item\" link");
	if (collections) tileUrlTemplate = appendCollectionsQueryParam(tileUrlTemplate, collections);
	return tileUrlTemplate;
}
/**
* @param {Array<Link>} links Tileset links.
* @param {string} [mediaType] The preferred media type.
* @param {Array<string>} [supportedMediaTypes] The media types supported by the parser.
* @param {Array<string>} [collections] Optional collections to append the URL with.
* @return {string} The tile URL template.
*/
function getVectorTileUrlTemplate(links, mediaType, supportedMediaTypes, collections) {
	let tileUrlTemplate;
	let fallbackUrlTemplate;
	/**
	* Lookup of URL by media type.
	* @type {Object<string, string>}
	*/
	const hrefLookup = {};
	for (let i = 0; i < links.length; ++i) {
		const link = links[i];
		hrefLookup[link.type] = link.href;
		if (link.rel === "item") {
			if (link.type === mediaType) {
				tileUrlTemplate = link.href;
				break;
			}
			if (knownVectorMediaTypes[link.type]) fallbackUrlTemplate = link.href;
		}
	}
	if (!tileUrlTemplate && supportedMediaTypes) for (let i = 0; i < supportedMediaTypes.length; ++i) {
		const supportedMediaType = supportedMediaTypes[i];
		if (hrefLookup[supportedMediaType]) {
			tileUrlTemplate = hrefLookup[supportedMediaType];
			break;
		}
	}
	if (!tileUrlTemplate) if (fallbackUrlTemplate) tileUrlTemplate = fallbackUrlTemplate;
	else throw new Error("Could not find \"item\" link");
	if (collections) tileUrlTemplate = appendCollectionsQueryParam(tileUrlTemplate, collections);
	return tileUrlTemplate;
}
/**
* @param {SourceInfo} sourceInfo The source info.
* @param {TileMatrixSet} tileMatrixSet Tile matrix set.
* @param {string} tileUrlTemplate Tile URL template.
* @param {Array<TileMatrixSetLimit>} [tileMatrixSetLimits] Tile matrix set limits.
* @return {TileSetInfo} Tile set info.
*/
function parseTileMatrixSet(sourceInfo, tileMatrixSet, tileUrlTemplate, tileMatrixSetLimits) {
	let projection = sourceInfo.projection;
	if (!projection) {
		if (typeof tileMatrixSet.crs === "string") projection = get(tileMatrixSet.crs);
		else if ("uri" in tileMatrixSet.crs) projection = get(tileMatrixSet.crs.uri);
		if (!projection) throw new Error(`Unsupported CRS: ${JSON.stringify(tileMatrixSet.crs)}`);
	}
	const orderedAxes = tileMatrixSet.orderedAxes;
	const backwards = !(orderedAxes ? orderedAxes.slice(0, 2).map((s) => s.replace(/E|X|Lon/i, "e").replace(/N|Y|Lat/i, "n")).join("") : projection.getAxisOrientation()).startsWith("en");
	const matrices = tileMatrixSet.tileMatrices;
	/**
	* @type {Object<string, TileMatrix>}
	*/
	const matrixLookup = {};
	for (let i = 0; i < matrices.length; ++i) {
		const matrix = matrices[i];
		matrixLookup[matrix.id] = matrix;
	}
	/**
	* @type {Object<string, TileMatrixSetLimit>}
	*/
	const limitLookup = {};
	/**
	* @type {Array<string>}
	*/
	const matrixIds = [];
	if (tileMatrixSetLimits) for (let i = 0; i < tileMatrixSetLimits.length; ++i) {
		const limit = tileMatrixSetLimits[i];
		const id = limit.tileMatrix;
		matrixIds.push(id);
		limitLookup[id] = limit;
	}
	else for (let i = 0; i < matrices.length; ++i) {
		const id = matrices[i].id;
		matrixIds.push(id);
	}
	const length = matrixIds.length;
	const origins = new Array(length);
	const resolutions = new Array(length);
	const sizes = new Array(length);
	const tileSizes = new Array(length);
	const extent = [
		-Infinity,
		-Infinity,
		Infinity,
		Infinity
	];
	for (let i = 0; i < length; ++i) {
		const id = matrixIds[i];
		const matrix = matrixLookup[id];
		const origin = matrix.pointOfOrigin;
		if (backwards) origins[i] = [origin[1], origin[0]];
		else origins[i] = origin;
		resolutions[i] = matrix.cellSize;
		sizes[i] = [matrix.matrixWidth, matrix.matrixHeight];
		tileSizes[i] = [matrix.tileWidth, matrix.tileHeight];
		const limit = limitLookup[id];
		if (limit) {
			const tileMapWidth = matrix.cellSize * matrix.tileWidth;
			const minX = origins[i][0] + limit.minTileCol * tileMapWidth;
			const maxX = origins[i][0] + (limit.maxTileCol + 1) * tileMapWidth;
			const tileMapHeight = matrix.cellSize * matrix.tileHeight;
			const upsideDown = matrix.cornerOfOrigin === "bottomLeft";
			let minY;
			let maxY;
			if (upsideDown) {
				minY = origins[i][1] + limit.minTileRow * tileMapHeight;
				maxY = origins[i][1] + (limit.maxTileRow + 1) * tileMapHeight;
			} else {
				minY = origins[i][1] - (limit.maxTileRow + 1) * tileMapHeight;
				maxY = origins[i][1] - limit.minTileRow * tileMapHeight;
			}
			getIntersection(extent, [
				minX,
				minY,
				maxX,
				maxY
			], extent);
		}
	}
	const tileGrid = new TileGrid({
		origins,
		resolutions,
		sizes,
		tileSizes,
		extent: tileMatrixSetLimits ? extent : void 0
	});
	const context = sourceInfo.context;
	const base = sourceInfo.url;
	/** @type {import('../Tile.js').UrlFunction} */
	function tileUrlFunction(tileCoord, pixelRatio, projection) {
		if (!tileCoord) return;
		const id = matrixIds[tileCoord[0]];
		const matrix = matrixLookup[id];
		const upsideDown = matrix.cornerOfOrigin === "bottomLeft";
		const localContext = {
			tileMatrix: id,
			tileCol: tileCoord[1],
			tileRow: upsideDown ? -tileCoord[2] - 1 : tileCoord[2]
		};
		if (tileMatrixSetLimits) {
			const limit = limitLookup[matrix.id];
			if (localContext.tileCol < limit.minTileCol || localContext.tileCol > limit.maxTileCol || localContext.tileRow < limit.minTileRow || localContext.tileRow > limit.maxTileRow) return;
		}
		Object.assign(localContext, context);
		return resolveUrl(base, tileUrlTemplate.replace(/\{(\w+?)\}/g, function(m, p) {
			return localContext[p];
		}));
	}
	return {
		grid: tileGrid,
		projection,
		urlTemplate: tileUrlTemplate,
		urlFunction: tileUrlFunction
	};
}
/**
* @param {SourceInfo} sourceInfo The source info.
* @param {TileSet} tileSet Tile set.
* @return {TileSetInfo|Promise<TileSetInfo>} Tile set info.
*/
function parseTileSetMetadata(sourceInfo, tileSet) {
	const tileMatrixSetLimits = tileSet.tileMatrixSetLimits;
	/** @type {string} */
	let tileUrlTemplate;
	if (tileSet.dataType === "map") tileUrlTemplate = getMapTileUrlTemplate(tileSet.links, sourceInfo.mediaType, sourceInfo.collections);
	else if (tileSet.dataType === "vector") tileUrlTemplate = getVectorTileUrlTemplate(tileSet.links, sourceInfo.mediaType, sourceInfo.supportedMediaTypes, sourceInfo.collections);
	else throw new Error("Expected tileset data type to be \"map\" or \"vector\"");
	if (tileSet.tileMatrixSet) return parseTileMatrixSet(sourceInfo, tileSet.tileMatrixSet, tileUrlTemplate, tileMatrixSetLimits);
	const tileMatrixSetLink = tileSet.links.find((link) => link.rel === "http://www.opengis.net/def/rel/ogc/1.0/tiling-scheme");
	if (!tileMatrixSetLink) throw new Error("Expected http://www.opengis.net/def/rel/ogc/1.0/tiling-scheme link or tileMatrixSet");
	const tileMatrixSetDefinition = tileMatrixSetLink.href;
	return getJSON(resolveUrl(sourceInfo.url, tileMatrixSetDefinition)).then(function(tileMatrixSet) {
		return parseTileMatrixSet(sourceInfo, tileMatrixSet, tileUrlTemplate, tileMatrixSetLimits);
	});
}
/**
* @param {SourceInfo} sourceInfo Source info.
* @return {Promise<TileSetInfo>} Tile set info.
*/
function getTileSetInfo(sourceInfo) {
	return getJSON(sourceInfo.url).then(function(tileSet) {
		return parseTileSetMetadata(sourceInfo, tileSet);
	});
}
//#endregion
//#region node_modules/ol/source/OGCMapTile.js
/**
* @module ol/source/OGCMapTile
*/
/**
* @typedef {Object} Options
* @property {string} url URL to the OGC Map Tileset endpoint.
* @property {Object} [context] A lookup of values to use in the tile URL template.  The `{tileMatrix}`
* (zoom level), `{tileRow}`, and `{tileCol}` variables in the URL will always be provided by the source.
* @property {string} [mediaType] The content type for the tiles (e.g. "image/png").  If not provided,
* the source will try to find a link with rel="item" that uses a supported image type.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. By default, the projection
* will be derived from the `crs` of the `tileMatrixSet`.  You can override this by supplying
* a projection to the constructor.
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
* Higher values can increase reprojection performance, but decrease precision.
* @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
* ```js
* function(tile, src) {
*   tile.getImage().src = src;
* };
* ```
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* @property {number} [transition] Duration of the opacity transition for rendering.
* To disable the opacity transition, pass `transition: 0`.
* @property {Array<string>} [collections] A list of geospatial data sub-resources to include. If not provided, the entire dataset will
* be included. This option is not applicable when requesting the tileset for a single collection.
*/
/**
* @classdesc
* Layer source for map tiles from an [OGC API - Tiles](https://ogcapi.ogc.org/tiles/) service that provides "map" type tiles.
* The service must conform to at least the core (http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/core)
* and tileset (http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/tileset) conformance classes. For supporting the `collections`
* option, the service must conform to the collections selection
* (http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/collections-selection) conformance class.
* @api
*/
var OGCMapTile = class extends TileImage {
	/**
	* @param {Options} options OGC map tile options.
	*/
	constructor(options) {
		super({
			attributions: options.attributions,
			cacheSize: options.cacheSize,
			crossOrigin: options.crossOrigin,
			interpolate: options.interpolate,
			projection: options.projection,
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			state: "loading",
			tileLoadFunction: options.tileLoadFunction,
			wrapX: options.wrapX !== void 0 ? options.wrapX : true,
			transition: options.transition
		});
		getTileSetInfo({
			url: options.url,
			projection: this.getProjection(),
			mediaType: options.mediaType,
			context: options.context || null,
			collections: options.collections
		}).then(this.handleTileSetInfo_.bind(this)).catch(this.handleError_.bind(this));
	}
	/**
	* @param {import("./ogcTileUtil.js").TileSetInfo} tileSetInfo Tile set info.
	* @private
	*/
	handleTileSetInfo_(tileSetInfo) {
		this.tileGrid = tileSetInfo.grid;
		this.projection = tileSetInfo.projection;
		this.setTileUrlFunction(tileSetInfo.urlFunction, tileSetInfo.urlTemplate);
		this.setState("ready");
	}
	/**
	* @private
	* @param {Error} error The error.
	*/
	handleError_(error$2) {
		error(error$2);
		this.setState("error");
	}
};
//#endregion
//#region node_modules/ol/source/VectorTile.js
/**
* @module ol/source/VectorTile
*/
/**
* @template {import("../Feature.js").FeatureLike} [FeatureType=import("../render/Feature.js").default]
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
* @property {number} [cacheSize] Initial tile cache size. Will auto-grow to hold at least twice the number of tiles in the viewport.
* @property {import("../extent.js").Extent} [extent] Extent.
* @property {import("../format/Feature.js").default<FeatureType>} [format] Feature format for tiles. Used and required by the default.
* @property {boolean} [overlaps=true] This source may have overlapping geometries. Setting this
* to `false` (e.g. for sources with polygons that represent administrative
* boundaries or TopoJSON sources) allows the renderer to optimise fill and
* stroke operations.
* @property {import("../proj.js").ProjectionLike} [projection='EPSG:3857'] Projection of the tile grid.
* @property {import("./Source.js").State} [state] Source state.
* @property {typeof import("../VectorTile.js").default} [tileClass] Class used to instantiate tiles.
* Default is {@link module:ol/VectorTile~VectorTile}.
* @property {number} [maxZoom=22] Optional max zoom level. Not used if `tileGrid` is provided.
* @property {number} [minZoom] Optional min zoom level. Not used if `tileGrid` is provided.
* @property {number|import("../size.js").Size} [tileSize=512] Optional tile size. Not used if `tileGrid` is provided.
* @property {number} [maxResolution] Optional tile grid resolution at level zero. Not used if `tileGrid` is provided.
* @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid.
* @property {import("../Tile.js").LoadFunction} [tileLoadFunction]
* Optional function to load a tile given a URL. Could look like this for pbf tiles:
* ```js
* function(tile, url) {
*   tile.setLoader(function(extent, resolution, projection) {
*     fetch(url).then(function(response) {
*       response.arrayBuffer().then(function(data) {
*         const format = tile.getFormat() // ol/format/MVT configured as source format
*         const features = format.readFeatures(data, {
*           extent: extent,
*           featureProjection: projection
*         });
*         tile.setFeatures(features);
*       });
*     });
*   });
* }
* ```
* If you do not need extent, resolution and projection to get the features for a tile (e.g.
* for GeoJSON tiles), your `tileLoadFunction` does not need a `setLoader()` call. Only make sure
* to call `setFeatures()` on the tile:
* ```js
* const format = new GeoJSON({featureProjection: map.getView().getProjection()});
* async function tileLoadFunction(tile, url) {
*   const response = await fetch(url);
*   const data = await response.json();
*   tile.setFeatures(format.readFeatures(data));
* }
* ```
* @property {import("../Tile.js").UrlFunction} [tileUrlFunction] Optional function to get tile URL given a tile coordinate and the projection.
* @property {string} [url] URL template. Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
* A `{?-?}` template pattern, for example `subdomain{a-f}.domain.com`, may be
* used instead of defining each one separately in the `urls` option.
* @property {number} [transition] A duration for tile opacity
* transitions in milliseconds. A duration of 0 disables the opacity transition.
* @property {Array<string>} [urls] An array of URL templates.
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* When set to `false`, only one world
* will be rendered. When set to `true`, tiles will be wrapped horizontally to
* render multiple worlds.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=1]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
/**
* @classdesc
* Class for layer sources providing vector data divided into a tile grid, to be
* used with {@link module:ol/layer/VectorTile~VectorTileLayer}. Although this source receives tiles
* with vector features from the server, it is not meant for feature editing.
* Features are optimized for rendering, their geometries are clipped at or near
* tile boundaries and simplified for a view resolution. See
* {@link module:ol/source/Vector~VectorSource} for vector sources that are suitable for feature
* editing.
*
* @fires import("./Tile.js").TileSourceEvent
* @api
* @template {import("../Feature.js").FeatureLike} [FeatureType=import("../render/Feature.js").default]
*/
var VectorTile = class extends UrlTile {
	/**
	* @param {!Options<FeatureType>} options Vector tile options.
	*/
	constructor(options) {
		const projection = options.projection || "EPSG:3857";
		const extent = options.extent || extentFromProjection(projection);
		const tileGrid = options.tileGrid || createXYZ({
			extent,
			maxResolution: options.maxResolution,
			maxZoom: options.maxZoom !== void 0 ? options.maxZoom : 22,
			minZoom: options.minZoom,
			tileSize: options.tileSize || 512
		});
		super({
			attributions: options.attributions,
			attributionsCollapsible: options.attributionsCollapsible,
			cacheSize: options.cacheSize,
			interpolate: true,
			projection,
			state: options.state,
			tileGrid,
			tileLoadFunction: options.tileLoadFunction ? options.tileLoadFunction : defaultLoadFunction,
			tileUrlFunction: options.tileUrlFunction,
			url: options.url,
			urls: options.urls,
			wrapX: options.wrapX === void 0 ? true : options.wrapX,
			transition: options.transition,
			zDirection: options.zDirection === void 0 ? 1 : options.zDirection
		});
		/**
		* @private
		* @type {import("../format/Feature.js").default<FeatureType>|null}
		*/
		this.format_ = options.format ? options.format : null;
		/**
		* @type {Object<string, Array<string>>}
		* @private
		*/
		this.tileKeysBySourceTileUrl_ = {};
		/**
		@type {Object<string, Tile<FeatureType>>}
		*/
		this.sourceTiles_ = {};
		/**
		* @private
		* @type {boolean}
		*/
		this.overlaps_ = options.overlaps == void 0 ? true : options.overlaps;
		/**
		* @protected
		* @type {typeof import("../VectorTile.js").default}
		*/
		this.tileClass = options.tileClass ? options.tileClass : VectorTile$1;
		/**
		* @private
		* @type {Object<string, import("../tilegrid/TileGrid.js").default>}
		*/
		this.tileGrids_ = {};
	}
	/**
	* @return {boolean} The source can have overlapping geometries.
	*/
	getOverlaps() {
		return this.overlaps_;
	}
	/**
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection").default} projection Projection.
	* @param {VectorRenderTile} tile Vector render tile.
	* @return {Array<import("../VectorTile").default>} Tile keys.
	*/
	getSourceTiles(pixelRatio, projection, tile) {
		if (tile.getState() === TileState_default.IDLE) {
			tile.setState(TileState_default.LOADING);
			const urlTileCoord = tile.wrappedTileCoord;
			const tileGrid = this.getTileGridForProjection(projection);
			const extent = tileGrid.getTileCoordExtent(urlTileCoord);
			const z = urlTileCoord[0];
			const resolution = tileGrid.getResolution(z);
			buffer$1(extent, -resolution, extent);
			const sourceTileGrid = this.tileGrid;
			const sourceExtent = sourceTileGrid.getExtent();
			if (sourceExtent) getIntersection(extent, sourceExtent, extent);
			const sourceZ = sourceTileGrid.getZForResolution(resolution, this.zDirection);
			sourceTileGrid.forEachTileCoord(extent, sourceZ, (sourceTileCoord) => {
				const tileUrl = this.tileUrlFunction(sourceTileCoord, pixelRatio, projection);
				if (!this.sourceTiles_[tileUrl]) this.sourceTiles_[tileUrl] = new this.tileClass(sourceTileCoord, tileUrl ? TileState_default.IDLE : TileState_default.EMPTY, tileUrl, this.format_, this.tileLoadFunction);
				const sourceTile = this.sourceTiles_[tileUrl];
				tile.sourceTiles.push(sourceTile);
				if (!this.tileKeysBySourceTileUrl_[tileUrl]) this.tileKeysBySourceTileUrl_[tileUrl] = [];
				this.tileKeysBySourceTileUrl_[tileUrl].push(tile.getKey());
				const sourceTileState = sourceTile.getState();
				if (sourceTileState < TileState_default.LOADED) {
					const listenChange = (event) => {
						this.handleTileChange(event);
						const state = sourceTile.getState();
						if (state === TileState_default.LOADED || state === TileState_default.ERROR) {
							const sourceTileKey = sourceTile.getKey();
							if (sourceTileKey in tile.errorTileKeys) {
								if (sourceTile.getState() === TileState_default.LOADED) delete tile.errorTileKeys[sourceTileKey];
							} else tile.loadingSourceTiles--;
							if (state === TileState_default.ERROR) tile.errorTileKeys[sourceTileKey] = true;
							else sourceTile.removeEventListener(EventType_default.CHANGE, listenChange);
							if (tile.loadingSourceTiles === 0) tile.setState(isEmpty(tile.errorTileKeys) ? TileState_default.LOADED : TileState_default.ERROR);
						}
					};
					sourceTile.addEventListener(EventType_default.CHANGE, listenChange);
					tile.loadingSourceTiles++;
				}
				if (sourceTileState === TileState_default.IDLE) {
					sourceTile.extent = sourceTileGrid.getTileCoordExtent(sourceTileCoord);
					sourceTile.projection = projection;
					sourceTile.resolution = sourceTileGrid.getResolution(sourceTileCoord[0]);
					sourceTile.load();
				}
			});
			if (!tile.loadingSourceTiles) tile.setState(tile.sourceTiles.some((sourceTile) => sourceTile.getState() === TileState_default.ERROR) ? TileState_default.ERROR : TileState_default.LOADED);
		}
		return tile.sourceTiles;
	}
	/**
	* @param {VectorRenderTile} tile Vector render tile.
	*/
	removeSourceTiles(tile) {
		const tileKey = tile.getKey();
		const sourceTiles = tile.sourceTiles;
		for (let i = 0, ii = sourceTiles.length; i < ii; ++i) {
			const sourceTileUrl = sourceTiles[i].getTileUrl();
			if (!this.tileKeysBySourceTileUrl_[sourceTileUrl]) return;
			const index = this.tileKeysBySourceTileUrl_[sourceTileUrl].indexOf(tileKey);
			if (index === -1) continue;
			this.tileKeysBySourceTileUrl_[sourceTileUrl].splice(index, 1);
			if (this.tileKeysBySourceTileUrl_[sourceTileUrl].length === 0) {
				delete this.tileKeysBySourceTileUrl_[sourceTileUrl];
				delete this.sourceTiles_[sourceTileUrl];
			}
		}
	}
	/**
	* @param {number} z Tile coordinate z.
	* @param {number} x Tile coordinate x.
	* @param {number} y Tile coordinate y.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {!VectorRenderTile} Tile.
	* @override
	*/
	getTile(z, x, y, pixelRatio, projection) {
		const tileCoord = [
			z,
			x,
			y
		];
		let urlTileCoord = this.getTileCoordForTileUrlFunction(tileCoord, projection);
		const sourceExtent = this.getTileGrid().getExtent();
		const tileGrid = this.getTileGridForProjection(projection);
		if (urlTileCoord && sourceExtent) {
			const tileExtent = tileGrid.getTileCoordExtent(urlTileCoord);
			buffer$1(tileExtent, -tileGrid.getResolution(z), tileExtent);
			if (!intersects(sourceExtent, tileExtent)) urlTileCoord = null;
		}
		let empty = true;
		if (urlTileCoord !== null) {
			const sourceTileGrid = this.tileGrid;
			const resolution = tileGrid.getResolution(z);
			const sourceZ = sourceTileGrid.getZForResolution(resolution, 1);
			const extent = tileGrid.getTileCoordExtent(urlTileCoord);
			buffer$1(extent, -resolution, extent);
			sourceTileGrid.forEachTileCoord(extent, sourceZ, (sourceTileCoord) => {
				empty = empty && !this.tileUrlFunction(sourceTileCoord, pixelRatio, projection);
			});
		}
		const newTile = new VectorRenderTile(tileCoord, empty ? TileState_default.EMPTY : TileState_default.IDLE, urlTileCoord, this.getSourceTiles.bind(this, pixelRatio, projection), this.removeSourceTiles.bind(this));
		newTile.key = this.getKey();
		return newTile;
	}
	/**
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
	* @override
	*/
	getTileGridForProjection(projection) {
		const code = projection.getCode();
		let tileGrid = this.tileGrids_[code];
		if (!tileGrid) {
			const sourceProjection = this.getProjection();
			assert(sourceProjection === null || equivalent(sourceProjection, projection), "A VectorTile source can only be rendered if it has a projection compatible with the view projection.");
			const sourceTileGrid = this.tileGrid;
			const resolutions = sourceTileGrid.getResolutions().slice();
			const origins = resolutions.map(function(resolution, z) {
				return sourceTileGrid.getOrigin(z);
			});
			const tileSizes = resolutions.map(function(resolution, z) {
				return sourceTileGrid.getTileSize(z);
			});
			const length = 43;
			for (let z = resolutions.length; z < length; ++z) {
				resolutions.push(resolutions[z - 1] / 2);
				origins.push(origins[z - 1]);
				tileSizes.push(tileSizes[z - 1]);
			}
			tileGrid = new TileGrid({
				extent: sourceTileGrid.getExtent(),
				origins,
				resolutions,
				tileSizes
			});
			this.tileGrids_[code] = tileGrid;
		}
		return tileGrid;
	}
	/**
	* Get the tile pixel ratio for this source.
	* @param {number} pixelRatio Pixel ratio.
	* @return {number} Tile pixel ratio.
	* @override
	*/
	getTilePixelRatio(pixelRatio) {
		return pixelRatio;
	}
	/**
	* @param {number} z Z.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {import("../size.js").Size} Tile size.
	* @override
	*/
	getTilePixelSize(z, pixelRatio, projection) {
		const tileSize = toSize(this.getTileGridForProjection(projection).getTileSize(z), this.tmpSize);
		return [Math.round(tileSize[0] * pixelRatio), Math.round(tileSize[1] * pixelRatio)];
	}
	/**
	* @param {boolean} overlaps The source has overlapping geometries.
	*/
	setOverlaps(overlaps) {
		this.overlaps_ = overlaps;
		this.changed();
	}
};
/**
* Sets the loader for a tile.
* @template {import("../Feature.js").FeatureLike} [FeatureType=import("../render/Feature.js").default]
* @param {import("../VectorTile.js").default<FeatureType>} tile Vector tile.
* @param {string} url URL.
*/
function defaultLoadFunction(tile, url) {
	tile.setLoader(
		/**
		* @param {import("../extent.js").Extent} extent Extent.
		* @param {number} resolution Resolution.
		* @param {import("../proj/Projection.js").default} projection Projection.
		*/
		function(extent, resolution, projection) {
			loadFeaturesXhr(url, tile.getFormat(), extent, resolution, projection, tile.onLoad.bind(tile), tile.onError.bind(tile));
		}
	);
}
//#endregion
//#region node_modules/ol/source/OGCVectorTile.js
/**
* @module ol/source/OGCVectorTile
*/
/**
* @template {import("../Feature.js").FeatureLike} [FeatureType=import("../render/Feature.js").default]
* @typedef {Object} Options
* @property {string} url URL to the OGC Vector Tileset endpoint.
* @property {Object} [context] A lookup of values to use in the tile URL template.  The `{tileMatrix}`
* (zoom level), `{tileRow}`, and `{tileCol}` variables in the URL will always be provided by the source.
* @property {import("../format/Feature.js").default<FeatureType>} [format] Feature format for tiles. Used and required by the default.
* @property {string} [mediaType] The content type for the tiles (e.g. "application/vnd.mapbox-vector-tile").  If not provided,
* the source will try to find a link with rel="item" that uses a vector type supported by the configured format.
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {boolean} [overlaps=true] This source may have overlapping geometries. Setting this
* to `false` (e.g. for sources with polygons that represent administrative
* boundaries or TopoJSON sources) allows the renderer to optimise fill and
* stroke operations.
* @property {import("../proj.js").ProjectionLike} [projection='EPSG:3857'] Projection of the tile grid.
* @property {typeof import("../VectorTile.js").default} [tileClass] Class used to instantiate image tiles.
* Default is {@link module:ol/VectorTile~VectorTile}.
* @property {number} [transition] A duration for tile opacity
* transitions in milliseconds. A duration of 0 disables the opacity transition.
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* When set to `false`, only one world
* will be rendered. When set to `true`, tiles will be wrapped horizontally to
* render multiple worlds.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=1]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
* @property {Array<string>} [collections] A list of geospatial data sub-resources to include. If not provided, the entire dataset will
* be included. This option is not applicable when requesting the tileset for a single collection.
*/
/**
* @classdesc
* Layer source for map tiles from an [OGC API - Tiles](https://ogcapi.ogc.org/tiles/) service that provides "vector" type tiles.
* The service must conform to at least the core (http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/core)
* and tileset (http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/tileset) conformance classes. For supporting the `collections`
* option, the service must conform to the collections selection
* (http://www.opengis.net/spec/ogcapi-tiles-1/1.0/conf/collections-selection) conformance class.
*
* Vector tile sets may come in a variety of formats (e.g. GeoJSON, MVT).  The `format` option is used to determine
* which of the advertised media types is used.  If you need to force the use of a particular media type, you can
* provide the `mediaType` option.
* @api
* @template {import("../Feature.js").FeatureLike} [FeatureType=import("../render/Feature.js").default]
* @extends {VectorTileSource<FeatureType>}
*/
var OGCVectorTile = class extends VectorTile {
	/**
	* @param {Options<FeatureType>} options OGC vector tile options.
	*/
	constructor(options) {
		super({
			attributions: options.attributions,
			attributionsCollapsible: options.attributionsCollapsible,
			cacheSize: options.cacheSize,
			format: options.format,
			overlaps: options.overlaps,
			projection: options.projection,
			tileClass: options.tileClass,
			transition: options.transition,
			wrapX: options.wrapX,
			zDirection: options.zDirection,
			state: "loading"
		});
		getTileSetInfo({
			url: options.url,
			projection: this.getProjection(),
			mediaType: options.mediaType,
			supportedMediaTypes: options.format.supportedMediaTypes,
			context: options.context || null,
			collections: options.collections
		}).then(this.handleTileSetInfo_.bind(this)).catch(this.handleError_.bind(this));
	}
	/**
	* @param {import("./ogcTileUtil.js").TileSetInfo} tileSetInfo Tile set info.
	* @private
	*/
	handleTileSetInfo_(tileSetInfo) {
		this.tileGrid = tileSetInfo.grid;
		this.projection = tileSetInfo.projection;
		this.setTileUrlFunction(tileSetInfo.urlFunction, tileSetInfo.urlTemplate);
		this.setState("ready");
	}
	/**
	* @private
	* @param {Error} error The error.
	*/
	handleError_(error$1) {
		error(error$1);
		this.setState("error");
	}
};
//#endregion
//#region node_modules/ol/renderer/canvas/ImageLayer.js
/**
* @module ol/renderer/canvas/ImageLayer
*/
/**
* @classdesc
* Canvas renderer for image layers.
* @api
*/
var CanvasImageLayerRenderer = class extends CanvasLayerRenderer {
	/**
	* @param {import("../../layer/Image.js").default} imageLayer Image layer.
	*/
	constructor(imageLayer) {
		super(imageLayer);
		/**
		* @protected
		* @type {?import("../../Image.js").default}
		*/
		this.image = null;
	}
	/**
	* @return {import('../../DataTile.js').ImageLike} Image.
	*/
	getImage() {
		return !this.image ? null : this.image.getImage();
	}
	/**
	* Determine whether render should be called.
	* @param {import("../../Map.js").FrameState} frameState Frame state.
	* @return {boolean} Layer is ready to be rendered.
	* @override
	*/
	prepareFrame(frameState) {
		const layerState = frameState.layerStatesArray[frameState.layerIndex];
		const pixelRatio = frameState.pixelRatio;
		const viewState = frameState.viewState;
		const viewResolution = viewState.resolution;
		const imageSource = this.getLayer().getSource();
		const hints = frameState.viewHints;
		let renderedExtent = frameState.extent;
		if (layerState.extent !== void 0) renderedExtent = getIntersection(renderedExtent, fromUserExtent(layerState.extent, viewState.projection));
		if (!hints[ViewHint_default.ANIMATING] && !hints[ViewHint_default.INTERACTING] && !isEmpty$1(renderedExtent)) if (imageSource) {
			const projection = viewState.projection;
			const image = imageSource.getImage(renderedExtent, viewResolution, pixelRatio, projection);
			if (image) {
				if (this.loadImage(image)) this.image = image;
				else if (image.getState() === ImageState_default.EMPTY) this.image = null;
			}
		} else this.image = null;
		return !!this.image;
	}
	/**
	* @param {import("../../pixel.js").Pixel} pixel Pixel.
	* @return {Uint8ClampedArray} Data at the pixel location.
	* @override
	*/
	getData(pixel) {
		const frameState = this.frameState;
		if (!frameState) return null;
		const layer = this.getLayer();
		const coordinate = apply(frameState.pixelToCoordinateTransform, pixel.slice());
		const layerExtent = layer.getExtent();
		if (layerExtent) {
			if (!containsCoordinate(layerExtent, coordinate)) return null;
		}
		const imageExtent = this.image.getExtent();
		const img = this.image.getImage();
		const imageMapWidth = getWidth(imageExtent);
		const col = Math.floor(img.width * ((coordinate[0] - imageExtent[0]) / imageMapWidth));
		if (col < 0 || col >= img.width) return null;
		const imageMapHeight = getHeight(imageExtent);
		const row = Math.floor(img.height * ((imageExtent[3] - coordinate[1]) / imageMapHeight));
		if (row < 0 || row >= img.height) return null;
		return this.getImageData(img, col, row);
	}
	/**
	* Render the layer.
	* @param {import("../../Map.js").FrameState} frameState Frame state.
	* @param {HTMLElement} target Target that may be used to render content to.
	* @return {HTMLElement} The rendered element.
	* @override
	*/
	renderFrame(frameState, target) {
		const image = this.image;
		const imageExtent = image.getExtent();
		const imageResolution = image.getResolution();
		const [imageResolutionX, imageResolutionY] = Array.isArray(imageResolution) ? imageResolution : [imageResolution, imageResolution];
		const imagePixelRatio = image.getPixelRatio();
		const layerState = frameState.layerStatesArray[frameState.layerIndex];
		const pixelRatio = frameState.pixelRatio;
		const viewState = frameState.viewState;
		const viewCenter = viewState.center;
		const viewResolution = viewState.resolution;
		const scaleX = pixelRatio * imageResolutionX / (viewResolution * imagePixelRatio);
		const scaleY = pixelRatio * imageResolutionY / (viewResolution * imagePixelRatio);
		this.prepareContainer(frameState, target);
		const width = this.context.canvas.width;
		const height = this.context.canvas.height;
		const context = this.getRenderContext(frameState);
		let clipped = false;
		let render = true;
		if (layerState.extent) {
			const layerExtent = fromUserExtent(layerState.extent, viewState.projection);
			render = intersects(layerExtent, frameState.extent);
			clipped = render && !containsExtent(layerExtent, frameState.extent);
			if (clipped) this.clipUnrotated(context, frameState, layerExtent);
		}
		const img = image.getImage();
		const transform = compose(this.tempTransform, width / 2, height / 2, scaleX, scaleY, 0, imagePixelRatio * (imageExtent[0] - viewCenter[0]) / imageResolutionX, imagePixelRatio * (viewCenter[1] - imageExtent[3]) / imageResolutionY);
		this.renderedResolution = imageResolutionY * pixelRatio / imagePixelRatio;
		const dw = img.width * transform[0];
		const dh = img.height * transform[3];
		if (!this.getLayer().getSource().getInterpolate()) context.imageSmoothingEnabled = false;
		this.preRender(context, frameState);
		if (render && dw >= .5 && dh >= .5) {
			const dx = transform[4];
			const dy = transform[5];
			const opacity = layerState.opacity;
			if (opacity !== 1) {
				context.save();
				context.globalAlpha = opacity;
			}
			context.drawImage(img, 0, 0, +img.width, +img.height, dx, dy, dw, dh);
			if (opacity !== 1) context.restore();
		}
		this.postRender(this.context, frameState);
		if (clipped) context.restore();
		context.imageSmoothingEnabled = true;
		return this.container;
	}
};
//#endregion
//#region node_modules/ol/layer/BaseImage.js
/**
* @module ol/layer/BaseImage
*/
/**
* @template {import("../source/Image.js").default} ImageSourceType
* @typedef {Object} Options
* @property {string} [className='ol-layer'] A CSS class name to set to the layer element.
* @property {number} [opacity=1] Opacity (0, 1).
* @property {boolean} [visible=true] Visibility.
* @property {import("../extent.js").Extent} [extent] The bounding extent for layer rendering.  The layer will not be
* rendered outside of this extent.
* @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
* will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
* for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
* method was used.
* @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
* visible.
* @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
* be visible.
* @property {number} [minZoom] The minimum view zoom level (exclusive) above which this layer will be
* visible.
* @property {number} [maxZoom] The maximum view zoom level (inclusive) at which this layer will
* be visible.
* @property {import("../Map.js").default} [map] Sets the layer as overlay on a map. The map will not manage
* this layer in its layers collection, and the layer will be rendered on top. This is useful for
* temporary layers. The standard way to add a layer to a map and have it managed by the map is to
* use {@link import("../Map.js").default#addLayer map.addLayer()}.
* @property {ImageSourceType} [source] Source for this layer.
* @property {Object<string, *>} [properties] Arbitrary observable properties. Can be accessed with `#get()` and `#set()`.
*/
/**
* @classdesc
* Server-rendered images that are available for arbitrary extents and
* resolutions.
* Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
* property on the layer object; for example, setting `title: 'My Title'` in the
* options means that `title` is observable, and has get/set accessors.
*
* @template {import("../source/Image.js").default} ImageSourceType
* @template {import("../renderer/Layer.js").default} RendererType
* @extends {Layer<ImageSourceType, RendererType>}
* @api
*/
var BaseImageLayer = class extends Layer {
	/**
	* @param {Options<ImageSourceType>} [options] Layer options.
	*/
	constructor(options) {
		options = options ? options : {};
		super(options);
	}
};
//#endregion
//#region node_modules/ol/layer/Image.js
/**
* @module ol/layer/Image
*/
/**
* @classdesc
* Server-rendered images that are available for arbitrary extents and
* resolutions.
* Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
* property on the layer object; for example, setting `title: 'My Title'` in the
* options means that `title` is observable, and has get/set accessors.
*
* @template {import("../source/Image.js").default} ImageSourceType
* @extends {BaseImageLayer<ImageSourceType, CanvasImageLayerRenderer>}
* @api
*/
var ImageLayer = class extends BaseImageLayer {
	/**
	* @param {import("./BaseImage.js").Options<ImageSourceType>} [options] Layer options.
	*/
	constructor(options) {
		super(options);
	}
	/**
	* @override
	*/
	createRenderer() {
		return new CanvasImageLayerRenderer(this);
	}
	/**
	* Get data for a pixel location.  A four element RGBA array will be returned.  For requests outside the
	* layer extent, `null` will be returned.  Data for an image can only be retrieved if the
	* source's `crossOrigin` property is set.
	*
	* ```js
	* // display layer data on every pointer move
	* map.on('pointermove', (event) => {
	*   console.log(layer.getData(event.pixel));
	* });
	* ```
	* @param {import("../pixel").Pixel} pixel Pixel.
	* @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
	* @api
	* @override
	*/
	getData(pixel) {
		return super.getData(pixel);
	}
};
//#endregion
//#region node_modules/ol/source/Raster.js
/**
* @module ol/source/Raster
*/
/**
* @typedef {Object} MinionData
* @property {Array<ArrayBuffer>} buffers Array of buffers.
* @property {Object} meta Operation metadata.
* @property {boolean} imageOps The operation is an image operation.
* @property {number} width The width of the image.
* @property {number} height The height of the image.
*/
/* istanbul ignore next */
/**
* Create a function for running operations.  This function is serialized for
* use in a worker.
* @param {function(Array, Object):*} operation The operation.
* @return {function(MinionData):ArrayBuffer} A function that takes an object with
* buffers, meta, imageOps, width, and height properties and returns an array
* buffer.
*/
function createMinion(operation) {
	return function(data) {
		const buffers = data["buffers"];
		const meta = data["meta"];
		const imageOps = data["imageOps"];
		const width = data["width"];
		const height = data["height"];
		const numBuffers = buffers.length;
		const numBytes = buffers[0].byteLength;
		if (imageOps) {
			const images = new Array(numBuffers);
			for (let b = 0; b < numBuffers; ++b) images[b] = new ImageData(new Uint8ClampedArray(buffers[b]), width, height);
			return operation(images, meta).data.buffer;
		}
		const output = new Uint8ClampedArray(numBytes);
		const arrays = new Array(numBuffers);
		const pixels = new Array(numBuffers);
		for (let b = 0; b < numBuffers; ++b) {
			arrays[b] = new Uint8ClampedArray(buffers[b]);
			pixels[b] = [
				0,
				0,
				0,
				0
			];
		}
		for (let i = 0; i < numBytes; i += 4) {
			for (let j = 0; j < numBuffers; ++j) {
				const array = arrays[j];
				pixels[j][0] = array[i];
				pixels[j][1] = array[i + 1];
				pixels[j][2] = array[i + 2];
				pixels[j][3] = array[i + 3];
			}
			const pixel = operation(pixels, meta);
			output[i] = pixel[0];
			output[i + 1] = pixel[1];
			output[i + 2] = pixel[2];
			output[i + 3] = pixel[3];
		}
		return output.buffer;
	};
}
/**
* Create a worker for running operations.
* @param {ProcessorOptions} config Processor options.
* @param {function(MessageEvent): void} onMessage Called with a message event.
* @return {Worker} The worker.
*/
function createWorker(config, onMessage) {
	const lines = Object.keys(config.lib || {}).map(function(name) {
		return "const " + name + " = " + config.lib[name].toString() + ";";
	}).concat([
		"const __minion__ = (" + createMinion.toString() + ")(",
		config.operation.toString(),
		");",
		"self.addEventListener(\"message\", function(event) {",
		"  const buffer = __minion__(event.data);",
		"  self.postMessage({buffer: buffer, meta: event.data.meta}, [buffer]);",
		"});"
	]);
	const worker = new Worker(typeof Blob === "undefined" ? "data:text/javascript;base64," + Buffer.from(lines.join("\n"), "binary").toString("base64") : URL.createObjectURL(new Blob(lines, { type: "text/javascript" })));
	worker.addEventListener("message", onMessage);
	return worker;
}
/**
* @typedef {Object} FauxMessageEvent
* @property {Object} data Message data.
*/
/**
* Create a faux worker for running operations.
* @param {ProcessorOptions} config Configuration.
* @param {function(FauxMessageEvent): void} onMessage Called with a message event.
* @return {Object} The faux worker.
*/
function createFauxWorker(config, onMessage) {
	const minion = createMinion(config.operation);
	let terminated = false;
	return {
		postMessage: function(data) {
			setTimeout(function() {
				if (terminated) return;
				onMessage({ data: {
					buffer: minion(data),
					meta: data["meta"]
				} });
			}, 0);
		},
		terminate: function() {
			terminated = true;
		}
	};
}
/**
* @typedef {function(Error, ImageData, (Object|Array<Object>)): void} JobCallback
*/
/**
* @typedef {Object} Job
* @property {Object} meta Job metadata.
* @property {Array<ImageData>} inputs Array of input data.
* @property {JobCallback} callback Called when the job is complete.
*/
/**
* @typedef {Object} ProcessorOptions
* @property {number} threads Number of workers to spawn.
* @property {Operation} operation The operation.
* @property {Object<string, Function>} [lib] Functions that will be made available to operations run in a worker.
* @property {number} queue The number of queued jobs to allow.
* @property {boolean} [imageOps=false] Pass all the image data to the operation instead of a single pixel.
*/
/**
* @classdesc
* A processor runs pixel or image operations in workers.
*/
var Processor = class extends Disposable {
	/**
	* @param {ProcessorOptions} config Configuration.
	*/
	constructor(config) {
		super();
		/**
		* @type {boolean}
		* @private
		*/
		this.imageOps_ = !!config.imageOps;
		let threads;
		if (config.threads === 0) threads = 0;
		else if (this.imageOps_) threads = 1;
		else threads = config.threads || 1;
		/**
		* @type {Array<Worker>}
		*/
		const workers = new Array(threads);
		if (threads) for (let i = 0; i < threads; ++i) workers[i] = createWorker(config, this.onWorkerMessage_.bind(this, i));
		else workers[0] = createFauxWorker(config, this.onWorkerMessage_.bind(this, 0));
		/**
		* @type {Array<Worker>}
		* @private
		*/
		this.workers_ = workers;
		/**
		* @type {Array<Job>}
		* @private
		*/
		this.queue_ = [];
		/**
		* @type {number}
		* @private
		*/
		this.maxQueueLength_ = config.queue || Infinity;
		/**
		* @type {number}
		* @private
		*/
		this.running_ = 0;
		/**
		* @type {Object<number, any>}
		* @private
		*/
		this.dataLookup_ = {};
		/**
		* @type {Job|null}
		* @private
		*/
		this.job_ = null;
	}
	/**
	* Run operation on input data.
	* @param {Array<ImageData>} inputs Array of image data.
	* @param {Object} meta A user data object.  This is passed to all operations
	*     and must be serializable.
	* @param {function(Error, ImageData, Object): void} callback Called when work
	*     completes.  The first argument is any error.  The second is the ImageData
	*     generated by operations.  The third is the user data object.
	*/
	process(inputs, meta, callback) {
		this.enqueue_({
			inputs,
			meta,
			callback
		});
		this.dispatch_();
	}
	/**
	* Add a job to the queue.
	* @param {Job} job The job.
	*/
	enqueue_(job) {
		this.queue_.push(job);
		while (this.queue_.length > this.maxQueueLength_) this.queue_.shift().callback(null, null);
	}
	/**
	* Dispatch a job.
	*/
	dispatch_() {
		if (this.running_ || this.queue_.length === 0) return;
		const job = this.queue_.shift();
		this.job_ = job;
		const width = job.inputs[0].width;
		const height = job.inputs[0].height;
		const buffers = job.inputs.map(function(input) {
			return input.data.buffer;
		});
		const threads = this.workers_.length;
		this.running_ = threads;
		if (threads === 1) {
			this.workers_[0].postMessage({
				buffers,
				meta: job.meta,
				imageOps: this.imageOps_,
				width,
				height
			}, buffers);
			return;
		}
		const length = job.inputs[0].data.length;
		const segmentLength = 4 * Math.ceil(length / 4 / threads);
		for (let i = 0; i < threads; ++i) {
			const offset = i * segmentLength;
			const slices = [];
			for (let j = 0, jj = buffers.length; j < jj; ++j) slices.push(buffers[j].slice(offset, offset + segmentLength));
			this.workers_[i].postMessage({
				buffers: slices,
				meta: job.meta,
				imageOps: this.imageOps_,
				width,
				height
			}, slices);
		}
	}
	/**
	* Handle messages from the worker.
	* @param {number} index The worker index.
	* @param {MessageEvent} event The message event.
	*/
	onWorkerMessage_(index, event) {
		if (this.disposed) return;
		this.dataLookup_[index] = event.data;
		--this.running_;
		if (this.running_ === 0) this.resolveJob_();
	}
	/**
	* Resolve a job.  If there are no more worker threads, the processor callback
	* will be called.
	*/
	resolveJob_() {
		const job = this.job_;
		const threads = this.workers_.length;
		let data, meta;
		if (threads === 1) {
			data = new Uint8ClampedArray(this.dataLookup_[0]["buffer"]);
			meta = this.dataLookup_[0]["meta"];
		} else {
			const length = job.inputs[0].data.length;
			data = new Uint8ClampedArray(length);
			meta = new Array(threads);
			const segmentLength = 4 * Math.ceil(length / 4 / threads);
			for (let i = 0; i < threads; ++i) {
				const buffer = this.dataLookup_[i]["buffer"];
				const offset = i * segmentLength;
				data.set(new Uint8ClampedArray(buffer), offset);
				meta[i] = this.dataLookup_[i]["meta"];
			}
		}
		this.job_ = null;
		this.dataLookup_ = {};
		job.callback(null, new ImageData(data, job.inputs[0].width, job.inputs[0].height), meta);
		this.dispatch_();
	}
	/**
	* Terminate all workers associated with the processor.
	* @override
	*/
	disposeInternal() {
		for (let i = 0; i < this.workers_.length; ++i) this.workers_[i].terminate();
		this.workers_.length = 0;
	}
};
/**
* A function that takes an array of input data, performs some operation, and
* returns an array of output data.
* For `pixel` type operations, the function will be called with an array of
* pixels, where each pixel is an array of four numbers (`[r, g, b, a]`) in the
* range of 0 - 255. It should return a single pixel array.
* For `'image'` type operations, functions will be called with an array of
* [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData)
* and should return a single
* [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData).
* The operations
* are called with a second "data" argument, which can be used for storage.  The
* data object is accessible from raster events, where it can be initialized in
* "beforeoperations" and accessed again in "afteroperations".
*
* @typedef {function((Array<Array<number>>|Array<ImageData>), Object):
*     (Array<number>|ImageData)} Operation
*/
/**
* @enum {string}
*/
var RasterEventType = {
	BEFOREOPERATIONS: "beforeoperations",
	AFTEROPERATIONS: "afteroperations"
};
/**
* @typedef {'pixel' | 'image'} RasterOperationType
* Raster operation type. Supported values are `'pixel'` and `'image'`.
*/
/**
* @typedef {import("./Image.js").ImageSourceEventTypes|'beforeoperations'|'afteroperations'} RasterSourceEventTypes
*/
/**
* @classdesc
* Events emitted by {@link module:ol/source/Raster~RasterSource} instances are instances of this
* type.
*/
var RasterSourceEvent = class extends BaseEvent {
	/**
	* @param {string} type Type.
	* @param {import("../Map.js").FrameState} frameState The frame state.
	* @param {Object|Array<Object>} data An object made available to operations.  For "afteroperations" evenets
	* this will be an array of objects if more than one thread is used.
	*/
	constructor(type, frameState, data) {
		super(type);
		/**
		* The raster extent.
		* @type {import("../extent.js").Extent}
		* @api
		*/
		this.extent = frameState.extent;
		/**
		* The pixel resolution (map units per pixel).
		* @type {number}
		* @api
		*/
		this.resolution = frameState.viewState.resolution / frameState.pixelRatio;
		/**
		* An object made available to all operations.  This can be used by operations
		* as a storage object (e.g. for calculating statistics).
		* @type {Object}
		* @api
		*/
		this.data = data;
	}
};
/**
* @typedef {Object} Options
* @property {Array<import("./Source.js").default|import("../layer/Layer.js").default>} sources Input
* sources or layers.  For vector data, use an VectorImage layer.
* @property {Operation} [operation] Raster operation.
* The operation will be called with data from input sources
* and the output will be assigned to the raster source.
* @property {Object} [lib] Functions that will be made available to operations run in a worker.
* @property {number} [threads] By default, operations will be run in a single worker thread.
* To avoid using workers altogether, set `threads: 0`.  For pixel operations, operations can
* be run in multiple worker threads.  Note that there is additional overhead in
* transferring data to multiple workers, and that depending on the user's
* system, it may not be possible to parallelize the work.
* @property {RasterOperationType} [operationType='pixel'] Operation type.
* Supported values are `'pixel'` and `'image'`.  By default,
* `'pixel'` operations are assumed, and operations will be called with an
* array of pixels from input sources.  If set to `'image'`, operations will
* be called with an array of ImageData objects from input sources.
* @property {Array<number>|null} [resolutions] Resolutions. If specified, raster operations will only
* be run at the given resolutions.  By default, the resolutions of the first source with resolutions
* specified will be used, if any. Set to `null` to use any view resolution instead.
*/
/***
* @template Return
* @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
*   import("../Observable").OnSignature<import("../ObjectEventType").Types, import("../Object").ObjectEvent, Return> &
*   import("../Observable").OnSignature<import("./Image.js").ImageSourceEventTypes, import("./Image.js").ImageSourceEvent, Return> &
*   import("../Observable").OnSignature<RasterSourceEventTypes, RasterSourceEvent, Return> &
*   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("../ObjectEventType").Types
*     |RasterSourceEventTypes, Return>} RasterSourceOnSignature
*/
/**
* @classdesc
* A source that transforms data from any number of input sources using an
* {@link module:ol/source/Raster~Operation} function to transform input pixel values into
* output pixel values.
*
* @fires module:ol/source/Raster.RasterSourceEvent
* @api
*/
var RasterSource = class extends ImageSource {
	/**
	* @param {Options} options Options.
	*/
	constructor(options) {
		super({ projection: null });
		/***
		* @type {RasterSourceOnSignature<import("../events").EventsKey>}
		*/
		this.on;
		/***
		* @type {RasterSourceOnSignature<import("../events").EventsKey>}
		*/
		this.once;
		/***
		* @type {RasterSourceOnSignature<void>}
		*/
		this.un;
		/**
		* @private
		* @type {Processor}
		*/
		this.processor_ = null;
		/**
		* @private
		* @type {RasterOperationType}
		*/
		this.operationType_ = options.operationType !== void 0 ? options.operationType : "pixel";
		/**
		* @private
		* @type {number}
		*/
		this.threads_ = options.threads !== void 0 ? options.threads : 1;
		/**
		* @private
		* @type {Array<import("../layer/Layer.js").default>}
		*/
		this.layers_ = createLayers(options.sources);
		const changed = this.changed.bind(this);
		for (let i = 0, ii = this.layers_.length; i < ii; ++i) this.layers_[i].addEventListener(EventType_default.CHANGE, changed);
		/**
		* @private
		* @type {boolean}
		*/
		this.useResolutions_ = options.resolutions !== null;
		/**
		* @private
		* @type {import("../TileQueue.js").default}
		*/
		this.tileQueue_ = new TileQueue(function() {
			return 1;
		}, this.processSources_.bind(this));
		/**
		* The most recently requested frame state.
		* @type {import("../Map.js").FrameState}
		* @private
		*/
		this.requestedFrameState_;
		/**
		* The most recently rendered image canvas.
		* @type {import("../ImageCanvas.js").default}
		* @private
		*/
		this.renderedImageCanvas_ = null;
		/**
		* The most recently rendered revision.
		* @type {number}
		* @private
		*/
		this.renderedRevision_;
		/**
		* @private
		* @type {import("../Map.js").FrameState}
		*/
		this.frameState_ = {
			animate: false,
			coordinateToPixelTransform: create$1(),
			declutter: null,
			extent: null,
			index: 0,
			layerIndex: 0,
			layerStatesArray: getLayerStatesArray(this.layers_),
			pixelRatio: 1,
			pixelToCoordinateTransform: create$1(),
			postRenderFunctions: [],
			size: [0, 0],
			tileQueue: this.tileQueue_,
			time: Date.now(),
			usedTiles: {},
			viewState: { rotation: 0 },
			viewHints: [],
			wantedTiles: {},
			mapId: getUid(this),
			renderTargets: {}
		};
		this.setAttributions(function(frameState) {
			/** @type {Array<string>} */
			const attributions = [];
			for (let i = 0, iMax = options.sources.length; i < iMax; ++i) {
				const sourceOrLayer = options.sources[i];
				const source = sourceOrLayer instanceof Source ? sourceOrLayer : sourceOrLayer.getSource();
				if (!source) continue;
				const sourceAttributions = source.getAttributions()?.(frameState);
				if (typeof sourceAttributions === "string") attributions.push(sourceAttributions);
				else if (sourceAttributions !== void 0) attributions.push(...sourceAttributions);
			}
			return attributions;
		});
		if (options.operation !== void 0) this.setOperation(options.operation, options.lib);
	}
	/**
	* Set the operation.
	* @param {Operation} operation New operation.
	* @param {Object} [lib] Functions that will be available to operations run
	*     in a worker.
	* @api
	*/
	setOperation(operation, lib) {
		if (this.processor_) this.processor_.dispose();
		this.processor_ = new Processor({
			operation,
			imageOps: this.operationType_ === "image",
			queue: 1,
			lib,
			threads: this.threads_
		});
		this.changed();
	}
	/**
	* Update the stored frame state.
	* @param {import("../extent.js").Extent} extent The view extent (in map units).
	* @param {number} resolution The view resolution.
	* @param {import("../proj/Projection.js").default} projection The view projection.
	* @return {import("../Map.js").FrameState} The updated frame state.
	* @private
	*/
	updateFrameState_(extent, resolution, projection) {
		const frameState = Object.assign({}, this.frameState_);
		frameState.viewState = Object.assign({}, frameState.viewState);
		const center = getCenter(extent);
		frameState.size[0] = Math.ceil(getWidth(extent) / resolution);
		frameState.size[1] = Math.ceil(getHeight(extent) / resolution);
		frameState.extent = [
			center[0] - frameState.size[0] * resolution / 2,
			center[1] - frameState.size[1] * resolution / 2,
			center[0] + frameState.size[0] * resolution / 2,
			center[1] + frameState.size[1] * resolution / 2
		];
		frameState.time = Date.now();
		const viewState = frameState.viewState;
		viewState.center = center;
		viewState.projection = projection;
		viewState.resolution = resolution;
		return frameState;
	}
	/**
	* Determine if all sources are ready.
	* @return {boolean} All sources are ready.
	* @private
	*/
	allSourcesReady_() {
		let ready = true;
		let source;
		for (let i = 0, ii = this.layers_.length; i < ii; ++i) {
			source = this.layers_[i].getSource();
			if (!source || source.getState() !== "ready") {
				ready = false;
				break;
			}
		}
		return ready;
	}
	/**
	* @param {import("../extent.js").Extent} extent Extent.
	* @param {number} resolution Resolution.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {import("../ImageCanvas.js").default} Single image.
	* @override
	*/
	getImage(extent, resolution, pixelRatio, projection) {
		if (!this.allSourcesReady_()) return null;
		this.tileQueue_.loadMoreTiles(16, 16);
		resolution = this.findNearestResolution(resolution);
		const frameState = this.updateFrameState_(extent, resolution, projection);
		this.requestedFrameState_ = frameState;
		if (this.renderedImageCanvas_) {
			const renderedResolution = this.renderedImageCanvas_.getResolution();
			const renderedExtent = this.renderedImageCanvas_.getExtent();
			if (resolution !== renderedResolution || !equals(frameState.extent, renderedExtent)) this.renderedImageCanvas_ = null;
		}
		if (!this.renderedImageCanvas_ || this.getRevision() !== this.renderedRevision_) this.processSources_();
		if (frameState.animate) requestAnimationFrame(this.changed.bind(this));
		return this.renderedImageCanvas_;
	}
	/**
	* Start processing source data.
	* @private
	*/
	processSources_() {
		const frameState = this.requestedFrameState_;
		const len = this.layers_.length;
		const imageDatas = new Array(len);
		for (let i = 0; i < len; ++i) {
			frameState.layerIndex = i;
			frameState.renderTargets = {};
			const imageData = getImageData(this.layers_[i], frameState);
			if (imageData) imageDatas[i] = imageData;
			else return;
		}
		const data = {};
		this.dispatchEvent(new RasterSourceEvent(RasterEventType.BEFOREOPERATIONS, frameState, data));
		this.processor_.process(imageDatas, data, this.onWorkerComplete_.bind(this, frameState));
	}
	/**
	* Called when pixel processing is complete.
	* @param {import("../Map.js").FrameState} frameState The frame state.
	* @param {Error} err Any error during processing.
	* @param {ImageData} output The output image data.
	* @param {Object|Array<Object>} data The user data (or an array if more than one thread).
	* @private
	*/
	onWorkerComplete_(frameState, err, output, data) {
		if (err || !output) return;
		const extent = frameState.extent;
		const resolution = frameState.viewState.resolution;
		if (resolution !== this.requestedFrameState_.viewState.resolution || !equals(extent, this.requestedFrameState_.extent)) return;
		let context;
		if (this.renderedImageCanvas_) context = this.renderedImageCanvas_.getImage().getContext("2d");
		else {
			context = createCanvasContext2D(Math.round(getWidth(extent) / resolution), Math.round(getHeight(extent) / resolution));
			this.renderedImageCanvas_ = new ImageCanvas(extent, resolution, 1, context.canvas);
		}
		context.putImageData(output, 0, 0);
		if (frameState.animate) requestAnimationFrame(this.changed.bind(this));
		else this.changed();
		this.renderedRevision_ = this.getRevision();
		this.dispatchEvent(new RasterSourceEvent(RasterEventType.AFTEROPERATIONS, frameState, data));
	}
	/**
	* @param {import("../proj/Projection").default} [projection] Projection.
	* @return {Array<number>|null} Resolutions.
	* @override
	*/
	getResolutions(projection) {
		if (!this.useResolutions_) return null;
		let resolutions = super.getResolutions();
		if (!resolutions) for (let i = 0, ii = this.layers_.length; i < ii; ++i) {
			resolutions = this.layers_[i].getSource().getResolutions(projection);
			if (resolutions) break;
		}
		return resolutions;
	}
	/**
	* @override
	*/
	disposeInternal() {
		if (this.processor_) this.processor_.dispose();
		super.disposeInternal();
	}
};
/**
* Clean up and unregister the worker.
* @function
* @api
*/
RasterSource.prototype.dispose;
/**
* A reusable canvas context.
* @type {CanvasRenderingContext2D}
* @private
*/
var sharedContext = null;
/**
* Get image data from a layer.
* @param {import("../layer/Layer.js").default} layer Layer to render.
* @param {import("../Map.js").FrameState} frameState The frame state.
* @return {ImageData} The image data.
*/
function getImageData(layer, frameState) {
	const renderer = layer.getRenderer();
	if (!renderer) throw new Error("Unsupported layer type: " + layer);
	if (!renderer.prepareFrame(frameState)) return null;
	const width = frameState.size[0];
	const height = frameState.size[1];
	if (width === 0 || height === 0) return null;
	const container = renderer.renderFrame(frameState, null);
	let element;
	if (container instanceof HTMLCanvasElement) element = container;
	else {
		if (container) element = container.firstElementChild;
		if (!(element instanceof HTMLCanvasElement)) throw new Error("Unsupported rendered element: " + element);
		if (element.width === width && element.height === height) return element.getContext("2d").getImageData(0, 0, width, height);
	}
	if (!sharedContext) sharedContext = createCanvasContext2D(width, height, void 0, { willReadFrequently: true });
	else {
		const canvas = sharedContext.canvas;
		if (canvas.width !== width || canvas.height !== height) sharedContext = createCanvasContext2D(width, height, void 0, { willReadFrequently: true });
		else sharedContext.clearRect(0, 0, width, height);
	}
	sharedContext.drawImage(element, 0, 0, width, height);
	return sharedContext.getImageData(0, 0, width, height);
}
/**
* Get a list of layer states from a list of layers.
* @param {Array<import("../layer/Layer.js").default>} layers Layers.
* @return {Array<import("../layer/Layer.js").State>} The layer states.
*/
function getLayerStatesArray(layers) {
	return layers.map(function(layer) {
		return layer.getLayerState();
	});
}
/**
* Create layers for all sources.
* @param {Array<import("./Source.js").default|import("../layer/Layer.js").default>} sources The sources.
* @return {Array<import("../layer/Layer.js").default>} Array of layers.
*/
function createLayers(sources) {
	const len = sources.length;
	const layers = new Array(len);
	for (let i = 0; i < len; ++i) layers[i] = createLayer(sources[i]);
	return layers;
}
/**
* Create a layer for the provided source.
* @param {import("./Source.js").default|import("../layer/Layer.js").default} layerOrSource The layer or source.
* @return {import("../layer/Layer.js").default} The layer.
*/
function createLayer(layerOrSource) {
	let layer;
	if (layerOrSource instanceof Source) {
		if (layerOrSource instanceof TileSource) layer = new TileLayer({ source: layerOrSource });
		else if (layerOrSource instanceof ImageSource) layer = new ImageLayer({ source: layerOrSource });
	} else layer = layerOrSource;
	return layer;
}
//#endregion
//#region node_modules/ol/source/StadiaMaps.js
/**
* @module ol/source/StadiaMaps
*/
/**
* @type {string}
*/
var STADIA_ATTRIBUTION = "&copy; <a href=\"https://www.stadiamaps.com/\" target=\"_blank\">Stadia Maps</a>";
/**
* @type {string}
*/
var OMT_ATTRIBUTION = "&copy; <a href=\"https://openmaptiles.org/\" target=\"_blank\">OpenMapTiles</a>";
/**
* @type {string}
*/
var STAMEN_ATTRIBUTION = "&copy; <a href=\"https://stamen.com/\" target=\"_blank\">Stamen Design</a>";
/**
* @type {Object<string, {extension: string}>}
*/
var LayerConfig = {
	"stamen_terrain": { extension: "png" },
	"stamen_terrain_background": { extension: "png" },
	"stamen_terrain_labels": { extension: "png" },
	"stamen_terrain_lines": { extension: "png" },
	"stamen_toner_background": { extension: "png" },
	"stamen_toner": { extension: "png" },
	"stamen_toner_labels": { extension: "png" },
	"stamen_toner_lines": { extension: "png" },
	"stamen_toner_lite": { extension: "png" },
	"stamen_watercolor": { extension: "jpg" },
	"alidade_smooth": { extension: "png" },
	"alidade_smooth_dark": { extension: "png" },
	"alidade_satellite": { extension: "png" },
	"outdoors": { extension: "png" },
	"osm_bright": { extension: "png" }
};
/**
* @type {Object<string, {minZoom: number, maxZoom: number, retina: boolean}>}
*/
var ProviderConfig = {
	"stamen_terrain": {
		minZoom: 0,
		maxZoom: 18,
		retina: true
	},
	"stamen_toner": {
		minZoom: 0,
		maxZoom: 20,
		retina: true
	},
	"stamen_watercolor": {
		minZoom: 1,
		maxZoom: 18,
		retina: false
	}
};
/**
* @typedef {Object} Options
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {string} layer Layer name. Valid values: `alidade_smooth`, `alidade_smooth_dark`, `outdoors`, `stamen_terrain`, `stamen_terrain_background`, `stamen_terrain_labels`, `stamen_terrain_lines`, `stamen_toner_background`, `stamen_toner`, `stamen_toner_labels`, `stamen_toner_lines`, `stamen_toner_lite`, `stamen_watercolor`, and `osm_bright`.
* @property {number} [minZoom] Minimum zoom.
* @property {number} [maxZoom] Maximum zoom.
* @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
* Higher values can increase reprojection performance, but decrease precision.
* @property {import("../Tile.js").LoadFunction} [tileLoadFunction]
* Optional function to load a tile given a URL. The default is
* ```js
* function(imageTile, src) {
*   imageTile.getImage().src = src;
* };
* ```
* @property {number} [transition=250] Duration of the opacity transition for rendering.
* To disable the opacity transition, pass `transition: 0`.
* @property {string} [url] URL template. Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
* @property {string} [apiKey] Stadia Maps API key. Not required for localhost or most public web deployments. See https://docs.stadiamaps.com/authentication/ for details.
* @property {boolean} [retina] Use retina tiles (if available; not available for Stamen Watercolor).
*/
/**
* @classdesc
* Layer source for the Stadia Maps tile server.
* @api
*/
var StadiaMaps = class extends XYZ {
	/**
	* @param {Options} options StadiaMaps options.
	*/
	constructor(options) {
		const i = options.layer.indexOf("-");
		const providerConfig = ProviderConfig[i == -1 ? options.layer : options.layer.slice(0, i)] || {
			"minZoom": 0,
			"maxZoom": 20,
			"retina": true
		};
		const layerConfig = LayerConfig[options.layer];
		const query = options.apiKey ? "?api_key=" + options.apiKey : "";
		const retina = providerConfig.retina && options.retina ? "@2x" : "";
		const url = options.url !== void 0 ? options.url : "https://tiles.stadiamaps.com/tiles/" + options.layer + "/{z}/{x}/{y}" + retina + "." + layerConfig.extension + query;
		const attributions = [
			STADIA_ATTRIBUTION,
			OMT_ATTRIBUTION,
			ATTRIBUTION
		];
		if (options.layer.startsWith("stamen_")) attributions.splice(1, 0, STAMEN_ATTRIBUTION);
		super({
			attributions,
			cacheSize: options.cacheSize,
			crossOrigin: "anonymous",
			interpolate: options.interpolate,
			maxZoom: options.maxZoom !== void 0 ? options.maxZoom : providerConfig.maxZoom,
			minZoom: options.minZoom !== void 0 ? options.minZoom : providerConfig.minZoom,
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			tileLoadFunction: options.tileLoadFunction,
			transition: options.transition,
			url,
			tilePixelRatio: retina ? 2 : 1,
			wrapX: options.wrapX,
			zDirection: options.zDirection
		});
	}
};
//#endregion
//#region node_modules/ol/source/TileArcGISRest.js
/**
* @module ol/source/TileArcGISRest
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {Object<string,*>} [params] ArcGIS Rest parameters. This field is optional. Service defaults will be
* used for any fields not specified. `FORMAT` is `PNG32` by default. `F` is `IMAGE` by
* default. `TRANSPARENT` is `true` by default.  `BBOX`, `SIZE`, `BBOXSR`,
* and `IMAGESR` will be set dynamically. Set `LAYERS` to
* override the default service layer visibility. See
* https://developers.arcgis.com/rest/services-reference/export-map.htm
* for further reference.
* @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
* the image from the remote server.
* @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid. Base this on the resolutions,
* tilesize and extent supported by the server.
* If this is not defined, a default grid will be used: if there is a projection
* extent, the grid will be based on that; if not, a grid based on a global
* extent with origin at 0,0 will be used.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
* The projection code must contain a numeric end portion separated by :
* or the entire code must form a valid ArcGIS SpatialReference definition.
* @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
* Higher values can increase reprojection performance, but decrease precision.
* @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL.
* The default is
* ```js
* function(imageTile, src) {
*   imageTile.getImage().src = src;
* };
* ```
* @property {string} [url] ArcGIS Rest service URL for a Map Service or Image Service. The
* url should include /MapServer or /ImageServer.
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* @property {number} [transition] Duration of the opacity transition for rendering.  To disable the opacity
* transition, pass `transition: 0`.
* @property {Array<string>} [urls] ArcGIS Rest service urls. Use this instead of `url` when the ArcGIS
* Service supports multiple urls for export requests.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
/**
* @classdesc
* Layer source for tile data from ArcGIS Rest services. Map and Image
* Services are supported.
*
* For cached ArcGIS services, better performance is available using the
* {@link module:ol/source/XYZ~XYZ} data source.
* @api
*/
var TileArcGISRest = class extends TileImage {
	/**
	* @param {Options} [options] Tile ArcGIS Rest options.
	*/
	constructor(options) {
		options = options ? options : {};
		super({
			attributions: options.attributions,
			cacheSize: options.cacheSize,
			crossOrigin: options.crossOrigin,
			interpolate: options.interpolate,
			projection: options.projection,
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			tileGrid: options.tileGrid,
			tileLoadFunction: options.tileLoadFunction,
			url: options.url,
			urls: options.urls,
			wrapX: options.wrapX !== void 0 ? options.wrapX : true,
			transition: options.transition,
			zDirection: options.zDirection
		});
		/**
		* @private
		* @type {!Object}
		*/
		this.params_ = Object.assign({}, options.params);
		/**
		* @private
		* @type {boolean}
		*/
		this.hidpi_ = options.hidpi !== void 0 ? options.hidpi : true;
		/**
		* @private
		* @type {import("../extent.js").Extent}
		*/
		this.tmpExtent_ = createEmpty();
		this.setKey(this.getKeyForParams_());
	}
	/**
	* @private
	* @return {string} The key for the current params.
	*/
	getKeyForParams_() {
		let i = 0;
		const res = [];
		for (const key in this.params_) res[i++] = key + "-" + this.params_[key];
		return res.join("/");
	}
	/**
	* Get the user-provided params, i.e. those passed to the constructor through
	* the "params" option, and possibly updated using the updateParams method.
	* @return {Object} Params.
	* @api
	*/
	getParams() {
		return this.params_;
	}
	/**
	* @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
	* @param {import("../size.js").Size} tileSize Tile size.
	* @param {import("../extent.js").Extent} tileExtent Tile extent.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @param {Object} params Params.
	* @return {string|undefined} Request URL.
	* @private
	*/
	getRequestUrl_(tileCoord, tileSize, tileExtent, pixelRatio, projection, params) {
		const urls = this.urls;
		if (!urls) return;
		let url;
		if (urls.length == 1) url = urls[0];
		else url = urls[modulo(hash(tileCoord), urls.length)];
		return getRequestUrl$1(url, tileExtent, (this.tileGrid || this.getTileGridForProjection(projection)).getResolution(tileCoord[0]), pixelRatio, projection, params);
	}
	/**
	* Get the tile pixel ratio for this source.
	* @param {number} pixelRatio Pixel ratio.
	* @return {number} Tile pixel ratio.
	* @override
	*/
	getTilePixelRatio(pixelRatio) {
		return this.hidpi_ ? pixelRatio : 1;
	}
	/**
	* Set the user-provided params.
	* @param {Object} params Params.
	* @api
	*/
	setParams(params) {
		this.params_ = Object.assign({}, params);
		this.setKey(this.getKeyForParams_());
	}
	/**
	* Update the user-provided params.
	* @param {Object} params Params.
	* @api
	*/
	updateParams(params) {
		Object.assign(this.params_, params);
		this.setKey(this.getKeyForParams_());
	}
	/**
	* @param {import("../tilecoord.js").TileCoord} tileCoord The tile coordinate
	* @param {number} pixelRatio The pixel ratio
	* @param {import("../proj/Projection.js").default} projection The projection
	* @return {string|undefined} The tile URL
	* @override
	*/
	tileUrlFunction(tileCoord, pixelRatio, projection) {
		let tileGrid = this.getTileGrid();
		if (!tileGrid) tileGrid = this.getTileGridForProjection(projection);
		if (tileGrid.getResolutions().length <= tileCoord[0]) return;
		if (pixelRatio != 1 && !this.hidpi_) pixelRatio = 1;
		const tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
		let tileSize = toSize(tileGrid.getTileSize(tileCoord[0]), this.tmpSize);
		if (pixelRatio != 1) tileSize = scale$1(tileSize, pixelRatio, this.tmpSize);
		const baseParams = {
			"F": "image",
			"FORMAT": "PNG32",
			"TRANSPARENT": true
		};
		Object.assign(baseParams, this.params_);
		return this.getRequestUrl_(tileCoord, tileSize, tileExtent, pixelRatio, projection, baseParams);
	}
};
//#endregion
//#region node_modules/ol/source/TileDebug.js
/**
* @module ol/source/TileDebug
*/
/**
* @typedef {Object} Options
* @property {import("../proj.js").ProjectionLike} [projection='EPSG:3857'] Optional projection.
* @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid.
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Set to `1` when debugging `VectorTile` sources with a default configuration.
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
* @property {import("./Tile.js").default} [source] Tile source.
* This allows `projection`, `tileGrid`, `wrapX` and `zDirection` to be copied from another source.
* If both `source` and individual options are specified the individual options will have precedence.
* @property {string} [template='z:{z} x:{x} y:{y}'] Template for labeling the tiles.
* Should include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
* @property {string} [color='grey'] CSS color to fill text and stroke grid lines of each tile.
*/
/**
* @classdesc
* A pseudo tile source, which does not fetch tiles from a server, but renders
* a grid outline for the tile grid/projection along with the coordinates for
* each tile. See examples/canvas-tiles for an example.
* @api
*/
var TileDebug = class extends ImageTileSource {
	/**
	* @param {Options} [options] Debug tile options.
	*/
	constructor(options) {
		/**
		* @type {Options}
		*/
		options = options || {};
		const template = options.template || "z:{z} x:{x} y:{y}";
		const source = options.source;
		const color = options.color || "grey";
		super({
			transition: 0,
			wrapX: options.wrapX !== void 0 ? options.wrapX : source !== void 0 ? source.getWrapX() : void 0
		});
		const setReady = () => {
			this.projection = options.projection !== void 0 ? get(options.projection) : source !== void 0 ? source.getProjection() : this.projection;
			this.tileGrid = options.tileGrid !== void 0 ? options.tileGrid : source !== void 0 ? source.getTileGrid() : this.tileGrid;
			this.zDirection = options.zDirection !== void 0 ? options.zDirection : source !== void 0 ? source.zDirection : this.zDirection;
			if (source instanceof DataTileSource) this.transformMatrix = source.transformMatrix?.slice() || null;
			const tileGrid = this.tileGrid;
			if (tileGrid) this.setTileSizes(tileGrid.getResolutions().map((r, i) => toSize(tileGrid.getTileSize(i)).map((s) => Math.max(Math.floor(s), 1))));
			this.setLoader((z, x, y, loaderOptions) => {
				const text = renderXYZTemplate(template, z, x, y, loaderOptions.maxY);
				const [width, height] = this.getTileSize(z);
				const context = createCanvasContext2D(width, height);
				context.strokeStyle = color;
				context.strokeRect(.5, .5, width + .5, height + .5);
				context.fillStyle = color;
				context.strokeStyle = "white";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.font = "24px sans-serif";
				context.lineWidth = 4;
				context.strokeText(text, width / 2, height / 2, width);
				context.fillText(text, width / 2, height / 2, width);
				return Promise.resolve(context.canvas);
			});
			this.setState("ready");
		};
		if (source === void 0 || source.getState() === "ready") setReady();
		else {
			const handler = () => {
				if (source.getState() === "ready") {
					source.removeEventListener(EventType_default.CHANGE, handler);
					setReady();
				}
			};
			source.addEventListener(EventType_default.CHANGE, handler);
		}
	}
};
//#endregion
//#region node_modules/ol/source/TileJSON.js
/**
* @module ol/source/TileJSON
*/
/**
* See https://mapbox.com/developers/api/.
*/
/**
* @typedef {Object} Config
* @property {string} [name] The name.
* @property {string} [description] The description.
* @property {string} [version] The version.
* @property {string} [attribution] The attribution.
* @property {string} [template] The template.
* @property {string} [legend] The legend.
* @property {string} [scheme] The scheme.
* @property {Array<string>} tiles The tile URL templates.
* @property {Array<string>} [grids] Optional grids.
* @property {number} [minzoom] Minimum zoom level.
* @property {number} [maxzoom] Maximum zoom level.
* @property {Array<number>} [bounds] Optional bounds.
* @property {Array<number>} [center] Optional center.
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {boolean} [jsonp=false] Use JSONP with callback to load the TileJSON.
* Useful when the server does not support CORS..
* @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
* Higher values can increase reprojection performance, but decrease precision.
* @property {Config} [tileJSON] TileJSON configuration for this source.
* If not provided, `url` must be configured.
* @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
* ```js
* function(imageTile, src) {
*   imageTile.getImage().src = src;
* };
* ```
* @property {number|import("../size.js").Size} [tileSize=[256, 256]] The tile size used by the tile service.
* Note: `tileSize` and other non-standard TileJSON properties are currently ignored.
* @property {string} [url] URL to the TileJSON file. If not provided, `tileJSON` must be configured.
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* @property {number} [transition] Duration of the opacity transition for rendering.
* To disable the opacity transition, pass `transition: 0`.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
/**
* @classdesc
* Layer source for tile data in TileJSON format.
* @api
*/
var TileJSON = class extends TileImage {
	/**
	* @param {Options} options TileJSON options.
	*/
	constructor(options) {
		super({
			attributions: options.attributions,
			cacheSize: options.cacheSize,
			crossOrigin: options.crossOrigin,
			interpolate: options.interpolate,
			projection: get("EPSG:3857"),
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			state: "loading",
			tileLoadFunction: options.tileLoadFunction,
			wrapX: options.wrapX !== void 0 ? options.wrapX : true,
			transition: options.transition,
			zDirection: options.zDirection
		});
		/**
		* @type {Config}
		* @private
		*/
		this.tileJSON_ = null;
		/**
		* @type {number|import("../size.js").Size}
		* @private
		*/
		this.tileSize_ = options.tileSize;
		if (options.url) if (options.jsonp) jsonp(options.url, this.handleTileJSONResponse.bind(this), this.handleTileJSONError.bind(this));
		else {
			const client = new XMLHttpRequest();
			client.addEventListener("load", this.onXHRLoad_.bind(this));
			client.addEventListener("error", this.onXHRError_.bind(this));
			client.open("GET", options.url);
			client.send();
		}
		else if (options.tileJSON) this.handleTileJSONResponse(options.tileJSON);
		else throw new Error("Either `url` or `tileJSON` options must be provided");
	}
	/**
	* @private
	* @param {Event} event The load event.
	*/
	onXHRLoad_(event) {
		const client = event.target;
		if (!client.status || client.status >= 200 && client.status < 300) {
			let response;
			try {
				response = JSON.parse(client.responseText);
			} catch {
				this.handleTileJSONError();
				return;
			}
			this.handleTileJSONResponse(response);
		} else this.handleTileJSONError();
	}
	/**
	* @private
	* @param {Event} event The error event.
	*/
	onXHRError_(event) {
		this.handleTileJSONError();
	}
	/**
	* @return {Config} The tilejson object.
	* @api
	*/
	getTileJSON() {
		return this.tileJSON_;
	}
	/**
	* @protected
	* @param {Config} tileJSON Tile JSON.
	*/
	handleTileJSONResponse(tileJSON) {
		const epsg4326Projection = get("EPSG:4326");
		const sourceProjection = this.getProjection();
		let extent;
		if (tileJSON["bounds"] !== void 0) {
			const transform = getTransformFromProjections(epsg4326Projection, sourceProjection);
			extent = applyTransform(tileJSON["bounds"], transform);
		}
		const gridExtent = extentFromProjection(sourceProjection);
		const minZoom = tileJSON["minzoom"] || 0;
		const tileGrid = createXYZ({
			extent: gridExtent,
			maxZoom: tileJSON["maxzoom"] || 22,
			minZoom,
			tileSize: this.tileSize_
		});
		this.tileGrid = tileGrid;
		this.tileUrlFunction = createFromTemplates(tileJSON["tiles"], tileGrid);
		if (tileJSON["attribution"] && !this.getAttributions()) {
			const attributionExtent = extent !== void 0 ? extent : gridExtent;
			this.setAttributions(function(frameState) {
				if (intersects(attributionExtent, frameState.extent)) return [tileJSON["attribution"]];
				return null;
			});
		}
		this.tileJSON_ = tileJSON;
		this.setState("ready");
	}
	/**
	* @protected
	*/
	handleTileJSONError() {
		this.setState("error");
	}
};
//#endregion
//#region node_modules/ol/source/TileWMS.js
/**
* @module ol/source/TileWMS
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {Object<string,*>} params WMS request parameters.
* At least a `LAYERS` param is required. `STYLES` is
* `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
* and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
* @property {number} [gutter=0]
* The size in pixels of the gutter around image tiles to ignore. By setting
* this property to a non-zero value, images will be requested that are wider
* and taller than the tile size by a value of `2 x gutter`.
* Using a non-zero value allows artifacts of rendering at tile edges to be
* ignored. If you control the WMS service it is recommended to address
* "artifacts at tile edges" issues by properly configuring the WMS service. For
* example, MapServer has a `tile_map_edge_buffer` configuration parameter for
* this. See https://mapserver.org/output/tile_mode.html.
* @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
* the image from the remote server.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
* @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
* Higher values can increase reprojection performance, but decrease precision.
* @property {typeof import("../ImageTile.js").default} [tileClass] Class used to instantiate image tiles.
* Default is {@link module:ol/ImageTile~ImageTile}.
* @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid. Base this on the resolutions,
* tilesize and extent supported by the server.
* If this is not defined, a default grid will be used: if there is a projection
* extent, the grid will be based on that; if not, a grid based on a global
* extent with origin at 0,0 will be used.
* @property {import("./wms.js").ServerType} [serverType] The type of
* the remote WMS server: `mapserver`, `geoserver`, `carmentaserver`, or `qgis`.
* Only needed if `hidpi` is `true`.
* @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
* ```js
* function(imageTile, src) {
*   imageTile.getImage().src = src;
* };
* ```
* @property {string} [url] WMS service URL.
* @property {Array<string>} [urls] WMS service urls.
* Use this instead of `url` when the WMS supports multiple urls for GetMap requests.
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* When set to `false`, only one world
* will be rendered. When `true`, tiles will be requested for one world only,
* but they will be wrapped horizontally to render multiple worlds.
* @property {number} [transition] Duration of the opacity transition for rendering.
* To disable the opacity transition, pass `transition: 0`.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
/**
* @classdesc
* Layer source for tile data from WMS servers.
* @api
*/
var TileWMS = class extends TileImage {
	/**
	* @param {Options} [options] Tile WMS options.
	*/
	constructor(options) {
		options = options ? options : {};
		const params = Object.assign({}, options.params);
		super({
			attributions: options.attributions,
			attributionsCollapsible: options.attributionsCollapsible,
			cacheSize: options.cacheSize,
			crossOrigin: options.crossOrigin,
			interpolate: options.interpolate,
			projection: options.projection,
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			tileClass: options.tileClass,
			tileGrid: options.tileGrid,
			tileLoadFunction: options.tileLoadFunction,
			url: options.url,
			urls: options.urls,
			wrapX: options.wrapX !== void 0 ? options.wrapX : true,
			transition: options.transition,
			zDirection: options.zDirection
		});
		/**
		* @private
		* @type {number}
		*/
		this.gutter_ = options.gutter !== void 0 ? options.gutter : 0;
		/**
		* @private
		* @type {!Object}
		*/
		this.params_ = params;
		/**
		* @private
		* @type {boolean}
		*/
		this.v13_ = true;
		/**
		* @private
		* @type {import("./wms.js").ServerType}
		*/
		this.serverType_ = options.serverType;
		/**
		* @private
		* @type {boolean}
		*/
		this.hidpi_ = options.hidpi !== void 0 ? options.hidpi : true;
		/**
		* @private
		* @type {import("../extent.js").Extent}
		*/
		this.tmpExtent_ = createEmpty();
		this.updateV13_();
		this.setKey(this.getKeyForParams_());
	}
	/**
	* Return the GetFeatureInfo URL for the passed coordinate, resolution, and
	* projection. Return `undefined` if the GetFeatureInfo URL cannot be
	* constructed.
	* @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
	* @param {number} resolution Resolution.
	* @param {import("../proj.js").ProjectionLike} projection Projection.
	* @param {!Object} params GetFeatureInfo params. `INFO_FORMAT` at least should
	*     be provided. If `QUERY_LAYERS` is not provided then the layers specified
	*     in the `LAYERS` parameter will be used. `VERSION` should not be
	*     specified here.
	* @return {string|undefined} GetFeatureInfo URL.
	* @api
	*/
	getFeatureInfoUrl(coordinate, resolution, projection, params) {
		const projectionObj = get(projection);
		const sourceProjectionObj = this.getProjection() || projectionObj;
		let tileGrid = this.getTileGrid();
		if (!tileGrid) tileGrid = this.getTileGridForProjection(sourceProjectionObj);
		const sourceProjCoord = transform(coordinate, projectionObj, sourceProjectionObj);
		const sourceResolution = calculateSourceResolution(sourceProjectionObj, projectionObj, coordinate, resolution);
		const z = tileGrid.getZForResolution(sourceResolution, this.zDirection);
		const tileResolution = tileGrid.getResolution(z);
		const tileCoord = tileGrid.getTileCoordForCoordAndZ(sourceProjCoord, z);
		if (tileGrid.getResolutions().length <= tileCoord[0]) return;
		let tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
		const gutter = this.gutter_;
		if (gutter !== 0) tileExtent = buffer$1(tileExtent, tileResolution * gutter, tileExtent);
		const baseParams = { "QUERY_LAYERS": this.params_["LAYERS"] };
		Object.assign(baseParams, getRequestParams(this.params_, "GetFeatureInfo"), params);
		const x = Math.floor((sourceProjCoord[0] - tileExtent[0]) / tileResolution);
		const y = Math.floor((tileExtent[3] - sourceProjCoord[1]) / tileResolution);
		baseParams[this.v13_ ? "I" : "X"] = x;
		baseParams[this.v13_ ? "J" : "Y"] = y;
		return this.getRequestUrl_(tileCoord, tileExtent, 1, sourceProjectionObj || projectionObj, baseParams);
	}
	/**
	* Return the GetLegendGraphic URL, optionally optimized for the passed
	* resolution and possibly including any passed specific parameters. Returns
	* `undefined` if the GetLegendGraphic URL cannot be constructed.
	*
	* @param {number} [resolution] Resolution. If set to undefined, `SCALE`
	*     will not be calculated and included in URL.
	* @param {Object} [params] GetLegendGraphic params. If `LAYER` is set, the
	*     request is generated for this wms layer, else it will try to use the
	*     configured wms layer. Default `FORMAT` is `image/png`.
	*     `VERSION` should not be specified here.
	* @return {string|undefined} GetLegendGraphic URL.
	* @api
	*/
	getLegendUrl(resolution, params) {
		if (this.urls[0] === void 0) return;
		const baseParams = {
			"SERVICE": "WMS",
			"VERSION": DEFAULT_VERSION,
			"REQUEST": "GetLegendGraphic",
			"FORMAT": "image/png"
		};
		if (params === void 0 || params["LAYER"] === void 0) {
			const layers = this.params_.LAYERS;
			if (!(!Array.isArray(layers) || layers.length === 1)) return;
			baseParams["LAYER"] = layers;
		}
		if (resolution !== void 0) baseParams["SCALE"] = resolution * (this.getProjection() ? this.getProjection().getMetersPerUnit() : 1) / 28e-5;
		Object.assign(baseParams, params);
		return appendParams(this.urls[0], baseParams);
	}
	/**
	* @return {number} Gutter.
	* @override
	*/
	getGutter() {
		return this.gutter_;
	}
	/**
	* Get the user-provided params, i.e. those passed to the constructor through
	* the "params" option, and possibly updated using the updateParams method.
	* @return {Object} Params.
	* @api
	*/
	getParams() {
		return this.params_;
	}
	/**
	* @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
	* @param {import("../extent.js").Extent} tileExtent Tile extent.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @param {Object} params Params.
	* @return {string|undefined} Request URL.
	* @private
	*/
	getRequestUrl_(tileCoord, tileExtent, pixelRatio, projection, params) {
		const urls = this.urls;
		if (!urls) return;
		let url;
		if (urls.length == 1) url = urls[0];
		else url = urls[modulo(hash(tileCoord), urls.length)];
		return getImageSrc(tileExtent, (this.tileGrid || this.getTileGridForProjection(projection)).getResolution(tileCoord[0]), pixelRatio, projection, url, params, this.serverType_);
	}
	/**
	* Get the tile pixel ratio for this source.
	* @param {number} pixelRatio Pixel ratio.
	* @return {number} Tile pixel ratio.
	* @override
	*/
	getTilePixelRatio(pixelRatio) {
		return !this.hidpi_ || this.serverType_ === void 0 ? 1 : pixelRatio;
	}
	/**
	* @private
	* @return {string} The key for the current params.
	*/
	getKeyForParams_() {
		let i = 0;
		const res = [];
		for (const key in this.params_) res[i++] = key + "-" + this.params_[key];
		return res.join("/");
	}
	/**
	* @param {Object} params New URL paremeters.
	* @private
	*/
	setParams_(params) {
		this.params_ = params;
		this.updateV13_();
		this.setKey(this.getKeyForParams_());
	}
	/**
	* Set the URL parameters passed to the WMS source.
	* @param {Object} params New URL paremeters.
	* @api
	*/
	setParams(params) {
		this.setParams_(Object.assign({}, params));
	}
	/**
	* Update the URL parameters. This method can be used to update a subset of the WMS
	* parameters. Call `setParams` to set all of the parameters.
	* @param {Object} params Updated URL parameters.
	* @api
	*/
	updateParams(params) {
		this.setParams_(Object.assign(this.params_, params));
	}
	/**
	* @private
	*/
	updateV13_() {
		this.v13_ = compareVersions(this.params_["VERSION"] || "1.3.0", "1.3") >= 0;
	}
	/**
	* @param {import("../tilecoord.js").TileCoord} tileCoord The tile coordinate
	* @param {number} pixelRatio The pixel ratio
	* @param {import("../proj/Projection.js").default} projection The projection
	* @return {string|undefined} The tile URL
	* @override
	*/
	tileUrlFunction(tileCoord, pixelRatio, projection) {
		let tileGrid = this.getTileGrid();
		if (!tileGrid) tileGrid = this.getTileGridForProjection(projection);
		if (tileGrid.getResolutions().length <= tileCoord[0]) return;
		if (pixelRatio != 1 && (!this.hidpi_ || this.serverType_ === void 0)) pixelRatio = 1;
		const tileResolution = tileGrid.getResolution(tileCoord[0]);
		let tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
		const gutter = this.gutter_;
		if (gutter !== 0) tileExtent = buffer$1(tileExtent, tileResolution * gutter, tileExtent);
		const baseParams = Object.assign({}, getRequestParams(this.params_, "GetMap"));
		return this.getRequestUrl_(tileCoord, tileExtent, pixelRatio, projection, baseParams);
	}
};
//#endregion
//#region node_modules/ol/source/UTFGrid.js
/**
* @module ol/source/UTFGrid
*/
/**
* @typedef {Object} UTFGridJSON
* @property {Array<string>} grid The grid.
* @property {Array<string>} keys The keys.
* @property {Object<string, Object>} [data] Optional data.
*/
var CustomTile = class extends Tile {
	/**
	* @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
	* @param {import("../TileState.js").default} state State.
	* @param {string} src Image source URI.
	* @param {import("../extent.js").Extent} extent Extent of the tile.
	* @param {boolean} preemptive Load the tile when visible (before it's needed).
	* @param {boolean} jsonp Load the tile as a script.
	*/
	constructor(tileCoord, state, src, extent, preemptive, jsonp) {
		super(tileCoord, state);
		/**
		* @private
		* @type {string}
		*/
		this.src_ = src;
		/**
		* @private
		* @type {import("../extent.js").Extent}
		*/
		this.extent_ = extent;
		/**
		* @private
		* @type {boolean}
		*/
		this.preemptive_ = preemptive;
		/**
		* @private
		* @type {Array<string>}
		*/
		this.grid_ = null;
		/**
		* @private
		* @type {Array<string>}
		*/
		this.keys_ = null;
		/**
		* @private
		* @type {Object<string, Object>|undefined}
		*/
		this.data_ = null;
		/**
		* @private
		* @type {boolean}
		*/
		this.jsonp_ = jsonp;
	}
	/**
	* Get the image element for this tile.
	* @return {HTMLImageElement} Image.
	*/
	getImage() {
		return null;
	}
	/**
	* Synchronously returns data at given coordinate (if available).
	* @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
	* @return {*} The data.
	*/
	getData(coordinate) {
		if (!this.grid_ || !this.keys_) return null;
		const xRelative = (coordinate[0] - this.extent_[0]) / (this.extent_[2] - this.extent_[0]);
		const yRelative = (coordinate[1] - this.extent_[1]) / (this.extent_[3] - this.extent_[1]);
		const row = this.grid_[Math.floor((1 - yRelative) * this.grid_.length)];
		if (typeof row !== "string") return null;
		let code = row.charCodeAt(Math.floor(xRelative * row.length));
		if (code >= 93) code--;
		if (code >= 35) code--;
		code -= 32;
		let data = null;
		if (code in this.keys_) {
			const id = this.keys_[code];
			if (this.data_ && id in this.data_) data = this.data_[id];
			else data = id;
		}
		return data;
	}
	/**
	* Calls the callback (synchronously by default) with the available data
	* for given coordinate (or `null` if not yet loaded).
	* @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
	* @param {function(*): void} callback Callback.
	* @param {boolean} [request] If `true` the callback is always async.
	*                               The tile data is requested if not yet loaded.
	*/
	forDataAtCoordinate(coordinate, callback, request) {
		if (this.state == TileState_default.EMPTY && request === true) {
			this.state = TileState_default.IDLE;
			listenOnce(this, EventType_default.CHANGE, (e) => {
				callback(this.getData(coordinate));
			});
			this.loadInternal_();
		} else if (request === true) setTimeout(() => {
			callback(this.getData(coordinate));
		}, 0);
		else callback(this.getData(coordinate));
	}
	/**
	* Return the key to be used for all tiles in the source.
	* @return {string} The key for all tiles.
	* @override
	*/
	getKey() {
		return this.src_;
	}
	/**
	* @private
	*/
	handleError_() {
		this.state = TileState_default.ERROR;
		this.changed();
	}
	/**
	* @param {!UTFGridJSON} json UTFGrid data.
	* @private
	*/
	handleLoad_(json) {
		this.grid_ = json["grid"];
		this.keys_ = json["keys"];
		this.data_ = json["data"];
		this.state = TileState_default.LOADED;
		this.changed();
	}
	/**
	* @private
	*/
	loadInternal_() {
		if (this.state == TileState_default.IDLE) {
			this.state = TileState_default.LOADING;
			if (this.jsonp_) jsonp(this.src_, this.handleLoad_.bind(this), this.handleError_.bind(this));
			else {
				const client = new XMLHttpRequest();
				client.addEventListener("load", this.onXHRLoad_.bind(this));
				client.addEventListener("error", this.onXHRError_.bind(this));
				client.open("GET", this.src_);
				client.send();
			}
		}
	}
	/**
	* @private
	* @param {Event} event The load event.
	*/
	onXHRLoad_(event) {
		const client = event.target;
		if (!client.status || client.status >= 200 && client.status < 300) {
			let response;
			try {
				response = JSON.parse(client.responseText);
			} catch {
				this.handleError_();
				return;
			}
			this.handleLoad_(response);
		} else this.handleError_();
	}
	/**
	* @private
	* @param {Event} event The error event.
	*/
	onXHRError_(event) {
		this.handleError_();
	}
	/**
	* @override
	*/
	load() {
		if (this.preemptive_) this.loadInternal_();
		else this.setState(TileState_default.EMPTY);
	}
};
/**
* @typedef {Object} Options
* @property {boolean} [preemptive=true]
* If `true` the UTFGrid source loads the tiles based on their "visibility".
* This improves the speed of response, but increases traffic.
* Note that if set to `false` (lazy loading), you need to pass `true` as
* `request` to the `forDataAtCoordinateAndResolution` method otherwise no
* data will ever be loaded.
* @property {boolean} [jsonp=false] Use JSONP with callback to load the TileJSON.
* Useful when the server does not support CORS..
* @property {import("./TileJSON.js").Config} [tileJSON] TileJSON configuration for this source.
* If not provided, `url` must be configured.
* @property {string} [url] TileJSON endpoint that provides the configuration for this source.
* Request will be made through JSONP. If not provided, `tileJSON` must be configured.
* @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
/**
* @classdesc
* Layer source for UTFGrid interaction data loaded from TileJSON format.
* @api
*/
var UTFGrid = class extends TileSource {
	/**
	* @param {Options} options Source options.
	*/
	constructor(options) {
		super({
			projection: get("EPSG:3857"),
			state: "loading",
			wrapX: options.wrapX !== void 0 ? options.wrapX : true,
			zDirection: options.zDirection
		});
		/**
		* @private
		* @type {boolean}
		*/
		this.preemptive_ = options.preemptive !== void 0 ? options.preemptive : true;
		/**
		* @private
		* @type {!import("../Tile.js").UrlFunction}
		*/
		this.tileUrlFunction_ = nullTileUrlFunction;
		/**
		* @private
		* @type {string|undefined}
		*/
		this.template_ = void 0;
		/**
		* @private
		* @type {boolean}
		*/
		this.jsonp_ = options.jsonp || false;
		/**
		* @private
		* @type {LRUCache}
		*/
		this.tileCache_ = new LRUCache(512);
		if (options.url) if (this.jsonp_) jsonp(options.url, this.handleTileJSONResponse.bind(this), this.handleTileJSONError.bind(this));
		else {
			const client = new XMLHttpRequest();
			client.addEventListener("load", this.onXHRLoad_.bind(this));
			client.addEventListener("error", this.onXHRError_.bind(this));
			client.open("GET", options.url);
			client.send();
		}
		else if (options.tileJSON) this.handleTileJSONResponse(options.tileJSON);
		else throw new Error("Either `url` or `tileJSON` options must be provided");
	}
	/**
	* @private
	* @param {Event} event The load event.
	*/
	onXHRLoad_(event) {
		const client = event.target;
		if (!client.status || client.status >= 200 && client.status < 300) {
			let response;
			try {
				response = JSON.parse(client.responseText);
			} catch {
				this.handleTileJSONError();
				return;
			}
			this.handleTileJSONResponse(response);
		} else this.handleTileJSONError();
	}
	/**
	* @private
	* @param {Event} event The error event.
	*/
	onXHRError_(event) {
		this.handleTileJSONError();
	}
	/**
	* Return the template from TileJSON.
	* @return {string|undefined} The template from TileJSON.
	* @api
	*/
	getTemplate() {
		return this.template_;
	}
	/**
	* Calls the callback (synchronously by default) with the available data
	* for given coordinate and resolution (or `null` if not yet loaded or
	* in case of an error).
	* @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
	* @param {number} resolution Resolution.
	* @param {function(*): void} callback Callback.
	* @param {boolean} [request] If `true` the callback is always async.
	*                               The tile data is requested if not yet loaded.
	* @api
	*/
	forDataAtCoordinateAndResolution(coordinate, resolution, callback, request) {
		if (this.tileGrid) {
			const z = this.tileGrid.getZForResolution(resolution, this.zDirection);
			const tileCoord = this.tileGrid.getTileCoordForCoordAndZ(coordinate, z);
			const tile = this.getTile(tileCoord[0], tileCoord[1], tileCoord[2], 1, this.getProjection());
			if (tile.getState() == TileState_default.IDLE) tile.load();
			tile.forDataAtCoordinate(coordinate, callback, request);
		} else if (request === true) setTimeout(function() {
			callback(null);
		}, 0);
		else callback(null);
	}
	/**
	* @protected
	*/
	handleTileJSONError() {
		this.setState("error");
	}
	/**
	* TODO: very similar to ol/source/TileJSON#handleTileJSONResponse
	* @protected
	* @param {import("./TileJSON.js").Config} tileJSON Tile JSON.
	*/
	handleTileJSONResponse(tileJSON) {
		const epsg4326Projection = get("EPSG:4326");
		const sourceProjection = this.getProjection();
		let extent;
		if (tileJSON["bounds"] !== void 0) {
			const transform = getTransformFromProjections(epsg4326Projection, sourceProjection);
			extent = applyTransform(tileJSON["bounds"], transform);
		}
		const gridExtent = extentFromProjection(sourceProjection);
		const minZoom = tileJSON["minzoom"] || 0;
		const tileGrid = createXYZ({
			extent: gridExtent,
			maxZoom: tileJSON["maxzoom"] || 22,
			minZoom
		});
		this.tileGrid = tileGrid;
		this.template_ = tileJSON["template"];
		const grids = tileJSON["grids"];
		if (!grids) {
			this.setState("error");
			return;
		}
		this.tileUrlFunction_ = createFromTemplates(grids, tileGrid);
		if (tileJSON["attribution"]) {
			const attributionExtent = extent !== void 0 ? extent : gridExtent;
			this.setAttributions(function(frameState) {
				if (intersects(attributionExtent, frameState.extent)) return [tileJSON["attribution"]];
				return null;
			});
		}
		this.setState("ready");
	}
	/**
	* @param {number} z Tile coordinate z.
	* @param {number} x Tile coordinate x.
	* @param {number} y Tile coordinate y.
	* @param {number} pixelRatio Pixel ratio.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {!CustomTile} Tile.
	* @override
	*/
	getTile(z, x, y, pixelRatio, projection) {
		const tileCoord = [
			z,
			x,
			y
		];
		const urlTileCoord = this.getTileCoordForTileUrlFunction(tileCoord, projection);
		const tileUrl = this.tileUrlFunction_(urlTileCoord, pixelRatio, projection);
		const tileKey = `${this.getKey()},${getKeyZXY(z, x, y)}`;
		if (this.tileCache_.containsKey(tileKey)) return this.tileCache_.get(tileKey);
		this.tileCache_.expireCache();
		const tile = new CustomTile(tileCoord, tileUrl !== void 0 ? TileState_default.IDLE : TileState_default.EMPTY, tileUrl !== void 0 ? tileUrl : "", this.tileGrid.getTileCoordExtent(tileCoord), this.preemptive_, this.jsonp_);
		this.tileCache_.set(tileKey, tile);
		return tile;
	}
};
//#endregion
//#region node_modules/ol/source/WMTS.js
/**
* Request encoding. One of 'KVP', 'REST'.
* @typedef {'KVP' | 'REST'} RequestEncoding
*/
/**
* @typedef {Object} Options
* @property {import("./Source.js").AttributionLike} [attributions] Attributions.
* @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
* @property {number} [cacheSize] Deprecated.  Use the cacheSize option on the layer instead.
* @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
* you must provide a `crossOrigin` value if you want to access pixel data with the Canvas renderer.
* See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
* @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
* linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
* @property {import("../tilegrid/WMTS.js").default} tileGrid Tile grid.
* @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
* @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
* Higher values can increase reprojection performance, but decrease precision.
* @property {RequestEncoding} [requestEncoding='KVP'] Request encoding.
* @property {string} layer Layer name as advertised in the WMTS capabilities.
* @property {string} style Style name as advertised in the WMTS capabilities.
* @property {typeof import("../ImageTile.js").default} [tileClass]  Class used to instantiate image tiles. Default is {@link module:ol/ImageTile~ImageTile}.
* @property {number} [tilePixelRatio=1] The pixel ratio used by the tile service.
* For example, if the tile service advertizes 256px by 256px tiles but actually sends 512px
* by 512px images (for retina/hidpi devices) then `tilePixelRatio`
* should be set to `2`.
* @property {string} [format='image/jpeg'] Image format. Only used when `requestEncoding` is `'KVP'`.
* @property {string} [version='1.0.0'] WMTS version.
* @property {string} matrixSet Matrix set.
* @property {!Object} [dimensions] Additional "dimensions" for tile requests.
* This is an object with properties named like the advertised WMTS dimensions.
* @property {string} [url]  A URL for the service.
* For the RESTful request encoding, this is a URL
* template.  For KVP encoding, it is normal URL. A `{?-?}` template pattern,
* for example `subdomain{a-f}.domain.com`, may be used instead of defining
* each one separately in the `urls` option.
* @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
* ```js
* function(imageTile, src) {
*   imageTile.getImage().src = src;
* };
* ```
* @property {Array<string>} [urls] An array of URLs.
* Requests will be distributed among the URLs in this array.
* @property {boolean} [wrapX=false] Whether to wrap the world horizontally.
* @property {number} [transition] Duration of the opacity transition for rendering.
* To disable the opacity transition, pass `transition: 0`.
* @property {number|import("../array.js").NearestDirectionFunction} [zDirection=0]
* Choose whether to use tiles with a higher or lower zoom level when between integer
* zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
*/
/**
* @classdesc
* Layer source for tile data from WMTS servers.
* @api
*/
var WMTS = class extends TileImage {
	/**
	* @param {Options} options WMTS options.
	*/
	constructor(options) {
		const requestEncoding = options.requestEncoding !== void 0 ? options.requestEncoding : "KVP";
		const tileGrid = options.tileGrid;
		let urls = options.urls;
		if (urls === void 0 && options.url !== void 0) urls = expandUrl(options.url);
		super({
			attributions: options.attributions,
			attributionsCollapsible: options.attributionsCollapsible,
			cacheSize: options.cacheSize,
			crossOrigin: options.crossOrigin,
			interpolate: options.interpolate,
			projection: options.projection,
			reprojectionErrorThreshold: options.reprojectionErrorThreshold,
			tileClass: options.tileClass,
			tileGrid,
			tileLoadFunction: options.tileLoadFunction,
			tilePixelRatio: options.tilePixelRatio,
			urls,
			wrapX: options.wrapX !== void 0 ? options.wrapX : false,
			transition: options.transition,
			zDirection: options.zDirection
		});
		/**
		* @private
		* @type {string}
		*/
		this.version_ = options.version !== void 0 ? options.version : "1.0.0";
		/**
		* @private
		* @type {string}
		*/
		this.format_ = options.format !== void 0 ? options.format : "image/jpeg";
		/**
		* @private
		* @type {!Object}
		*/
		this.dimensions_ = options.dimensions !== void 0 ? options.dimensions : {};
		/**
		* @private
		* @type {string}
		*/
		this.layer_ = options.layer;
		/**
		* @private
		* @type {string}
		*/
		this.matrixSet_ = options.matrixSet;
		/**
		* @private
		* @type {string}
		*/
		this.style_ = options.style;
		/**
		* @private
		* @type {RequestEncoding}
		*/
		this.requestEncoding_ = requestEncoding;
		this.setKey(this.getKeyForDimensions_());
		if (urls && urls.length > 0) this.tileUrlFunction = createFromTileUrlFunctions(urls.map(this.createFromWMTSTemplate.bind(this)));
	}
	/**
	* Set the URLs to use for requests.
	* URLs may contain OGC conform URL Template Variables: {TileMatrix}, {TileRow}, {TileCol}.
	* @param {Array<string>} urls URLs.
	* @override
	*/
	setUrls(urls) {
		this.urls = urls;
		const key = urls.join("\n");
		this.setTileUrlFunction(createFromTileUrlFunctions(urls.map(this.createFromWMTSTemplate.bind(this))), key);
	}
	/**
	* Get the dimensions, i.e. those passed to the constructor through the
	* "dimensions" option, and possibly updated using the updateDimensions
	* method.
	* @return {!Object} Dimensions.
	* @api
	*/
	getDimensions() {
		return this.dimensions_;
	}
	/**
	* Return the image format of the WMTS source.
	* @return {string} Format.
	* @api
	*/
	getFormat() {
		return this.format_;
	}
	/**
	* Return the layer of the WMTS source.
	* @return {string} Layer.
	* @api
	*/
	getLayer() {
		return this.layer_;
	}
	/**
	* Return the matrix set of the WMTS source.
	* @return {string} MatrixSet.
	* @api
	*/
	getMatrixSet() {
		return this.matrixSet_;
	}
	/**
	* Return the request encoding, either "KVP" or "REST".
	* @return {RequestEncoding} Request encoding.
	* @api
	*/
	getRequestEncoding() {
		return this.requestEncoding_;
	}
	/**
	* Return the style of the WMTS source.
	* @return {string} Style.
	* @api
	*/
	getStyle() {
		return this.style_;
	}
	/**
	* Return the version of the WMTS source.
	* @return {string} Version.
	* @api
	*/
	getVersion() {
		return this.version_;
	}
	/**
	* @private
	* @return {string} The key for the current dimensions.
	*/
	getKeyForDimensions_() {
		const res = this.urls ? this.urls.slice(0) : [];
		for (const key in this.dimensions_) res.push(key + "-" + this.dimensions_[key]);
		return res.join("/");
	}
	/**
	* Update the dimensions.
	* @param {Object} dimensions Dimensions.
	* @api
	*/
	updateDimensions(dimensions) {
		Object.assign(this.dimensions_, dimensions);
		this.setKey(this.getKeyForDimensions_());
	}
	/**
	* @param {string} template Template.
	* @return {import("../Tile.js").UrlFunction} Tile URL function.
	*/
	createFromWMTSTemplate(template) {
		const requestEncoding = this.requestEncoding_;
		const context = {
			"layer": this.layer_,
			"style": this.style_,
			"tilematrixset": this.matrixSet_
		};
		if (requestEncoding == "KVP") Object.assign(context, {
			"Service": "WMTS",
			"Request": "GetTile",
			"Version": this.version_,
			"Format": this.format_
		});
		template = requestEncoding == "KVP" ? appendParams(template, context) : template.replace(/\{(\w+?)\}/g, function(m, p) {
			return p.toLowerCase() in context ? context[p.toLowerCase()] : m;
		});
		const tileGrid = this.tileGrid;
		const dimensions = this.dimensions_;
		return (function(tileCoord, pixelRatio, projection) {
			if (!tileCoord) return;
			const localContext = {
				"TileMatrix": tileGrid.getMatrixId(tileCoord[0]),
				"TileCol": tileCoord[1],
				"TileRow": tileCoord[2]
			};
			Object.assign(localContext, dimensions);
			let url = template;
			if (requestEncoding == "KVP") url = appendParams(url, localContext);
			else url = url.replace(/\{(\w+?)\}/g, function(m, p) {
				return encodeURIComponent(localContext[p]);
			});
			return url;
		});
	}
};
//#endregion
//#region node_modules/ol/source.js
/**
* @module ol/source
*/
/**
* Creates a sources function from a tile grid. This function can be used as value for the
* `sources` property of the {@link module:ol/layer/Layer~Layer} subclasses that support it.
* @param {import("./tilegrid/TileGrid.js").default} tileGrid Tile grid.
* @param {function(import("./tilecoord.js").TileCoord): import("./source/Source.js").default} factory Source factory.
* This function takes a {@link module:ol/tilecoord~TileCoord} as argument and is expected to return a
* {@link module:ol/source/Source~Source}. **Note**: The returned sources should have a tile grid with
* a limited set of resolutions, matching the resolution range of a single zoom level of the pyramid
* `tileGrid` that `sourcesFromTileGrid` was called with.
* @return {function(import("./extent.js").Extent, number): Array<import("./source/Source.js").default>} Sources function.
* @api
*/
function sourcesFromTileGrid(tileGrid, factory) {
	const sourceCache = new LRUCache(32);
	const tileGridExtent = tileGrid.getExtent();
	return function(extent, resolution) {
		sourceCache.expireCache();
		if (tileGridExtent) extent = getIntersection(tileGridExtent, extent);
		const z = tileGrid.getZForResolution(resolution);
		const wantedSources = [];
		tileGrid.forEachTileCoord(extent, z, (tileCoord) => {
			const key = tileCoord.toString();
			if (!sourceCache.containsKey(key)) {
				const source = factory(tileCoord);
				sourceCache.set(key, source);
			}
			wantedSources.push(sourceCache.get(key));
		});
		return wantedSources;
	};
}
//#endregion
export { BingMaps, CartoDB, Cluster, DataTileSource as DataTile, GeoTIFFSource as GeoTIFF, Google, IIIF, ImageSource as Image, ImageArcGISRest, ImageCanvasSource as ImageCanvas, ImageMapGuide, Static as ImageStatic, ImageTileSource as ImageTile, ImageWMS, OGCMapTile, OGCVectorTile, OSM, RasterSource as Raster, Source, StadiaMaps, TileSource as Tile, TileArcGISRest, TileDebug, TileImage, TileJSON, TileWMS, UTFGrid, UrlTile, VectorSource as Vector, VectorTile, WMTS, XYZ, Zoomify, createLoader as createArcGISRestLoader, createLoader$1 as createMapGuideLoader, createLoader$2 as createStaticLoader, createLoader$3 as createWMSLoader, sourcesFromTileGrid };

//# sourceMappingURL=ol_source.js.map
import { E as EventType_default, c as abstract, i as listen, o as unlistenByKey, x as extend } from "./Object-DCW2lR92.js";
import { n as isEmpty } from "./obj-DsDkrhYV.js";
import { k as getCenter, l as containsXY, o as closestSquaredDistanceXY, p as createOrUpdateEmpty, y as extend$1 } from "./extent-Ct519ZT-.js";
import { m as equivalent, x as getTransform, y as get } from "./proj-CpbG7wpi.js";
import { c as squaredDistance } from "./math-BWMiNrVo.js";
import { i as linearRingssContainsXY } from "./contains-DqIevFtL.js";
import { a as orientLinearRingsArray, d as quantizeMultiArray, i as orientLinearRings, l as douglasPeuckerArray, n as linearRingsAreOriented, r as linearRingssAreOriented, s as getInteriorPointsOfMultiArray } from "./orient-yCFkOKBU.js";
import { _ as linearRingss, a as inflateCoordinates, c as deflateCoordinates, d as arrayMaxSquaredDelta, f as assignClosestArrayPoint, g as multiArrayMaxSquaredDelta, i as Point, l as deflateCoordinatesArray, o as inflateCoordinatesArray, p as assignClosestMultiArrayPoint, s as inflateMultiCoordinatesArray, t as Polygon, u as deflateMultiCoordinatesArray, v as SimpleGeometry, x as Geometry, y as getLayoutForStride } from "./Polygon-CmUxCsnH.js";
import { a as intersectsLinearRingMultiArray, n as intersectsLineStringArray } from "./intersectsextent-Bf7POWne.js";
import { a as lineStringsCoordinateAtM, n as linearRingss$1, o as Feature, r as interpolatePoint, t as RenderFeature } from "./Feature-CclFINmX.js";
import { t as lineStringLength } from "./length-B31Bx5sv.js";
import { t as LineString } from "./LineString-CiIVPihz.js";
//#region node_modules/ol/geom/GeometryCollection.js
/**
* @module ol/geom/GeometryCollection
*/
/**
* @classdesc
* An array of {@link module:ol/geom/Geometry~Geometry} objects.
*
* @api
*/
var GeometryCollection = class GeometryCollection extends Geometry {
	/**
	* @param {Array<Geometry>} geometries Geometries.
	*/
	constructor(geometries) {
		super();
		/**
		* @private
		* @type {Array<Geometry>}
		*/
		this.geometries_ = geometries;
		/**
		* @private
		* @type {Array<import("../events.js").EventsKey>}
		*/
		this.changeEventsKeys_ = [];
		this.listenGeometriesChange_();
	}
	/**
	* @private
	*/
	unlistenGeometriesChange_() {
		this.changeEventsKeys_.forEach(unlistenByKey);
		this.changeEventsKeys_.length = 0;
	}
	/**
	* @private
	*/
	listenGeometriesChange_() {
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) this.changeEventsKeys_.push(listen(geometries[i], EventType_default.CHANGE, this.changed, this));
	}
	/**
	* Make a complete copy of the geometry.
	* @return {!GeometryCollection} Clone.
	* @api
	* @override
	*/
	clone() {
		const geometryCollection = new GeometryCollection(cloneGeometries(this.geometries_));
		geometryCollection.applyProperties(this);
		return geometryCollection;
	}
	/**
	* @param {number} x X.
	* @param {number} y Y.
	* @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
	* @param {number} minSquaredDistance Minimum squared distance.
	* @return {number} Minimum squared distance.
	* @override
	*/
	closestPointXY(x, y, closestPoint, minSquaredDistance) {
		if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) return minSquaredDistance;
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) minSquaredDistance = geometries[i].closestPointXY(x, y, closestPoint, minSquaredDistance);
		return minSquaredDistance;
	}
	/**
	* @param {number} x X.
	* @param {number} y Y.
	* @return {boolean} Contains (x, y).
	* @override
	*/
	containsXY(x, y) {
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) if (geometries[i].containsXY(x, y)) return true;
		return false;
	}
	/**
	* @param {import("../extent.js").Extent} extent Extent.
	* @protected
	* @return {import("../extent.js").Extent} extent Extent.
	* @override
	*/
	computeExtent(extent) {
		createOrUpdateEmpty(extent);
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) extend$1(extent, geometries[i].getExtent());
		return extent;
	}
	/**
	* Return the geometries that make up this geometry collection.
	* @return {Array<Geometry>} Geometries.
	* @api
	*/
	getGeometries() {
		return cloneGeometries(this.geometries_);
	}
	/**
	* @return {Array<Geometry>} Geometries.
	*/
	getGeometriesArray() {
		return this.geometries_;
	}
	/**
	* @return {Array<Geometry>} Geometries.
	*/
	getGeometriesArrayRecursive() {
		/** @type {Array<Geometry>} */
		let geometriesArray = [];
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) if (geometries[i].getType() === this.getType()) geometriesArray = geometriesArray.concat(
			/** @type {GeometryCollection} */
			geometries[i].getGeometriesArrayRecursive()
		);
		else geometriesArray.push(geometries[i]);
		return geometriesArray;
	}
	/**
	* Create a simplified version of this geometry using the Douglas Peucker algorithm.
	* @param {number} squaredTolerance Squared tolerance.
	* @return {GeometryCollection} Simplified GeometryCollection.
	* @override
	*/
	getSimplifiedGeometry(squaredTolerance) {
		if (this.simplifiedGeometryRevision !== this.getRevision()) {
			this.simplifiedGeometryMaxMinSquaredTolerance = 0;
			this.simplifiedGeometryRevision = this.getRevision();
		}
		if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance < this.simplifiedGeometryMaxMinSquaredTolerance) return this;
		const simplifiedGeometries = [];
		const geometries = this.geometries_;
		let simplified = false;
		for (let i = 0, ii = geometries.length; i < ii; ++i) {
			const geometry = geometries[i];
			const simplifiedGeometry = geometry.getSimplifiedGeometry(squaredTolerance);
			simplifiedGeometries.push(simplifiedGeometry);
			if (simplifiedGeometry !== geometry) simplified = true;
		}
		if (simplified) return new GeometryCollection(simplifiedGeometries);
		this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
		return this;
	}
	/**
	* Get the type of this geometry.
	* @return {import("./Geometry.js").Type} Geometry type.
	* @api
	* @override
	*/
	getType() {
		return "GeometryCollection";
	}
	/**
	* Test if the geometry and the passed extent intersect.
	* @param {import("../extent.js").Extent} extent Extent.
	* @return {boolean} `true` if the geometry and the extent intersect.
	* @api
	* @override
	*/
	intersectsExtent(extent) {
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) if (geometries[i].intersectsExtent(extent)) return true;
		return false;
	}
	/**
	* @return {boolean} Is empty.
	*/
	isEmpty() {
		return this.geometries_.length === 0;
	}
	/**
	* Rotate the geometry around a given coordinate. This modifies the geometry
	* coordinates in place.
	* @param {number} angle Rotation angle in radians.
	* @param {import("../coordinate.js").Coordinate} anchor The rotation center.
	* @api
	* @override
	*/
	rotate(angle, anchor) {
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) geometries[i].rotate(angle, anchor);
		this.changed();
	}
	/**
	* Scale the geometry (with an optional origin).  This modifies the geometry
	* coordinates in place.
	* @abstract
	* @param {number} sx The scaling factor in the x-direction.
	* @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
	* @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
	*     of the geometry extent).
	* @api
	* @override
	*/
	scale(sx, sy, anchor) {
		if (!anchor) anchor = getCenter(this.getExtent());
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) geometries[i].scale(sx, sy, anchor);
		this.changed();
	}
	/**
	* Set the geometries that make up this geometry collection.
	* @param {Array<Geometry>} geometries Geometries.
	* @api
	*/
	setGeometries(geometries) {
		this.setGeometriesArray(cloneGeometries(geometries));
	}
	/**
	* @param {Array<Geometry>} geometries Geometries.
	*/
	setGeometriesArray(geometries) {
		this.unlistenGeometriesChange_();
		this.geometries_ = geometries;
		this.listenGeometriesChange_();
		this.changed();
	}
	/**
	* Apply a transform function to the coordinates of the geometry.
	* The geometry is modified in place.
	* If you do not want the geometry modified in place, first `clone()` it and
	* then use this function on the clone.
	* @param {import("../proj.js").TransformFunction} transformFn Transform function.
	* Called with a flat array of geometry coordinates.
	* @api
	* @override
	*/
	applyTransform(transformFn) {
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) geometries[i].applyTransform(transformFn);
		this.changed();
	}
	/**
	* Translate the geometry.  This modifies the geometry coordinates in place.  If
	* instead you want a new geometry, first `clone()` this geometry.
	* @param {number} deltaX Delta X.
	* @param {number} deltaY Delta Y.
	* @api
	* @override
	*/
	translate(deltaX, deltaY) {
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) geometries[i].translate(deltaX, deltaY);
		this.changed();
	}
	/**
	* Clean up.
	* @override
	*/
	disposeInternal() {
		this.unlistenGeometriesChange_();
		super.disposeInternal();
	}
};
/**
* @param {Array<Geometry>} geometries Geometries.
* @return {Array<Geometry>} Cloned geometries.
*/
function cloneGeometries(geometries) {
	return geometries.map((geometry) => geometry.clone());
}
//#endregion
//#region node_modules/ol/geom/MultiLineString.js
/**
* @module ol/geom/MultiLineString
*/
/**
* @classdesc
* Multi-linestring geometry.
*
* @api
*/
var MultiLineString = class MultiLineString extends SimpleGeometry {
	/**
	* @param {Array<Array<import("../coordinate.js").Coordinate>|LineString>|Array<number>} coordinates
	*     Coordinates or LineString geometries. (For internal use, flat coordinates in
	*     combination with `layout` and `ends` are also accepted.)
	* @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
	* @param {Array<number>} [ends] Flat coordinate ends for internal use.
	*/
	constructor(coordinates, layout, ends) {
		super();
		/**
		* @type {Array<number>}
		* @private
		*/
		this.ends_ = [];
		/**
		* @private
		* @type {number}
		*/
		this.maxDelta_ = -1;
		/**
		* @private
		* @type {number}
		*/
		this.maxDeltaRevision_ = -1;
		if (Array.isArray(coordinates[0])) this.setCoordinates(coordinates, layout);
		else if (layout !== void 0 && ends) {
			this.setFlatCoordinates(layout, coordinates);
			this.ends_ = ends;
		} else {
			const lineStrings = coordinates;
			/** @type {Array<number>} */
			const flatCoordinates = [];
			const ends = [];
			for (let i = 0, ii = lineStrings.length; i < ii; ++i) {
				const lineString = lineStrings[i];
				extend(flatCoordinates, lineString.getFlatCoordinates());
				ends.push(flatCoordinates.length);
			}
			const layout = lineStrings.length === 0 ? this.getLayout() : lineStrings[0].getLayout();
			this.setFlatCoordinates(layout, flatCoordinates);
			this.ends_ = ends;
		}
	}
	/**
	* Append the passed linestring to the multilinestring.
	* @param {LineString} lineString LineString.
	* @api
	*/
	appendLineString(lineString) {
		extend(this.flatCoordinates, lineString.getFlatCoordinates().slice());
		this.ends_.push(this.flatCoordinates.length);
		this.changed();
	}
	/**
	* Make a complete copy of the geometry.
	* @return {!MultiLineString} Clone.
	* @api
	* @override
	*/
	clone() {
		const multiLineString = new MultiLineString(this.flatCoordinates.slice(), this.layout, this.ends_.slice());
		multiLineString.applyProperties(this);
		return multiLineString;
	}
	/**
	* @param {number} x X.
	* @param {number} y Y.
	* @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
	* @param {number} minSquaredDistance Minimum squared distance.
	* @return {number} Minimum squared distance.
	* @override
	*/
	closestPointXY(x, y, closestPoint, minSquaredDistance) {
		if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) return minSquaredDistance;
		if (this.maxDeltaRevision_ != this.getRevision()) {
			this.maxDelta_ = Math.sqrt(arrayMaxSquaredDelta(this.flatCoordinates, 0, this.ends_, this.stride, 0));
			this.maxDeltaRevision_ = this.getRevision();
		}
		return assignClosestArrayPoint(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
	}
	/**
	* Returns the coordinate at `m` using linear interpolation, or `null` if no
	* such coordinate exists.
	*
	* `extrapolate` controls extrapolation beyond the range of Ms in the
	* MultiLineString. If `extrapolate` is `true` then Ms less than the first
	* M will return the first coordinate and Ms greater than the last M will
	* return the last coordinate.
	*
	* `interpolate` controls interpolation between consecutive LineStrings
	* within the MultiLineString. If `interpolate` is `true` the coordinates
	* will be linearly interpolated between the last coordinate of one LineString
	* and the first coordinate of the next LineString.  If `interpolate` is
	* `false` then the function will return `null` for Ms falling between
	* LineStrings.
	*
	* @param {number} m M.
	* @param {boolean} [extrapolate] Extrapolate. Default is `false`.
	* @param {boolean} [interpolate] Interpolate. Default is `false`.
	* @return {import("../coordinate.js").Coordinate|null} Coordinate.
	* @api
	*/
	getCoordinateAtM(m, extrapolate, interpolate) {
		if (this.layout != "XYM" && this.layout != "XYZM" || this.flatCoordinates.length === 0) return null;
		extrapolate = extrapolate !== void 0 ? extrapolate : false;
		interpolate = interpolate !== void 0 ? interpolate : false;
		return lineStringsCoordinateAtM(this.flatCoordinates, 0, this.ends_, this.stride, m, extrapolate, interpolate);
	}
	/**
	* Return the coordinates of the multilinestring.
	* @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
	* @api
	* @override
	*/
	getCoordinates() {
		return inflateCoordinatesArray(this.flatCoordinates, 0, this.ends_, this.stride);
	}
	/**
	* @return {Array<number>} Ends.
	*/
	getEnds() {
		return this.ends_;
	}
	/**
	* Return the linestring at the specified index.
	* @param {number} index Index.
	* @return {LineString} LineString.
	* @api
	*/
	getLineString(index) {
		if (index < 0 || this.ends_.length <= index) return null;
		return new LineString(this.flatCoordinates.slice(index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]), this.layout);
	}
	/**
	* Return the linestrings of this multilinestring.
	* @return {Array<LineString>} LineStrings.
	* @api
	*/
	getLineStrings() {
		const flatCoordinates = this.flatCoordinates;
		const ends = this.ends_;
		const layout = this.layout;
		/** @type {Array<LineString>} */
		const lineStrings = [];
		let offset = 0;
		for (let i = 0, ii = ends.length; i < ii; ++i) {
			const end = ends[i];
			const lineString = new LineString(flatCoordinates.slice(offset, end), layout);
			lineStrings.push(lineString);
			offset = end;
		}
		return lineStrings;
	}
	/**
	* Return the sum of all line string lengths
	* @return {number} Length (on projected plane).
	* @api
	*/
	getLength() {
		const ends = this.ends_;
		let start = 0;
		let length = 0;
		for (let i = 0, ii = ends.length; i < ii; ++i) {
			length += lineStringLength(this.flatCoordinates, start, ends[i], this.stride);
			start = ends[i];
		}
		return length;
	}
	/**
	* @return {Array<number>} Flat midpoints.
	*/
	getFlatMidpoints() {
		/** @type {Array<number>} */
		const midpoints = [];
		const flatCoordinates = this.flatCoordinates;
		let offset = 0;
		const ends = this.ends_;
		const stride = this.stride;
		for (let i = 0, ii = ends.length; i < ii; ++i) {
			const end = ends[i];
			extend(midpoints, interpolatePoint(flatCoordinates, offset, end, stride, .5));
			offset = end;
		}
		return midpoints;
	}
	/**
	* @param {number} squaredTolerance Squared tolerance.
	* @return {MultiLineString} Simplified MultiLineString.
	* @protected
	* @override
	*/
	getSimplifiedGeometryInternal(squaredTolerance) {
		/** @type {Array<number>} */
		const simplifiedFlatCoordinates = [];
		/** @type {Array<number>} */
		const simplifiedEnds = [];
		simplifiedFlatCoordinates.length = douglasPeuckerArray(this.flatCoordinates, 0, this.ends_, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0, simplifiedEnds);
		return new MultiLineString(simplifiedFlatCoordinates, "XY", simplifiedEnds);
	}
	/**
	* Get the type of this geometry.
	* @return {import("./Geometry.js").Type} Geometry type.
	* @api
	* @override
	*/
	getType() {
		return "MultiLineString";
	}
	/**
	* Test if the geometry and the passed extent intersect.
	* @param {import("../extent.js").Extent} extent Extent.
	* @return {boolean} `true` if the geometry and the extent intersect.
	* @api
	* @override
	*/
	intersectsExtent(extent) {
		return intersectsLineStringArray(this.flatCoordinates, 0, this.ends_, this.stride, extent);
	}
	/**
	* Set the coordinates of the multilinestring.
	* @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
	* @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
	* @api
	* @override
	*/
	setCoordinates(coordinates, layout) {
		this.setLayout(layout, coordinates, 2);
		if (!this.flatCoordinates) this.flatCoordinates = [];
		const ends = deflateCoordinatesArray(this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
		this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
		this.changed();
	}
};
//#endregion
//#region node_modules/ol/geom/MultiPoint.js
/**
* @module ol/geom/MultiPoint
*/
/**
* @classdesc
* Multi-point geometry.
*
* @api
*/
var MultiPoint = class MultiPoint extends SimpleGeometry {
	/**
	* @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
	*     For internal use, flat coordinates in combination with `layout` are also accepted.
	* @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
	*/
	constructor(coordinates, layout) {
		super();
		if (layout && !Array.isArray(coordinates[0])) this.setFlatCoordinates(layout, coordinates);
		else this.setCoordinates(coordinates, layout);
	}
	/**
	* Append the passed point to this multipoint.
	* @param {Point} point Point.
	* @api
	*/
	appendPoint(point) {
		extend(this.flatCoordinates, point.getFlatCoordinates());
		this.changed();
	}
	/**
	* Make a complete copy of the geometry.
	* @return {!MultiPoint} Clone.
	* @api
	* @override
	*/
	clone() {
		const multiPoint = new MultiPoint(this.flatCoordinates.slice(), this.layout);
		multiPoint.applyProperties(this);
		return multiPoint;
	}
	/**
	* @param {number} x X.
	* @param {number} y Y.
	* @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
	* @param {number} minSquaredDistance Minimum squared distance.
	* @return {number} Minimum squared distance.
	* @override
	*/
	closestPointXY(x, y, closestPoint, minSquaredDistance) {
		if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) return minSquaredDistance;
		const flatCoordinates = this.flatCoordinates;
		const stride = this.stride;
		for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
			const squaredDistance$1 = squaredDistance(x, y, flatCoordinates[i], flatCoordinates[i + 1]);
			if (squaredDistance$1 < minSquaredDistance) {
				minSquaredDistance = squaredDistance$1;
				for (let j = 0; j < stride; ++j) closestPoint[j] = flatCoordinates[i + j];
				closestPoint.length = stride;
			}
		}
		return minSquaredDistance;
	}
	/**
	* Return the coordinates of the multipoint.
	* @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
	* @api
	* @override
	*/
	getCoordinates() {
		return inflateCoordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
	}
	/**
	* Return the point at the specified index.
	* @param {number} index Index.
	* @return {Point} Point.
	* @api
	*/
	getPoint(index) {
		const n = this.flatCoordinates.length / this.stride;
		if (index < 0 || n <= index) return null;
		return new Point(this.flatCoordinates.slice(index * this.stride, (index + 1) * this.stride), this.layout);
	}
	/**
	* Return the points of this multipoint.
	* @return {Array<Point>} Points.
	* @api
	*/
	getPoints() {
		const flatCoordinates = this.flatCoordinates;
		const layout = this.layout;
		const stride = this.stride;
		/** @type {Array<Point>} */
		const points = [];
		for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
			const point = new Point(flatCoordinates.slice(i, i + stride), layout);
			points.push(point);
		}
		return points;
	}
	/**
	* Get the type of this geometry.
	* @return {import("./Geometry.js").Type} Geometry type.
	* @api
	* @override
	*/
	getType() {
		return "MultiPoint";
	}
	/**
	* Test if the geometry and the passed extent intersect.
	* @param {import("../extent.js").Extent} extent Extent.
	* @return {boolean} `true` if the geometry and the extent intersect.
	* @api
	* @override
	*/
	intersectsExtent(extent) {
		const flatCoordinates = this.flatCoordinates;
		const stride = this.stride;
		for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
			const x = flatCoordinates[i];
			const y = flatCoordinates[i + 1];
			if (containsXY(extent, x, y)) return true;
		}
		return false;
	}
	/**
	* Set the coordinates of the multipoint.
	* @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
	* @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
	* @api
	* @override
	*/
	setCoordinates(coordinates, layout) {
		this.setLayout(layout, coordinates, 1);
		if (!this.flatCoordinates) this.flatCoordinates = [];
		this.flatCoordinates.length = deflateCoordinates(this.flatCoordinates, 0, coordinates, this.stride);
		this.changed();
	}
};
//#endregion
//#region node_modules/ol/geom/MultiPolygon.js
/**
* @module ol/geom/MultiPolygon
*/
/**
* @classdesc
* Multi-polygon geometry.
*
* @api
*/
var MultiPolygon = class MultiPolygon extends SimpleGeometry {
	/**
	* @param {Array<Array<Array<import("../coordinate.js").Coordinate>>|Polygon>|Array<number>} coordinates Coordinates.
	*     For internal use, flat coordinates in combination with `layout` and `endss` are also accepted.
	* @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
	* @param {Array<Array<number>>} [endss] Array of ends for internal use with flat coordinates.
	*/
	constructor(coordinates, layout, endss) {
		super();
		/**
		* @type {Array<Array<number>>}
		* @private
		*/
		this.endss_ = [];
		/**
		* @private
		* @type {number}
		*/
		this.flatInteriorPointsRevision_ = -1;
		/**
		* @private
		* @type {Array<number>|null}
		*/
		this.flatInteriorPoints_ = null;
		/**
		* @private
		* @type {number}
		*/
		this.maxDelta_ = -1;
		/**
		* @private
		* @type {number}
		*/
		this.maxDeltaRevision_ = -1;
		/**
		* @private
		* @type {number}
		*/
		this.orientedRevision_ = -1;
		/**
		* @private
		* @type {Array<number>|null}
		*/
		this.orientedFlatCoordinates_ = null;
		if (!endss && !Array.isArray(coordinates[0])) {
			const polygons = coordinates;
			/** @type {Array<number>} */
			const flatCoordinates = [];
			const thisEndss = [];
			for (let i = 0, ii = polygons.length; i < ii; ++i) {
				const polygon = polygons[i];
				const offset = flatCoordinates.length;
				const ends = polygon.getEnds();
				for (let j = 0, jj = ends.length; j < jj; ++j) ends[j] += offset;
				extend(flatCoordinates, polygon.getFlatCoordinates());
				thisEndss.push(ends);
			}
			layout = polygons.length === 0 ? this.getLayout() : polygons[0].getLayout();
			coordinates = flatCoordinates;
			endss = thisEndss;
		}
		if (layout !== void 0 && endss) {
			this.setFlatCoordinates(layout, coordinates);
			this.endss_ = endss;
		} else this.setCoordinates(coordinates, layout);
	}
	/**
	* Append the passed polygon to this multipolygon.
	* @param {Polygon} polygon Polygon.
	* @api
	*/
	appendPolygon(polygon) {
		/** @type {Array<number>} */
		let ends;
		if (!this.flatCoordinates) {
			this.flatCoordinates = polygon.getFlatCoordinates().slice();
			ends = polygon.getEnds().slice();
			this.endss_.push();
		} else {
			const offset = this.flatCoordinates.length;
			extend(this.flatCoordinates, polygon.getFlatCoordinates());
			ends = polygon.getEnds().slice();
			for (let i = 0, ii = ends.length; i < ii; ++i) ends[i] += offset;
		}
		this.endss_.push(ends);
		this.changed();
	}
	/**
	* Make a complete copy of the geometry.
	* @return {!MultiPolygon} Clone.
	* @api
	* @override
	*/
	clone() {
		const len = this.endss_.length;
		const newEndss = new Array(len);
		for (let i = 0; i < len; ++i) newEndss[i] = this.endss_[i].slice();
		const multiPolygon = new MultiPolygon(this.flatCoordinates.slice(), this.layout, newEndss);
		multiPolygon.applyProperties(this);
		return multiPolygon;
	}
	/**
	* @param {number} x X.
	* @param {number} y Y.
	* @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
	* @param {number} minSquaredDistance Minimum squared distance.
	* @return {number} Minimum squared distance.
	* @override
	*/
	closestPointXY(x, y, closestPoint, minSquaredDistance) {
		if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) return minSquaredDistance;
		if (this.maxDeltaRevision_ != this.getRevision()) {
			this.maxDelta_ = Math.sqrt(multiArrayMaxSquaredDelta(this.flatCoordinates, 0, this.endss_, this.stride, 0));
			this.maxDeltaRevision_ = this.getRevision();
		}
		return assignClosestMultiArrayPoint(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
	}
	/**
	* @param {number} x X.
	* @param {number} y Y.
	* @return {boolean} Contains (x, y).
	* @override
	*/
	containsXY(x, y) {
		return linearRingssContainsXY(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, x, y);
	}
	/**
	* Return the area of the multipolygon on projected plane.
	* @return {number} Area (on projected plane).
	* @api
	*/
	getArea() {
		return linearRingss(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride);
	}
	/**
	* Get the coordinate array for this geometry.  This array has the structure
	* of a GeoJSON coordinate array for multi-polygons.
	*
	* @param {boolean} [right] Orient coordinates according to the right-hand
	*     rule (counter-clockwise for exterior and clockwise for interior rings).
	*     If `false`, coordinates will be oriented according to the left-hand rule
	*     (clockwise for exterior and counter-clockwise for interior rings).
	*     By default, coordinate orientation will depend on how the geometry was
	*     constructed.
	* @return {Array<Array<Array<import("../coordinate.js").Coordinate>>>} Coordinates.
	* @api
	* @override
	*/
	getCoordinates(right) {
		let flatCoordinates;
		if (right !== void 0) {
			flatCoordinates = this.getOrientedFlatCoordinates().slice();
			orientLinearRingsArray(flatCoordinates, 0, this.endss_, this.stride, right);
		} else flatCoordinates = this.flatCoordinates;
		return inflateMultiCoordinatesArray(flatCoordinates, 0, this.endss_, this.stride);
	}
	/**
	* @return {Array<Array<number>>} Endss.
	*/
	getEndss() {
		return this.endss_;
	}
	/**
	* @return {Array<number>} Flat interior points.
	*/
	getFlatInteriorPoints() {
		if (this.flatInteriorPointsRevision_ != this.getRevision()) {
			const flatCenters = linearRingss$1(this.flatCoordinates, 0, this.endss_, this.stride);
			this.flatInteriorPoints_ = getInteriorPointsOfMultiArray(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, flatCenters);
			this.flatInteriorPointsRevision_ = this.getRevision();
		}
		return this.flatInteriorPoints_;
	}
	/**
	* Return the interior points as {@link module:ol/geom/MultiPoint~MultiPoint multipoint}.
	* @return {MultiPoint} Interior points as XYM coordinates, where M is
	* the length of the horizontal intersection that the point belongs to.
	* @api
	*/
	getInteriorPoints() {
		return new MultiPoint(this.getFlatInteriorPoints().slice(), "XYM");
	}
	/**
	* @return {Array<number>} Oriented flat coordinates.
	*/
	getOrientedFlatCoordinates() {
		if (this.orientedRevision_ != this.getRevision()) {
			const flatCoordinates = this.flatCoordinates;
			if (linearRingssAreOriented(flatCoordinates, 0, this.endss_, this.stride)) this.orientedFlatCoordinates_ = flatCoordinates;
			else {
				this.orientedFlatCoordinates_ = flatCoordinates.slice();
				this.orientedFlatCoordinates_.length = orientLinearRingsArray(this.orientedFlatCoordinates_, 0, this.endss_, this.stride);
			}
			this.orientedRevision_ = this.getRevision();
		}
		return this.orientedFlatCoordinates_;
	}
	/**
	* @param {number} squaredTolerance Squared tolerance.
	* @return {MultiPolygon} Simplified MultiPolygon.
	* @protected
	* @override
	*/
	getSimplifiedGeometryInternal(squaredTolerance) {
		/** @type {Array<number>} */
		const simplifiedFlatCoordinates = [];
		/** @type {Array<Array<number>>} */
		const simplifiedEndss = [];
		simplifiedFlatCoordinates.length = quantizeMultiArray(this.flatCoordinates, 0, this.endss_, this.stride, Math.sqrt(squaredTolerance), simplifiedFlatCoordinates, 0, simplifiedEndss);
		return new MultiPolygon(simplifiedFlatCoordinates, "XY", simplifiedEndss);
	}
	/**
	* Return the polygon at the specified index.
	* @param {number} index Index.
	* @return {Polygon} Polygon.
	* @api
	*/
	getPolygon(index) {
		if (index < 0 || this.endss_.length <= index) return null;
		let offset;
		if (index === 0) offset = 0;
		else {
			const prevEnds = this.endss_[index - 1];
			offset = prevEnds[prevEnds.length - 1];
		}
		const ends = this.endss_[index].slice();
		const end = ends[ends.length - 1];
		if (offset !== 0) for (let i = 0, ii = ends.length; i < ii; ++i) ends[i] -= offset;
		return new Polygon(this.flatCoordinates.slice(offset, end), this.layout, ends);
	}
	/**
	* Return the polygons of this multipolygon.
	* @return {Array<Polygon>} Polygons.
	* @api
	*/
	getPolygons() {
		const layout = this.layout;
		const flatCoordinates = this.flatCoordinates;
		const endss = this.endss_;
		const polygons = [];
		let offset = 0;
		for (let i = 0, ii = endss.length; i < ii; ++i) {
			const ends = endss[i].slice();
			const end = ends[ends.length - 1];
			if (offset !== 0) for (let j = 0, jj = ends.length; j < jj; ++j) ends[j] -= offset;
			const polygon = new Polygon(flatCoordinates.slice(offset, end), layout, ends);
			polygons.push(polygon);
			offset = end;
		}
		return polygons;
	}
	/**
	* Get the type of this geometry.
	* @return {import("./Geometry.js").Type} Geometry type.
	* @api
	* @override
	*/
	getType() {
		return "MultiPolygon";
	}
	/**
	* Test if the geometry and the passed extent intersect.
	* @param {import("../extent.js").Extent} extent Extent.
	* @return {boolean} `true` if the geometry and the extent intersect.
	* @api
	* @override
	*/
	intersectsExtent(extent) {
		return intersectsLinearRingMultiArray(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, extent);
	}
	/**
	* Set the coordinates of the multipolygon.
	* @param {!Array<Array<Array<import("../coordinate.js").Coordinate>>>} coordinates Coordinates.
	* @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
	* @api
	* @override
	*/
	setCoordinates(coordinates, layout) {
		this.setLayout(layout, coordinates, 3);
		if (!this.flatCoordinates) this.flatCoordinates = [];
		const endss = deflateMultiCoordinatesArray(this.flatCoordinates, 0, coordinates, this.stride, this.endss_);
		if (endss.length === 0) this.flatCoordinates.length = 0;
		else {
			const lastEnds = endss[endss.length - 1];
			this.flatCoordinates.length = lastEnds.length === 0 ? 0 : lastEnds[lastEnds.length - 1];
		}
		this.changed();
	}
};
//#endregion
//#region node_modules/ol/format/Feature.js
/**
* @module ol/format/Feature
*/
/**
* @typedef {Object} ReadOptions
* @property {import("../proj.js").ProjectionLike} [dataProjection] Projection of the data we are reading.
* If not provided, the projection will be derived from the data (where possible) or
* the `dataProjection` of the format is assigned (where set). If the projection
* can not be derived from the data and if no `dataProjection` is set for a format,
* the features will not be reprojected.
* @property {import("../extent.js").Extent} [extent] Tile extent in map units of the tile being read.
* This is only required when reading data with tile pixels as geometry units. When configured,
* a `dataProjection` with `TILE_PIXELS` as `units` and the tile's pixel extent as `extent` needs to be
* provided.
* @property {import("../proj.js").ProjectionLike} [featureProjection] Projection of the feature geometries
* created by the format reader. If not provided, features will be returned in the
* `dataProjection`.
*/
/**
* @typedef {Object} WriteOptions
* @property {import("../proj.js").ProjectionLike} [dataProjection] Projection of the data we are writing.
* If not provided, the `dataProjection` of the format is assigned (where set).
* If no `dataProjection` is set for a format, the features will be returned
* in the `featureProjection`.
* @property {import("../proj.js").ProjectionLike} [featureProjection] Projection of the feature geometries
* that will be serialized by the format writer. If not provided, geometries are assumed
* to be in the `dataProjection` if that is set; in other words, they are not transformed.
* @property {boolean} [rightHanded] When writing geometries, follow the right-hand
* rule for linear ring orientation.  This means that polygons will have counter-clockwise
* exterior rings and clockwise interior rings.  By default, coordinates are serialized
* as they are provided at construction.  If `true`, the right-hand rule will
* be applied.  If `false`, the left-hand rule will be applied (clockwise for
* exterior and counter-clockwise for interior rings).  Note that not all
* formats support this.  The GeoJSON format does use this property when writing
* geometries.
* @property {number} [decimals] Maximum number of decimal places for coordinates.
* Coordinates are stored internally as floats, but floating-point arithmetic can create
* coordinates with a large number of decimal places, not generally wanted on output.
* Set a number here to round coordinates. Can also be used to ensure that
* coordinates read in can be written back out with the same number of decimals.
* Default is no rounding.
*/
/**
* @typedef {'arraybuffer' | 'json' | 'text' | 'xml'} Type
*/
/**
* @typedef {Object} SimpleGeometryObject
* @property {import('../geom/Geometry.js').Type} type Type.
* @property {Array<number>} flatCoordinates Flat coordinates.
* @property {Array<number>|Array<Array<number>>} [ends] Ends or endss.
* @property {import('../geom/Geometry.js').GeometryLayout} [layout] Layout.
*/
/**
* @typedef {Array<GeometryObject>} GeometryCollectionObject
*/
/**
* @typedef {SimpleGeometryObject|GeometryCollectionObject} GeometryObject
*/
/**
* @typedef {Object} FeatureObject
* @property {string|number} [id] Id.
* @property {GeometryObject} [geometry] Geometry.
* @property {Object<string, *>} [properties] Properties.
*/
/***
* @template {import('../Feature.js').FeatureLike} T
* @typedef {T extends RenderFeature ? typeof RenderFeature : typeof Feature} FeatureToFeatureClass
*/
/***
* @template {import("../Feature.js").FeatureClass} T
* @typedef {T[keyof T] extends RenderFeature ? RenderFeature : Feature} FeatureClassToFeature
*/
/**
* @classdesc
* Abstract base class; normally only used for creating subclasses and not
* instantiated in apps.
* Base class for feature formats.
* {@link module:ol/format/Feature~FeatureFormat} subclasses provide the ability to decode and encode
* {@link module:ol/Feature~Feature} objects from a variety of commonly used geospatial
* file formats.  See the documentation for each format for more details.
*
* @template {import('../Feature.js').FeatureLike} [FeatureType=import("../Feature.js").default]
* @abstract
* @api
*/
var FeatureFormat = class {
	constructor() {
		/**
		* @protected
		* @type {import("../proj/Projection.js").default|undefined}
		*/
		this.dataProjection = void 0;
		/**
		* @protected
		* @type {import("../proj/Projection.js").default|undefined}
		*/
		this.defaultFeatureProjection = void 0;
		/**
		* @protected
		* @type {FeatureToFeatureClass<FeatureType>}
		*/
		this.featureClass = Feature;
		/**
		* A list media types supported by the format in descending order of preference.
		* @type {Array<string>}
		*/
		this.supportedMediaTypes = null;
	}
	/**
	* Adds the data projection to the read options.
	* @param {Document|Element|Object|string} source Source.
	* @param {ReadOptions} [options] Options.
	* @return {ReadOptions|undefined} Options.
	* @protected
	*/
	getReadOptions(source, options) {
		if (options) {
			let dataProjection = options.dataProjection ? get(options.dataProjection) : this.readProjection(source);
			if (options.extent && dataProjection && dataProjection.getUnits() === "tile-pixels") {
				dataProjection = get(dataProjection);
				dataProjection.setWorldExtent(options.extent);
			}
			options = {
				dataProjection,
				featureProjection: options.featureProjection
			};
		}
		return this.adaptOptions(options);
	}
	/**
	* Sets the `dataProjection` on the options, if no `dataProjection`
	* is set.
	* @param {WriteOptions|ReadOptions|undefined} options
	*     Options.
	* @protected
	* @return {WriteOptions|ReadOptions|undefined}
	*     Updated options.
	*/
	adaptOptions(options) {
		return Object.assign({
			dataProjection: this.dataProjection,
			featureProjection: this.defaultFeatureProjection,
			featureClass: this.featureClass
		}, options);
	}
	/**
	* @abstract
	* @return {Type} The format type.
	*/
	getType() {
		return abstract();
	}
	/**
	* Read a single feature from a source.
	*
	* @abstract
	* @param {Document|Element|Object|string} source Source.
	* @param {ReadOptions} [options] Read options.
	* @return {FeatureType|Array<FeatureType>} Feature.
	*/
	readFeature(source, options) {
		return abstract();
	}
	/**
	* Read all features from a source.
	*
	* @abstract
	* @param {Document|Element|ArrayBuffer|Object|string} source Source.
	* @param {ReadOptions} [options] Read options.
	* @return {Array<FeatureType>} Features.
	*/
	readFeatures(source, options) {
		return abstract();
	}
	/**
	* Read a single geometry from a source.
	*
	* @abstract
	* @param {Document|Element|Object|string} source Source.
	* @param {ReadOptions} [options] Read options.
	* @return {import("../geom/Geometry.js").default} Geometry.
	*/
	readGeometry(source, options) {
		return abstract();
	}
	/**
	* Read the projection from a source.
	*
	* @abstract
	* @param {Document|Element|Object|string} source Source.
	* @return {import("../proj/Projection.js").default|undefined} Projection.
	*/
	readProjection(source) {
		return abstract();
	}
	/**
	* Encode a feature in this format.
	*
	* @abstract
	* @param {Feature} feature Feature.
	* @param {WriteOptions} [options] Write options.
	* @return {string|ArrayBuffer} Result.
	*/
	writeFeature(feature, options) {
		return abstract();
	}
	/**
	* Encode an array of features in this format.
	*
	* @abstract
	* @param {Array<Feature>} features Features.
	* @param {WriteOptions} [options] Write options.
	* @return {string|ArrayBuffer} Result.
	*/
	writeFeatures(features, options) {
		return abstract();
	}
	/**
	* Write a single geometry in this format.
	*
	* @abstract
	* @param {import("../geom/Geometry.js").default} geometry Geometry.
	* @param {WriteOptions} [options] Write options.
	* @return {string|ArrayBuffer} Result.
	*/
	writeGeometry(geometry, options) {
		return abstract();
	}
};
/**
* @template {import("../geom/Geometry.js").default|RenderFeature} T
* @param {T} geometry Geometry.
* @param {boolean} write Set to true for writing, false for reading.
* @param {WriteOptions|ReadOptions} [options] Options.
* @return {T} Transformed geometry.
*/
function transformGeometryWithOptions(geometry, write, options) {
	const featureProjection = options ? get(options.featureProjection) : null;
	const dataProjection = options ? get(options.dataProjection) : null;
	let transformed = geometry;
	if (featureProjection && dataProjection && !equivalent(featureProjection, dataProjection)) {
		if (write) transformed = geometry.clone();
		const fromProjection = write ? featureProjection : dataProjection;
		const toProjection = write ? dataProjection : featureProjection;
		if (fromProjection.getUnits() === "tile-pixels") transformed.transform(fromProjection, toProjection);
		else transformed.applyTransform(getTransform(fromProjection, toProjection));
	}
	if (write && options && options.decimals !== void 0) {
		const power = Math.pow(
			10,
			/** @type {WriteOptions} */
			options.decimals
		);
		/**
		* @param {Array<number>} coordinates Coordinates.
		* @return {Array<number>} Transformed coordinates.
		*/
		const transform = function(coordinates) {
			for (let i = 0, ii = coordinates.length; i < ii; ++i) coordinates[i] = Math.round(coordinates[i] * power) / power;
			return coordinates;
		};
		if (transformed === geometry) transformed = geometry.clone();
		transformed.applyTransform(transform);
	}
	return transformed;
}
var GeometryConstructor = {
	Point,
	LineString,
	Polygon,
	MultiPoint,
	MultiLineString,
	MultiPolygon
};
function orientFlatCoordinates(flatCoordinates, ends, stride) {
	if (Array.isArray(ends[0])) {
		if (!linearRingssAreOriented(flatCoordinates, 0, ends, stride)) {
			flatCoordinates = flatCoordinates.slice();
			orientLinearRingsArray(flatCoordinates, 0, ends, stride);
		}
		return flatCoordinates;
	}
	if (!linearRingsAreOriented(flatCoordinates, 0, ends, stride)) {
		flatCoordinates = flatCoordinates.slice();
		orientLinearRings(flatCoordinates, 0, ends, stride);
	}
	return flatCoordinates;
}
/**
* @param {FeatureObject} object Feature object.
* @param {WriteOptions|ReadOptions} [options] Options.
* @return {RenderFeature|Array<RenderFeature>} Render feature.
*/
function createRenderFeature(object, options) {
	const geometry = object.geometry;
	if (!geometry) return [];
	if (Array.isArray(geometry)) return geometry.map((geometry) => createRenderFeature({
		...object,
		geometry
	})).flat();
	const geometryType = geometry.type === "MultiPolygon" ? "Polygon" : geometry.type;
	if (geometryType === "GeometryCollection" || geometryType === "Circle") throw new Error("Unsupported geometry type: " + geometryType);
	const stride = geometry.layout.length;
	return transformGeometryWithOptions(new RenderFeature(geometryType, geometryType === "Polygon" ? orientFlatCoordinates(geometry.flatCoordinates, geometry.ends, stride) : geometry.flatCoordinates, geometry.ends?.flat(), stride, object.properties || {}, object.id).enableSimplifyTransformed(), false, options);
}
/**
* @param {GeometryObject|null} object Geometry object.
* @param {WriteOptions|ReadOptions} [options] Options.
* @return {import("../geom/Geometry.js").default} Geometry.
*/
function createGeometry(object, options) {
	if (!object) return null;
	if (Array.isArray(object)) return new GeometryCollection(object.map((geometry) => createGeometry(geometry, options)));
	const Geometry = GeometryConstructor[object.type];
	return transformGeometryWithOptions(new Geometry(object.flatCoordinates, object.layout || "XY", object.ends), false, options);
}
//#endregion
//#region node_modules/ol/format/JSONFeature.js
/**
* @module ol/format/JSONFeature
*/
/**
* @classdesc
* Abstract base class; normally only used for creating subclasses and not
* instantiated in apps.
* Base class for JSON feature formats.
*
* @template {import('../Feature.js').FeatureLike} [FeatureType=import("../Feature.js").default]
* @extends {FeatureFormat<FeatureType>}
* @abstract
*/
var JSONFeature = class extends FeatureFormat {
	constructor() {
		super();
	}
	/**
	* @return {import("./Feature.js").Type} Format.
	* @override
	*/
	getType() {
		return "json";
	}
	/**
	* Read a feature.  Only works for a single feature. Use `readFeatures` to
	* read a feature collection.
	*
	* @param {ArrayBuffer|Document|Element|Object|string} source Source.
	* @param {import("./Feature.js").ReadOptions} [options] Read options.
	* @return {FeatureType|Array<FeatureType>} Feature.
	* @api
	* @override
	*/
	readFeature(source, options) {
		return this.readFeatureFromObject(getObject(source), this.getReadOptions(source, options));
	}
	/**
	* Read all features.  Works with both a single feature and a feature
	* collection.
	*
	* @param {ArrayBuffer|Document|Element|Object|string} source Source.
	* @param {import("./Feature.js").ReadOptions} [options] Read options.
	* @return {Array<FeatureType>} Features.
	* @api
	* @override
	*/
	readFeatures(source, options) {
		return this.readFeaturesFromObject(getObject(source), this.getReadOptions(source, options));
	}
	/**
	* @abstract
	* @param {Object} object Object.
	* @param {import("./Feature.js").ReadOptions} [options] Read options.
	* @protected
	* @return {FeatureType|Array<FeatureType>} Feature.
	*/
	readFeatureFromObject(object, options) {
		return abstract();
	}
	/**
	* @abstract
	* @param {Object} object Object.
	* @param {import("./Feature.js").ReadOptions} [options] Read options.
	* @protected
	* @return {Array<FeatureType>} Features.
	*/
	readFeaturesFromObject(object, options) {
		return abstract();
	}
	/**
	* Read a geometry.
	*
	* @param {ArrayBuffer|Document|Element|Object|string} source Source.
	* @param {import("./Feature.js").ReadOptions} [options] Read options.
	* @return {import("../geom/Geometry.js").default} Geometry.
	* @api
	* @override
	*/
	readGeometry(source, options) {
		return this.readGeometryFromObject(getObject(source), this.getReadOptions(source, options));
	}
	/**
	* @abstract
	* @param {Object} object Object.
	* @param {import("./Feature.js").ReadOptions} [options] Read options.
	* @protected
	* @return {import("../geom/Geometry.js").default} Geometry.
	*/
	readGeometryFromObject(object, options) {
		return abstract();
	}
	/**
	* Read the projection.
	*
	* @param {ArrayBuffer|Document|Element|Object|string} source Source.
	* @return {import("../proj/Projection.js").default} Projection.
	* @api
	* @override
	*/
	readProjection(source) {
		return this.readProjectionFromObject(getObject(source));
	}
	/**
	* @abstract
	* @param {Object} object Object.
	* @protected
	* @return {import("../proj/Projection.js").default} Projection.
	*/
	readProjectionFromObject(object) {
		return abstract();
	}
	/**
	* Encode a feature as string.
	*
	* @param {import("../Feature.js").default} feature Feature.
	* @param {import("./Feature.js").WriteOptions} [options] Write options.
	* @return {string} Encoded feature.
	* @api
	* @override
	*/
	writeFeature(feature, options) {
		return JSON.stringify(this.writeFeatureObject(feature, options));
	}
	/**
	* @abstract
	* @param {import("../Feature.js").default} feature Feature.
	* @param {import("./Feature.js").WriteOptions} [options] Write options.
	* @return {Object} Object.
	*/
	writeFeatureObject(feature, options) {
		return abstract();
	}
	/**
	* Encode an array of features as string.
	*
	* @param {Array<import("../Feature.js").default>} features Features.
	* @param {import("./Feature.js").WriteOptions} [options] Write options.
	* @return {string} Encoded features.
	* @api
	* @override
	*/
	writeFeatures(features, options) {
		return JSON.stringify(this.writeFeaturesObject(features, options));
	}
	/**
	* @abstract
	* @param {Array<import("../Feature.js").default>} features Features.
	* @param {import("./Feature.js").WriteOptions} [options] Write options.
	* @return {Object} Object.
	*/
	writeFeaturesObject(features, options) {
		return abstract();
	}
	/**
	* Encode a geometry as string.
	*
	* @param {import("../geom/Geometry.js").default} geometry Geometry.
	* @param {import("./Feature.js").WriteOptions} [options] Write options.
	* @return {string} Encoded geometry.
	* @api
	* @override
	*/
	writeGeometry(geometry, options) {
		return JSON.stringify(this.writeGeometryObject(geometry, options));
	}
	/**
	* @abstract
	* @param {import("../geom/Geometry.js").default} geometry Geometry.
	* @param {import("./Feature.js").WriteOptions} [options] Write options.
	* @return {Object} Object.
	*/
	writeGeometryObject(geometry, options) {
		return abstract();
	}
};
/**
* @param {Document|Element|Object|string} source Source.
* @return {Object} Object.
*/
function getObject(source) {
	if (typeof source === "string") {
		const object = JSON.parse(source);
		return object ? object : null;
	}
	if (source !== null) return source;
	return null;
}
//#endregion
//#region node_modules/ol/format/GeoJSON.js
/**
* @module ol/format/GeoJSON
*/
/**
* @typedef {import("geojson").GeoJSON} GeoJSONObject
* @typedef {import("geojson").Feature} GeoJSONFeature
* @typedef {import("geojson").FeatureCollection} GeoJSONFeatureCollection
* @typedef {import("geojson").Geometry} GeoJSONGeometry
* @typedef {import("geojson").Point} GeoJSONPoint
* @typedef {import("geojson").LineString} GeoJSONLineString
* @typedef {import("geojson").Polygon} GeoJSONPolygon
* @typedef {import("geojson").MultiPoint} GeoJSONMultiPoint
* @typedef {import("geojson").MultiLineString} GeoJSONMultiLineString
* @typedef {import("geojson").MultiPolygon} GeoJSONMultiPolygon
* @typedef {import("geojson").GeometryCollection} GeoJSONGeometryCollection
*/
/**
* @template {import("../Feature.js").FeatureLike} [FeatureType=import("../Feature.js").default]
* @typedef {Object} Options
*
* @property {import("../proj.js").ProjectionLike} [dataProjection='EPSG:4326'] Default data projection.
* @property {import("../proj.js").ProjectionLike} [featureProjection] Projection for features read or
* written by the format.  Options passed to read or write methods will take precedence.
* @property {string} [geometryName] Geometry name to use when creating features.
* @property {boolean} [extractGeometryName=false] Certain GeoJSON providers include
* the geometry_name field in the feature GeoJSON. If set to `true` the GeoJSON reader
* will look for that field to set the geometry name. If both this field is set to `true`
* and a `geometryName` is provided, the `geometryName` will take precedence.
* @property {import('./Feature.js').FeatureToFeatureClass<FeatureType>} [featureClass] Feature class
* to be used when reading features. The default is {@link module:ol/Feature~Feature}. If performance is
* the primary concern, and features are not going to be modified or round-tripped through the format,
* consider using {@link module:ol/render/Feature~RenderFeature}
*/
/**
* @classdesc
* Feature format for reading and writing data in the GeoJSON format.
*
* @template {import('../Feature.js').FeatureLike} [FeatureType=import("../Feature.js").default]
* @extends {JSONFeature<FeatureType>}
* @api
*/
var GeoJSON = class extends JSONFeature {
	/**
	* @param {Options<FeatureType>} [options] Options.
	*/
	constructor(options) {
		options = options ? options : {};
		super();
		/**
		* @type {import("../proj/Projection.js").default}
		*/
		this.dataProjection = get(options.dataProjection ? options.dataProjection : "EPSG:4326");
		if (options.featureProjection)
 /**
		* @type {import("../proj/Projection.js").default}
		*/
		this.defaultFeatureProjection = get(options.featureProjection);
		if (options.featureClass) this.featureClass = options.featureClass;
		/**
		* Name of the geometry attribute for features.
		* @type {string|undefined}
		* @private
		*/
		this.geometryName_ = options.geometryName;
		/**
		* Look for the `geometry_name` in the feature GeoJSON
		* @type {boolean|undefined}
		* @private
		*/
		this.extractGeometryName_ = options.extractGeometryName;
		this.supportedMediaTypes = ["application/geo+json", "application/vnd.geo+json"];
	}
	/**
	* @param {Object} object Object.
	* @param {import("./Feature.js").ReadOptions} [options] Read options.
	* @protected
	* @return {FeatureType|Array<FeatureType>} Feature.
	* @override
	*/
	readFeatureFromObject(object, options) {
		/**
		* @type {GeoJSONFeature}
		*/
		let geoJSONFeature = null;
		if (object["type"] === "Feature") geoJSONFeature = object;
		else geoJSONFeature = {
			"type": "Feature",
			"geometry": object,
			"properties": null
		};
		const geometry = readGeometryInternal(geoJSONFeature["geometry"], options);
		if (this.featureClass === RenderFeature) return createRenderFeature({
			geometry,
			id: geoJSONFeature["id"],
			properties: geoJSONFeature["properties"]
		}, options);
		const feature = new Feature();
		if (this.geometryName_) feature.setGeometryName(this.geometryName_);
		else if (this.extractGeometryName_ && geoJSONFeature["geometry_name"]) feature.setGeometryName(geoJSONFeature["geometry_name"]);
		feature.setGeometry(createGeometry(geometry, options));
		if ("id" in geoJSONFeature) feature.setId(geoJSONFeature["id"]);
		if (geoJSONFeature["properties"]) feature.setProperties(geoJSONFeature["properties"], true);
		return feature;
	}
	/**
	* @param {Object} object Object.
	* @param {import("./Feature.js").ReadOptions} [options] Read options.
	* @protected
	* @return {Array<FeatureType>} Features.
	* @override
	*/
	readFeaturesFromObject(object, options) {
		const geoJSONObject = object;
		let features = null;
		if (geoJSONObject["type"] === "FeatureCollection") {
			const geoJSONFeatureCollection = object;
			features = [];
			const geoJSONFeatures = geoJSONFeatureCollection["features"];
			for (let i = 0, ii = geoJSONFeatures.length; i < ii; ++i) {
				const featureObject = this.readFeatureFromObject(geoJSONFeatures[i], options);
				if (!featureObject) continue;
				features.push(featureObject);
			}
		} else features = [this.readFeatureFromObject(object, options)];
		return features.flat();
	}
	/**
	* @param {GeoJSONGeometry} object Object.
	* @param {import("./Feature.js").ReadOptions} [options] Read options.
	* @protected
	* @return {import("../geom/Geometry.js").default} Geometry.
	* @override
	*/
	readGeometryFromObject(object, options) {
		return readGeometry(object, options);
	}
	/**
	* @param {Object} object Object.
	* @protected
	* @return {import("../proj/Projection.js").default} Projection.
	* @override
	*/
	readProjectionFromObject(object) {
		const crs = object["crs"];
		let projection;
		if (crs) if (crs["type"] == "name") projection = get(crs["properties"]["name"]);
		else if (crs["type"] === "EPSG") projection = get("EPSG:" + crs["properties"]["code"]);
		else throw new Error("Unknown SRS type");
		else projection = this.dataProjection;
		return projection;
	}
	/**
	* Encode a feature as a GeoJSON Feature object.
	*
	* @param {import("../Feature.js").default} feature Feature.
	* @param {import("./Feature.js").WriteOptions} [options] Write options.
	* @return {GeoJSONFeature} Object.
	* @api
	* @override
	*/
	writeFeatureObject(feature, options) {
		options = this.adaptOptions(options);
		/** @type {GeoJSONFeature} */
		const object = {
			"type": "Feature",
			geometry: null,
			properties: null
		};
		const id = feature.getId();
		if (id !== void 0) object.id = id;
		if (!feature.hasProperties()) return object;
		const properties = feature.getProperties();
		const geometry = feature.getGeometry();
		if (geometry) {
			object.geometry = writeGeometry(geometry, options);
			delete properties[feature.getGeometryName()];
		}
		if (!isEmpty(properties)) object.properties = properties;
		return object;
	}
	/**
	* Encode an array of features as a GeoJSON object.
	*
	* @param {Array<import("../Feature.js").default>} features Features.
	* @param {import("./Feature.js").WriteOptions} [options] Write options.
	* @return {GeoJSONFeatureCollection} GeoJSON Object.
	* @api
	* @override
	*/
	writeFeaturesObject(features, options) {
		options = this.adaptOptions(options);
		const objects = [];
		for (let i = 0, ii = features.length; i < ii; ++i) objects.push(this.writeFeatureObject(features[i], options));
		return {
			type: "FeatureCollection",
			features: objects
		};
	}
	/**
	* Encode a geometry as a GeoJSON object.
	*
	* @param {import("../geom/Geometry.js").default} geometry Geometry.
	* @param {import("./Feature.js").WriteOptions} [options] Write options.
	* @return {GeoJSONGeometry|GeoJSONGeometryCollection} Object.
	* @api
	* @override
	*/
	writeGeometryObject(geometry, options) {
		return writeGeometry(geometry, this.adaptOptions(options));
	}
};
/**
* @param {GeoJSONGeometry|GeoJSONGeometryCollection} object Object.
* @param {import("./Feature.js").ReadOptions} [options] Read options.
* @return {import("./Feature.js").GeometryObject} Geometry.
*/
function readGeometryInternal(object, options) {
	if (!object) return null;
	/** @type {import("./Feature.js").GeometryObject} */
	let geometry;
	switch (object["type"]) {
		case "Point":
			geometry = readPointGeometry(object);
			break;
		case "LineString":
			geometry = readLineStringGeometry(object);
			break;
		case "Polygon":
			geometry = readPolygonGeometry(object);
			break;
		case "MultiPoint":
			geometry = readMultiPointGeometry(object);
			break;
		case "MultiLineString":
			geometry = readMultiLineStringGeometry(object);
			break;
		case "MultiPolygon":
			geometry = readMultiPolygonGeometry(object);
			break;
		case "GeometryCollection":
			geometry = readGeometryCollectionGeometry(object);
			break;
		default: throw new Error("Unsupported GeoJSON type: " + object["type"]);
	}
	return geometry;
}
/**
* @param {GeoJSONGeometry|GeoJSONGeometryCollection} object Object.
* @param {import("./Feature.js").ReadOptions} [options] Read options.
* @return {import("../geom/Geometry.js").default} Geometry.
*/
function readGeometry(object, options) {
	return createGeometry(readGeometryInternal(object, options), options);
}
/**
* @param {GeoJSONGeometryCollection} object Object.
* @param {import("./Feature.js").ReadOptions} [options] Read options.
* @return {import("./Feature.js").GeometryCollectionObject} Geometry collection.
*/
function readGeometryCollectionGeometry(object, options) {
	return object["geometries"].map(
		/**
		* @param {GeoJSONGeometry} geometry Geometry.
		* @return {import("./Feature.js").GeometryObject} geometry Geometry.
		*/
		function(geometry) {
			return readGeometryInternal(geometry, options);
		}
	);
}
/**
* @param {GeoJSONPoint} object Input object.
* @return {import("./Feature.js").GeometryObject} Point geometry.
*/
function readPointGeometry(object) {
	const flatCoordinates = object["coordinates"];
	return {
		type: "Point",
		flatCoordinates,
		layout: getLayoutForStride(flatCoordinates.length)
	};
}
/**
* @param {GeoJSONLineString} object Object.
* @return {import("./Feature.js").GeometryObject} LineString geometry.
*/
function readLineStringGeometry(object) {
	const coordinates = object["coordinates"];
	const flatCoordinates = coordinates.flat();
	return {
		type: "LineString",
		flatCoordinates,
		ends: [flatCoordinates.length],
		layout: getLayoutForStride(coordinates[0]?.length || 2)
	};
}
/**
* @param {GeoJSONMultiLineString} object Object.
* @return {import("./Feature.js").GeometryObject} MultiLineString geometry.
*/
function readMultiLineStringGeometry(object) {
	const coordinates = object["coordinates"];
	const stride = coordinates[0]?.[0]?.length || 2;
	const flatCoordinates = [];
	return {
		type: "MultiLineString",
		flatCoordinates,
		ends: deflateCoordinatesArray(flatCoordinates, 0, coordinates, stride),
		layout: getLayoutForStride(stride)
	};
}
/**
* @param {GeoJSONMultiPoint} object Object.
* @return {import("./Feature.js").GeometryObject} MultiPoint geometry.
*/
function readMultiPointGeometry(object) {
	const coordinates = object["coordinates"];
	return {
		type: "MultiPoint",
		flatCoordinates: coordinates.flat(),
		layout: getLayoutForStride(coordinates[0]?.length || 2)
	};
}
/**
* @param {GeoJSONMultiPolygon} object Object.
* @return {import("./Feature.js").GeometryObject} MultiPolygon geometry.
*/
function readMultiPolygonGeometry(object) {
	const coordinates = object["coordinates"];
	const flatCoordinates = [];
	const stride = coordinates[0]?.[0]?.[0].length || 2;
	return {
		type: "MultiPolygon",
		flatCoordinates,
		ends: deflateMultiCoordinatesArray(flatCoordinates, 0, coordinates, stride),
		layout: getLayoutForStride(stride)
	};
}
/**
* @param {GeoJSONPolygon} object Object.
* @return {import("./Feature.js").GeometryObject} Polygon.
*/
function readPolygonGeometry(object) {
	const coordinates = object["coordinates"];
	const flatCoordinates = [];
	const stride = coordinates[0]?.[0]?.length;
	return {
		type: "Polygon",
		flatCoordinates,
		ends: deflateCoordinatesArray(flatCoordinates, 0, coordinates, stride),
		layout: getLayoutForStride(stride)
	};
}
/**
* @param {import("../geom/Geometry.js").default} geometry Geometry.
* @param {import("./Feature.js").WriteOptions} [options] Write options.
* @return {GeoJSONGeometry} GeoJSON geometry.
*/
function writeGeometry(geometry, options) {
	geometry = transformGeometryWithOptions(geometry, true, options);
	const type = geometry.getType();
	/** @type {GeoJSONGeometry} */
	let geoJSON;
	switch (type) {
		case "Point":
			geoJSON = writePointGeometry(geometry, options);
			break;
		case "LineString":
			geoJSON = writeLineStringGeometry(geometry, options);
			break;
		case "Polygon":
			geoJSON = writePolygonGeometry(geometry, options);
			break;
		case "MultiPoint":
			geoJSON = writeMultiPointGeometry(geometry, options);
			break;
		case "MultiLineString":
			geoJSON = writeMultiLineStringGeometry(geometry, options);
			break;
		case "MultiPolygon":
			geoJSON = writeMultiPolygonGeometry(geometry, options);
			break;
		case "GeometryCollection":
			geoJSON = writeGeometryCollectionGeometry(geometry, options);
			break;
		case "Circle":
			geoJSON = {
				type: "GeometryCollection",
				geometries: []
			};
			break;
		default: throw new Error("Unsupported geometry type: " + type);
	}
	return geoJSON;
}
/**
* @param {import("../geom/GeometryCollection.js").default} geometry Geometry.
* @param {import("./Feature.js").WriteOptions} [options] Write options.
* @return {GeoJSONGeometryCollection} GeoJSON geometry collection.
*/
function writeGeometryCollectionGeometry(geometry, options) {
	options = Object.assign({}, options);
	delete options.featureProjection;
	return {
		type: "GeometryCollection",
		geometries: geometry.getGeometriesArray().map(function(geometry) {
			return writeGeometry(geometry, options);
		})
	};
}
/**
* @param {import("../geom/LineString.js").default} geometry Geometry.
* @param {import("./Feature.js").WriteOptions} [options] Write options.
* @return {GeoJSONGeometry} GeoJSON geometry.
*/
function writeLineStringGeometry(geometry, options) {
	return {
		type: "LineString",
		coordinates: geometry.getCoordinates()
	};
}
/**
* @param {import("../geom/MultiLineString.js").default} geometry Geometry.
* @param {import("./Feature.js").WriteOptions} [options] Write options.
* @return {GeoJSONGeometry} GeoJSON geometry.
*/
function writeMultiLineStringGeometry(geometry, options) {
	return {
		type: "MultiLineString",
		coordinates: geometry.getCoordinates()
	};
}
/**
* @param {import("../geom/MultiPoint.js").default} geometry Geometry.
* @param {import("./Feature.js").WriteOptions} [options] Write options.
* @return {GeoJSONGeometry} GeoJSON geometry.
*/
function writeMultiPointGeometry(geometry, options) {
	return {
		type: "MultiPoint",
		coordinates: geometry.getCoordinates()
	};
}
/**
* @param {import("../geom/MultiPolygon.js").default} geometry Geometry.
* @param {import("./Feature.js").WriteOptions} [options] Write options.
* @return {GeoJSONGeometry} GeoJSON geometry.
*/
function writeMultiPolygonGeometry(geometry, options) {
	let right;
	if (options) right = options.rightHanded;
	return {
		type: "MultiPolygon",
		coordinates: geometry.getCoordinates(right)
	};
}
/**
* @param {import("../geom/Point.js").default} geometry Geometry.
* @param {import("./Feature.js").WriteOptions} [options] Write options.
* @return {GeoJSONGeometry} GeoJSON geometry.
*/
function writePointGeometry(geometry, options) {
	return {
		type: "Point",
		coordinates: geometry.getCoordinates()
	};
}
/**
* @param {import("../geom/Polygon.js").default} geometry Geometry.
* @param {import("./Feature.js").WriteOptions} [options] Write options.
* @return {GeoJSONGeometry} GeoJSON geometry.
*/
function writePolygonGeometry(geometry, options) {
	let right;
	if (options) right = options.rightHanded;
	return {
		type: "Polygon",
		coordinates: geometry.getCoordinates(right)
	};
}
//#endregion
export { GeoJSON as default };

//# sourceMappingURL=ol_format_GeoJSON__js.js.map
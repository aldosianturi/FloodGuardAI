import { H as intersects, S as extendFlatCoordinates, U as intersectsSegment, d as createEmpty } from "./extent-Ct519ZT-.js";
import { n as linearRingContainsXY, t as linearRingContainsExtent } from "./contains-DqIevFtL.js";
//#region node_modules/ol/geom/flat/segments.js
/**
* @module ol/geom/flat/segments
*/
/**
* This function calls `callback` for each segment of the flat coordinates
* array. If the callback returns a truthy value the function returns that
* value immediately. Otherwise the function returns `false`.
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
* @param {function(import("../../coordinate.js").Coordinate, import("../../coordinate.js").Coordinate): T} callback Function
*     called for each segment.
* @return {T|boolean} Value.
* @template T
*/
function forEach(flatCoordinates, offset, end, stride, callback) {
	let ret;
	offset += stride;
	for (; offset < end; offset += stride) {
		ret = callback(flatCoordinates.slice(offset - stride, offset), flatCoordinates.slice(offset, offset + stride));
		if (ret) return ret;
	}
	return false;
}
//#endregion
//#region node_modules/ol/geom/flat/intersectsextent.js
/**
* @module ol/geom/flat/intersectsextent
*/
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
* @param {import("../../extent.js").Extent} extent Extent.
* @param {import('../../extent.js').Extent} [coordinatesExtent] Coordinates extent
* @return {boolean} True if the geometry and the extent intersect.
*/
function intersectsLineString(flatCoordinates, offset, end, stride, extent, coordinatesExtent) {
	coordinatesExtent = coordinatesExtent ?? extendFlatCoordinates(createEmpty(), flatCoordinates, offset, end, stride);
	if (!intersects(extent, coordinatesExtent)) return false;
	if (coordinatesExtent[0] >= extent[0] && coordinatesExtent[2] <= extent[2] || coordinatesExtent[1] >= extent[1] && coordinatesExtent[3] <= extent[3]) return true;
	return forEach(
		flatCoordinates,
		offset,
		end,
		stride,
		/**
		* @param {import("../../coordinate.js").Coordinate} point1 Start point.
		* @param {import("../../coordinate.js").Coordinate} point2 End point.
		* @return {boolean} `true` if the segment and the extent intersect,
		*     `false` otherwise.
		*/
		function(point1, point2) {
			return intersectsSegment(extent, point1, point2);
		}
	);
}
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<number>} ends Ends.
* @param {number} stride Stride.
* @param {import("../../extent.js").Extent} extent Extent.
* @return {boolean} True if the geometry and the extent intersect.
*/
function intersectsLineStringArray(flatCoordinates, offset, ends, stride, extent) {
	for (let i = 0, ii = ends.length; i < ii; ++i) {
		if (intersectsLineString(flatCoordinates, offset, ends[i], stride, extent)) return true;
		offset = ends[i];
	}
	return false;
}
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
* @param {import("../../extent.js").Extent} extent Extent.
* @return {boolean} True if the geometry and the extent intersect.
*/
function intersectsLinearRing(flatCoordinates, offset, end, stride, extent) {
	if (intersectsLineString(flatCoordinates, offset, end, stride, extent)) return true;
	if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[0], extent[1])) return true;
	if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[0], extent[3])) return true;
	if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[2], extent[1])) return true;
	if (linearRingContainsXY(flatCoordinates, offset, end, stride, extent[2], extent[3])) return true;
	return false;
}
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<number>} ends Ends.
* @param {number} stride Stride.
* @param {import("../../extent.js").Extent} extent Extent.
* @return {boolean} True if the geometry and the extent intersect.
*/
function intersectsLinearRingArray(flatCoordinates, offset, ends, stride, extent) {
	if (!intersectsLinearRing(flatCoordinates, offset, ends[0], stride, extent)) return false;
	if (ends.length === 1) return true;
	for (let i = 1, ii = ends.length; i < ii; ++i) if (linearRingContainsExtent(flatCoordinates, ends[i - 1], ends[i], stride, extent)) {
		if (!intersectsLineString(flatCoordinates, ends[i - 1], ends[i], stride, extent)) return false;
	}
	return true;
}
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<Array<number>>} endss Endss.
* @param {number} stride Stride.
* @param {import("../../extent.js").Extent} extent Extent.
* @return {boolean} True if the geometry and the extent intersect.
*/
function intersectsLinearRingMultiArray(flatCoordinates, offset, endss, stride, extent) {
	for (let i = 0, ii = endss.length; i < ii; ++i) {
		const ends = endss[i];
		if (intersectsLinearRingArray(flatCoordinates, offset, ends, stride, extent)) return true;
		offset = ends[ends.length - 1];
	}
	return false;
}
//#endregion
export { intersectsLinearRingMultiArray as a, intersectsLinearRingArray as i, intersectsLineStringArray as n, forEach as o, intersectsLinearRing as r, intersectsLineString as t };

//# sourceMappingURL=intersectsextent-Bf7POWne.js.map
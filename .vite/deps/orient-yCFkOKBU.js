import { _ as ascending } from "./Object-DCW2lR92.js";
import { l as squaredSegmentDistance } from "./math-BWMiNrVo.js";
import { r as linearRingsContainsXY } from "./contains-DqIevFtL.js";
//#region node_modules/ol/geom/flat/transform.js
/**
* @module ol/geom/flat/transform
*/
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
* @param {import("../../transform.js").Transform} transform Transform.
* @param {Array<number>} [dest] Destination.
* @param {number} [destinationStride] Stride of destination coordinates; if unspecified, assumed to be 2.
* @return {Array<number>} Transformed coordinates.
*/
function transform2D(flatCoordinates, offset, end, stride, transform, dest, destinationStride) {
	dest = dest ? dest : [];
	destinationStride = destinationStride ? destinationStride : 2;
	let i = 0;
	for (let j = offset; j < end; j += stride) {
		const x = flatCoordinates[j];
		const y = flatCoordinates[j + 1];
		dest[i++] = transform[0] * x + transform[2] * y + transform[4];
		dest[i++] = transform[1] * x + transform[3] * y + transform[5];
		for (let k = 2; k < destinationStride; k++) dest[i++] = flatCoordinates[j + k];
	}
	if (dest && dest.length != i) dest.length = i;
	return dest;
}
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
* @param {number} angle Angle.
* @param {Array<number>} anchor Rotation anchor point.
* @param {Array<number>} [dest] Destination.
* @return {Array<number>} Transformed coordinates.
*/
function rotate(flatCoordinates, offset, end, stride, angle, anchor, dest) {
	dest = dest ? dest : [];
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const anchorX = anchor[0];
	const anchorY = anchor[1];
	let i = 0;
	for (let j = offset; j < end; j += stride) {
		const deltaX = flatCoordinates[j] - anchorX;
		const deltaY = flatCoordinates[j + 1] - anchorY;
		dest[i++] = anchorX + deltaX * cos - deltaY * sin;
		dest[i++] = anchorY + deltaX * sin + deltaY * cos;
		for (let k = j + 2; k < j + stride; ++k) dest[i++] = flatCoordinates[k];
	}
	if (dest && dest.length != i) dest.length = i;
	return dest;
}
/**
* Scale the coordinates.
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
* @param {number} sx Scale factor in the x-direction.
* @param {number} sy Scale factor in the y-direction.
* @param {Array<number>} anchor Scale anchor point.
* @param {Array<number>} [dest] Destination.
* @return {Array<number>} Transformed coordinates.
*/
function scale(flatCoordinates, offset, end, stride, sx, sy, anchor, dest) {
	dest = dest ? dest : [];
	const anchorX = anchor[0];
	const anchorY = anchor[1];
	let i = 0;
	for (let j = offset; j < end; j += stride) {
		const deltaX = flatCoordinates[j] - anchorX;
		const deltaY = flatCoordinates[j + 1] - anchorY;
		dest[i++] = anchorX + sx * deltaX;
		dest[i++] = anchorY + sy * deltaY;
		for (let k = j + 2; k < j + stride; ++k) dest[i++] = flatCoordinates[k];
	}
	if (dest && dest.length != i) dest.length = i;
	return dest;
}
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
* @param {number} deltaX Delta X.
* @param {number} deltaY Delta Y.
* @param {Array<number>} [dest] Destination.
* @return {Array<number>} Transformed coordinates.
*/
function translate(flatCoordinates, offset, end, stride, deltaX, deltaY, dest) {
	dest = dest ? dest : [];
	let i = 0;
	for (let j = offset; j < end; j += stride) {
		dest[i++] = flatCoordinates[j] + deltaX;
		dest[i++] = flatCoordinates[j + 1] + deltaY;
		for (let k = j + 2; k < j + stride; ++k) dest[i++] = flatCoordinates[k];
	}
	if (dest && dest.length != i) dest.length = i;
	return dest;
}
//#endregion
//#region node_modules/ol/geom/flat/simplify.js
/**
* @module ol/geom/flat/simplify
*/
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
* @param {number} squaredTolerance Squared tolerance.
* @param {Array<number>} simplifiedFlatCoordinates Simplified flat
*     coordinates.
* @param {number} simplifiedOffset Simplified offset.
* @return {number} Simplified offset.
*/
function douglasPeucker(flatCoordinates, offset, end, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
	const n = (end - offset) / stride;
	if (n < 3) {
		for (; offset < end; offset += stride) {
			simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset];
			simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset + 1];
		}
		return simplifiedOffset;
	}
	/** @type {Array<number>} */
	const markers = new Array(n);
	markers[0] = 1;
	markers[n - 1] = 1;
	/** @type {Array<number>} */
	const stack = [offset, end - stride];
	let index = 0;
	while (stack.length > 0) {
		const last = stack.pop();
		const first = stack.pop();
		let maxSquaredDistance = 0;
		const x1 = flatCoordinates[first];
		const y1 = flatCoordinates[first + 1];
		const x2 = flatCoordinates[last];
		const y2 = flatCoordinates[last + 1];
		for (let i = first + stride; i < last; i += stride) {
			const x = flatCoordinates[i];
			const y = flatCoordinates[i + 1];
			const squaredDistance = squaredSegmentDistance(x, y, x1, y1, x2, y2);
			if (squaredDistance > maxSquaredDistance) {
				index = i;
				maxSquaredDistance = squaredDistance;
			}
		}
		if (maxSquaredDistance > squaredTolerance) {
			markers[(index - offset) / stride] = 1;
			if (first + stride < index) stack.push(first, index);
			if (index + stride < last) stack.push(index, last);
		}
	}
	for (let i = 0; i < n; ++i) if (markers[i]) {
		simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset + i * stride];
		simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset + i * stride + 1];
	}
	return simplifiedOffset;
}
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<number>} ends Ends.
* @param {number} stride Stride.
* @param {number} squaredTolerance Squared tolerance.
* @param {Array<number>} simplifiedFlatCoordinates Simplified flat
*     coordinates.
* @param {number} simplifiedOffset Simplified offset.
* @param {Array<number>} simplifiedEnds Simplified ends.
* @return {number} Simplified offset.
*/
function douglasPeuckerArray(flatCoordinates, offset, ends, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds) {
	for (let i = 0, ii = ends.length; i < ii; ++i) {
		const end = ends[i];
		simplifiedOffset = douglasPeucker(flatCoordinates, offset, end, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset);
		simplifiedEnds.push(simplifiedOffset);
		offset = end;
	}
	return simplifiedOffset;
}
/**
* @param {number} value Value.
* @param {number} tolerance Tolerance.
* @return {number} Rounded value.
*/
function snap(value, tolerance) {
	return tolerance * Math.round(value / tolerance);
}
/**
* Simplifies a line string using an algorithm designed by Tim Schaub.
* Coordinates are snapped to the nearest value in a virtual grid and
* consecutive duplicate coordinates are discarded.  This effectively preserves
* topology as the simplification of any subsection of a line string is
* independent of the rest of the line string.  This means that, for examples,
* the common edge between two polygons will be simplified to the same line
* string independently in both polygons.  This implementation uses a single
* pass over the coordinates and eliminates intermediate collinear points.
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
* @param {number} tolerance Tolerance.
* @param {Array<number>} simplifiedFlatCoordinates Simplified flat
*     coordinates.
* @param {number} simplifiedOffset Simplified offset.
* @return {number} Simplified offset.
*/
function quantize(flatCoordinates, offset, end, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset) {
	if (offset == end) return simplifiedOffset;
	let x1 = snap(flatCoordinates[offset], tolerance);
	let y1 = snap(flatCoordinates[offset + 1], tolerance);
	offset += stride;
	simplifiedFlatCoordinates[simplifiedOffset++] = x1;
	simplifiedFlatCoordinates[simplifiedOffset++] = y1;
	let x2, y2;
	do {
		x2 = snap(flatCoordinates[offset], tolerance);
		y2 = snap(flatCoordinates[offset + 1], tolerance);
		offset += stride;
		if (offset == end) {
			simplifiedFlatCoordinates[simplifiedOffset++] = x2;
			simplifiedFlatCoordinates[simplifiedOffset++] = y2;
			return simplifiedOffset;
		}
	} while (x2 == x1 && y2 == y1);
	while (offset < end) {
		const x3 = snap(flatCoordinates[offset], tolerance);
		const y3 = snap(flatCoordinates[offset + 1], tolerance);
		offset += stride;
		if (x3 == x2 && y3 == y2) continue;
		const dx1 = x2 - x1;
		const dy1 = y2 - y1;
		const dx2 = x3 - x1;
		const dy2 = y3 - y1;
		if (dx1 * dy2 == dy1 * dx2 && (dx1 < 0 && dx2 < dx1 || dx1 == dx2 || dx1 > 0 && dx2 > dx1) && (dy1 < 0 && dy2 < dy1 || dy1 == dy2 || dy1 > 0 && dy2 > dy1)) {
			x2 = x3;
			y2 = y3;
			continue;
		}
		simplifiedFlatCoordinates[simplifiedOffset++] = x2;
		simplifiedFlatCoordinates[simplifiedOffset++] = y2;
		x1 = x2;
		y1 = y2;
		x2 = x3;
		y2 = y3;
	}
	simplifiedFlatCoordinates[simplifiedOffset++] = x2;
	simplifiedFlatCoordinates[simplifiedOffset++] = y2;
	return simplifiedOffset;
}
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<number>} ends Ends.
* @param {number} stride Stride.
* @param {number} tolerance Tolerance.
* @param {Array<number>} simplifiedFlatCoordinates Simplified flat
*     coordinates.
* @param {number} simplifiedOffset Simplified offset.
* @param {Array<number>} simplifiedEnds Simplified ends.
* @return {number} Simplified offset.
*/
function quantizeArray(flatCoordinates, offset, ends, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds) {
	for (let i = 0, ii = ends.length; i < ii; ++i) {
		const end = ends[i];
		simplifiedOffset = quantize(flatCoordinates, offset, end, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset);
		simplifiedEnds.push(simplifiedOffset);
		offset = end;
	}
	return simplifiedOffset;
}
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<Array<number>>} endss Endss.
* @param {number} stride Stride.
* @param {number} tolerance Tolerance.
* @param {Array<number>} simplifiedFlatCoordinates Simplified flat
*     coordinates.
* @param {number} simplifiedOffset Simplified offset.
* @param {Array<Array<number>>} simplifiedEndss Simplified endss.
* @return {number} Simplified offset.
*/
function quantizeMultiArray(flatCoordinates, offset, endss, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEndss) {
	for (let i = 0, ii = endss.length; i < ii; ++i) {
		const ends = endss[i];
		/** @type {Array<number>} */
		const simplifiedEnds = [];
		simplifiedOffset = quantizeArray(flatCoordinates, offset, ends, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds);
		simplifiedEndss.push(simplifiedEnds);
		offset = ends[ends.length - 1];
	}
	return simplifiedOffset;
}
//#endregion
//#region node_modules/ol/geom/flat/interiorpoint.js
/**
* @module ol/geom/flat/interiorpoint
*/
/**
* Calculates a point that is likely to lie in the interior of the linear rings.
* Inspired by JTS's com.vividsolutions.jts.geom.Geometry#getInteriorPoint.
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<number>} ends Ends.
* @param {number} stride Stride.
* @param {Array<number>} flatCenters Flat centers.
* @param {number} flatCentersOffset Flat center offset.
* @param {Array<number>} [dest] Destination.
* @return {Array<number>} Destination point as XYM coordinate, where M is the
* length of the horizontal intersection that the point belongs to.
*/
function getInteriorPointOfArray(flatCoordinates, offset, ends, stride, flatCenters, flatCentersOffset, dest) {
	let i, ii, x, x1, x2, y1, y2;
	const y = flatCenters[flatCentersOffset + 1];
	/** @type {Array<number>} */
	const intersections = [];
	for (let r = 0, rr = ends.length; r < rr; ++r) {
		const end = ends[r];
		x1 = flatCoordinates[end - stride];
		y1 = flatCoordinates[end - stride + 1];
		for (i = offset; i < end; i += stride) {
			x2 = flatCoordinates[i];
			y2 = flatCoordinates[i + 1];
			if (y <= y1 && y2 <= y || y1 <= y && y <= y2) {
				x = (y - y1) / (y2 - y1) * (x2 - x1) + x1;
				intersections.push(x);
			}
			x1 = x2;
			y1 = y2;
		}
	}
	let pointX = NaN;
	let maxSegmentLength = -Infinity;
	intersections.sort(ascending);
	x1 = intersections[0];
	for (i = 1, ii = intersections.length; i < ii; ++i) {
		x2 = intersections[i];
		const segmentLength = Math.abs(x2 - x1);
		if (segmentLength > maxSegmentLength) {
			x = (x1 + x2) / 2;
			if (linearRingsContainsXY(flatCoordinates, offset, ends, stride, x, y)) {
				pointX = x;
				maxSegmentLength = segmentLength;
			}
		}
		x1 = x2;
	}
	if (isNaN(pointX)) pointX = flatCenters[flatCentersOffset];
	if (dest) {
		dest.push(pointX, y, maxSegmentLength);
		return dest;
	}
	return [
		pointX,
		y,
		maxSegmentLength
	];
}
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<Array<number>>} endss Endss.
* @param {number} stride Stride.
* @param {Array<number>} flatCenters Flat centers.
* @return {Array<number>} Interior points as XYM coordinates, where M is the
* length of the horizontal intersection that the point belongs to.
*/
function getInteriorPointsOfMultiArray(flatCoordinates, offset, endss, stride, flatCenters) {
	/** @type {Array<number>} */
	let interiorPoints = [];
	for (let i = 0, ii = endss.length; i < ii; ++i) {
		const ends = endss[i];
		interiorPoints = getInteriorPointOfArray(flatCoordinates, offset, ends, stride, flatCenters, 2 * i, interiorPoints);
		offset = ends[ends.length - 1];
	}
	return interiorPoints;
}
//#endregion
//#region node_modules/ol/geom/flat/reverse.js
/**
* @module ol/geom/flat/reverse
*/
/**
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
*/
function coordinates(flatCoordinates, offset, end, stride) {
	while (offset < end - stride) {
		for (let i = 0; i < stride; ++i) {
			const tmp = flatCoordinates[offset + i];
			flatCoordinates[offset + i] = flatCoordinates[end - stride + i];
			flatCoordinates[end - stride + i] = tmp;
		}
		offset += stride;
		end -= stride;
	}
}
//#endregion
//#region node_modules/ol/geom/flat/orient.js
/**
* @module ol/geom/flat/orient
*/
/**
* Is the linear ring oriented clockwise in a coordinate system with a bottom-left
* coordinate origin? For a coordinate system with a top-left coordinate origin,
* the ring's orientation is clockwise when this function returns false.
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {number} end End.
* @param {number} stride Stride.
* @return {boolean|undefined} Is clockwise.
*/
function linearRingIsClockwise(flatCoordinates, offset, end, stride) {
	let edge = 0;
	let x1 = flatCoordinates[end - stride];
	let y1 = flatCoordinates[end - stride + 1];
	for (; offset < end; offset += stride) {
		const x2 = flatCoordinates[offset];
		const y2 = flatCoordinates[offset + 1];
		edge += (x2 - x1) * (y2 + y1);
		x1 = x2;
		y1 = y2;
	}
	return edge === 0 ? void 0 : edge > 0;
}
/**
* Determines if linear rings are oriented.  By default, left-hand orientation
* is tested (first ring must be clockwise, remaining rings counter-clockwise).
* To test for right-hand orientation, use the `right` argument.
*
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<number>} ends Array of end indexes.
* @param {number} stride Stride.
* @param {boolean} [right] Test for right-hand orientation
*     (counter-clockwise exterior ring and clockwise interior rings).
* @return {boolean} Rings are correctly oriented.
*/
function linearRingsAreOriented(flatCoordinates, offset, ends, stride, right) {
	right = right !== void 0 ? right : false;
	for (let i = 0, ii = ends.length; i < ii; ++i) {
		const end = ends[i];
		const isClockwise = linearRingIsClockwise(flatCoordinates, offset, end, stride);
		if (i === 0) {
			if (right && isClockwise || !right && !isClockwise) return false;
		} else if (right && !isClockwise || !right && isClockwise) return false;
		offset = end;
	}
	return true;
}
/**
* Determines if linear rings are oriented.  By default, left-hand orientation
* is tested (first ring must be clockwise, remaining rings counter-clockwise).
* To test for right-hand orientation, use the `right` argument.
*
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<Array<number>>} endss Array of array of end indexes.
* @param {number} stride Stride.
* @param {boolean} [right] Test for right-hand orientation
*     (counter-clockwise exterior ring and clockwise interior rings).
* @return {boolean} Rings are correctly oriented.
*/
function linearRingssAreOriented(flatCoordinates, offset, endss, stride, right) {
	for (let i = 0, ii = endss.length; i < ii; ++i) {
		const ends = endss[i];
		if (!linearRingsAreOriented(flatCoordinates, offset, ends, stride, right)) return false;
		if (ends.length) offset = ends[ends.length - 1];
	}
	return true;
}
/**
* Orient coordinates in a flat array of linear rings.  By default, rings
* are oriented following the left-hand rule (clockwise for exterior and
* counter-clockwise for interior rings).  To orient according to the
* right-hand rule, use the `right` argument.
*
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<number>} ends Ends.
* @param {number} stride Stride.
* @param {boolean} [right] Follow the right-hand rule for orientation.
* @return {number} End.
*/
function orientLinearRings(flatCoordinates, offset, ends, stride, right) {
	right = right !== void 0 ? right : false;
	for (let i = 0, ii = ends.length; i < ii; ++i) {
		const end = ends[i];
		const isClockwise = linearRingIsClockwise(flatCoordinates, offset, end, stride);
		if (i === 0 ? right && isClockwise || !right && !isClockwise : right && !isClockwise || !right && isClockwise) coordinates(flatCoordinates, offset, end, stride);
		offset = end;
	}
	return offset;
}
/**
* Orient coordinates in a flat array of linear rings.  By default, rings
* are oriented following the left-hand rule (clockwise for exterior and
* counter-clockwise for interior rings).  To orient according to the
* right-hand rule, use the `right` argument.
*
* @param {Array<number>} flatCoordinates Flat coordinates.
* @param {number} offset Offset.
* @param {Array<Array<number>>} endss Array of array of end indexes.
* @param {number} stride Stride.
* @param {boolean} [right] Follow the right-hand rule for orientation.
* @return {number} End.
*/
function orientLinearRingsArray(flatCoordinates, offset, endss, stride, right) {
	for (let i = 0, ii = endss.length; i < ii; ++i) offset = orientLinearRings(flatCoordinates, offset, endss[i], stride, right);
	return offset;
}
/**
* Return a two-dimensional endss
* @param {Array<number>} flatCoordinates Flat coordinates
* @param {Array<number>} ends Linear ring end indexes
* @return {Array<Array<number>>} Two dimensional endss array that can
* be used to construct a MultiPolygon
*/
function inflateEnds(flatCoordinates, ends) {
	const endss = [];
	let offset = 0;
	let prevEndIndex = 0;
	let startOrientation;
	for (let i = 0, ii = ends.length; i < ii; ++i) {
		const end = ends[i];
		const orientation = linearRingIsClockwise(flatCoordinates, offset, end, 2);
		if (startOrientation === void 0) startOrientation = orientation;
		if (orientation === startOrientation) endss.push(ends.slice(prevEndIndex, i + 1));
		else {
			if (endss.length === 0) continue;
			endss[endss.length - 1].push(ends[prevEndIndex]);
		}
		prevEndIndex = i + 1;
		offset = end;
	}
	return endss;
}
//#endregion
export { orientLinearRingsArray as a, douglasPeucker as c, quantizeMultiArray as d, snap as f, translate as g, transform2D as h, orientLinearRings as i, douglasPeuckerArray as l, scale as m, linearRingsAreOriented as n, getInteriorPointOfArray as o, rotate as p, linearRingssAreOriented as r, getInteriorPointsOfMultiArray as s, inflateEnds as t, quantizeArray as u };

//# sourceMappingURL=orient-yCFkOKBU.js.map
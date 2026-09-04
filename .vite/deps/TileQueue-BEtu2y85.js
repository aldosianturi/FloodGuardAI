import { t as TileState_default } from "./TileState-CGIWeHVJ.js";
import { E as EventType_default } from "./Object-DCW2lR92.js";
import { t as clear } from "./obj-DsDkrhYV.js";
import { t as assert } from "./asserts-gRk-GPA6.js";
//#region node_modules/ol/structs/PriorityQueue.js
/**
* @module ol/structs/PriorityQueue
*/
/**
* @type {number}
*/
var DROP = Infinity;
/**
* @classdesc
* Priority queue.
*
* The implementation is inspired from the Closure Library's Heap class and
* Python's heapq module.
*
* See https://github.com/google/closure-library/blob/master/closure/goog/structs/heap.js
* and https://hg.python.org/cpython/file/2.7/Lib/heapq.py.
*
* @template T
*/
var PriorityQueue = class {
	/**
	* @param {function(T): number} priorityFunction Priority function.
	* @param {function(T): string} keyFunction Key function.
	*/
	constructor(priorityFunction, keyFunction) {
		/**
		* @type {function(T): number}
		* @private
		*/
		this.priorityFunction_ = priorityFunction;
		/**
		* @type {function(T): string}
		* @private
		*/
		this.keyFunction_ = keyFunction;
		/**
		* @type {Array<T>}
		* @private
		*/
		this.elements_ = [];
		/**
		* @type {Array<number>}
		* @private
		*/
		this.priorities_ = [];
		/**
		* @type {!Object<string, boolean>}
		* @private
		*/
		this.queuedElements_ = {};
	}
	/**
	* FIXME empty description for jsdoc
	*/
	clear() {
		this.elements_.length = 0;
		this.priorities_.length = 0;
		clear(this.queuedElements_);
	}
	/**
	* Remove and return the highest-priority element. O(log N).
	* @return {T} Element.
	*/
	dequeue() {
		const elements = this.elements_;
		const priorities = this.priorities_;
		const element = elements[0];
		if (elements.length == 1) {
			elements.length = 0;
			priorities.length = 0;
		} else {
			elements[0] = elements.pop();
			priorities[0] = priorities.pop();
			this.siftUp_(0);
		}
		const elementKey = this.keyFunction_(element);
		delete this.queuedElements_[elementKey];
		return element;
	}
	/**
	* Enqueue an element. O(log N).
	* @param {T} element Element.
	* @return {boolean} The element was added to the queue.
	*/
	enqueue(element) {
		assert(!(this.keyFunction_(element) in this.queuedElements_), "Tried to enqueue an `element` that was already added to the queue");
		const priority = this.priorityFunction_(element);
		if (priority != Infinity) {
			this.elements_.push(element);
			this.priorities_.push(priority);
			this.queuedElements_[this.keyFunction_(element)] = true;
			this.siftDown_(0, this.elements_.length - 1);
			return true;
		}
		return false;
	}
	/**
	* @return {number} Count.
	*/
	getCount() {
		return this.elements_.length;
	}
	/**
	* Gets the index of the left child of the node at the given index.
	* @param {number} index The index of the node to get the left child for.
	* @return {number} The index of the left child.
	* @private
	*/
	getLeftChildIndex_(index) {
		return index * 2 + 1;
	}
	/**
	* Gets the index of the right child of the node at the given index.
	* @param {number} index The index of the node to get the right child for.
	* @return {number} The index of the right child.
	* @private
	*/
	getRightChildIndex_(index) {
		return index * 2 + 2;
	}
	/**
	* Gets the index of the parent of the node at the given index.
	* @param {number} index The index of the node to get the parent for.
	* @return {number} The index of the parent.
	* @private
	*/
	getParentIndex_(index) {
		return index - 1 >> 1;
	}
	/**
	* Make this a heap. O(N).
	* @private
	*/
	heapify_() {
		let i;
		for (i = (this.elements_.length >> 1) - 1; i >= 0; i--) this.siftUp_(i);
	}
	/**
	* @return {boolean} Is empty.
	*/
	isEmpty() {
		return this.elements_.length === 0;
	}
	/**
	* @param {string} key Key.
	* @return {boolean} Is key queued.
	*/
	isKeyQueued(key) {
		return key in this.queuedElements_;
	}
	/**
	* @param {T} element Element.
	* @return {boolean} Is queued.
	*/
	isQueued(element) {
		return this.isKeyQueued(this.keyFunction_(element));
	}
	/**
	* @param {number} index The index of the node to move down.
	* @private
	*/
	siftUp_(index) {
		const elements = this.elements_;
		const priorities = this.priorities_;
		const count = elements.length;
		const element = elements[index];
		const priority = priorities[index];
		const startIndex = index;
		while (index < count >> 1) {
			const lIndex = this.getLeftChildIndex_(index);
			const rIndex = this.getRightChildIndex_(index);
			const smallerChildIndex = rIndex < count && priorities[rIndex] < priorities[lIndex] ? rIndex : lIndex;
			elements[index] = elements[smallerChildIndex];
			priorities[index] = priorities[smallerChildIndex];
			index = smallerChildIndex;
		}
		elements[index] = element;
		priorities[index] = priority;
		this.siftDown_(startIndex, index);
	}
	/**
	* @param {number} startIndex The index of the root.
	* @param {number} index The index of the node to move up.
	* @private
	*/
	siftDown_(startIndex, index) {
		const elements = this.elements_;
		const priorities = this.priorities_;
		const element = elements[index];
		const priority = priorities[index];
		while (index > startIndex) {
			const parentIndex = this.getParentIndex_(index);
			if (priorities[parentIndex] > priority) {
				elements[index] = elements[parentIndex];
				priorities[index] = priorities[parentIndex];
				index = parentIndex;
			} else break;
		}
		elements[index] = element;
		priorities[index] = priority;
	}
	/**
	* FIXME empty description for jsdoc
	*/
	reprioritize() {
		const priorityFunction = this.priorityFunction_;
		const elements = this.elements_;
		const priorities = this.priorities_;
		let index = 0;
		const n = elements.length;
		let element, i, priority;
		for (i = 0; i < n; ++i) {
			element = elements[i];
			priority = priorityFunction(element);
			if (priority == Infinity) delete this.queuedElements_[this.keyFunction_(element)];
			else {
				priorities[index] = priority;
				elements[index++] = element;
			}
		}
		elements.length = index;
		priorities.length = index;
		this.heapify_();
	}
};
//#endregion
//#region node_modules/ol/TileQueue.js
/**
* @module ol/TileQueue
*/
/**
* @typedef {function(import("./Tile.js").default, string, import('./tilecoord.js').TileCoord, number): number} PriorityFunction
*/
/**
* @typedef {[import('./Tile.js').default, string, import('./tilecoord.js').TileCoord, number]} TileQueueElement
*/
/**
* @extends PriorityQueue<TileQueueElement>}
*/
var TileQueue = class extends PriorityQueue {
	/**
	* @param {PriorityFunction} tilePriorityFunction Tile priority function.
	* @param {function(): ?} tileChangeCallback Function called on each tile change event.
	*/
	constructor(tilePriorityFunction, tileChangeCallback) {
		super((element) => tilePriorityFunction.apply(null, element), (element) => element[0].getKey());
		/** @private */
		this.boundHandleTileChange_ = this.handleTileChange.bind(this);
		/**
		* @private
		* @type {function(): ?}
		*/
		this.tileChangeCallback_ = tileChangeCallback;
		/**
		* @private
		* @type {number}
		*/
		this.tilesLoading_ = 0;
		/**
		* @private
		* @type {!Object<string,boolean>}
		*/
		this.tilesLoadingKeys_ = {};
	}
	/**
	* @param {TileQueueElement} element Element.
	* @return {boolean} The element was added to the queue.
	* @override
	*/
	enqueue(element) {
		const added = super.enqueue(element);
		if (added) element[0].addEventListener(EventType_default.CHANGE, this.boundHandleTileChange_);
		return added;
	}
	/**
	* @return {number} Number of tiles loading.
	*/
	getTilesLoading() {
		return this.tilesLoading_;
	}
	/**
	* @param {import("./events/Event.js").default} event Event.
	* @protected
	*/
	handleTileChange(event) {
		const tile = event.target;
		const state = tile.getState();
		if (state === TileState_default.LOADED || state === TileState_default.ERROR || state === TileState_default.EMPTY) {
			if (state !== TileState_default.ERROR) tile.removeEventListener(EventType_default.CHANGE, this.boundHandleTileChange_);
			const tileKey = tile.getKey();
			if (tileKey in this.tilesLoadingKeys_) {
				delete this.tilesLoadingKeys_[tileKey];
				--this.tilesLoading_;
			}
			this.tileChangeCallback_();
		}
	}
	/**
	* @param {number} maxTotalLoading Maximum number tiles to load simultaneously.
	* @param {number} maxNewLoads Maximum number of new tiles to load.
	*/
	loadMoreTiles(maxTotalLoading, maxNewLoads) {
		let newLoads = 0;
		while (this.tilesLoading_ < maxTotalLoading && newLoads < maxNewLoads && this.getCount() > 0) {
			const tile = this.dequeue()[0];
			const tileKey = tile.getKey();
			if (tile.getState() === TileState_default.IDLE && !(tileKey in this.tilesLoadingKeys_)) {
				this.tilesLoadingKeys_[tileKey] = true;
				++this.tilesLoading_;
				++newLoads;
				tile.load();
			}
		}
	}
};
/**
* @param {import('./Map.js').FrameState} frameState Frame state.
* @param {import("./Tile.js").default} tile Tile.
* @param {string} tileSourceKey Tile source key.
* @param {import("./coordinate.js").Coordinate} tileCenter Tile center.
* @param {number} tileResolution Tile resolution.
* @return {number} Tile priority.
*/
function getTilePriority(frameState, tile, tileSourceKey, tileCenter, tileResolution) {
	if (!frameState || !(tileSourceKey in frameState.wantedTiles)) return DROP;
	if (!frameState.wantedTiles[tileSourceKey][tile.getKey()]) return DROP;
	const center = frameState.viewState.center;
	const deltaX = tileCenter[0] - center[0];
	const deltaY = tileCenter[1] - center[1];
	return 65536 * Math.log(tileResolution) + Math.sqrt(deltaX * deltaX + deltaY * deltaY) / tileResolution;
}
//#endregion
export { getTilePriority as n, TileQueue as t };

//# sourceMappingURL=TileQueue-BEtu2y85.js.map
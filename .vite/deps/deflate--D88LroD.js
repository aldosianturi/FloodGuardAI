import { t as BaseDecoder } from "./basedecoder-Wq4kKObi.js";
import { t as inflate_1 } from "./pako.esm-DrgZqFsV.js";
//#region node_modules/geotiff/dist-module/compression/deflate.js
var DeflateDecoder = class extends BaseDecoder {
	decodeBlock(buffer) {
		return inflate_1(new Uint8Array(buffer)).buffer;
	}
};
//#endregion
export { DeflateDecoder as default };

//# sourceMappingURL=deflate--D88LroD.js.map
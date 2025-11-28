/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.135.1
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as u}from"./chunk-FPWBHWFX.js";import"./chunk-JRRMHJ6Q.js";import"./chunk-24CCT6MZ.js";import{a as f}from"./chunk-PA6L7PNH.js";import"./chunk-SZMHRX5Y.js";import"./chunk-AFVOLTM4.js";import"./chunk-2HS2RD4J.js";import"./chunk-SLCQLCIS.js";import"./chunk-KUIQ5QZM.js";import"./chunk-OJMLUVHY.js";import"./chunk-WUOXPQI3.js";import"./chunk-ABG5CBMX.js";import"./chunk-GTGLGYR5.js";import"./chunk-SHU5XLHO.js";import"./chunk-PJSIZFRN.js";import"./chunk-MSOAON3W.js";import"./chunk-SGT62F4G.js";import"./chunk-A4XPW3XT.js";import"./chunk-OPF4VTEO.js";import"./chunk-RVGYS7AK.js";import"./chunk-L6URUAFR.js";import"./chunk-B2IRVOVP.js";import"./chunk-B2SDQXYD.js";import"./chunk-ZSPEXXVJ.js";function a(c,d){return u.createMesh(c).then(function(e){let t=e.vertices.buffer,r=e.indices.buffer,s=e.westIndicesSouthToNorth.buffer,o=e.southIndicesEastToWest.buffer,i=e.eastIndicesNorthToSouth.buffer,n=e.northIndicesWestToEast.buffer;return d.push(t,r,s,o,i,n),{verticesBuffer:t,indicesBuffer:r,vertexCountWithoutSkirts:e.vertexCountWithoutSkirts,indexCountWithoutSkirts:e.indexCountWithoutSkirts,encoding:e.encoding,westIndicesBuffer:s,southIndicesBuffer:o,eastIndicesBuffer:i,northIndicesBuffer:n}})}var T=f(a);export{T as default};

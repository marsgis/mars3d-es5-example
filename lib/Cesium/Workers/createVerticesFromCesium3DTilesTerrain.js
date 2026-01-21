/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.137.0
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

import{a as u}from"./chunk-EAK2NYVT.js";import"./chunk-MYPJIRXE.js";import"./chunk-PFBCREPC.js";import{a as f}from"./chunk-5MNXCIAQ.js";import"./chunk-DMJCD4AA.js";import"./chunk-F2AWQA6Z.js";import"./chunk-HZHBRTRT.js";import"./chunk-K2CUONAS.js";import"./chunk-3HFCZ77L.js";import"./chunk-IPOSTFHS.js";import"./chunk-67AKABTA.js";import"./chunk-QL35WEO3.js";import"./chunk-AYK4RNAN.js";import"./chunk-ELWO7X6Y.js";import"./chunk-QYDEAGWW.js";import"./chunk-ZQC66MCS.js";import"./chunk-32AHHUF4.js";import"./chunk-7MMCML27.js";import"./chunk-XGLQQYOQ.js";import"./chunk-FQLWLYTE.js";import"./chunk-XJBOZNKQ.js";import"./chunk-CTZ5EJYK.js";import"./chunk-OIVYU3AH.js";import"./chunk-C7M6BOJB.js";function a(c,d){return u.createMesh(c).then(function(e){let t=e.vertices.buffer,r=e.indices.buffer,s=e.westIndicesSouthToNorth.buffer,o=e.southIndicesEastToWest.buffer,i=e.eastIndicesNorthToSouth.buffer,n=e.northIndicesWestToEast.buffer;return d.push(t,r,s,o,i,n),{verticesBuffer:t,indicesBuffer:r,vertexCountWithoutSkirts:e.vertexCountWithoutSkirts,indexCountWithoutSkirts:e.indexCountWithoutSkirts,encoding:e.encoding,westIndicesBuffer:s,southIndicesBuffer:o,eastIndicesBuffer:i,northIndicesBuffer:n}})}var T=f(a);export{T as default};

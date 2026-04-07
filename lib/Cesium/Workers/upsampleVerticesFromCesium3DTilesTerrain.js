/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.140.0
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

import{a as f}from"./chunk-DMJB4DHC.js";import"./chunk-PQWMNK6M.js";import"./chunk-TJUBNZ45.js";import{a as u}from"./chunk-WYMSHGR6.js";import"./chunk-7U5EVTKW.js";import"./chunk-KIXGV6RH.js";import"./chunk-JD76ATDQ.js";import"./chunk-RPFEAA52.js";import"./chunk-JQWGTP3K.js";import"./chunk-SDQXNLTQ.js";import"./chunk-PUOAX5MA.js";import"./chunk-YWNU5ZQD.js";import"./chunk-UKJ254OV.js";import"./chunk-YDQLCOZM.js";import"./chunk-MWY74K7V.js";import"./chunk-YECQFZBX.js";import"./chunk-TOK3PZ73.js";import"./chunk-65MI2E3A.js";import"./chunk-422SYBQS.js";import"./chunk-QQJ4EFK2.js";import"./chunk-XXWWJ3QU.js";import"./chunk-N6SIW7ZL.js";import"./chunk-K35RPNUR.js";import"./chunk-RTRJ3LVQ.js";function h(c,d){let e=f.upsampleMesh(c),t=e.vertices.buffer,i=e.indices.buffer,s=e.westIndicesSouthToNorth.buffer,o=e.southIndicesEastToWest.buffer,r=e.eastIndicesNorthToSouth.buffer,n=e.northIndicesWestToEast.buffer;return d.push(t,i,s,o,r,n),{verticesBuffer:t,indicesBuffer:i,vertexCountWithoutSkirts:e.vertexCountWithoutSkirts,indexCountWithoutSkirts:e.indexCountWithoutSkirts,encoding:e.encoding,westIndicesBuffer:s,southIndicesBuffer:o,eastIndicesBuffer:r,northIndicesBuffer:n,minimumHeight:e.minimumHeight,maximumHeight:e.maximumHeight,boundingSphere:e.boundingSphere3D,orientedBoundingBox:e.orientedBoundingBox,horizonOcclusionPoint:e.horizonOcclusionPoint}}var I=u(h);export{I as default};

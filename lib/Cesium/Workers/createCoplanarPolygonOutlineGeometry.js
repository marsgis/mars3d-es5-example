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

import{a as T}from"./chunk-IJWZQPQA.js";import"./chunk-AFVOLTM4.js";import{a as l}from"./chunk-SST2IET5.js";import"./chunk-23F7QTWZ.js";import{a as G}from"./chunk-LOZ5WFDY.js";import{a as C}from"./chunk-ELGJNIOP.js";import"./chunk-2HS2RD4J.js";import"./chunk-UBEWSTP3.js";import"./chunk-SLCQLCIS.js";import"./chunk-KUIQ5QZM.js";import"./chunk-YSF4UF4J.js";import{a as L}from"./chunk-GBQ6ZFCR.js";import"./chunk-6WEFCTPE.js";import"./chunk-OJMLUVHY.js";import"./chunk-WUOXPQI3.js";import{a as w}from"./chunk-ABG5CBMX.js";import{a as O}from"./chunk-VTPQPICZ.js";import{b,c as d,d as k}from"./chunk-RO3EN73M.js";import{c as P}from"./chunk-GTGLGYR5.js";import"./chunk-SHU5XLHO.js";import"./chunk-PJSIZFRN.js";import"./chunk-MSOAON3W.js";import{a as H}from"./chunk-SGT62F4G.js";import"./chunk-A4XPW3XT.js";import"./chunk-OPF4VTEO.js";import{c as g}from"./chunk-RVGYS7AK.js";import{a as y,c as u}from"./chunk-L6URUAFR.js";import"./chunk-B2IRVOVP.js";import{b as m}from"./chunk-B2SDQXYD.js";import{e as f}from"./chunk-ZSPEXXVJ.js";function E(o){let e=o.length,t=new Float64Array(e*3),i=w.createTypedArray(e,e*2),r=0,a=0;for(let n=0;n<e;n++){let p=o[n];t[r++]=p.x,t[r++]=p.y,t[r++]=p.z,i[a++]=n,i[a++]=(n+1)%e}let s=new O({position:new k({componentDatatype:H.DOUBLE,componentsPerAttribute:3,values:t})});return new d({attributes:s,indices:i,primitiveType:b.LINES})}function c(o){o=o??u.EMPTY_OBJECT;let e=o.polygonHierarchy;m.defined("options.polygonHierarchy",e),this._polygonHierarchy=e,this._workerName="createCoplanarPolygonOutlineGeometry",this.packedLength=l.computeHierarchyPackedLength(e,y)+1}c.fromPositions=function(o){o=o??u.EMPTY_OBJECT,m.defined("options.positions",o.positions);let e={polygonHierarchy:{positions:o.positions}};return new c(e)};c.pack=function(o,e,t){return m.typeOf.object("value",o),m.defined("array",e),t=t??0,t=l.packPolygonHierarchy(o._polygonHierarchy,e,t,y),e[t]=o.packedLength,e};var v={polygonHierarchy:{}};c.unpack=function(o,e,t){m.defined("array",o),e=e??0;let i=l.unpackPolygonHierarchy(o,e,y);e=i.startingIndex,delete i.startingIndex;let r=o[e];return f(t)||(t=new c(v)),t._polygonHierarchy=i,t.packedLength=r,t};c.createGeometry=function(o){let e=o._polygonHierarchy,t=e.positions;if(t=L(t,y.equalsEpsilon,!0),t.length<3||!T.validOutline(t))return;let r=l.polygonOutlinesFromHierarchy(e,!1);if(r.length===0)return;let a=[];for(let p=0;p<r.length;p++){let _=new G({geometry:E(r[p])});a.push(_)}let s=C.combineInstances(a)[0],n=P.fromPoints(e.positions);return new d({attributes:s.attributes,indices:s.indices,primitiveType:s.primitiveType,boundingSphere:n})};var h=c;function A(o,e){return f(e)&&(o=h.unpack(o,e)),o._ellipsoid=g.clone(o._ellipsoid),h.createGeometry(o)}var Z=A;export{Z as default};

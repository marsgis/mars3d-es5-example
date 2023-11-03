/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.111.1
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

import{a as T}from"./chunk-F2PUPSXD.js";import"./chunk-XV4OJ7PA.js";import{a as f}from"./chunk-EKAWWY6W.js";import"./chunk-3WSKQB2G.js";import{a as G}from"./chunk-YVCHLSZT.js";import{a as C}from"./chunk-R5ZDDUA7.js";import"./chunk-WG42H7ON.js";import"./chunk-YC4YH3IC.js";import"./chunk-KDAZVMJV.js";import"./chunk-BJLICBZZ.js";import"./chunk-V5GSDLAX.js";import{a as L}from"./chunk-QAAEKGEN.js";import"./chunk-QF3XTSZ6.js";import"./chunk-NXNPOLPQ.js";import"./chunk-I2FFQ4WH.js";import{a as w}from"./chunk-TZCDIH4R.js";import{a as O}from"./chunk-CFIDANCC.js";import{b,c as d,d as k}from"./chunk-FWDUGYMR.js";import{d as P}from"./chunk-HGGJIMVV.js";import"./chunk-7X64AI22.js";import"./chunk-X7ZLRX4N.js";import{a as H}from"./chunk-PCS4J77B.js";import{a as l,c as g}from"./chunk-LXB43KQ6.js";import"./chunk-DKRENQ7L.js";import"./chunk-LRFNHOZM.js";import"./chunk-RUNKVG3S.js";import{a as c}from"./chunk-VWVMTNDV.js";import{b as a}from"./chunk-2XTA2UF4.js";import{e as u}from"./chunk-PIMZQP3B.js";function E(o){let e=o.length,t=new Float64Array(e*3),r=w.createTypedArray(e,e*2),i=0,s=0;for(let n=0;n<e;n++){let p=o[n];t[i++]=p.x,t[i++]=p.y,t[i++]=p.z,r[s++]=n,r[s++]=(n+1)%e}let y=new O({position:new k({componentDatatype:H.DOUBLE,componentsPerAttribute:3,values:t})});return new d({attributes:y,indices:r,primitiveType:b.LINES})}function m(o){o=c(o,c.EMPTY_OBJECT);let e=o.polygonHierarchy;a.defined("options.polygonHierarchy",e),this._polygonHierarchy=e,this._workerName="createCoplanarPolygonOutlineGeometry",this.packedLength=f.computeHierarchyPackedLength(e,l)+1}m.fromPositions=function(o){o=c(o,c.EMPTY_OBJECT),a.defined("options.positions",o.positions);let e={polygonHierarchy:{positions:o.positions}};return new m(e)};m.pack=function(o,e,t){return a.typeOf.object("value",o),a.defined("array",e),t=c(t,0),t=f.packPolygonHierarchy(o._polygonHierarchy,e,t,l),e[t]=o.packedLength,e};var v={polygonHierarchy:{}};m.unpack=function(o,e,t){a.defined("array",o),e=c(e,0);let r=f.unpackPolygonHierarchy(o,e,l);e=r.startingIndex,delete r.startingIndex;let i=o[e];return u(t)||(t=new m(v)),t._polygonHierarchy=r,t.packedLength=i,t};m.createGeometry=function(o){let e=o._polygonHierarchy,t=e.positions;if(t=L(t,l.equalsEpsilon,!0),t.length<3||!T.validOutline(t))return;let i=f.polygonOutlinesFromHierarchy(e,!1);if(i.length===0)return;let s=[];for(let p=0;p<i.length;p++){let _=new G({geometry:E(i[p])});s.push(_)}let y=C.combineInstances(s)[0],n=P.fromPoints(e.positions);return new d({attributes:y.attributes,indices:y.indices,primitiveType:y.primitiveType,boundingSphere:n})};var h=m;function A(o,e){return u(e)&&(o=h.unpack(o,e)),o._ellipsoid=g.clone(o._ellipsoid),h.createGeometry(o)}var Z=A;export{Z as default};

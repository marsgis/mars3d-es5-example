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

import{a as r}from"./chunk-25O6KEA4.js";import"./chunk-DGEQNHVI.js";import{a as m}from"./chunk-AZNPK76Q.js";import"./chunk-ABG5CBMX.js";import"./chunk-VTPQPICZ.js";import"./chunk-RO3EN73M.js";import"./chunk-GTGLGYR5.js";import"./chunk-SHU5XLHO.js";import"./chunk-PJSIZFRN.js";import"./chunk-MSOAON3W.js";import"./chunk-SGT62F4G.js";import"./chunk-A4XPW3XT.js";import"./chunk-OPF4VTEO.js";import"./chunk-RVGYS7AK.js";import{a as s}from"./chunk-L6URUAFR.js";import"./chunk-B2IRVOVP.js";import{b as p}from"./chunk-B2SDQXYD.js";import{e as c}from"./chunk-ZSPEXXVJ.js";function a(e){let t=e.radius??1,o={radii:new s(t,t,t),stackPartitions:e.stackPartitions,slicePartitions:e.slicePartitions,vertexFormat:e.vertexFormat};this._ellipsoidGeometry=new r(o),this._workerName="createSphereGeometry"}a.packedLength=r.packedLength;a.pack=function(e,t,n){return p.typeOf.object("value",e),r.pack(e._ellipsoidGeometry,t,n)};var l=new r,i={radius:void 0,radii:new s,vertexFormat:new m,stackPartitions:void 0,slicePartitions:void 0};a.unpack=function(e,t,n){let o=r.unpack(e,t,l);return i.vertexFormat=m.clone(o._vertexFormat,i.vertexFormat),i.stackPartitions=o._stackPartitions,i.slicePartitions=o._slicePartitions,c(n)?(s.clone(o._radii,i.radii),n._ellipsoidGeometry=new r(i),n):(i.radius=o._radii.x,new a(i))};a.createGeometry=function(e){return r.createGeometry(e._ellipsoidGeometry)};var d=a;function f(e,t){return c(t)&&(e=d.unpack(e,t)),d.createGeometry(e)}var w=f;export{w as default};

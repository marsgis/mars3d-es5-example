/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.131
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

import{a as r}from"./chunk-NGP2CKO6.js";import"./chunk-J6I5ZCTL.js";import{a as m}from"./chunk-SZMZ5HN2.js";import"./chunk-337ELWCW.js";import"./chunk-JR7YHEST.js";import"./chunk-QQYGWGGH.js";import"./chunk-7NAAA2KT.js";import"./chunk-C4HEU6LX.js";import"./chunk-VQH37XSD.js";import{a as s}from"./chunk-6IDW5JLT.js";import"./chunk-VG3VFFCL.js";import"./chunk-GFRD27HW.js";import"./chunk-XTMVK6TZ.js";import{b as p}from"./chunk-TBAVFI4H.js";import{e as c}from"./chunk-ZKR66ARQ.js";function a(e){let t=e.radius??1,o={radii:new s(t,t,t),stackPartitions:e.stackPartitions,slicePartitions:e.slicePartitions,vertexFormat:e.vertexFormat};this._ellipsoidGeometry=new r(o),this._workerName="createSphereGeometry"}a.packedLength=r.packedLength;a.pack=function(e,t,n){return p.typeOf.object("value",e),r.pack(e._ellipsoidGeometry,t,n)};var l=new r,i={radius:void 0,radii:new s,vertexFormat:new m,stackPartitions:void 0,slicePartitions:void 0};a.unpack=function(e,t,n){let o=r.unpack(e,t,l);return i.vertexFormat=m.clone(o._vertexFormat,i.vertexFormat),i.stackPartitions=o._stackPartitions,i.slicePartitions=o._slicePartitions,c(n)?(s.clone(o._radii,i.radii),n._ellipsoidGeometry=new r(i),n):(i.radius=o._radii.x,new a(i))};a.createGeometry=function(e){return r.createGeometry(e._ellipsoidGeometry)};var d=a;function f(e,t){return c(t)&&(e=d.unpack(e,t)),d.createGeometry(e)}var w=f;export{w as default};

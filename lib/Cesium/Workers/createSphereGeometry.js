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

import{a as r}from"./chunk-I3GNA57D.js";import"./chunk-GN6DMMVT.js";import{a as m}from"./chunk-CWD6KW4D.js";import"./chunk-TZCDIH4R.js";import"./chunk-CFIDANCC.js";import"./chunk-FWDUGYMR.js";import"./chunk-HGGJIMVV.js";import"./chunk-7X64AI22.js";import"./chunk-X7ZLRX4N.js";import"./chunk-PCS4J77B.js";import{a as s}from"./chunk-LXB43KQ6.js";import"./chunk-DKRENQ7L.js";import"./chunk-LRFNHOZM.js";import"./chunk-RUNKVG3S.js";import{a as l}from"./chunk-VWVMTNDV.js";import{b as p}from"./chunk-2XTA2UF4.js";import{e as c}from"./chunk-PIMZQP3B.js";function n(e){let t=l(e.radius,1),o={radii:new s(t,t,t),stackPartitions:e.stackPartitions,slicePartitions:e.slicePartitions,vertexFormat:e.vertexFormat};this._ellipsoidGeometry=new r(o),this._workerName="createSphereGeometry"}n.packedLength=r.packedLength;n.pack=function(e,t,a){return p.typeOf.object("value",e),r.pack(e._ellipsoidGeometry,t,a)};var f=new r,i={radius:void 0,radii:new s,vertexFormat:new m,stackPartitions:void 0,slicePartitions:void 0};n.unpack=function(e,t,a){let o=r.unpack(e,t,f);return i.vertexFormat=m.clone(o._vertexFormat,i.vertexFormat),i.stackPartitions=o._stackPartitions,i.slicePartitions=o._slicePartitions,c(a)?(s.clone(o._radii,i.radii),a._ellipsoidGeometry=new r(i),a):(i.radius=o._radii.x,new n(i))};n.createGeometry=function(e){return r.createGeometry(e._ellipsoidGeometry)};var d=n;function u(e,t){return c(t)&&(e=d.unpack(e,t)),d.createGeometry(e)}var v=u;export{v as default};

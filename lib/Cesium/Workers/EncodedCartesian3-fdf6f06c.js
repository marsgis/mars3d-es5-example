define(["exports","./Matrix2-b55a7626","./RuntimeError-138b7f6a","./when-229515d6"],(function(n,e,o,i){"use strict";function t(){this.high=e.Cartesian3.clone(e.Cartesian3.ZERO),this.low=e.Cartesian3.clone(e.Cartesian3.ZERO)}t.encode=function(n,e){let o;return i.defined(e)||(e={high:0,low:0}),n>=0?(o=65536*Math.floor(n/65536),e.high=o,e.low=n-o):(o=65536*Math.floor(-n/65536),e.high=-o,e.low=n+o),e};const h={high:0,low:0};t.fromCartesian=function(n,e){i.defined(e)||(e=new t);const o=e.high,r=e.low;return t.encode(n.x,h),o.x=h.high,r.x=h.low,t.encode(n.y,h),o.y=h.high,r.y=h.low,t.encode(n.z,h),o.z=h.high,r.z=h.low,e};const r=new t;t.writeElements=function(n,e,o){t.fromCartesian(n,r);const i=r.high,h=r.low;e[o]=i.x,e[o+1]=i.y,e[o+2]=i.z,e[o+3]=h.x,e[o+4]=h.y,e[o+5]=h.z},n.EncodedCartesian3=t}));
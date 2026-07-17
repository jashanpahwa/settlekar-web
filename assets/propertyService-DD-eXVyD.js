import{g as it,h as se,_ as at,i as ct,j as ut,k as Le,p as lt,l as ht,F as dt,m as pt,C as ft,r as Se,S as gt,n as _t,s as mt,G as wt,t as yt,v as S,w as Re,c as R,q as k,x as I,a as re,y as A,f as M,d as m,b as ye,z as v,u as D,A as Ce,B as ae,D as bt,E as Rt,H as Et,I as It,J as Tt,K as kt,L as Ut}from"./firebase-vendor-qI3n1Cnh.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fe="firebasestorage.googleapis.com",Me="storageBucket",Pt=120*1e3,At=600*1e3,St=1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b extends dt{constructor(e,t,s=0){super(de(e),`Firebase Storage: ${t} (${de(e)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,b.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return de(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var w;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(w||(w={}));function de(r){return"storage/"+r}function Ee(){const r="An unknown error occurred, please check the error payload for server response.";return new b(w.UNKNOWN,r)}function Ct(r){return new b(w.OBJECT_NOT_FOUND,"Object '"+r+"' does not exist.")}function Ot(r){return new b(w.QUOTA_EXCEEDED,"Quota for bucket '"+r+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function Nt(){const r="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new b(w.UNAUTHENTICATED,r)}function xt(){return new b(w.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function vt(r){return new b(w.UNAUTHORIZED,"User does not have permission to access '"+r+"'.")}function He(){return new b(w.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function ze(){return new b(w.CANCELED,"User canceled the upload/download.")}function Dt(r){return new b(w.INVALID_URL,"Invalid URL '"+r+"'.")}function qt(r){return new b(w.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function Bt(){return new b(w.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+Me+"' property when initializing the app?")}function $e(){return new b(w.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function Lt(){return new b(w.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function Ft(){return new b(w.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function Mt(r){return new b(w.UNSUPPORTED_ENVIRONMENT,`${r} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function be(r){return new b(w.INVALID_ARGUMENT,r)}function We(){return new b(w.APP_DELETED,"The Firebase app was deleted.")}function Ht(r){return new b(w.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function te(r,e){return new b(w.INVALID_FORMAT,"String does not match format '"+r+"': "+e)}function J(r){throw new b(w.INTERNAL_ERROR,"Internal error: "+r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let s;try{s=O.makeFromUrl(e,t)}catch{return new O(e,"")}if(s.path==="")return s;throw qt(e)}static makeFromUrl(e,t){let s=null;const n="([A-Za-z0-9.\\-_]+)";function o(T){T.path.charAt(T.path.length-1)==="/"&&(T.path_=T.path_.slice(0,-1))}const i="(/(.*))?$",c=new RegExp("^gs://"+n+i,"i"),a={bucket:1,path:3};function l(T){T.path_=decodeURIComponent(T.path)}const u="v[A-Za-z0-9_]+",h=t.replace(/[.]/g,"\\."),d="(/([^?#]*).*)?$",f=new RegExp(`^https?://${h}/${u}/b/${n}/o${d}`,"i"),_={bucket:1,path:3},y=t===Fe?"(?:storage.googleapis.com|storage.cloud.google.com)":t,g="([^?#]*)",E=new RegExp(`^https?://${y}/${n}/${g}`,"i"),U=[{regex:c,indices:a,postModify:o},{regex:f,indices:_,postModify:l},{regex:E,indices:{bucket:1,path:2},postModify:l}];for(let T=0;T<U.length;T++){const j=U[T],X=j.regex.exec(e);if(X){const le=X[j.indices.bucket];let Y=X[j.indices.path];Y||(Y=""),s=new O(le,Y),j.postModify(s);break}}if(s==null)throw Dt(e);return s}}class zt{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $t(r,e,t){let s=1,n=null,o=null,i=!1,c=0;function a(){return c===2}let l=!1;function u(...g){l||(l=!0,e.apply(null,g))}function h(g){n=setTimeout(()=>{n=null,r(f,a())},g)}function d(){o&&clearTimeout(o)}function f(g,...E){if(l){d();return}if(g){d(),u.call(null,g,...E);return}if(a()||i){d(),u.call(null,g,...E);return}s<64&&(s*=2);let U;c===1?(c=2,U=0):U=(s+Math.random())*1e3,h(U)}let _=!1;function y(g){_||(_=!0,d(),!l&&(n!==null?(g||(c=2),clearTimeout(n),h(0)):g||(c=1)))}return h(0),o=setTimeout(()=>{i=!0,y(!0)},t),y}function Wt(r){r(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gt(r){return r!==void 0}function jt(r){return typeof r=="function"}function Xt(r){return typeof r=="object"&&!Array.isArray(r)}function ue(r){return typeof r=="string"||r instanceof String}function Oe(r){return Ie()&&r instanceof Blob}function Ie(){return typeof Blob<"u"}function Ne(r,e,t,s){if(s<e)throw be(`Invalid value for '${r}'. Expected ${e} or greater.`);if(s>t)throw be(`Invalid value for '${r}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z(r,e,t){let s=e;return t==null&&(s=`https://${e}`),`${t}://${s}/v0${r}`}function Ge(r){const e=encodeURIComponent;let t="?";for(const s in r)if(r.hasOwnProperty(s)){const n=e(s)+"="+e(r[s]);t=t+n+"&"}return t=t.slice(0,-1),t}var $;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})($||($={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function je(r,e){const t=r>=500&&r<600,n=[408,429].indexOf(r)!==-1,o=e.indexOf(r)!==-1;return t||n||o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(e,t,s,n,o,i,c,a,l,u,h,d=!0,f=!1){this.url_=e,this.method_=t,this.headers_=s,this.body_=n,this.successCodes_=o,this.additionalRetryCodes_=i,this.callback_=c,this.errorCallback_=a,this.timeout_=l,this.progressCallback_=u,this.connectionFactory_=h,this.retry=d,this.isUsingEmulator=f,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((_,y)=>{this.resolve_=_,this.reject_=y,this.start_()})}start_(){const e=(s,n)=>{if(n){s(!1,new oe(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const i=c=>{const a=c.loaded,l=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(a,l)};this.progressCallback_!==null&&o.addUploadProgressListener(i),o.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(i),this.pendingConnection_=null;const c=o.getErrorCode()===$.NO_ERROR,a=o.getStatus();if(!c||je(a,this.additionalRetryCodes_)&&this.retry){const u=o.getErrorCode()===$.ABORT;s(!1,new oe(!1,null,u));return}const l=this.successCodes_.indexOf(a)!==-1;s(!0,new oe(l,o))})},t=(s,n)=>{const o=this.resolve_,i=this.reject_,c=n.connection;if(n.wasSuccessCode)try{const a=this.callback_(c,c.getResponse());Gt(a)?o(a):o()}catch(a){i(a)}else if(c!==null){const a=Ee();a.serverResponse=c.getErrorText(),this.errorCallback_?i(this.errorCallback_(c,a)):i(a)}else if(n.canceled){const a=this.appDelete_?We():ze();i(a)}else{const a=He();i(a)}};this.canceled_?t(!1,new oe(!1,null,!0)):this.backoffId_=$t(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&Wt(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class oe{constructor(e,t,s){this.wasSuccessCode=e,this.connection=t,this.canceled=!!s}}function Kt(r,e){e!==null&&e.length>0&&(r.Authorization="Firebase "+e)}function Zt(r,e){r["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function Yt(r,e){e&&(r["X-Firebase-GMPID"]=e)}function Jt(r,e){e!==null&&(r["X-Firebase-AppCheck"]=e)}function Qt(r,e,t,s,n,o,i=!0,c=!1){const a=Ge(r.urlParams),l=r.url+a,u=Object.assign({},r.headers);return Yt(u,e),Kt(u,t),Zt(u,o),Jt(u,s),new Vt(l,r.method,u,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,n,i,c)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function er(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function tr(...r){const e=er();if(e!==void 0){const t=new e;for(let s=0;s<r.length;s++)t.append(r[s]);return t.getBlob()}else{if(Ie())return new Blob(r);throw new b(w.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function rr(r,e,t){return r.webkitSlice?r.webkitSlice(e,t):r.mozSlice?r.mozSlice(e,t):r.slice?r.slice(e,t):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sr(r){if(typeof atob>"u")throw Mt("base-64");return atob(r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class pe{constructor(e,t){this.data=e,this.contentType=t||null}}function nr(r,e){switch(r){case q.RAW:return new pe(Xe(e));case q.BASE64:case q.BASE64URL:return new pe(Ve(r,e));case q.DATA_URL:return new pe(ir(e),ar(e))}throw Ee()}function Xe(r){const e=[];for(let t=0;t<r.length;t++){let s=r.charCodeAt(t);if(s<=127)e.push(s);else if(s<=2047)e.push(192|s>>6,128|s&63);else if((s&64512)===55296)if(!(t<r.length-1&&(r.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const o=s,i=r.charCodeAt(++t);s=65536|(o&1023)<<10|i&1023,e.push(240|s>>18,128|s>>12&63,128|s>>6&63,128|s&63)}else(s&64512)===56320?e.push(239,191,189):e.push(224|s>>12,128|s>>6&63,128|s&63)}return new Uint8Array(e)}function or(r){let e;try{e=decodeURIComponent(r)}catch{throw te(q.DATA_URL,"Malformed data URL.")}return Xe(e)}function Ve(r,e){switch(r){case q.BASE64:{const n=e.indexOf("-")!==-1,o=e.indexOf("_")!==-1;if(n||o)throw te(r,"Invalid character '"+(n?"-":"_")+"' found: is it base64url encoded?");break}case q.BASE64URL:{const n=e.indexOf("+")!==-1,o=e.indexOf("/")!==-1;if(n||o)throw te(r,"Invalid character '"+(n?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=sr(e)}catch(n){throw n.message.includes("polyfill")?n:te(r,"Invalid character found")}const s=new Uint8Array(t.length);for(let n=0;n<t.length;n++)s[n]=t.charCodeAt(n);return s}class Ke{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw te(q.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const s=t[1]||null;s!=null&&(this.base64=cr(s,";base64"),this.contentType=this.base64?s.substring(0,s.length-7):s),this.rest=e.substring(e.indexOf(",")+1)}}function ir(r){const e=new Ke(r);return e.base64?Ve(q.BASE64,e.rest):or(e.rest)}function ar(r){return new Ke(r).contentType}function cr(r,e){return r.length>=e.length?r.substring(r.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F{constructor(e,t){let s=0,n="";Oe(e)?(this.data_=e,s=e.size,n=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),s=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),s=e.length),this.size_=s,this.type_=n}size(){return this.size_}type(){return this.type_}slice(e,t){if(Oe(this.data_)){const s=this.data_,n=rr(s,e,t);return n===null?null:new F(n)}else{const s=new Uint8Array(this.data_.buffer,e,t-e);return new F(s,!0)}}static getBlob(...e){if(Ie()){const t=e.map(s=>s instanceof F?s.data_:s);return new F(tr.apply(null,t))}else{const t=e.map(i=>ue(i)?nr(q.RAW,i).data:i.data_);let s=0;t.forEach(i=>{s+=i.byteLength});const n=new Uint8Array(s);let o=0;return t.forEach(i=>{for(let c=0;c<i.length;c++)n[o++]=i[c]}),new F(n,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ze(r){let e;try{e=JSON.parse(r)}catch{return null}return Xt(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ur(r){if(r.length===0)return null;const e=r.lastIndexOf("/");return e===-1?"":r.slice(0,e)}function lr(r,e){const t=e.split("/").filter(s=>s.length>0).join("/");return r.length===0?t:r+"/"+t}function Ye(r){const e=r.lastIndexOf("/",r.length-2);return e===-1?r:r.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hr(r,e){return e}class P{constructor(e,t,s,n){this.server=e,this.local=t||e,this.writable=!!s,this.xform=n||hr}}let ie=null;function dr(r){return!ue(r)||r.length<2?r:Ye(r)}function Je(){if(ie)return ie;const r=[];r.push(new P("bucket")),r.push(new P("generation")),r.push(new P("metageneration")),r.push(new P("name","fullPath",!0));function e(o,i){return dr(i)}const t=new P("name");t.xform=e,r.push(t);function s(o,i){return i!==void 0?Number(i):i}const n=new P("size");return n.xform=s,r.push(n),r.push(new P("timeCreated")),r.push(new P("updated")),r.push(new P("md5Hash",null,!0)),r.push(new P("cacheControl",null,!0)),r.push(new P("contentDisposition",null,!0)),r.push(new P("contentEncoding",null,!0)),r.push(new P("contentLanguage",null,!0)),r.push(new P("contentType",null,!0)),r.push(new P("metadata","customMetadata",!0)),ie=r,ie}function pr(r,e){function t(){const s=r.bucket,n=r.fullPath,o=new O(s,n);return e._makeStorageReference(o)}Object.defineProperty(r,"ref",{get:t})}function fr(r,e,t){const s={};s.type="file";const n=t.length;for(let o=0;o<n;o++){const i=t[o];s[i.local]=i.xform(s,e[i.server])}return pr(s,r),s}function Qe(r,e,t){const s=Ze(e);return s===null?null:fr(r,s,t)}function gr(r,e,t,s){const n=Ze(e);if(n===null||!ue(n.downloadTokens))return null;const o=n.downloadTokens;if(o.length===0)return null;const i=encodeURIComponent;return o.split(",").map(l=>{const u=r.bucket,h=r.fullPath,d="/b/"+i(u)+"/o/"+i(h),f=Z(d,t,s),_=Ge({alt:"media",token:l});return f+_})[0]}function et(r,e){const t={},s=e.length;for(let n=0;n<s;n++){const o=e[n];o.writable&&(t[o.server]=r[o.local])}return JSON.stringify(t)}class G{constructor(e,t,s,n){this.url=e,this.method=t,this.handler=s,this.timeout=n,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L(r){if(!r)throw Ee()}function Te(r,e){function t(s,n){const o=Qe(r,n,e);return L(o!==null),o}return t}function _r(r,e){function t(s,n){const o=Qe(r,n,e);return L(o!==null),gr(o,n,r.host,r._protocol)}return t}function ne(r){function e(t,s){let n;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?n=xt():n=Nt():t.getStatus()===402?n=Ot(r.bucket):t.getStatus()===403?n=vt(r.path):n=s,n.status=t.getStatus(),n.serverResponse=s.serverResponse,n}return e}function ke(r){const e=ne(r);function t(s,n){let o=e(s,n);return s.getStatus()===404&&(o=Ct(r.path)),o.serverResponse=n.serverResponse,o}return t}function mr(r,e,t){const s=e.fullServerUrl(),n=Z(s,r.host,r._protocol),o="GET",i=r.maxOperationRetryTime,c=new G(n,o,Te(r,t),i);return c.errorHandler=ke(e),c}function wr(r,e,t){const s=e.fullServerUrl(),n=Z(s,r.host,r._protocol),o="GET",i=r.maxOperationRetryTime,c=new G(n,o,_r(r,t),i);return c.errorHandler=ke(e),c}function yr(r,e){const t=e.fullServerUrl(),s=Z(t,r.host,r._protocol),n="DELETE",o=r.maxOperationRetryTime;function i(a,l){}const c=new G(s,n,i,o);return c.successCodes=[200,204],c.errorHandler=ke(e),c}function br(r,e){return r&&r.contentType||e&&e.type()||"application/octet-stream"}function tt(r,e,t){const s=Object.assign({},t);return s.fullPath=r.path,s.size=e.size(),s.contentType||(s.contentType=br(null,e)),s}function Rr(r,e,t,s,n){const o=e.bucketOnlyServerUrl(),i={"X-Goog-Upload-Protocol":"multipart"};function c(){let U="";for(let T=0;T<2;T++)U=U+Math.random().toString().slice(2);return U}const a=c();i["Content-Type"]="multipart/related; boundary="+a;const l=tt(e,s,n),u=et(l,t),h="--"+a+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+u+`\r
--`+a+`\r
Content-Type: `+l.contentType+`\r
\r
`,d=`\r
--`+a+"--",f=F.getBlob(h,s,d);if(f===null)throw $e();const _={name:l.fullPath},y=Z(o,r.host,r._protocol),g="POST",E=r.maxUploadRetryTime,B=new G(y,g,Te(r,t),E);return B.urlParams=_,B.headers=i,B.body=f.uploadData(),B.errorHandler=ne(e),B}class ce{constructor(e,t,s,n){this.current=e,this.total=t,this.finalized=!!s,this.metadata=n||null}}function Ue(r,e){let t=null;try{t=r.getResponseHeader("X-Goog-Upload-Status")}catch{L(!1)}return L(!!t&&(e||["active"]).indexOf(t)!==-1),t}function Er(r,e,t,s,n){const o=e.bucketOnlyServerUrl(),i=tt(e,s,n),c={name:i.fullPath},a=Z(o,r.host,r._protocol),l="POST",u={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${s.size()}`,"X-Goog-Upload-Header-Content-Type":i.contentType,"Content-Type":"application/json; charset=utf-8"},h=et(i,t),d=r.maxUploadRetryTime;function f(y){Ue(y);let g;try{g=y.getResponseHeader("X-Goog-Upload-URL")}catch{L(!1)}return L(ue(g)),g}const _=new G(a,l,f,d);return _.urlParams=c,_.headers=u,_.body=h,_.errorHandler=ne(e),_}function Ir(r,e,t,s){const n={"X-Goog-Upload-Command":"query"};function o(l){const u=Ue(l,["active","final"]);let h=null;try{h=l.getResponseHeader("X-Goog-Upload-Size-Received")}catch{L(!1)}h||L(!1);const d=Number(h);return L(!isNaN(d)),new ce(d,s.size(),u==="final")}const i="POST",c=r.maxUploadRetryTime,a=new G(t,i,o,c);return a.headers=n,a.errorHandler=ne(e),a}const xe=256*1024;function Tr(r,e,t,s,n,o,i,c){const a=new ce(0,0);if(i?(a.current=i.current,a.total=i.total):(a.current=0,a.total=s.size()),s.size()!==a.total)throw Lt();const l=a.total-a.current;let u=l;n>0&&(u=Math.min(u,n));const h=a.current,d=h+u;let f="";u===0?f="finalize":l===u?f="upload, finalize":f="upload";const _={"X-Goog-Upload-Command":f,"X-Goog-Upload-Offset":`${a.current}`},y=s.slice(h,d);if(y===null)throw $e();function g(T,j){const X=Ue(T,["active","final"]),le=a.current+u,Y=s.size();let he;return X==="final"?he=Te(e,o)(T,j):he=null,new ce(le,Y,X==="final",he)}const E="POST",B=e.maxUploadRetryTime,U=new G(t,E,g,B);return U.headers=_,U.body=y.uploadData(),U.progressCallback=c||null,U.errorHandler=ne(r),U}const C={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function fe(r){switch(r){case"running":case"pausing":case"canceling":return C.RUNNING;case"paused":return C.PAUSED;case"success":return C.SUCCESS;case"canceled":return C.CANCELED;case"error":return C.ERROR;default:return C.ERROR}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(e,t,s){if(jt(e)||t!=null||s!=null)this.next=e,this.error=t??void 0,this.complete=s??void 0;else{const o=e;this.next=o.next,this.error=o.error,this.complete=o.complete}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V(r){return(...e)=>{Promise.resolve().then(()=>r(...e))}}class Ur{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=$.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=$.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=$.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,s,n,o){if(this.sent_)throw J("cannot .send() more than once");if(Le(e)&&s&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),o!==void 0)for(const i in o)o.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,o[i].toString());return n!==void 0?this.xhr_.send(n):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw J("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw J("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw J("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw J("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class Pr extends Ur{initXhr(){this.xhr_.responseType="text"}}function z(){return new Pr}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ar{isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}constructor(e,t,s=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=t,this._metadata=s,this._mappings=Je(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=n=>{if(this._request=void 0,this._chunkMultiplier=1,n._codeEquals(w.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const o=this.isExponentialBackoffExpired();if(je(n.status,[]))if(o)n=He();else{this.sleepTime=Math.max(this.sleepTime*2,St),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=n,this._transition("error")}},this._metadataErrorHandler=n=>{this._request=void 0,n._codeEquals(w.CANCELED)?this.completeTransitions_():(this._error=n,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((n,o)=>{this._resolve=n,this._reject=o,this._start()}),this._promise.then(null,()=>{})}_makeProgressCallback(){const e=this._transferred;return t=>this._updateProgress(e+t)}_shouldDoResumable(e){return e.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([t,s])=>{switch(this._state){case"running":e(t,s);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((e,t)=>{const s=Er(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),n=this._ref.storage._makeRequest(s,z,e,t);this._request=n,n.getPromise().then(o=>{this._request=void 0,this._uploadUrl=o,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const e=this._uploadUrl;this._resolveToken((t,s)=>{const n=Ir(this._ref.storage,this._ref._location,e,this._blob),o=this._ref.storage._makeRequest(n,z,t,s);this._request=o,o.getPromise().then(i=>{i=i,this._request=void 0,this._updateProgress(i.current),this._needToFetchStatus=!1,i.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const e=xe*this._chunkMultiplier,t=new ce(this._transferred,this._blob.size()),s=this._uploadUrl;this._resolveToken((n,o)=>{let i;try{i=Tr(this._ref._location,this._ref.storage,s,this._blob,e,this._mappings,t,this._makeProgressCallback())}catch(a){this._error=a,this._transition("error");return}const c=this._ref.storage._makeRequest(i,z,n,o,!1);this._request=c,c.getPromise().then(a=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(a.current),a.finalized?(this._metadata=a.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){xe*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((e,t)=>{const s=mr(this._ref.storage,this._ref._location,this._mappings),n=this._ref.storage._makeRequest(s,z,e,t);this._request=n,n.getPromise().then(o=>{this._request=void 0,this._metadata=o,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((e,t)=>{const s=Rr(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),n=this._ref.storage._makeRequest(s,z,e,t);this._request=n,n.getPromise().then(o=>{this._request=void 0,this._metadata=o,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(e){const t=this._transferred;this._transferred=e,this._transferred!==t&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const t=this._state==="paused";this._state=e,t&&(this._notifyObservers(),this._start());break;case"paused":this._state=e,this._notifyObservers();break;case"canceled":this._error=ze(),this._state=e,this._notifyObservers();break;case"error":this._state=e,this._notifyObservers();break;case"success":this._state=e,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const e=fe(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,t,s,n){const o=new kr(t||void 0,s||void 0,n||void 0);return this._addObserver(o),()=>{this._removeObserver(o)}}then(e,t){return this._promise.then(e,t)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){const t=this._observers.indexOf(e);t!==-1&&this._observers.splice(t,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(t=>{this._notifyObserver(t)})}_finishPromise(){if(this._resolve!==void 0){let e=!0;switch(fe(this._state)){case C.SUCCESS:V(this._resolve.bind(null,this.snapshot))();break;case C.CANCELED:case C.ERROR:const t=this._reject;V(t.bind(null,this._error))();break;default:e=!1;break}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){switch(fe(this._state)){case C.RUNNING:case C.PAUSED:e.next&&V(e.next.bind(e,this.snapshot))();break;case C.SUCCESS:e.complete&&V(e.complete.bind(e))();break;case C.CANCELED:case C.ERROR:e.error&&V(e.error.bind(e,this._error))();break;default:e.error&&V(e.error.bind(e,this._error))()}}resume(){const e=this._state==="paused"||this._state==="pausing";return e&&this._transition("running"),e}pause(){const e=this._state==="running";return e&&this._transition("pausing"),e}cancel(){const e=this._state==="running"||this._state==="pausing";return e&&this._transition("canceling"),e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e,t){this._service=e,t instanceof O?this._location=t:this._location=O.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new W(e,t)}get root(){const e=new O(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Ye(this._location.path)}get storage(){return this._service}get parent(){const e=ur(this._location.path);if(e===null)return null;const t=new O(this._location.bucket,e);return new W(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw Ht(e)}}function Sr(r,e,t){return r._throwIfRoot("uploadBytesResumable"),new Ar(r,new F(e),t)}function Cr(r){r._throwIfRoot("getDownloadURL");const e=wr(r.storage,r._location,Je());return r.storage.makeRequestWithTokens(e,z).then(t=>{if(t===null)throw Ft();return t})}function Or(r){r._throwIfRoot("deleteObject");const e=yr(r.storage,r._location);return r.storage.makeRequestWithTokens(e,z)}function Nr(r,e){const t=lr(r._location.path,e),s=new O(r._location.bucket,t);return new W(r.storage,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xr(r){return/^[A-Za-z]+:\/\//.test(r)}function vr(r,e){return new W(r,e)}function rt(r,e){if(r instanceof Pe){const t=r;if(t._bucket==null)throw Bt();const s=new W(t,t._bucket);return e!=null?rt(s,e):s}else return e!==void 0?Nr(r,e):r}function Dr(r,e){if(e&&xr(e)){if(r instanceof Pe)return vr(r,e);throw be("To use ref(service, url), the first argument must be a Storage instance.")}else return rt(r,e)}function ve(r,e){const t=e?.[Me];return t==null?null:O.makeFromBucketSpec(t,r)}function qr(r,e,t,s={}){r.host=`${e}:${t}`;const n=Le(e);n&&lt(`https://${r.host}/b`),r._isUsingEmulator=!0,r._protocol=n?"https":"http";const{mockUserToken:o}=s;o&&(r._overrideAuthToken=typeof o=="string"?o:ht(o,r.app.options.projectId))}class Pe{constructor(e,t,s,n,o,i=!1){this.app=e,this._authProvider=t,this._appCheckProvider=s,this._url=n,this._firebaseVersion=o,this._isUsingEmulator=i,this._bucket=null,this._host=Fe,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Pt,this._maxUploadRetryTime=At,this._requests=new Set,n!=null?this._bucket=O.makeFromBucketSpec(n,this._host):this._bucket=ve(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=O.makeFromBucketSpec(this._url,e):this._bucket=ve(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Ne("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Ne("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(ut(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new W(this,e)}_makeRequest(e,t,s,n,o=!0){if(this._deleted)return new zt(We());{const i=Qt(e,this._appId,s,n,t,this._firebaseVersion,o,this._isUsingEmulator);return this._requests.add(i),i.getPromise().then(()=>this._requests.delete(i),()=>this._requests.delete(i)),i}}async makeRequestWithTokens(e,t){const[s,n]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,s,n).getPromise()}}const De="@firebase/storage",qe="0.14.3";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const st="storage";function Br(r,e,t){return r=se(r),Sr(r,e,t)}function Lr(r){return r=se(r),Cr(r)}function Be(r){return r=se(r),Or(r)}function ge(r,e){return r=se(r),Dr(r,e)}function Fr(r=it(),e){r=se(r);const s=at(r,st).getImmediate({identifier:e}),n=ct("storage");return n&&Mr(s,...n),s}function Mr(r,e,t,s={}){qr(r,e,t,s)}function Hr(r,{instanceIdentifier:e}){const t=r.getProvider("app").getImmediate(),s=r.getProvider("auth-internal"),n=r.getProvider("app-check-internal");return new Pe(t,s,n,e,gt)}function zr(){pt(new ft(st,Hr,"PUBLIC").setMultipleInstances(!0)),Se(De,qe,""),Se(De,qe,"esm2020")}zr();const $r={apiKey:"AIzaSyDHPYZcizMxhqsIL3ZWwKCBAiqx8ZWRLvY",authDomain:"settlekar-6996b.firebaseapp.com",projectId:"settlekar-6996b",storageBucket:"settlekar-6996b.firebasestorage.app",messagingSenderId:"1066822040792",appId:"1:1066822040792:web:01502badcd6d4215056bad",measurementId:"G-V69LG6V4ZB"},Ae=yt($r),N=_t(Ae),p=mt(Ae),_e=Fr(Ae),nt=new wt;nt.setCustomParameters({prompt:"select_account"});class Wr{async uploadImage(e,t="properties/"){try{const n=(l=>{if("name"in l&&l.name){const d=l.name.split(".");if(d.length>1)return d[d.length-1]}const h=(l.type||"").split("/");return h.length===2?h[1]:"jpg"})(e),o=`${crypto.randomUUID()}.${n}`,i=t.endsWith("/")?t:`${t}/`,c=ge(_e,`${i}${o}`),a=Br(c,e,{customMetadata:{ownerId:N.currentUser?.uid||"unknown",originalFileName:"name"in e?e.name:"unknown",uploadedAt:new Date().toISOString(),fileType:e.type||"image/jpeg"}});return new Promise((l,u)=>{a.on("state_changed",h=>{const d=h.bytesTransferred/h.totalBytes*100;console.log(`Upload is ${d}% done`)},h=>{console.error("Upload error:",h),u(h)},async()=>{try{const h=await Lr(a.snapshot.ref);l(h)}catch(h){u(h)}})})}catch(s){throw console.error("Error uploading image:",s),s}}async uploadMultipleImages(e,t,s=3){try{const n=[],o=[...e];for(;o.length>0;){const l=o.splice(0,s).map(h=>this.uploadImage(h,t)),u=await Promise.allSettled(l);n.push(...u)}const i=n.filter(a=>a.status==="fulfilled").map(a=>a.value),c=n.filter(a=>a.status==="rejected").map((a,l)=>({file:e[l],error:a.reason}));return c.length>0&&console.warn("Some uploads failed:",c),i}catch(n){throw console.error("Error uploading multiple images:",n),n}}async deleteImage(e){try{if(e.startsWith("https://firebasestorage.googleapis.com/v0/b/")){const n=e.split("/o/")[1]?.split("?")[0];if(n){const o=decodeURIComponent(n),i=ge(_e,o);await Be(i);return}}const s=ge(_e,e);await Be(s)}catch(t){console.error("Error deleting image:",t),console.warn("Image deletion failed, but continuing operation")}}}const H="inquiries",me=r=>{const e=r.data();return{id:r.id,...e,createdAt:e.createdAt?.toDate?e.createdAt.toDate():e.createdAt||null,updatedAt:e.updatedAt?.toDate?e.updatedAt.toDate():e.updatedAt||null}};let Q={};class ot{clearCache(){Q={}}async sendInquiry(e){try{const t={propertyId:e.propertyId,propertyTitle:e.propertyTitle,propertyPrice:e.propertyPrice||null,ownerId:e.ownerId,ownerName:e.ownerName||null,inquirerId:e.inquirerId,inquirerName:e.inquirerName||"SettleKar User",inquirerEmail:e.inquirerEmail||"",inquirerPhone:e.inquirerPhone||"",message:e.message||"",createdAt:S(),updatedAt:S()};return await Re(R(p,H),t),this.clearCache(),{success:!0}}catch(t){throw console.error("Error sending inquiry:",t),t}}async getInquiriesByOwner(e,t=!1){const s=Date.now();if(!t&&Q[e]&&s-Q[e].timestamp<3e4)return Q[e].data;try{const o=k(R(p,H),I("ownerId","==",e),re("createdAt","desc")),c=(await A(o)).docs.map(me);return Q[e]={data:c,timestamp:s},c}catch(o){throw console.error("Error fetching owner inquiries:",o),o}}async getInquiriesByProperty(e,t){try{const s=k(R(p,H),I("ownerId","==",e),I("propertyId","==",t),re("createdAt","desc"));return(await A(s)).docs.map(me)}catch(s){throw console.error("Error fetching property inquiries:",s),s}}async checkUserInquiry(e,t){try{const s=k(R(p,H),I("inquirerId","==",e),I("propertyId","==",t)),n=await A(s);if(n.empty)return{hasInquired:!1,inquiryId:null};const o=n.docs[0];return{hasInquired:!0,inquiryId:o.id,inquiry:me(o)}}catch(s){throw console.error("Error checking user inquiry:",s),s}}async deleteInquiry(e){try{return await M(m(p,H,e)),this.clearCache(),{success:!0}}catch(t){throw console.error("Error deleting inquiry:",t),t}}async deleteInquiriesByProperty(e){try{const t=k(R(p,H),I("propertyId","==",e)),n=(await A(t)).docs.map(o=>M(m(p,H,o.id)));return await Promise.all(n),this.clearCache(),{success:!0}}catch(t){throw console.error("Error deleting inquiries by property:",t),t}}}const K=new Wr,Gr=new ot;let ee={};class jr{clearCache(){ee={}}async getAllProperties(){try{const e=await A(R(p,"properties")),t=[];return e.forEach(s=>{t.push({id:s.id,...s.data()})}),t}catch(e){throw console.error("Error getting properties:",e),e}}async getPropertiesByCity(e){try{const t=k(R(p,"properties"),I("city","==",e)),s=await A(t),n=[];return s.forEach(o=>{n.push({id:o.id,...o.data()})}),n}catch(t){throw console.error("Error getting properties by city:",t),t}}getPropertiesRealtime(e,t){const s=k(R(p,"properties"));return ye(s,o=>{const i=[];o.forEach(c=>{i.push({id:c.id,...c.data()})}),e(i)},o=>{t(o)})}async getPropertyById(e){try{const t=m(p,"properties",e),s=await v(t);if(s.exists())return{id:s.id,...s.data()};throw new Error("Property not found")}catch(t){throw t}}async searchProperties(e){try{const t=k(R(p,"properties"),I("keywords","array-contains",e.toLowerCase())),s=await A(t),n=[];return s.forEach(o=>{n.push({id:o.id,...o.data()})}),n}catch(t){throw console.error("Error searching properties:",t),t}}async getFeaturedProperties(){try{const e=k(R(p,"properties"),I("featured","==",!0),re("createdAt","desc")),t=await A(e),s=[];return t.forEach(n=>{s.push({id:n.id,...n.data()})}),s}catch(e){throw console.error("Error getting featured properties:",e),e}}async addProperty(e,t=[],s=[]){try{const n={...e,indoorImages:[],outdoorImages:[],images:[],createdAt:new Date},o=await Re(R(p,"properties"),n),i=o.id;let c=[];t.length>0&&(c=await K.uploadMultipleImages(t,`properties/${i}/`));let a=[];s.length>0&&(a=await K.uploadMultipleImages(s,`properties/${i}/`));const l=[...c,...a],u={...e,indoorImages:c,outdoorImages:a,images:l,createdAt:new Date};return await D(o,u),this.clearCache(),{id:i,...u}}catch(n){throw console.error("Error adding property:",n),n}}async updateProperty(e,t,s=[],n=[],o=[]){try{let i=t.indoorImages||[],c=t.outdoorImages||[],a=t.images||[];if(o.length>0){const g=o.map(E=>K.deleteImage(E));await Promise.all(g),i=i.filter(E=>!o.includes(E)),c=c.filter(E=>!o.includes(E)),a=a.filter(E=>!o.includes(E))}let l=[];s.length>0&&(l=await K.uploadMultipleImages(s,`properties/${e}/indoor/`));let u=[];n.length>0&&(u=await K.uploadMultipleImages(n,`properties/${e}/outdoor/`));const h=[...i,...l],d=[...c,...u],f=[...h,...d],_={...t,indoorImages:h,outdoorImages:d,images:f,updatedAt:new Date},y=m(p,"properties",e);return await D(y,_),this.clearCache(),{success:!0}}catch(i){throw console.error("Error updating property:",i),i}}async getUserProperties(e,t=!1){const s=Date.now();if(!t&&ee[e]&&s-ee[e].timestamp<3e4)return ee[e].data;try{const o=k(R(p,"properties"),I("createdBy","==",e)),i=await A(o),c=[];return i.forEach(a=>{c.push({id:a.id,...a.data()})}),ee[e]={data:c,timestamp:s},c}catch(o){throw console.error("Error getting user properties:",o),o}}async deleteProperty(e){try{const t=await this.getPropertyById(e);if(t.images&&t.images.length>0){const s=t.images.map(n=>K.deleteImage(n));await Promise.all(s)}return await Gr.deleteInquiriesByProperty(e),await M(m(p,"properties",e)),this.clearCache(),{success:!0}}catch(t){throw console.error("Error deleting property:",t),t}}}const we=new Map;class Xr{async addToWishlist(e,t){try{if((await this.isInWishlist(e,t)).exists)throw new Error("Property is already in wishlist");return(await Re(R(p,"wishlists"),{userId:e,propertyId:t,createdAt:new Date})).id}catch(s){throw console.error("Error adding to wishlist:",s),s}}getWishlistRealtime(e,t){const s=k(R(p,"wishlists"),I("userId","==",e),re("createdAt","desc"));return ye(s,async o=>{try{const i=o.docs,a=i.map(d=>d.data().propertyId).filter(Boolean).filter(d=>!we.has(d)),l=10,u=[];for(let d=0;d<a.length;d+=l)u.push(a.slice(d,d+l));if(u.length>0){const d=u.map(async f=>{const _=k(R(p,"properties"),I(Ce(),"in",f));(await A(_)).forEach(g=>{we.set(g.id,{id:g.id,...g.data()})})});await Promise.all(d)}const h=[];for(const d of i){const f=d.data(),_=we.get(f.propertyId);if(_)h.push({id:d.id,propertyId:f.propertyId,property:_,createdAt:f.createdAt});else try{await M(m(p,"wishlists",d.id))}catch(y){console.warn("Failed to cleanup missing property wishlist entry",d.id,y)}}t(h)}catch(i){console.error("Wishlist realtime processing error:",i)}},o=>{console.error("Real-time wishlist error:",o)})}getWishlistCountRealtime(e,t){const s=k(R(p,"wishlists"),I("userId","==",e));return ye(s,n=>{t(n.size)})}async removeFromWishlist(e,t){try{const s=k(R(p,"wishlists"),I("userId","==",e),I("propertyId","==",t)),n=await A(s);if(n.empty)throw new Error("Wishlist item not found");{const o=n.docs[0];await M(m(p,"wishlists",o.id))}}catch(s){throw console.error("Error removing from wishlist:",s),s}}async removeFromWishlistById(e){try{await M(m(p,"wishlists",e))}catch(t){throw console.error("Error removing from wishlist by ID:",t),t}}async getWishlist(e){try{const t=k(R(p,"wishlists"),I("userId","==",e),re("createdAt","desc")),n=(await A(t)).docs,o=n.map(u=>u.data().propertyId).filter(Boolean);if(o.length===0)return[];const i=10,c=[];for(let u=0;u<o.length;u+=i)c.push(o.slice(u,u+i));const a=new Map;await Promise.all(c.map(async u=>{const h=k(R(p,"properties"),I(Ce(),"in",u));(await A(h)).forEach(f=>{a.set(f.id,{id:f.id,...f.data()})})}));const l=[];for(const u of n){const h=u.data(),d=a.get(h.propertyId);if(d)l.push({id:u.id,propertyId:h.propertyId,property:d,createdAt:h.createdAt});else try{await M(m(p,"wishlists",u.id))}catch{}}return l}catch(t){throw console.error("Error getting wishlist:",t),t}}async isInWishlist(e,t){try{const s=k(R(p,"wishlists"),I("userId","==",e),I("propertyId","==",t)),n=await A(s);return{exists:!n.empty,wishlistItemId:n.empty?null:n.docs[0].id}}catch(s){throw console.error("Error checking wishlist:",s),s}}async getWishlistedPropertyIds(e){try{const t=k(R(p,"wishlists"),I("userId","==",e)),s=await A(t),n=[];return s.forEach(o=>{n.push(o.data().propertyId)}),n}catch(t){throw console.error("Error getting wishlisted property IDs:",t),t}}}class Vr{async createOrUpdateUser(e){try{const t=m(p,"users",e.userId);if((await v(t)).exists())return await D(t,{...e,updatedAt:new Date}),{id:e.userId,...e};{const n={...e,createdAt:new Date,updatedAt:new Date};return await ae(t,n),{id:e.userId,...n}}}catch(t){throw console.error("Error creating/updating user:",t),t}}async getUserById(e){try{const t=m(p,"users",e),s=await v(t);return s.exists()?{id:s.id,...s.data()}:null}catch(t){throw console.error("Error getting user:",t),t}}async updateUserProfile(e,t){try{const s=m(p,"users",e);return await D(s,{...t,updatedAt:new Date}),{success:!0}}catch(s){throw console.error("Error updating user profile:",s),s}}async deleteUser(e){try{return await M(m(p,"users",e)),{success:!0}}catch(t){throw console.error("Error deleting user:",t),t}}async googleSignIn(){try{const e=await bt(N,nt);console.log("✅ Google Sign-In successful:");const t=await this.getUserById(e.user.uid);return(!t||!t.username)&&(await this.createOrUpdateUser({userId:e.user.uid,username:e.user.displayName||"",userEmail:e.user.email||"",userPhone:e.user.phoneNumber||"",userBio:"",userprofile:e.user.photoURL||null,role:"tenant",provider:"google"}),console.log("✅ New user document created in Firestore for Google Sign-In")),e.user}catch(e){throw console.error("Google SignIn error:",e),e}}async googleSignOut(){try{await this.logout()}catch(e){throw console.error("Google Sign-Out error:",e),e}}async isSignedInWithGoogle(){const e=N.currentUser;return e?e.providerData.some(t=>t.providerId==="google.com"):!1}async getCurrentGoogleUser(){return N.currentUser}async register(e,t,s){try{const n=await Rt(N,e,t);return await Et(n.user,{displayName:s}),await this.createOrUpdateUser({userId:n.user.uid,username:s.trim(),userEmail:e.trim(),userPhone:"",userBio:"",userprofile:null,role:"tenant",provider:"email"}),n.user}catch(n){throw console.error("Error registering user:",n),n}}async login(e,t){try{const s=await It(N,e,t),n=await this.getUserById(s.user.uid);return(!n||!n.username)&&await this.createOrUpdateUser({userId:s.user.uid,username:s.user.displayName||e.split("@")[0],userEmail:s.user.email||e,userPhone:"",userBio:"",userprofile:null,role:"tenant",provider:"email"}),s.user}catch(s){throw console.error("Error logging in:",s),s}}async logout(){try{const e=N.currentUser?.uid;if(e)try{await this.updateUserProfile(e,{pushToken:null}),console.log("✅ Push token cleared from Firestore on logout")}catch(t){console.error("⚠️ Failed to clear push token on logout:",t)}await Tt(N)}catch(e){throw console.error("Error logging out:",e),e}}async resetPassword(e){try{return await kt(N,e),{success:!0,message:"Password reset email sent successfully"}}catch(t){throw console.error("Error sending password reset email:",t),t}}async autoLogin(){return N.currentUser}getCurrentUser(){return N.currentUser}}class Kr{async createOwnerProfile(e,t){try{const s=m(p,"owners",e);(await v(s)).exists()?await D(s,{...t,updatedAt:S()}):await ae(s,{userId:e,...t,createdAt:S(),updatedAt:S()});const o=m(p,"users",e);return await D(o,{role:"owner",updatedAt:S()}),{success:!0}}catch(s){throw console.error("Error creating owner profile:",s),s}}async getOwnerProfile(e){try{const t=await v(m(p,"owners",e));return t.exists()?t.data():null}catch(t){throw console.error("Error getting owner profile:",t),t}}async createBrokerProfile(e,t){try{const s=m(p,"brokers",e);(await v(s)).exists()?await D(s,{...t,updatedAt:S()}):await ae(s,{userId:e,...t,createdAt:S(),updatedAt:S()});const o=m(p,"users",e);return await D(o,{role:"broker",updatedAt:S()}),{success:!0}}catch(s){throw console.error("Error creating broker profile:",s),s}}async getBrokerProfile(e){try{const t=await v(m(p,"brokers",e));return t.exists()?t.data():null}catch(t){throw console.error("Error getting broker profile:",t),t}}async createFirmProfile(e,t){try{const s=m(p,"firms",e);(await v(s)).exists()?await D(s,{...t,updatedAt:S()}):await ae(s,{userId:e,...t,createdAt:S(),updatedAt:S()});const o=m(p,"users",e);return await D(o,{role:"firm",updatedAt:S()}),{success:!0}}catch(s){throw console.error("Error creating firm profile:",s),s}}async getFirmProfile(e){try{const t=await v(m(p,"firms",e));return t.exists()?t.data():null}catch(t){throw console.error("Error getting firm profile:",t),t}}}class Zr{async submitRating(e,t){const s=N.currentUser;if(!s)throw new Error("You must be signed in to rate a property.");if(t<1||t>5)throw new Error("Rating must be between 1 and 5.");const n=s.uid,o=m(p,"properties",e),i=m(p,"properties",e,"userRatings",n);return await Ut(p,async a=>{if((await a.get(i)).exists())throw new Error("You have already rated this property.");const u=await a.get(o);if(!u.exists())throw new Error("Property does not exist.");const h=u.data();let d=4.5;h.rating&&(d=parseFloat(h.rating)||4.5);let f=Number(h.ratingCount)||1,_=d*f;const y=f+1,g=_+t,E=Math.round(g/y*10)/10;return a.set(i,{rating:t,createdAt:new Date,userId:n}),a.update(o,{rating:E.toFixed(1),ratingCount:y,ratingSum:g,updatedAt:new Date}),{average:E,count:y}})}async getUserSubmittedRating(e,t){try{const s=m(p,"properties",e,"userRatings",t),n=await v(s);return n.exists()&&Number(n.data().rating)||null}catch(s){return console.error("Error fetching user rating:",s),null}}}const x=new jr,Jr=new Xr,Qr=new ot,es=new Vr,ts=new Kr,rs=new Zr,ss={clearCache:()=>{x.clearCache()},getAllProperties:async()=>x.getAllProperties(),getPropertiesByCity:async r=>x.getPropertiesByCity(r),getPropertiesRealtime(r,e){return x.getPropertiesRealtime(r,e)},getPropertyById:async r=>x.getPropertyById(r),searchProperties:async r=>x.searchProperties(r),getFeaturedProperties:async()=>x.getFeaturedProperties(),addProperty:async(r,e=[],t=[])=>x.addProperty(r,e,t),updateProperty:async(r,e,t=[],s=[],n=[])=>x.updateProperty(r,e,t,s,n),getUserProperties:async(r,e=!1)=>x.getUserProperties(r,e),deleteProperty:async r=>x.deleteProperty(r)};export{N as a,p as d,Qr as i,ts as o,ss as p,rs as r,es as u,Jr as w};

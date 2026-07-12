import{v as Qe,x as Z,_ as et,y as tt,z as nt,A as Ne,B as rt,C as st,F as ot,D as it,E as at,G as Te,S as ct,H as ut,I as lt,J as ht,K as dt,q as C,k as U,w as I,l as O,a as de,d as X,m as pe,j as Ee,t as ve,u as ke,g as pt,p as ft}from"./firebase-vendor-W9RrfMRn.js";/**
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
 */const xe="firebasestorage.googleapis.com",De="storageBucket",_t=120*1e3,mt=600*1e3,gt=1e3;/**
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
 */class f extends ot{constructor(e,n,r=0){super(ie(e),`Firebase Storage: ${n} (${ie(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,f.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return ie(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var p;(function(t){t.UNKNOWN="unknown",t.OBJECT_NOT_FOUND="object-not-found",t.BUCKET_NOT_FOUND="bucket-not-found",t.PROJECT_NOT_FOUND="project-not-found",t.QUOTA_EXCEEDED="quota-exceeded",t.UNAUTHENTICATED="unauthenticated",t.UNAUTHORIZED="unauthorized",t.UNAUTHORIZED_APP="unauthorized-app",t.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",t.INVALID_CHECKSUM="invalid-checksum",t.CANCELED="canceled",t.INVALID_EVENT_NAME="invalid-event-name",t.INVALID_URL="invalid-url",t.INVALID_DEFAULT_BUCKET="invalid-default-bucket",t.NO_DEFAULT_BUCKET="no-default-bucket",t.CANNOT_SLICE_BLOB="cannot-slice-blob",t.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",t.NO_DOWNLOAD_URL="no-download-url",t.INVALID_ARGUMENT="invalid-argument",t.INVALID_ARGUMENT_COUNT="invalid-argument-count",t.APP_DELETED="app-deleted",t.INVALID_ROOT_OPERATION="invalid-root-operation",t.INVALID_FORMAT="invalid-format",t.INTERNAL_ERROR="internal-error",t.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(p||(p={}));function ie(t){return"storage/"+t}function _e(){const t="An unknown error occurred, please check the error payload for server response.";return new f(p.UNKNOWN,t)}function yt(t){return new f(p.OBJECT_NOT_FOUND,"Object '"+t+"' does not exist.")}function wt(t){return new f(p.QUOTA_EXCEEDED,"Quota for bucket '"+t+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function bt(){const t="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new f(p.UNAUTHENTICATED,t)}function Rt(){return new f(p.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Tt(t){return new f(p.UNAUTHORIZED,"User does not have permission to access '"+t+"'.")}function qe(){return new f(p.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Le(){return new f(p.CANCELED,"User canceled the upload/download.")}function Et(t){return new f(p.INVALID_URL,"Invalid URL '"+t+"'.")}function kt(t){return new f(p.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+t+"'.")}function Ut(){return new f(p.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+De+"' property when initializing the app?")}function Be(){return new f(p.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function It(){return new f(p.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function At(){return new f(p.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function Pt(t){return new f(p.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function fe(t){return new f(p.INVALID_ARGUMENT,t)}function Me(){return new f(p.APP_DELETED,"The Firebase app was deleted.")}function St(t){return new f(p.INVALID_ROOT_OPERATION,"The operation '"+t+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function K(t,e){return new f(p.INVALID_FORMAT,"String does not match format '"+t+"': "+e)}function G(t){throw new f(p.INTERNAL_ERROR,"Internal error: "+t)}/**
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
 */class k{constructor(e,n){this.bucket=e,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,n){let r;try{r=k.makeFromUrl(e,n)}catch{return new k(e,"")}if(r.path==="")return r;throw kt(e)}static makeFromUrl(e,n){let r=null;const s="([A-Za-z0-9.\\-_]+)";function o(y){y.path.charAt(y.path.length-1)==="/"&&(y.path_=y.path_.slice(0,-1))}const i="(/(.*))?$",c=new RegExp("^gs://"+s+i,"i"),a={bucket:1,path:3};function l(y){y.path_=decodeURIComponent(y.path)}const u="v[A-Za-z0-9_]+",h=n.replace(/[.]/g,"\\."),_="(/([^?#]*).*)?$",m=new RegExp(`^https?://${h}/${u}/b/${s}/o${_}`,"i"),g={bucket:1,path:3},b=n===xe?"(?:storage.googleapis.com|storage.cloud.google.com)":n,d="([^?#]*)",P=new RegExp(`^https?://${b}/${s}/${d}`,"i"),R=[{regex:c,indices:a,postModify:o},{regex:m,indices:g,postModify:l},{regex:P,indices:{bucket:1,path:2},postModify:l}];for(let y=0;y<R.length;y++){const F=R[y],H=F.regex.exec(e);if(H){const se=H[F.indices.bucket];let j=H[F.indices.path];j||(j=""),r=new k(se,j),F.postModify(r);break}}if(r==null)throw Et(e);return r}}class Ct{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
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
 */function Ot(t,e,n){let r=1,s=null,o=null,i=!1,c=0;function a(){return c===2}let l=!1;function u(...d){l||(l=!0,e.apply(null,d))}function h(d){s=setTimeout(()=>{s=null,t(m,a())},d)}function _(){o&&clearTimeout(o)}function m(d,...P){if(l){_();return}if(d){_(),u.call(null,d,...P);return}if(a()||i){_(),u.call(null,d,...P);return}r<64&&(r*=2);let R;c===1?(c=2,R=0):R=(r+Math.random())*1e3,h(R)}let g=!1;function b(d){g||(g=!0,_(),!l&&(s!==null?(d||(c=2),clearTimeout(s),h(0)):d||(c=1)))}return h(0),o=setTimeout(()=>{i=!0,b(!0)},n),b}function Nt(t){t(!1)}/**
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
 */function vt(t){return t!==void 0}function xt(t){return typeof t=="function"}function Dt(t){return typeof t=="object"&&!Array.isArray(t)}function re(t){return typeof t=="string"||t instanceof String}function Ue(t){return me()&&t instanceof Blob}function me(){return typeof Blob<"u"}function Ie(t,e,n,r){if(r<e)throw fe(`Invalid value for '${t}'. Expected ${e} or greater.`);if(r>n)throw fe(`Invalid value for '${t}'. Expected ${n} or less.`)}/**
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
 */function $(t,e,n){let r=e;return n==null&&(r=`https://${e}`),`${n}://${r}/v0${t}`}function Fe(t){const e=encodeURIComponent;let n="?";for(const r in t)if(t.hasOwnProperty(r)){const s=e(r)+"="+e(t[r]);n=n+s+"&"}return n=n.slice(0,-1),n}var L;(function(t){t[t.NO_ERROR=0]="NO_ERROR",t[t.NETWORK_ERROR=1]="NETWORK_ERROR",t[t.ABORT=2]="ABORT"})(L||(L={}));/**
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
 */function He(t,e){const n=t>=500&&t<600,s=[408,429].indexOf(t)!==-1,o=e.indexOf(t)!==-1;return n||s||o}/**
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
 */class qt{constructor(e,n,r,s,o,i,c,a,l,u,h,_=!0,m=!1){this.url_=e,this.method_=n,this.headers_=r,this.body_=s,this.successCodes_=o,this.additionalRetryCodes_=i,this.callback_=c,this.errorCallback_=a,this.timeout_=l,this.progressCallback_=u,this.connectionFactory_=h,this.retry=_,this.isUsingEmulator=m,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((g,b)=>{this.resolve_=g,this.reject_=b,this.start_()})}start_(){const e=(r,s)=>{if(s){r(!1,new J(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const i=c=>{const a=c.loaded,l=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(a,l)};this.progressCallback_!==null&&o.addUploadProgressListener(i),o.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(i),this.pendingConnection_=null;const c=o.getErrorCode()===L.NO_ERROR,a=o.getStatus();if(!c||He(a,this.additionalRetryCodes_)&&this.retry){const u=o.getErrorCode()===L.ABORT;r(!1,new J(!1,null,u));return}const l=this.successCodes_.indexOf(a)!==-1;r(!0,new J(l,o))})},n=(r,s)=>{const o=this.resolve_,i=this.reject_,c=s.connection;if(s.wasSuccessCode)try{const a=this.callback_(c,c.getResponse());vt(a)?o(a):o()}catch(a){i(a)}else if(c!==null){const a=_e();a.serverResponse=c.getErrorText(),this.errorCallback_?i(this.errorCallback_(c,a)):i(a)}else if(s.canceled){const a=this.appDelete_?Me():Le();i(a)}else{const a=qe();i(a)}};this.canceled_?n(!1,new J(!1,null,!0)):this.backoffId_=Ot(e,n,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&Nt(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class J{constructor(e,n,r){this.wasSuccessCode=e,this.connection=n,this.canceled=!!r}}function Lt(t,e){e!==null&&e.length>0&&(t.Authorization="Firebase "+e)}function Bt(t,e){t["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function Mt(t,e){e&&(t["X-Firebase-GMPID"]=e)}function Ft(t,e){e!==null&&(t["X-Firebase-AppCheck"]=e)}function Ht(t,e,n,r,s,o,i=!0,c=!1){const a=Fe(t.urlParams),l=t.url+a,u=Object.assign({},t.headers);return Mt(u,e),Lt(u,n),Bt(u,o),Ft(u,r),new qt(l,t.method,u,t.body,t.successCodes,t.additionalRetryCodes,t.handler,t.errorHandler,t.timeout,t.progressCallback,s,i,c)}/**
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
 */function zt(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function $t(...t){const e=zt();if(e!==void 0){const n=new e;for(let r=0;r<t.length;r++)n.append(t[r]);return n.getBlob()}else{if(me())return new Blob(t);throw new f(p.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function jt(t,e,n){return t.webkitSlice?t.webkitSlice(e,n):t.mozSlice?t.mozSlice(e,n):t.slice?t.slice(e,n):null}/**
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
 */function Gt(t){if(typeof atob>"u")throw Pt("base-64");return atob(t)}/**
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
 */const A={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class ae{constructor(e,n){this.data=e,this.contentType=n||null}}function Vt(t,e){switch(t){case A.RAW:return new ae(ze(e));case A.BASE64:case A.BASE64URL:return new ae($e(t,e));case A.DATA_URL:return new ae(Xt(e),Kt(e))}throw _e()}function ze(t){const e=[];for(let n=0;n<t.length;n++){let r=t.charCodeAt(n);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(n<t.length-1&&(t.charCodeAt(n+1)&64512)===56320))e.push(239,191,189);else{const o=r,i=t.charCodeAt(++n);r=65536|(o&1023)<<10|i&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function Wt(t){let e;try{e=decodeURIComponent(t)}catch{throw K(A.DATA_URL,"Malformed data URL.")}return ze(e)}function $e(t,e){switch(t){case A.BASE64:{const s=e.indexOf("-")!==-1,o=e.indexOf("_")!==-1;if(s||o)throw K(t,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case A.BASE64URL:{const s=e.indexOf("+")!==-1,o=e.indexOf("/")!==-1;if(s||o)throw K(t,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=Gt(e)}catch(s){throw s.message.includes("polyfill")?s:K(t,"Invalid character found")}const r=new Uint8Array(n.length);for(let s=0;s<n.length;s++)r[s]=n.charCodeAt(s);return r}class je{constructor(e){this.base64=!1,this.contentType=null;const n=e.match(/^data:([^,]+)?,/);if(n===null)throw K(A.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=n[1]||null;r!=null&&(this.base64=Zt(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}}function Xt(t){const e=new je(t);return e.base64?$e(A.BASE64,e.rest):Wt(e.rest)}function Kt(t){return new je(t).contentType}function Zt(t,e){return t.length>=e.length?t.substring(t.length-e.length)===e:!1}/**
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
 */class v{constructor(e,n){let r=0,s="";Ue(e)?(this.data_=e,r=e.size,s=e.type):e instanceof ArrayBuffer?(n?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(n?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=s}size(){return this.size_}type(){return this.type_}slice(e,n){if(Ue(this.data_)){const r=this.data_,s=jt(r,e,n);return s===null?null:new v(s)}else{const r=new Uint8Array(this.data_.buffer,e,n-e);return new v(r,!0)}}static getBlob(...e){if(me()){const n=e.map(r=>r instanceof v?r.data_:r);return new v($t.apply(null,n))}else{const n=e.map(i=>re(i)?Vt(A.RAW,i).data:i.data_);let r=0;n.forEach(i=>{r+=i.byteLength});const s=new Uint8Array(r);let o=0;return n.forEach(i=>{for(let c=0;c<i.length;c++)s[o++]=i[c]}),new v(s,!0)}}uploadData(){return this.data_}}/**
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
 */function Ge(t){let e;try{e=JSON.parse(t)}catch{return null}return Dt(e)?e:null}/**
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
 */function Yt(t){if(t.length===0)return null;const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function Jt(t,e){const n=e.split("/").filter(r=>r.length>0).join("/");return t.length===0?n:t+"/"+n}function Ve(t){const e=t.lastIndexOf("/",t.length-2);return e===-1?t:t.slice(e+1)}/**
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
 */function Qt(t,e){return e}class T{constructor(e,n,r,s){this.server=e,this.local=n||e,this.writable=!!r,this.xform=s||Qt}}let Q=null;function en(t){return!re(t)||t.length<2?t:Ve(t)}function We(){if(Q)return Q;const t=[];t.push(new T("bucket")),t.push(new T("generation")),t.push(new T("metageneration")),t.push(new T("name","fullPath",!0));function e(o,i){return en(i)}const n=new T("name");n.xform=e,t.push(n);function r(o,i){return i!==void 0?Number(i):i}const s=new T("size");return s.xform=r,t.push(s),t.push(new T("timeCreated")),t.push(new T("updated")),t.push(new T("md5Hash",null,!0)),t.push(new T("cacheControl",null,!0)),t.push(new T("contentDisposition",null,!0)),t.push(new T("contentEncoding",null,!0)),t.push(new T("contentLanguage",null,!0)),t.push(new T("contentType",null,!0)),t.push(new T("metadata","customMetadata",!0)),Q=t,Q}function tn(t,e){function n(){const r=t.bucket,s=t.fullPath,o=new k(r,s);return e._makeStorageReference(o)}Object.defineProperty(t,"ref",{get:n})}function nn(t,e,n){const r={};r.type="file";const s=n.length;for(let o=0;o<s;o++){const i=n[o];r[i.local]=i.xform(r,e[i.server])}return tn(r,t),r}function Xe(t,e,n){const r=Ge(e);return r===null?null:nn(t,r,n)}function rn(t,e,n,r){const s=Ge(e);if(s===null||!re(s.downloadTokens))return null;const o=s.downloadTokens;if(o.length===0)return null;const i=encodeURIComponent;return o.split(",").map(l=>{const u=t.bucket,h=t.fullPath,_="/b/"+i(u)+"/o/"+i(h),m=$(_,n,r),g=Fe({alt:"media",token:l});return m+g})[0]}function Ke(t,e){const n={},r=e.length;for(let s=0;s<r;s++){const o=e[s];o.writable&&(n[o.server]=t[o.local])}return JSON.stringify(n)}class M{constructor(e,n,r,s){this.url=e,this.method=n,this.handler=r,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
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
 */function N(t){if(!t)throw _e()}function ge(t,e){function n(r,s){const o=Xe(t,s,e);return N(o!==null),o}return n}function sn(t,e){function n(r,s){const o=Xe(t,s,e);return N(o!==null),rn(o,s,t.host,t._protocol)}return n}function Y(t){function e(n,r){let s;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?s=Rt():s=bt():n.getStatus()===402?s=wt(t.bucket):n.getStatus()===403?s=Tt(t.path):s=r,s.status=n.getStatus(),s.serverResponse=r.serverResponse,s}return e}function ye(t){const e=Y(t);function n(r,s){let o=e(r,s);return r.getStatus()===404&&(o=yt(t.path)),o.serverResponse=s.serverResponse,o}return n}function on(t,e,n){const r=e.fullServerUrl(),s=$(r,t.host,t._protocol),o="GET",i=t.maxOperationRetryTime,c=new M(s,o,ge(t,n),i);return c.errorHandler=ye(e),c}function an(t,e,n){const r=e.fullServerUrl(),s=$(r,t.host,t._protocol),o="GET",i=t.maxOperationRetryTime,c=new M(s,o,sn(t,n),i);return c.errorHandler=ye(e),c}function cn(t,e){const n=e.fullServerUrl(),r=$(n,t.host,t._protocol),s="DELETE",o=t.maxOperationRetryTime;function i(a,l){}const c=new M(r,s,i,o);return c.successCodes=[200,204],c.errorHandler=ye(e),c}function un(t,e){return t&&t.contentType||e&&e.type()||"application/octet-stream"}function Ze(t,e,n){const r=Object.assign({},n);return r.fullPath=t.path,r.size=e.size(),r.contentType||(r.contentType=un(null,e)),r}function ln(t,e,n,r,s){const o=e.bucketOnlyServerUrl(),i={"X-Goog-Upload-Protocol":"multipart"};function c(){let R="";for(let y=0;y<2;y++)R=R+Math.random().toString().slice(2);return R}const a=c();i["Content-Type"]="multipart/related; boundary="+a;const l=Ze(e,r,s),u=Ke(l,n),h="--"+a+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+u+`\r
--`+a+`\r
Content-Type: `+l.contentType+`\r
\r
`,_=`\r
--`+a+"--",m=v.getBlob(h,r,_);if(m===null)throw Be();const g={name:l.fullPath},b=$(o,t.host,t._protocol),d="POST",P=t.maxUploadRetryTime,S=new M(b,d,ge(t,n),P);return S.urlParams=g,S.headers=i,S.body=m.uploadData(),S.errorHandler=Y(e),S}class ne{constructor(e,n,r,s){this.current=e,this.total=n,this.finalized=!!r,this.metadata=s||null}}function we(t,e){let n=null;try{n=t.getResponseHeader("X-Goog-Upload-Status")}catch{N(!1)}return N(!!n&&(e||["active"]).indexOf(n)!==-1),n}function hn(t,e,n,r,s){const o=e.bucketOnlyServerUrl(),i=Ze(e,r,s),c={name:i.fullPath},a=$(o,t.host,t._protocol),l="POST",u={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${r.size()}`,"X-Goog-Upload-Header-Content-Type":i.contentType,"Content-Type":"application/json; charset=utf-8"},h=Ke(i,n),_=t.maxUploadRetryTime;function m(b){we(b);let d;try{d=b.getResponseHeader("X-Goog-Upload-URL")}catch{N(!1)}return N(re(d)),d}const g=new M(a,l,m,_);return g.urlParams=c,g.headers=u,g.body=h,g.errorHandler=Y(e),g}function dn(t,e,n,r){const s={"X-Goog-Upload-Command":"query"};function o(l){const u=we(l,["active","final"]);let h=null;try{h=l.getResponseHeader("X-Goog-Upload-Size-Received")}catch{N(!1)}h||N(!1);const _=Number(h);return N(!isNaN(_)),new ne(_,r.size(),u==="final")}const i="POST",c=t.maxUploadRetryTime,a=new M(n,i,o,c);return a.headers=s,a.errorHandler=Y(e),a}const Ae=256*1024;function pn(t,e,n,r,s,o,i,c){const a=new ne(0,0);if(i?(a.current=i.current,a.total=i.total):(a.current=0,a.total=r.size()),r.size()!==a.total)throw It();const l=a.total-a.current;let u=l;s>0&&(u=Math.min(u,s));const h=a.current,_=h+u;let m="";u===0?m="finalize":l===u?m="upload, finalize":m="upload";const g={"X-Goog-Upload-Command":m,"X-Goog-Upload-Offset":`${a.current}`},b=r.slice(h,_);if(b===null)throw Be();function d(y,F){const H=we(y,["active","final"]),se=a.current+u,j=r.size();let oe;return H==="final"?oe=ge(e,o)(y,F):oe=null,new ne(se,j,H==="final",oe)}const P="POST",S=e.maxUploadRetryTime,R=new M(n,P,d,S);return R.headers=g,R.body=b.uploadData(),R.progressCallback=c||null,R.errorHandler=Y(t),R}const E={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function ce(t){switch(t){case"running":case"pausing":case"canceling":return E.RUNNING;case"paused":return E.PAUSED;case"success":return E.SUCCESS;case"canceled":return E.CANCELED;case"error":return E.ERROR;default:return E.ERROR}}/**
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
 */class fn{constructor(e,n,r){if(xt(e)||n!=null||r!=null)this.next=e,this.error=n??void 0,this.complete=r??void 0;else{const o=e;this.next=o.next,this.error=o.error,this.complete=o.complete}}}/**
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
 */function z(t){return(...e)=>{Promise.resolve().then(()=>t(...e))}}class _n{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=L.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=L.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=L.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,n,r,s,o){if(this.sent_)throw G("cannot .send() more than once");if(Ne(e)&&r&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(n,e,!0),o!==void 0)for(const i in o)o.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,o[i].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw G("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw G("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw G("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw G("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class mn extends _n{initXhr(){this.xhr_.responseType="text"}}function q(){return new mn}/**
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
 */class gn{isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}constructor(e,n,r=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=n,this._metadata=r,this._mappings=We(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=s=>{if(this._request=void 0,this._chunkMultiplier=1,s._codeEquals(p.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const o=this.isExponentialBackoffExpired();if(He(s.status,[]))if(o)s=qe();else{this.sleepTime=Math.max(this.sleepTime*2,gt),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=s,this._transition("error")}},this._metadataErrorHandler=s=>{this._request=void 0,s._codeEquals(p.CANCELED)?this.completeTransitions_():(this._error=s,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((s,o)=>{this._resolve=s,this._reject=o,this._start()}),this._promise.then(null,()=>{})}_makeProgressCallback(){const e=this._transferred;return n=>this._updateProgress(e+n)}_shouldDoResumable(e){return e.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([n,r])=>{switch(this._state){case"running":e(n,r);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((e,n)=>{const r=hn(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),s=this._ref.storage._makeRequest(r,q,e,n);this._request=s,s.getPromise().then(o=>{this._request=void 0,this._uploadUrl=o,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const e=this._uploadUrl;this._resolveToken((n,r)=>{const s=dn(this._ref.storage,this._ref._location,e,this._blob),o=this._ref.storage._makeRequest(s,q,n,r);this._request=o,o.getPromise().then(i=>{i=i,this._request=void 0,this._updateProgress(i.current),this._needToFetchStatus=!1,i.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const e=Ae*this._chunkMultiplier,n=new ne(this._transferred,this._blob.size()),r=this._uploadUrl;this._resolveToken((s,o)=>{let i;try{i=pn(this._ref._location,this._ref.storage,r,this._blob,e,this._mappings,n,this._makeProgressCallback())}catch(a){this._error=a,this._transition("error");return}const c=this._ref.storage._makeRequest(i,q,s,o,!1);this._request=c,c.getPromise().then(a=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(a.current),a.finalized?(this._metadata=a.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){Ae*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((e,n)=>{const r=on(this._ref.storage,this._ref._location,this._mappings),s=this._ref.storage._makeRequest(r,q,e,n);this._request=s,s.getPromise().then(o=>{this._request=void 0,this._metadata=o,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((e,n)=>{const r=ln(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),s=this._ref.storage._makeRequest(r,q,e,n);this._request=s,s.getPromise().then(o=>{this._request=void 0,this._metadata=o,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(e){const n=this._transferred;this._transferred=e,this._transferred!==n&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const n=this._state==="paused";this._state=e,n&&(this._notifyObservers(),this._start());break;case"paused":this._state=e,this._notifyObservers();break;case"canceled":this._error=Le(),this._state=e,this._notifyObservers();break;case"error":this._state=e,this._notifyObservers();break;case"success":this._state=e,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const e=ce(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,n,r,s){const o=new fn(n||void 0,r||void 0,s||void 0);return this._addObserver(o),()=>{this._removeObserver(o)}}then(e,n){return this._promise.then(e,n)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){const n=this._observers.indexOf(e);n!==-1&&this._observers.splice(n,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(n=>{this._notifyObserver(n)})}_finishPromise(){if(this._resolve!==void 0){let e=!0;switch(ce(this._state)){case E.SUCCESS:z(this._resolve.bind(null,this.snapshot))();break;case E.CANCELED:case E.ERROR:const n=this._reject;z(n.bind(null,this._error))();break;default:e=!1;break}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){switch(ce(this._state)){case E.RUNNING:case E.PAUSED:e.next&&z(e.next.bind(e,this.snapshot))();break;case E.SUCCESS:e.complete&&z(e.complete.bind(e))();break;case E.CANCELED:case E.ERROR:e.error&&z(e.error.bind(e,this._error))();break;default:e.error&&z(e.error.bind(e,this._error))()}}resume(){const e=this._state==="paused"||this._state==="pausing";return e&&this._transition("running"),e}pause(){const e=this._state==="running";return e&&this._transition("pausing"),e}cancel(){const e=this._state==="running"||this._state==="pausing";return e&&this._transition("canceling"),e}}/**
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
 */class B{constructor(e,n){this._service=e,n instanceof k?this._location=n:this._location=k.makeFromUrl(n,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,n){return new B(e,n)}get root(){const e=new k(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Ve(this._location.path)}get storage(){return this._service}get parent(){const e=Yt(this._location.path);if(e===null)return null;const n=new k(this._location.bucket,e);return new B(this._service,n)}_throwIfRoot(e){if(this._location.path==="")throw St(e)}}function yn(t,e,n){return t._throwIfRoot("uploadBytesResumable"),new gn(t,new v(e),n)}function wn(t){t._throwIfRoot("getDownloadURL");const e=an(t.storage,t._location,We());return t.storage.makeRequestWithTokens(e,q).then(n=>{if(n===null)throw At();return n})}function bn(t){t._throwIfRoot("deleteObject");const e=cn(t.storage,t._location);return t.storage.makeRequestWithTokens(e,q)}function Rn(t,e){const n=Jt(t._location.path,e),r=new k(t._location.bucket,n);return new B(t.storage,r)}/**
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
 */function Tn(t){return/^[A-Za-z]+:\/\//.test(t)}function En(t,e){return new B(t,e)}function Ye(t,e){if(t instanceof be){const n=t;if(n._bucket==null)throw Ut();const r=new B(n,n._bucket);return e!=null?Ye(r,e):r}else return e!==void 0?Rn(t,e):t}function kn(t,e){if(e&&Tn(e)){if(t instanceof be)return En(t,e);throw fe("To use ref(service, url), the first argument must be a Storage instance.")}else return Ye(t,e)}function Pe(t,e){const n=e?.[De];return n==null?null:k.makeFromBucketSpec(n,t)}function Un(t,e,n,r={}){t.host=`${e}:${n}`;const s=Ne(e);s&&rt(`https://${t.host}/b`),t._isUsingEmulator=!0,t._protocol=s?"https":"http";const{mockUserToken:o}=r;o&&(t._overrideAuthToken=typeof o=="string"?o:st(o,t.app.options.projectId))}class be{constructor(e,n,r,s,o,i=!1){this.app=e,this._authProvider=n,this._appCheckProvider=r,this._url=s,this._firebaseVersion=o,this._isUsingEmulator=i,this._bucket=null,this._host=xe,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=_t,this._maxUploadRetryTime=mt,this._requests=new Set,s!=null?this._bucket=k.makeFromBucketSpec(s,this._host):this._bucket=Pe(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=k.makeFromBucketSpec(this._url,e):this._bucket=Pe(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Ie("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Ie("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const n=await e.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){if(nt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new B(this,e)}_makeRequest(e,n,r,s,o=!0){if(this._deleted)return new Ct(Me());{const i=Ht(e,this._appId,r,s,n,this._firebaseVersion,o,this._isUsingEmulator);return this._requests.add(i),i.getPromise().then(()=>this._requests.delete(i),()=>this._requests.delete(i)),i}}async makeRequestWithTokens(e,n){const[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,n,r,s).getPromise()}}const Se="@firebase/storage",Ce="0.14.3";/**
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
 */const Je="storage";function In(t,e,n){return t=Z(t),yn(t,e,n)}function An(t){return t=Z(t),wn(t)}function Oe(t){return t=Z(t),bn(t)}function ue(t,e){return t=Z(t),kn(t,e)}function Pn(t=Qe(),e){t=Z(t);const r=et(t,Je).getImmediate({identifier:e}),s=tt("storage");return s&&Sn(r,...s),r}function Sn(t,e,n,r={}){Un(t,e,n,r)}function Cn(t,{instanceIdentifier:e}){const n=t.getProvider("app").getImmediate(),r=t.getProvider("auth-internal"),s=t.getProvider("app-check-internal");return new be(n,r,s,e,ct)}function On(){it(new at(Je,Cn,"PUBLIC").setMultipleInstances(!0)),Te(Se,Ce,""),Te(Se,Ce,"esm2020")}On();const Nn={apiKey:"AIzaSyDHPYZcizMxhqsIL3ZWwKCBAiqx8ZWRLvY",authDomain:"settlekar-6996b.firebaseapp.com",projectId:"settlekar-6996b",storageBucket:"settlekar-6996b.firebasestorage.app",messagingSenderId:"1066822040792",appId:"1:1066822040792:web:01502badcd6d4215056bad",measurementId:"G-V69LG6V4ZB"},Re=dt(Nn),vn=ut(Re),w=lt(Re),le=Pn(Re),xn=new ht;xn.setCustomParameters({prompt:"select_account"});const D={uploadImage:async(t,e="properties/")=>{try{const r=(a=>{if("name"in a&&a.name){const h=a.name.split(".");if(h.length>1)return h[h.length-1]}const u=(a.type||"").split("/");return u.length===2?u[1]:"jpg"})(t),s=`${crypto.randomUUID()}.${r}`,o=e.endsWith("/")?e:`${e}/`,i=ue(le,`${o}${s}`),c=In(i,t,{customMetadata:{ownerId:vn.currentUser?.uid||"unknown",originalFileName:"name"in t?t.name:"unknown",uploadedAt:new Date().toISOString(),fileType:t.type||"image/jpeg"}});return new Promise((a,l)=>{c.on("state_changed",u=>{const h=u.bytesTransferred/u.totalBytes*100;console.log(`Upload is ${h}% done`)},u=>{console.error("Upload error:",u),l(u)},async()=>{try{const u=await An(c.snapshot.ref);a(u)}catch(u){l(u)}})})}catch(n){throw console.error("Error uploading image:",n),n}},uploadMultipleImages:async(t,e,n=3)=>{try{const r=[],s=[...t];for(;s.length>0;){const a=s.splice(0,n).map(u=>D.uploadImage(u,e)),l=await Promise.allSettled(a);r.push(...l)}const o=r.filter(c=>c.status==="fulfilled").map(c=>c.value),i=r.filter(c=>c.status==="rejected").map((c,a)=>({file:t[a],error:c.reason}));return i.length>0&&console.warn("Some uploads failed:",i),o}catch(r){throw console.error("Error uploading multiple images:",r),r}},deleteImage:async t=>{try{if(t.startsWith("https://firebasestorage.googleapis.com/v0/b/")){const r=t.split("/o/")[1]?.split("?")[0];if(r){const s=decodeURIComponent(r),o=ue(le,s);await Oe(o);return}}const n=ue(le,t);await Oe(n)}catch(e){console.error("Error deleting image:",e),console.warn("Image deletion failed, but continuing operation")}}},Dn=(t,e={})=>{if(typeof window.fbq!="function"){console.log("Pixel not ready:",t);return}typeof window<"u"&&window.fbq&&window.fbq("track",t,e)},x="inquiries",he=t=>{const e=t.data();return{id:t.id,...e,createdAt:e.createdAt?.toDate?e.createdAt.toDate():e.createdAt||null,updatedAt:e.updatedAt?.toDate?e.updatedAt.toDate():e.updatedAt||null}};let V={};const te={clearCache(){V={}},async sendInquiry(t){try{const e={propertyId:t.propertyId,propertyTitle:t.propertyTitle,propertyPrice:t.propertyPrice||null,ownerId:t.ownerId,ownerName:t.ownerName||null,inquirerId:t.inquirerId,inquirerName:t.inquirerName||"SettleKar User",inquirerEmail:t.inquirerEmail||"",inquirerPhone:t.inquirerPhone||"",message:t.message||"",createdAt:Ee(),updatedAt:Ee()};return Dn("Lead",{property_id:t.propertyId}),await ve(U(w,x),e),te.clearCache(),{success:!0}}catch(e){throw console.error("Error sending inquiry:",e),e}},async getInquiriesByOwner(t,e=!1){const n=Date.now();if(!e&&V[t]&&n-V[t].timestamp<3e4)return V[t].data;try{const s=C(U(w,x),I("ownerId","==",t),pe("createdAt","desc")),i=(await O(s)).docs.map(he);return V[t]={data:i,timestamp:n},i}catch(s){throw console.error("Error fetching owner inquiries:",s),s}},async getInquiriesByProperty(t,e){try{const n=C(U(w,x),I("ownerId","==",t),I("propertyId","==",e),pe("createdAt","desc"));return(await O(n)).docs.map(he)}catch(n){throw console.error("Error fetching property inquiries:",n),n}},async checkUserInquiry(t,e){try{const n=C(U(w,x),I("inquirerId","==",t),I("propertyId","==",e)),r=await O(n);if(r.empty)return{hasInquired:!1,inquiryId:null};const s=r.docs[0];return{hasInquired:!0,inquiryId:s.id,inquiry:he(s)}}catch(n){throw console.error("Error checking user inquiry:",n),n}},async deleteInquiry(t){try{return await de(X(w,x,t)),te.clearCache(),{success:!0}}catch(e){throw console.error("Error deleting inquiry:",e),e}},async deleteInquiriesByProperty(t){try{const e=C(U(w,x),I("propertyId","==",t)),r=(await O(e)).docs.map(s=>de(X(w,x,s.id)));return await Promise.all(r),te.clearCache(),{success:!0}}catch(e){throw console.error("Error deleting inquiries by property:",e),e}}};let W={};const ee={clearCache:()=>{W={}},getAllProperties:async()=>{try{const t=await O(U(w,"properties")),e=[];return t.forEach(n=>{e.push({id:n.id,...n.data()})}),e}catch(t){throw console.error("Error getting properties:",t),t}},getPropertiesByCity:async t=>{try{const e=C(U(w,"properties"),I("city","==",t)),n=await O(e),r=[];return n.forEach(s=>{r.push({id:s.id,...s.data()})}),r}catch(e){throw console.error("Error getting properties by city:",e),e}},getPropertiesRealtime(t,e){const n=C(U(w,"properties"));return ft(n,s=>{const o=[];s.forEach(i=>{o.push({id:i.id,...i.data()})}),t(o)},s=>{e(s)})},getPropertyById:async t=>{try{const e=X(w,"properties",t),n=await pt(e);if(n.exists())return{id:n.id,...n.data()};throw new Error("Property not found")}catch(e){throw e}},searchProperties:async t=>{try{const e=C(U(w,"properties"),I("keywords","array-contains",t.toLowerCase())),n=await O(e),r=[];return n.forEach(s=>{r.push({id:s.id,...s.data()})}),r}catch(e){throw console.error("Error searching properties:",e),e}},getFeaturedProperties:async()=>{try{const t=C(U(w,"properties"),I("featured","==",!0),pe("createdAt","desc")),e=await O(t),n=[];return e.forEach(r=>{n.push({id:r.id,...r.data()})}),n}catch(t){throw console.error("Error getting featured properties:",t),t}},addProperty:async(t,e=[],n=[])=>{try{const r={...t,indoorImages:[],outdoorImages:[],images:[],createdAt:new Date},s=await ve(U(w,"properties"),r),o=s.id;let i=[];e.length>0&&(i=await D.uploadMultipleImages(e,`properties/${o}/`));let c=[];n.length>0&&(c=await D.uploadMultipleImages(n,`properties/${o}/`));const a=[...i,...c],l={...t,indoorImages:i,outdoorImages:c,images:a,createdAt:new Date};return await ke(s,l),ee.clearCache(),{id:o,...l}}catch(r){throw console.error("Error adding property:",r),r}},updateProperty:async(t,e,n=[],r=[],s=[])=>{try{let o=e.indoorImages||[],i=e.outdoorImages||[],c=e.images||[];if(s.length>0){const b=s.map(d=>D.deleteImage(d));await Promise.all(b),o=o.filter(d=>!s.includes(d)),i=i.filter(d=>!s.includes(d)),c=c.filter(d=>!s.includes(d))}let a=[];n.length>0&&(a=await D.uploadMultipleImages(n,`properties/${t}/indoor/`));let l=[];r.length>0&&(l=await D.uploadMultipleImages(r,`properties/${t}/outdoor/`));const u=[...o,...a],h=[...i,...l],_=[...u,...h],m={...e,indoorImages:u,outdoorImages:h,images:_,updatedAt:new Date},g=X(w,"properties",t);return await ke(g,m),ee.clearCache(),{success:!0}}catch(o){throw console.error("Error updating property:",o),o}},getUserProperties:async(t,e=!1)=>{const n=Date.now();if(!e&&W[t]&&n-W[t].timestamp<3e4)return W[t].data;try{const s=C(U(w,"properties"),I("createdBy","==",t)),o=await O(s),i=[];return o.forEach(c=>{i.push({id:c.id,...c.data()})}),W[t]={data:i,timestamp:n},i}catch(s){throw console.error("Error getting user properties:",s),s}},deleteProperty:async t=>{try{const e=await ee.getPropertyById(t);if(e.images&&e.images.length>0){const n=e.images.map(r=>D.deleteImage(r));await Promise.all(n)}return await te.deleteInquiriesByProperty(t),await de(X(w,"properties",t)),ee.clearCache(),{success:!0}}catch(e){throw console.error("Error deleting property:",e),e}}};export{vn as a,w as d,xn as g,te as i,ee as p,Dn as t};

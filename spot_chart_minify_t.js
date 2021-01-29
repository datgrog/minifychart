function GradientReader(t){let e,o=document.createElement("canvas"),r=o.getContext("2d"),n=r.createLinearGradient(101,0,0,0),l=0;for(o.width=101,o.height=1;e=t[l++];)stop=parseFloat(e.offset)/100,n.addColorStop(stop,e.color);r.fillStyle=n,r.fillRect(0,0,101,1),this.getColor=function(t){const e=r.getImageData(0|t,0,1,1).data;return fullColorHex(e[0],e[1],e[2])}}function rgbToHex(t){let e=Number(t).toString(16);return e.length<2&&(e="0"+e),e}function fullColorHex(t,e,o){const r=rgbToHex(t),n=rgbToHex(e),l=rgbToHex(o);return r+n+l}const series_provider_local=async(e,r,t)=>{const o=`?cryptocurrency_id=${e}&width=${r}&height=${t}`;return console.log("https://cors-anywhere.herokuapp.com/https://staging2.api.spotapp.tech/v1/graphs/aion"+o),fetch_crypto_series("https://cors-anywhere.herokuapp.com/https://staging2.api.spotapp.tech/v1/graphs/aion"+o)},series_provider_prod=async(e,r,t)=>{return fetch_crypto_series("https://spot.so/graphs"+`?cryptocurrency_id=${e}&width=${r}&height=${t}`)},fetch_crypto_series=async e=>{const r=await fetch(e).then((function(e){return e.ok?e.json():Promise.reject(e)})).catch((function(e){console.warn("Something went wrong.",e)}));return["1d","7d","1m","3m","1y","all"].map(e=>helios_graph_to_d3(r[e]))},data_provider="undefined"!=typeof local?series_provider_local:series_provider_prod;function GraphGradient(e,t){const i=e.append("defs").append("linearGradient").attr("id","linear-gradient").attr("x1","0%").attr("y1","0%").attr("x2","0%").attr("y2","100%");i.selectAll("stop").data(t).enter().append("stop").attr("offset",(function(e){return e.offset})).attr("stop-color",(function(e){return e.color}))}function PriceLabel(e,t,i){this.label=e.append("g").append("text"),this.show=(e,r)=>{this.label.html(priceFormat(e.price)).attr("x",t(e.date)+r.x).attr("y",i(e.price)+ +r.y).attr("visibility","visible")},this.hide=()=>{this.label.attr("visibility","hidden")}}function PointMouseOver(e,t,i,r,a){this.gradient_reader=new GradientReader(i),this.mouseover_info=document.getElementById("mouseover_info"),this.line=e.append("g").append("line").attr("id","mouse_over_line").style("stroke","#c1c8c7").style("stroke-width",2).style("opacity",1),this.dot=e.append("g").append("circle").attr("id","mouse_over_dot").style("opacity",0),this.mouse_layer_recovery=e.append("rect").attr("id","mouse_layer_recovery").style("fill","none").style("pointer-events","all").attr("width",t.width).attr("height",t.height),this.show=()=>{this.dot.attr("visibility","visible"),this.line.attr("visibility","visible")},this.update=(e,t,i)=>{this.dot.attr("visibility","hidden"),this.line.attr("visibility","hidden");const s=this.mouseover_info.querySelector("p#price-info"),o=this.mouseover_info.querySelector("span#price-value"),n=this.mouseover_info.querySelector("span#price-change"),c=Math.sign(e[0].price-e[e.length-1].price),l=Math.abs(e[0].price-e[e.length-1].price),d=(Math.abs(e[0].price-e[e.length-1].price)/e[0].price*100).toFixed(2);-1===c?(n.className="increase",n.innerHTML=`\u2191${priceFormat(l)} (+${d}%)`):(n.className="decrease",n.innerHTML=`\u2193${priceFormat(l)} (-${d}%)`);let p=document.getElementById("series_selector").getElementsByTagName("a")[CURRENT_SPOT_SERIE_IDX].innerHTML;5==CURRENT_SPOT_SERIE_IDX&&(p="all time"),void 0!=s.childNodes[2]&&s.childNodes[2].remove(),s.append(` since ${p}`);const h=(()=>{dot=this.dot,line=this.line,mouseover_info=this.mouseover_info,gradient_reader=this.gradient_reader;const c=()=>{const c=r.invert(d3.mouse(this.mouse_layer_recovery._groups[0][0])[0]),l=bisect(e,c,1),d=e[l],p=get_price_pst(d,t,i),h=gradient_reader.getColor(p);dot.style("fill",`#${h}`).style("opacity",1).attr("cx",r(d.date)).attr("cy",a(d.price)),line.style("opacity",1).attr("x1",r(d.date)).attr("y1",a(t)).attr("x2",r(d.date)).attr("y2",a(i)),s.prepend(n),o.innerHTML=`${priceFormat(d.price)}`};return{mouseout:()=>{o.innerHTML=`${priceFormat(e[e.length-1].price)}`,this.dot.style("opacity",0),this.line.style("opacity",0)},mousemove:c,touchmove:c}})();this.mouse_layer_recovery.on("mouseover",h.mouseover).on("mouseout",h.mouseout).on("mousemove",h.mousemove).on("touchmove",h.touchmove)}}function BlinkingPoint(e,t,i,r){this.gradient_reader=new GradientReader(r),this.circles=[e.append("g").append("circle").attr("class","pulse-disk").attr("visibility","hidden"),e.append("g").append("circle").attr("class","pulse-circle").attr("stroke-width",2).attr("visibility","hidden"),e.append("g").append("circle").attr("class","pulse-circle-2").attr("stroke-width",2).attr("visibility","hidden")],this.show=(e,r,a)=>{const s=get_price_pst(e,r,a),o=this.gradient_reader.getColor(s);this.circles[0].style("fill",`#${o}`),this.circles[1].style("stroke",`#${o}`),this.circles[2].style("stroke",`#${o}`),this.circles.forEach(r=>{r.attr("cx",t(e.date)).attr("cy",i(e.price)).attr("visibility","visible")})},this.hide=()=>{this.circles.forEach(e=>e.attr("visibility","hidden"))}}const bisect=d3.bisector((function(e){return e.date})).left,get_price_pst=(e,t,i)=>{return 100*(e.price-t)/(i-t)},getNavigatorLanguage=()=>navigator.languages&&navigator.languages.length?navigator.languages[0]:navigator.userLanguage||navigator.language||navigator.browserLanguage||"en",priceFormat=e=>{return e.toLocaleString("en",{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:0})};class SpotChart{constructor(t,i,e){this.chart_dimension={width:document.getElementById(t).clientWidth-i.left-i.right,height:document.getElementById(t).clientHeight-i.top-i.bottom},this.data_gradient=e,this.x=d3.scaleTime().range([0,this.chart_dimension.width]),this.y=d3.scaleLinear().range([this.chart_dimension.height,0]),this.xAxis=d3.axisBottom().scale(this.x),this.yAxis=d3.axisLeft().scale(this.y),this.svg=d3.select("#crypto-chart").append("svg").attr("width","100%").attr("height","100%").append("g").attr("transform","translate("+i.left+","+i.top+")"),this._init_components()}_init_components(){this._linearGradient=new GraphGradient(this.svg,this.data_gradient),this._point_mouse_over=new PointMouseOver(this.svg,this.chart_dimension,this.data_gradient,this.x,this.y),this._min_price_label=new PriceLabel(this.svg,this.x,this.y),this._max_price_label=new PriceLabel(this.svg,this.x,this.y),this._blinking_point=new BlinkingPoint(this.svg,this.x,this.y,this.data_gradient)}draw(t){const i=d3.minIndex(t,t=>t.price),e=d3.maxIndex(t,t=>t.price),s=t[i].price,n=t[e].price,a=t[t.length-1];get_price_pst(a,s,n);this.x.domain(d3.extent(t,(function(t){return t.date}))),this.y.domain([s,n]);const r=this.svg.selectAll(".line").data([t]),h=d3.line().curve(d3.curveCatmullRom.alpha(.25)).x(t=>{return this.x(t.date)}).y(t=>{return this.y(t.price)});r.enter().append("path").attr("class","line").merge(r).transition().duration(1500).attr("d",h).attr("fill","none").style("stroke","url(#linear-gradient)").on("start",()=>{this._point_mouse_over.update(t,s,n),this._min_price_label.hide(),this._max_price_label.hide(),this._blinking_point.hide()}).on("end",()=>{this._point_mouse_over.show(),this._min_price_label.show(t[i],{x:-30,y:25}),this._max_price_label.show(t[e],{x:-30,y:-25}),this._blinking_point.show(a,s,n)})}}function helios_graph_to_d3(t){const i=[],e=t.end_timestamp-t.start_timestamp,s=e/t.prices.length;t.prices.forEach((function(t){t.time=new Date(1e3*t.time)}));for(var n=0;n<t.prices.length;n++){let e=n*s+t.start_timestamp;i.push({price:t.prices[n],date:new Date(1e3*e)})}const a=this.mouseover_info.querySelector("span#price-value");return a.innerHTML=`${priceFormat(i[i.length-1].price)}`,i}var domIsReady=function(t){const o=function(){return document.attachEvent&&"undefined"!==typeof document.attachEvent?"ie":"not-ie"};return t=function(t){t&&"function"===typeof t?"ie"!==o()?document.addEventListener("DOMContentLoaded",(function(){return t()})):document.attachEvent("onreadystatechange",(function(){if("complete"===document.readyState)return t()})):console.error("The callback is not a function!")},t}(domIsReady||{});const MOBILE_WIDTH=767;let CURRENT_SPOT_SERIE_IDX=5;function get_crypto_id_from_url(){const t=window.location.pathname;return"/chart"===t||-1!==t.search("bitcoin-price")?33:-1!==t.search("ethereum-price")?34:33}const run=async()=>{const t=[{offset:"0%",color:"#f7931a"},{offset:"12.5%",color:"#f7931a"},{offset:"20%",color:"#f7931a"},{offset:"25%",color:"#f7931a"},{offset:"30%",color:"#f7931a"},{offset:"50%",color:"#f7931a"},{offset:"60%",color:"#f7931a"},{offset:"70%",color:"#f7931a"},{offset:"75%",color:"#f7931a"},{offset:"80%",color:"#f7931a"},{offset:"87.5%",color:"#f7931a"},{offset:"100%",color:"#f7931a"}],o=["1 day","7 days","1 month","3 months","1 year","all"],e=["24h","7d","1m","3m","1y","all"],n={top:50,right:20,bottom:50,left:20},r=screen.width,c=screen.height,a=document.getElementById("series_selector"),f=a.getElementsByTagName("a");r>MOBILE_WIDTH?[...f].forEach((t,e)=>t.innerHTML=o[e]):[...f].forEach((t,o)=>t.innerHTML=e[o]);const d=get_crypto_id_from_url(),i=await data_provider(d,r,c);document.getElementById("chart-loader").remove();const s=new SpotChart("crypto-chart",n,t);if(a.childElementCount!=i.length)throw"Number of button and series does not match";let l;function m(){document.getElementById("crypto-chart").firstElementChild.remove(),i.forEach((t,e)=>f[e].onclick=()=>{CURRENT_SPOT_SERIE_IDX=e,o.draw(t)});const o=new SpotChart("crypto-chart",n,t);o.draw(i[CURRENT_SPOT_SERIE_IDX])}i.forEach((t,o)=>f[o].onclick=()=>{CURRENT_SPOT_SERIE_IDX=o,s.draw(t)}),s.draw(i[CURRENT_SPOT_SERIE_IDX]),window.onresize=()=>{clearTimeout(l),l=setTimeout(m,25)}};(function(t,o,e,n){e(run)})(document,window,domIsReady);

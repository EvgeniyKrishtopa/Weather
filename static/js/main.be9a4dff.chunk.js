(this["webpackJsonpweather-app"]=this["webpackJsonpweather-app"]||[]).push([[0],{11:function(e,t,a){e.exports=a(19)},17:function(e,t,a){},18:function(e,t,a){},19:function(e,t,a){"use strict";a.r(t);var n,r=a(0),c=a.n(r),o=a(9),l=a.n(o),i=a(7),s=a.n(i),u=a(10),m=a(1),p=Object(r.createContext)(),d=a(3),h=a(5),b=(n={},Object(d.a)(n,"GET_USER",(function(e,t){var a=t.payload;return Object(h.a)(Object(h.a)({},e),{},{weather:a,loading:!1,clear:!1})})),Object(d.a)(n,"SET_LOADING",(function(e){return Object(h.a)(Object(h.a)({},e),{},{loading:!0})})),Object(d.a)(n,"DEFAULT",(function(e){return e})),n),f=function(e,t){return(b[t.type]||b.DEFAULT)(e,t)},w=function(e){var t=e.children,a=Object(r.useReducer)(f,{weather:null,loading:!1}),n=Object(m.a)(a,2),o=n[0],l=n[1],i=function(){var e=Object(u.a)(s.a.mark((function e(t,a){var n,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return d(),e.next=3,fetch("https://api.openweathermap.org/data/2.5/weather?q=".concat(t,",").concat(a,"&appid=").concat("4f1400dc97a7e72fa59e6c3a211b7d40"));case 3:return n=e.sent,e.next=6,n.json();case 6:r=e.sent,l({type:"GET_USER",payload:r});case 8:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),d=function(){return l({type:"SET_LOADING"})},h=o.weather,b=o.loading;return c.a.createElement(p.Provider,{value:{getWeather:i,weather:h,loading:b}},t)},g=a(2),E=(a(17),function(){return c.a.createElement("div",{className:"lds-dual-ring"})}),O=function(){var e=Object(r.useContext)(p),t=e.loading,a=e.weather,n=Object(r.useState)(null),o=Object(m.a)(n,2),l=o[0],i=o[1],s="wi-thunderstorm",u="wi-sleet",d="wi-storm-showers",h="wi-snow",b="wi-fog",f="wi-day-sunny",w="wi-day-fog",O=Object(r.useState)(["wi","wi-flip-vertical"]),v=Object(m.a)(O,2),y=v[0],j=v[1];Object(r.useEffect)((function(){a&&localStorage.setItem("weather",JSON.stringify(a))}),[a]),Object(r.useEffect)((function(){var e=JSON.parse(localStorage.getItem("weather"));if(e)switch(e.weather[0].main){case"Thunderstorm":j([].concat(Object(g.a)(y),[s]));break;case"Drizzle":j([].concat(Object(g.a)(y),[u]));break;case"Rain":j([].concat(Object(g.a)(y),[d]));break;case"Snow":j([].concat(Object(g.a)(y),[h]));break;case"Atmosphere":j.apply(void 0,Object(g.a)(y).concat([[b]]));break;case"Clear":j([].concat(Object(g.a)(y),[f]));break;case"Clouds":j([].concat(Object(g.a)(y),[w]))}i(e)}),[a]);var N=JSON.parse(localStorage.getItem("city"));return c.a.createElement("div",{className:"weather-result"},t?c.a.createElement(E,null):c.a.createElement("div",null,l?c.a.createElement("div",null,c.a.createElement("h3",null,N),c.a.createElement("p",{className:"tepmeratureAverege"},"Temperature:\xa0",(l.main.temp-273.15).toFixed(2),"\xa0C\xb0"),c.a.createElement("p",{className:"weather-description"},c.a.createElement("i",{className:y.join(" ")}),l.weather[0].main),c.a.createElement("p",{className:"wind"},"Wind speed:\xa0",l.wind.speed,"km/h"),c.a.createElement("p",{className:"wind"},"Humidity:\xa0",l.main.humidity,"%")):null))};var v=function(){var e=Object(r.useRef)(),t=Object(r.useContext)(p).getWeather,a=Object(r.useState)(""),n=Object(m.a)(a,2),o=n[0],l=n[1],i=Object(r.useState)(""),s=Object(m.a)(i,2),u=s[0],d=s[1];return c.a.createElement("div",{className:"container"},c.a.createElement("h1",null,"Get Your Weather"),c.a.createElement("form",{className:"weather-form",id:"weatherForm",action:"#",onSubmit:function(a){a.preventDefault(),a.target.reset(),o&&u?(t(o,u),localStorage.setItem("city",JSON.stringify(u)),l(""),d(""),e.current.style.opacity="0"):(e.current.style.opacity="1",localStorage.clear())}},c.a.createElement("span",{className:"current-date"},function(){var e=new Date;return["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()]+"\n"+String(e.getDate()).padStart(2,"0")+","+e.getFullYear()}()),c.a.createElement("div",{className:"form-group"},c.a.createElement("input",{type:"text",className:"form-control",placeholder:"Country",id:"inputCountry",value:o,onChange:function(e){return l(e.target.value)}})),c.a.createElement("div",{className:"form-group"},c.a.createElement("input",{type:"text",className:"form-control",placeholder:"City",id:"inputCity",value:u,onChange:function(e){return d(e.target.value)}}),c.a.createElement("p",{className:"hidden",ref:e},"Enter some data please!")),c.a.createElement("button",{type:"submit",className:"btn btn-primary"},"Get Weather")))};a(18);var y=function(){return c.a.createElement(w,null,c.a.createElement("div",{className:"wrapper"},c.a.createElement(v,null),c.a.createElement(O,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(c.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[11,1,2]]]);
//# sourceMappingURL=main.be9a4dff.chunk.js.map
(this["webpackJsonpweather-app"]=this["webpackJsonpweather-app"]||[]).push([[0],{14:function(e,t,a){},15:function(e,t,a){},16:function(e,t,a){"use strict";a.r(t);var n,r=a(0),c=a.n(r),o=a(6),l=a.n(o),i=a(4),u=a.n(i),s=a(7),m=a(1),p=Object(r.createContext)(),d=a(2),h=a(3),f=(n={},Object(d.a)(n,"GET_USER",(function(e,t){var a=t.payload;return Object(h.a)(Object(h.a)({},e),{},{weather:a,loading:!1,clear:!1})})),Object(d.a)(n,"SET_LOADING",(function(e){return Object(h.a)(Object(h.a)({},e),{},{loading:!0})})),Object(d.a)(n,"DEFAULT",(function(e){return e})),n),w=function(e,t){return(f[t.type]||f.DEFAULT)(e,t)},b=function(e){var t=e.children,a=Object(r.useReducer)(w,{weather:null,loading:!1}),n=Object(m.a)(a,2),o=n[0],l=n[1],i=function(){var e=Object(s.a)(u.a.mark((function e(t,a){var n,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return l({type:"SET_LOADING"}),e.next=3,fetch("https://api.openweathermap.org/data/2.5/weather?q=".concat(t,",").concat(a,"&appid=").concat("4f1400dc97a7e72fa59e6c3a211b7d40"));case 3:return n=e.sent,e.next=6,n.json();case 6:r=e.sent,l({type:"GET_USER",payload:r});case 8:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),d=o.weather,h=o.loading;return c.a.createElement(p.Provider,{value:{getWeather:i,weather:d,loading:h}},t)},g=(a(14),function(){return c.a.createElement("div",{className:"lds-dual-ring"})}),E={Thunderstorm:"wi-thunderstorm",Drizzle:"wi-sleet",Rain:"wi-storm-showers",Snow:"wi-snow",Atmosphere:"wi-fog",Clear:"wi-day-sunny",Clouds:"wi-day-fog"},v=["wi","wi-flip-vertical"],y=function(){var e=Object(r.useContext)(p),t=e.loading,a=e.weather,n=Object(r.useState)(null),o=Object(m.a)(n,2),l=o[0],i=o[1],u=Object(r.useState)([]),s=Object(m.a)(u,2),d=s[0],h=s[1],f=Object(r.useState)(""),w=Object(m.a)(f,2),b=w[0],y=w[1];return Object(r.useEffect)((function(){a&&localStorage.setItem("weather",JSON.stringify(a));var e=JSON.parse(localStorage.getItem("weather")),t=JSON.parse(localStorage.getItem("city"));(e||t)&&(y(t),i(e))}),[a]),Object(r.useEffect)((function(){if(l){var e=l.weather[0].main;h([E[e]])}}),[l]),c.a.createElement("div",{className:"weather-result"},t?c.a.createElement(g,null):c.a.createElement("div",null,l?c.a.createElement("div",null,c.a.createElement("h3",null,b),c.a.createElement("p",{className:"tepmeratureAverege"},"Temperature:\xa0",(l.main.temp-273.15).toFixed(2),"\xa0C\xb0"),c.a.createElement("p",{className:"weather-description"},c.a.createElement("i",{className:v.concat(d).join(" ")}),l.weather[0].main),c.a.createElement("p",{className:"wind"},"Wind speed:\xa0",l.wind.speed,"km/h"),c.a.createElement("p",{className:"wind"},"Humidity:\xa0",l.main.humidity,"%")):null))};var O=function(){var e=Object(r.useRef)(),t=Object(r.useContext)(p).getWeather,a=Object(r.useState)(""),n=Object(m.a)(a,2),o=n[0],l=n[1],i=Object(r.useState)(""),u=Object(m.a)(i,2),s=u[0],d=u[1];return c.a.createElement("div",{className:"container"},c.a.createElement("h1",null,"Get Your Weather"),c.a.createElement("form",{className:"weather-form",id:"weatherForm",action:"#",onSubmit:function(a){a.preventDefault(),a.target.reset(),o&&s?(t(o,s),localStorage.setItem("city",JSON.stringify(s)),l(""),d(""),e.current.style.opacity="0"):(e.current.style.opacity="1",localStorage.clear())}},c.a.createElement("span",{className:"current-date"},function(){var e=new Date;return["January","February","March","April","May","June","July","August","September","October","November","December"][e.getMonth()]+"\n"+String(e.getDate()).padStart(2,"0")+","+e.getFullYear()}()),c.a.createElement("div",{className:"form-group"},c.a.createElement("input",{type:"text",className:"form-control",placeholder:"Country",id:"inputCountry",value:o,onChange:function(e){return l(e.target.value)}})),c.a.createElement("div",{className:"form-group"},c.a.createElement("input",{type:"text",className:"form-control",placeholder:"City",id:"inputCity",value:s,onChange:function(e){return d(e.target.value)}}),c.a.createElement("p",{className:"hidden",ref:e},"Enter some data please!")),c.a.createElement("button",{type:"submit",className:"btn btn-primary"},"Get Weather")))};a(15);var j=function(){return c.a.createElement(b,null,c.a.createElement("div",{className:"wrapper"},c.a.createElement(O,null),c.a.createElement(y,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(c.a.createElement(j,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},8:function(e,t,a){e.exports=a(16)}},[[8,1,2]]]);
//# sourceMappingURL=main.66eceaea.chunk.js.map
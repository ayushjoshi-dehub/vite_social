import{n as e,s as t,t as n}from"./jsx-runtime-C7M7YA1l.js";import{t as r}from"./proxy-BRpInirX.js";t(e(),1);var i=n();function a({name:e=`?`,src:t,size:n=`w-10 h-10`,hasStory:a=!1,viewed:o=!1,isLive:s=!1,online:c=!1,verified:l=!1,className:u=``,onClick:d,ariaLabel:f}){let p=typeof n==`number`?n:parseInt(n.match(/\d+/)?.[0]||40,10),m=Math.max(2,Math.round(p*.08)),h=e.trim().split(/\s+/).map(e=>e[0]).join(``).toUpperCase().slice(0,2),g=[`from-pink-500 via-rose-500 to-purple-600`,`from-cyan-500 via-blue-500 to-indigo-600`,`from-emerald-500 via-teal-500 to-green-600`,`from-amber-500 via-orange-500 to-red-500`],_=g[(e.charCodeAt(0)||65)%g.length],v=a?`p-[${m}px] bg-gradient-to-tr ${o?`from-zinc-600 to-zinc-500`:_} animate-pulse-slow`:``;return(0,i.jsxs)(r.div,{whileHover:d?{scale:1.07}:{},whileTap:d?{scale:.96}:{},className:`
        relative flex-shrink-0 cursor-pointer
        ${u}
      `,onClick:d,"aria-label":f||e||`User avatar`,role:d?`button`:void 0,children:[(0,i.jsx)(`div`,{className:`
          rounded-full transition-all duration-300
          ${v}
          ${!a&&`bg-zinc-800`}
        `,children:(0,i.jsx)(`div`,{className:`
            ${n} rounded-full overflow-hidden flex items-center justify-center
            border-2 border-zinc-950 shadow-inner
            ${t?``:`bg-gradient-to-br ${_}`}
          `,children:t?(0,i.jsx)(`img`,{src:t,alt:e||`User`,className:`w-full h-full object-cover`,loading:`lazy`,onError:e=>e.target.style.display=`none`}):(0,i.jsx)(`span`,{className:`text-white font-semibold tracking-wider drop-shadow-md`,children:h})})}),s&&(0,i.jsx)(`span`,{className:`\r
            absolute -bottom-1 left-1/2 -translate-x-1/2\r
            px-2 py-0.5 text-[9px] font-extrabold tracking-wide\r
            bg-gradient-to-r from-rose-600 to-pink-600\r
            text-white rounded-full border border-black/40 shadow-sm\r
          `,children:`LIVE`}),c&&!s&&(0,i.jsx)(`span`,{className:`\r
            absolute bottom-0.5 right-0.5\r
            w-3.5 h-3.5 bg-emerald-500 rounded-full\r
            border-2 border-zinc-950 shadow-lg shadow-emerald-900/40\r
          `}),l&&(0,i.jsx)(`span`,{className:`\r
            absolute -bottom-1 -right-1\r
            w-5 h-5 bg-blue-600 rounded-full\r
            flex items-center justify-center\r
            border-2 border-zinc-950 shadow-sm\r
          `,children:(0,i.jsx)(`svg`,{className:`w-3 h-3 text-white`,fill:`currentColor`,viewBox:`0 0 24 24`,children:(0,i.jsx)(`path`,{d:`M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z`})})})]})}export{a as t};
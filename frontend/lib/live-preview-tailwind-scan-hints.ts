/**
 * Tailwind scans this file (see `app/globals.css` @source) so utilities that only
 * appear inside react-live streamed JSX still exist in the production CSS bundle.
 * Without this, Live Preview DOM mounts but looks “blank” (no layout/colors/typography).
 */
export const LIVE_PREVIEW_TAILWIND_SCAN_HINT = `
min-h-0 min-h-screen min-h-svh min-h-dvh min-h-full min-h-[50vh] min-h-[60vh] min-h-[70vh] w-full h-full max-w-full
max-w-xs max-w-sm max-w-md max-w-lg max-w-xl max-w-2xl max-w-3xl max-w-4xl max-w-5xl max-w-6xl max-w-7xl mx-auto
flex flex-1 flex-col flex-row flex-wrap inline-flex
items-stretch items-start items-center items-end justify-start justify-center justify-between justify-end
gap-1 gap-2 gap-3 gap-4 gap-6 gap-8 gap-10 gap-12
grid grid-flow-row grid-cols-1 grid-cols-2 grid-cols-3 md:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3
col-span-1 col-span-2 row-span-1
p-0 p-1 p-2 p-3 p-4 p-5 p-6 p-8 p-10 p-12 px-2 px-3 px-4 px-6 px-8 py-2 py-3 py-4 py-6 py-8 py-12 py-16 py-20 pt-8 pb-12
m-0 mx-auto my-4 my-6 my-8 mt-4 mb-8 ml-auto mr-auto
space-y-2 space-y-3 space-y-4 space-y-6 space-y-8 space-x-2 space-x-4
text-left text-center text-right
text-xs text-sm text-base text-lg text-xl text-2xl text-3xl text-4xl text-5xl text-6xl text-7xl
font-sans font-serif font-mono font-light font-normal font-medium font-semibold font-bold font-extrabold
tracking-tight tracking-wide tracking-wider uppercase leading-none leading-tight leading-snug leading-relaxed
text-balance
text-inherit text-current text-transparent text-white text-black
text-zinc-50 text-zinc-100 text-zinc-200 text-zinc-300 text-zinc-400 text-zinc-500 text-zinc-600 text-zinc-700 text-zinc-800 text-zinc-900 text-zinc-950
text-stone-100 text-stone-200 text-stone-300 text-stone-400 text-stone-500 text-stone-600 text-stone-700 text-stone-800 text-stone-900
text-amber-50 text-amber-100 text-amber-200 text-amber-300 text-amber-400 text-amber-500 text-amber-600 text-amber-700 text-amber-800 text-amber-900
text-yellow-100 text-yellow-200 text-rose-100 text-rose-200
bg-inherit bg-transparent bg-white bg-black
bg-zinc-50 bg-zinc-100 bg-zinc-200 bg-zinc-800 bg-zinc-900 bg-zinc-950
bg-stone-50 bg-stone-100 bg-stone-200 bg-stone-800 bg-stone-900 bg-stone-950
bg-amber-50 bg-amber-100 bg-amber-200 bg-amber-500 bg-amber-600 bg-amber-900
bg-gradient-to-b bg-gradient-to-t bg-gradient-to-br bg-gradient-to-tr bg-gradient-to-r bg-gradient-to-l
from-white from-zinc-900 from-stone-900 from-amber-50 from-amber-100 via-amber-100 via-stone-800 to-white to-zinc-50 to-stone-100 to-amber-50 to-amber-900
rounded-none rounded-sm rounded-md rounded-lg rounded-xl rounded-2xl rounded-3xl rounded-full
border-0 border border-2 border-t border-b border-amber-200 border-amber-300 border-stone-200 border-stone-700 border-white/10 border-white/20 border-zinc-800 border-zinc-700
ring-1 ring-2 ring-amber-400 ring-offset-2
shadow-sm shadow-md shadow-lg shadow-xl shadow-2xl shadow-inner
opacity-0 opacity-5 opacity-10 opacity-20 opacity-50 opacity-70 opacity-90 opacity-100
backdrop-blur-sm backdrop-blur-md backdrop-blur-xl
transition transition-all duration-200 duration-300 ease-out
hover:opacity-90 hover:shadow-lg hover:bg-amber-100
overflow-hidden overflow-auto overflow-x-auto overflow-y-auto
relative absolute fixed sticky inset-0 inset-x-0 inset-y-0 top-0 right-0 bottom-0 left-0 z-0 z-10 z-20 z-50
hidden block inline-block md:flex md:grid md:block lg:flex
w-screen h-screen w-1/2 w-1/3 w-2/3 h-1/2
max-h-screen object-cover object-center
list-none list-disc
cursor-pointer select-none
pointer-events-none pointer-events-auto
antialiased subpixel-antialiased
sr-only
dark:bg-zinc-950 dark:bg-stone-950 dark:text-amber-100 dark:text-stone-200 dark:text-zinc-100 dark:border-amber-500/20 dark:border-white/10
`;

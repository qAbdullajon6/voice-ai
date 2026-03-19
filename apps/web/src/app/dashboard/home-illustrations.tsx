/** ElevenLabs home card SVGs — gradient/pattern IDs must be unique per instance */

export function SvgInstantSpeech({ uid }: { uid: string }) {
  const g = `${uid}-g`;
  return (
    <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full max-w-[90%]">
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110 md:group-hover:rotate-3">
        <rect x="26" y="27" width="58" height="42" rx="9" fill={`url(#${g})`} />
        <rect x="34" y="35" width="39" height="4" rx="2" fill="#C7D5F4" />
        <rect x="34" y="42" width="28" height="4" rx="2" fill="#C7D5F4" />
        <rect x="34" y="49" width="32" height="4" rx="2" fill="#C7D5F4" />
        <rect x="65" y="57" width="13" height="5" rx="2.5" fill="#5D79DF" />
        <path
          d="M26 50.661V35C26 30.5817 29.5817 27 34 27H76C80.4183 27 84 30.5817 84 35V64"
          stroke="#E5E7EB"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <g className="origin-[30px_70px] transition-all duration-200 ease-in-out md:group-hover:scale-125 md:group-hover:-rotate-12">
        <rect x="10" y="55" width="32" height="32" rx="16" fill="#5D79DF" stroke="#F3F4F6" strokeWidth="2.5" className="transition-all duration-200 md:group-hover:stroke-[#E5E7EB]" />
        <path
          d="M23.8668 76.3333V73.6L25.1335 73.7333C25.5023 73.7128 25.8512 73.5599 26.1163 73.3027C26.3813 73.0455 26.5446 72.7013 26.5762 72.3333V68.5333C26.5806 67.5729 26.2033 66.65 25.5273 65.9678C24.8513 65.2855 23.9319 64.8997 22.9715 64.8953C22.0111 64.8909 21.0882 65.2682 20.4059 65.9442C19.7237 66.6202 19.3379 67.5395 19.3335 68.5C19.3335 70.3666 19.7708 70.536 20.0002 71.5333C20.1552 72.1356 20.1618 72.7665 20.0195 73.372L19.3335 76.3333"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31.2002 74.8666C32.1374 73.9293 32.6641 72.6582 32.6645 71.3327C32.6648 70.0072 32.1389 68.7358 31.2022 67.798"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29.3331 73C29.5512 72.7819 29.7239 72.5228 29.8412 72.2376C29.9586 71.9523 30.0182 71.6466 30.0166 71.3382C30.0151 71.0298 29.9524 70.7247 29.8322 70.4407C29.712 70.1566 29.5367 69.8992 29.3164 69.6833"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <linearGradient id={g} x1="55" y1="27" x2="55" y2="69" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SvgImageVideo({ uid }: { uid: string }) {
  const g = `${uid}-iv`;
  return (
    <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full max-w-[90%]">
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110">
        <path
          d="M74 22H34C28.4772 22 24 26.4772 24 32V56C24 61.5228 28.4772 66 34 66H74C79.5228 66 84 61.5228 84 56V32C84 26.4772 79.5228 22 74 22Z"
          fill={`url(#${g})`}
        />
        <path d="M56 37H34C32.8954 37 32 37.8954 32 39C32 40.1046 32.8954 41 34 41H56C57.1046 41 58 40.1046 58 39C58 37.8954 57.1046 37 56 37Z" fill="#CAEADC" />
        <path d="M50 44H34C32.8954 44 32 44.8954 32 46C32 47.1046 32.8954 48 34 48H50C51.1046 48 52 47.1046 52 46C52 44.8954 51.1046 44 50 44Z" fill="#CAEADC" />
        <path
          d="M24 42V32C24 26.4772 28.4772 22 34 22H74C79.5228 22 84 26.4772 84 32V54"
          stroke="#E5E7EB"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect x="32" y="30" width="6" height="4" rx="1" fill="#CAEADC" />
        <rect x="40" y="30" width="6" height="4" rx="1" fill="#CAEADC" />
      </g>
      <g className="origin-[60px_60px] transition-all duration-200 ease-in-out md:group-hover:scale-125 md:group-hover:rotate-12">
        <path
          d="M64 57.2a9.2 9.2 0 019.2-9.2h9.2a9.2 9.2 0 019.2 9.2v4.6a9.2 9.2 0 01-9.2 9.2h-9.2a9.2 9.2 0 01-9.2-9.2v-4.6z"
          fill="#5D79DF"
          stroke="#F3F4F6"
          strokeWidth="2.5"
          className="transition-all md:group-hover:stroke-[#E5E7EB]"
        />
        <path d="M74.925 62.375v-5.75L81.25 59.5l-6.325 2.875z" fill="#fff" stroke="#fff" strokeWidth="1.25" strokeLinejoin="round" />
      </g>
      <g className="origin-[30px_60px] transition-all duration-200 ease-in-out md:group-hover:scale-125 md:group-hover:-rotate-12 md:group-hover:translate-y-1">
        <path
          d="M45 66c0-9.389-7.611-17-17-17s-17 7.611-17 17 7.611 17 17 17 17-7.611 17-17z"
          fill="#2DD28D"
          stroke="#F3F4F6"
          strokeWidth="2.5"
          className="transition-all md:group-hover:stroke-[#E5E7EB]"
        />
        <path
          d="M32.667 60h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333z"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 65.333a1.333 1.333 0 100-2.666 1.333 1.333 0 000 2.666zM34 68l-2.057-2.057a1.334 1.334 0 00-1.886 0L24 72"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <linearGradient id={g} x1="54" y1="22" x2="54" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SvgAudiobook({ uid }: { uid: string }) {
  const g = `${uid}-ab`;
  return (
    <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full max-w-[90%]">
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110">
        <rect x="24" y="19" width="58" height="42" rx="9" fill={`url(#${g})`} />
        <rect x="39" y="53" width="30" height="4" rx="2" fill="#E5E7EB" />
        <rect x="39" y="60" width="24" height="4" rx="2" fill="#E5E7EB" />
        <circle cx="33.1089" cy="29" r="3" fill="#2DD28D" />
        <circle cx="33.1089" cy="29" r="3" fill="#EB524B" />
        <rect x="39" y="27" width="34" height="4" rx="2" fill="#FDCDCB" />
        <rect x="39" y="34" width="28" height="4" rx="2" fill="#FDCDCB" />
        <rect x="39" y="41" width="32" height="4" rx="2" fill="#FDCDCB" />
        <path d="M24 38.661V27C24 22.5817 27.5817 19 32 19H74C78.4183 19 82 22.5817 82 27V38" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <g className="origin-[10px_60px] transition-all duration-200 ease-in-out md:group-hover:scale-125 md:group-hover:-rotate-12 md:group-hover:translate-y-2">
        <rect x="4" y="41" width="32" height="32" rx="16" fill="#EB524B" stroke="#F3F4F6" strokeWidth="2.5" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        <path
          d="M14.6665 57.8519H16.4443C16.7586 57.8519 17.0601 57.9768 17.2823 58.199C17.5046 58.4213 17.6295 58.7227 17.6295 59.0371V60.8149C17.6295 61.1292 17.5046 61.4306 17.2823 61.6529C17.0601 61.8752 16.7586 62 16.4443 62H15.8517C15.5374 62 15.2359 61.8752 15.0136 61.6529C14.7914 61.4306 14.6665 61.1292 14.6665 60.8149V56.6667C14.6665 55.2522 15.2284 53.8957 16.2286 52.8955C17.2288 51.8953 18.5853 51.3334 19.9998 51.3334C21.4143 51.3334 22.7709 51.8953 23.7711 52.8955C24.7713 53.8957 25.3332 55.2522 25.3332 56.6667V60.8149C25.3332 61.1292 25.2083 61.4306 24.986 61.6529C24.7638 61.8752 24.4623 62 24.148 62H23.5554C23.2411 62 22.9396 61.8752 22.7173 61.6529C22.4951 61.4306 22.3702 61.1292 22.3702 60.8149V59.0371C22.3702 58.7227 22.4951 58.4213 22.7173 58.199C22.9396 57.9768 23.2411 57.8519 23.5554 57.8519H25.3332"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110 md:group-hover:rotate-12">
        <rect x="58.623" y="38.6885" width="40.3321" height="51.7078" rx="6.24266" transform="rotate(9.28629 58.623 38.6885)" fill="#f97316" opacity="0.85" />
      </g>
      <defs>
        <linearGradient id={g} x1="53" y1="19" x2="53" y2="61" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SvgElevenAgents({ uid }: { uid: string }) {
  return (
    <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full max-w-[90%]">
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110">
        <rect x="28.8779" y="23" width="57.6076" height="57.6076" rx="28.8038" transform="rotate(4.85741 28.8779 23)" fill="#c4b5fd" />
        <rect x="28.8779" y="23" width="57.6076" height="57.6076" rx="28.8038" transform="rotate(4.85741 28.8779 23)" fill="#a78bfa" opacity="0.6" />
      </g>
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-125 md:group-hover:-rotate-6">
        <rect x="18" y="62" width="43" height="16" rx="5.02641" fill="#A94BD2" stroke="#F3F4F6" strokeWidth="2" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        {[24.536, 27.795, 31.055, 34.314, 37.574, 40.833, 44.092, 47.352, 50.611, 53.871].map((x, i) => (
          <line key={i} x1={x} y1="73.25" x2={x} y2={66.75 + (i % 3) * 2} stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </g>
      <g className="origin-[60px_20px] transition-all duration-200 ease-in-out md:group-hover:scale-110 md:group-hover:rotate-12">
        <rect x="58" y="12" width="32" height="32" rx="16" fill="#A94BD2" stroke="#F3F4F6" strokeWidth="2.5" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        <path
          d="M71.8668 33.3333V30.6L73.1335 30.7333C73.5023 30.7128 73.8512 30.5599 74.1163 30.3027C74.3813 30.0455 74.5446 29.7013 74.5762 29.3333V25.5333C74.5806 24.5729 74.2033 23.65 73.5273 22.9678C72.8513 22.2855 71.9319 21.8997 70.9715 21.8953C70.0111 21.8909 69.0882 22.2682 68.4059 22.9442C67.7237 23.6202 67.3379 24.5395 67.3335 25.5C67.3335 27.3666 67.7708 27.536 68.0002 28.5333C68.1552 29.1356 68.1618 29.7665 68.0195 30.372L67.3335 33.3333"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M79.2002 31.8666C80.1374 30.9293 80.6641 29.6582 80.6645 28.3327C80.6648 27.0072 80.1389 25.7358 79.2022 24.798"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M77.3331 30C77.5512 29.7819 77.7239 29.5228 77.8412 29.2376C77.9586 28.9523 78.0182 28.6466 78.0166 28.3382C78.0151 28.0298 77.9524 27.7247 77.8322 27.4407C77.712 27.1566 77.5367 26.8992 77.3164 26.6833"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function SvgMusic({ uid }: { uid: string }) {
  const g = `${uid}-m`;
  return (
    <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full max-w-[90%]">
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110">
        <path
          d="M63 40C68.4 40 72.9 44.2 72.9 49.5V59.5C72.9 64.8 68.4 69 63 69H4C-1.4 69 -5.9 64.8 -5.9 59.5V49.5C-5.9 44.2 -1.4 40 4 40H63Z"
          transform="translate(24 20)"
          stroke="#E5E7EB"
          strokeWidth="1.88"
          fill={`url(#${g}a)`}
        />
        <path
          d="M63 41H4C-1 41 -5 44.8 -5 49.5V59.5C-5 64.2 -1 68 4 68H63C68 68 72 64.2 72 59.5V49.5C72 44.8 68 41 63 41Z"
          transform="translate(24 20)"
          fill={`url(#${g}b)`}
        />
        {[15.8, 10, 4, 21.4, 27, 32.6, 38.2, 43.8, 49.4, 55, 61, 67.9].map((x, i) => (
          <path
            key={i}
            d={`M${39 + (i * 5.2) % 30} ${60 - (i % 5) * 3}v${8 + (i % 4) * 4}`}
            stroke="#F58633"
            strokeOpacity={0.15 + (i % 5) * 0.15}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
        <rect x="60" y="28" width="8" height="8" rx="2" fill="#1a1a1a" />
        <rect x="62" y="30" width="4" height="40" rx="1" fill={`url(#${g}c)`} />
      </g>
      <g className="origin-[24px_28px] transition-all duration-200 ease-in-out md:group-hover:scale-110 md:group-hover:rotate-12 md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5">
        <path
          d="M20.6 30.8C18.6 25 21.5 18.6 27.3 16.6C33.1 14.5 39.5 17.5 41.6 23.2C43.7 29 40.7 35.4 34.9 37.5C29.1 39.6 22.7 36.6 20.6 30.8Z"
          fill="#171717"
        />
        <path
          d="M30 23.9C28.3 24.5 27.4 26.4 28 28.2C28.6 29.9 30.5 30.8 32.2 30.2C34 29.5 34.9 27.6 34.2 25.9C33.6 24.2 31.7 23.3 30 23.9Z"
          fill="#FE9641"
        />
        <path
          d="M8.2 25.2C7.5 23.5 8.5 21.5 10.2 20.9L28 14.5C29.8 13.8 31.7 14.7 32.4 16.5L38.8 34.2C39.5 36 38.5 38 36.7 38.6L19 45C17.2 45.7 15.2 44.8 14.6 43L8.2 25.2Z"
          fill="#FE9641"
        />
        <path
          d="M27.4 14.6L10.8 20.7C8.7 21.4 7.6 23.7 8.4 25.8L14.4 42.4C15.2 44.5 17.4 45.6 19.5 44.8L36.2 38.8C38.2 38.1 39.3 35.8 38.6 33.7L32.6 17.1C31.8 15 29.5 13.9 27.4 14.6Z"
          fill="#FE9641"
          stroke="#F3F4F6"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all md:group-hover:stroke-[#E5E7EB]"
        />
      </g>
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110 md:group-hover:rotate-12">
        <path
          d="M90.9 60.2C98.6 62.3 103.2 70.2 101.1 77.9C99 85.6 91.1 90.2 83.4 88.1C75.7 86 71.1 78.1 73.2 70.4C75.3 62.7 83.2 58.1 90.9 60.2Z"
          fill="#F58633"
          stroke="#F3F4F6"
          strokeWidth="2.5"
          className="transition-all md:group-hover:stroke-[#E5E7EB]"
        />
        <path d="M92.4 74.4L91.9 76L84.2 78.1L83 76.9L85 69.2L86.7 68.7L92.4 74.4Z" fill="white" />
      </g>
      <defs>
        <linearGradient id={`${g}a`} x1="72" y1="54.5" x2="-5" y2="54.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E6E7EB" />
          <stop offset="0.84" stopColor="#E5E7EB" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${g}b`} x1="72" y1="50" x2="5.5" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${g}c`} x1="64" y1="33" x2="64" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0.28" stopColor="#333" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SvgDubbedVideo({ uid }: { uid: string }) {
  return (
    <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full max-w-[90%]">
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110">
        <rect x="25.7578" y="25.1987" width="67.8246" height="51.5787" rx="8" transform="rotate(4.85741 25.7578 25.1987)" fill="#86efac" opacity="0.9" />
      </g>
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110 md:group-hover:-rotate-3">
        <rect x="9" y="51" width="42" height="16" rx="5" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        {[15.47, 18.73, 21.99, 25.25, 28.51, 31.77, 35.03, 38.29, 41.55, 44.81].map((x, i) => (
          <line key={i} x1={x} y1="62.2" x2={x} y2={55.8 + (i % 3)} stroke="white" strokeWidth="1.63" strokeLinecap="round" />
        ))}
      </g>
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110 md:group-hover:translate-y-1">
        <rect x="33" y="73" width="30" height="16" rx="5" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        {[40.25, 43.45, 46.65, 49.85, 53.05, 56.25].map((x, i) => (
          <line key={i} x1={x} y1="84.25" x2={x} y2={77.75 + i} stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </g>
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-110 md:group-hover:rotate-6">
        <rect x="66" y="17" width="32" height="32" rx="16" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2.5" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        <g transform="translate(74 25)">
          <path d="M3.3 5.3L7.3 9.3" stroke="white" strokeWidth="1.33" strokeLinecap="round" />
          <path d="M2.7 9.3L6.7 5.3L8 3.3" stroke="white" strokeWidth="1.33" strokeLinecap="round" />
          <path d="M1.3 3.3H9.3" stroke="white" strokeWidth="1.33" strokeLinecap="round" />
          <path d="M4.7 1.3H5.3" stroke="white" strokeWidth="1.33" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

export function SvgVoiceDesign() {
  return (
    <svg width="78" height="48" viewBox="0 0 78 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full max-w-[90%]">
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-[1.15]">
        <rect x="21" y="6" width="36" height="36" rx="10" fill="#EB524B" stroke="#F3F4F6" strokeWidth="3" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        <path
          d="M38.705 29.7528C37.8373 29.9893 36.9267 30.022 36.0443 29.8484C35.162 29.6749 34.3316 29.2997 33.6181 28.7523C32.9047 28.2048 32.3274 27.4999 31.9313 26.6925C31.5353 25.8851 31.3312 24.9971 31.335 24.0978C31.3388 23.1985 31.5504 22.3123 31.9533 21.5082C32.3562 20.7042 32.9394 20.0042 33.6575 19.4628C34.3756 18.9215 35.2091 18.5534 36.093 18.3873C36.9768 18.2212 37.8871 18.2617 38.7527 18.5055"
          stroke="white"
          strokeWidth="1.40625"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M38.5507 21.3C38.5507 21.1807 38.5981 21.0662 38.6825 20.9818C38.7669 20.8974 38.8814 20.85 39.0007 20.85H41.9257C42.0451 20.85 42.1595 20.8974 42.2439 20.9818C42.3283 21.0662 42.3757 21.1807 42.3757 21.3C42.3757 21.4193 42.3283 21.5338 42.2439 21.6182C42.1595 21.7026 42.0451 21.75 41.9257 21.75H39.0007C38.8814 21.75 38.7669 21.7026 38.6825 21.6182C38.5981 21.5338 38.5507 21.4193 38.5507 21.3ZM38.9998 22.65C38.8805 22.65 38.766 22.6974 38.6816 22.7818C38.5972 22.8662 38.5498 22.9807 38.5498 23.1C38.5498 23.2193 38.5972 23.3338 38.6816 23.4182C38.766 23.5026 38.8805 23.55 38.9998 23.55H40.3507C40.4701 23.55 40.5845 23.5026 40.6689 23.4182C40.7533 23.3338 40.8007 23.2193 40.8007 23.1C40.8007 22.9807 40.7533 22.8662 40.6689 22.7818C40.5845 22.6974 40.4701 22.65 40.3507 22.65H38.9998ZM45.5482 21.3C45.4646 21.2163 45.3654 21.1499 45.2561 21.1046C45.1468 21.0594 45.0297 21.036 44.9115 21.036C44.7932 21.036 44.6761 21.0594 44.5668 21.1046C44.4576 21.1499 44.3583 21.2163 44.2747 21.3L40.4821 25.0926C40.4403 25.1345 40.4072 25.1842 40.3847 25.2388C40.3622 25.2935 40.3506 25.3521 40.3507 25.4112V27.15C40.3507 27.2693 40.3981 27.3838 40.4825 27.4682C40.5669 27.5526 40.6814 27.6 40.8007 27.6H42.5395C42.5986 27.6001 42.6572 27.5886 42.7119 27.566C42.7665 27.5435 42.8162 27.5104 42.8581 27.4686L46.6507 23.676C46.7344 23.5924 46.8008 23.4932 46.8461 23.3839C46.8913 23.2746 46.9147 23.1575 46.9147 23.0392C46.9147 22.921 46.8913 22.8039 46.8461 22.6946C46.8008 22.5853 46.7344 22.4861 46.6507 22.4025L45.5482 21.3Z"
          fill="white"
        />
      </g>
    </svg>
  );
}

export function SvgCloneVoice() {
  return (
    <svg width="78" height="48" viewBox="0 0 78 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full max-w-[90%]">
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-[1.15] md:group-hover:-translate-x-0.5">
        <rect x="8" y="13.2822" width="32" height="32" rx="10" transform="rotate(-15 8 13.2822)" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2.5" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        <path
          d="M28.7 29.6C28 30 27.2 30.24 26.4 30.3C25.6 30.35 24.8 30.22 24.1 29.91C23.3 29.61 22.7 29.14 22.1 28.53C21.6 27.93 21.2 27.22 21 26.44C20.8 25.67 20.8 24.86 21 24.08C21.1 23.29 21.5 22.56 22 21.93C22.5 21.3 23.1 20.79 23.8 20.45C24.5 20.1 25.3 19.93 26.1 19.94"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.1 20.3C29.2 20.2 29.3 20.1 29.3 20.1L31 20.5L31.8 20.1L32.1 20.1C32.2 20.1 32.3 20.15 32.4 20.2L33.1 21.5L33.9 21.7L34.4 22.8L34.1 23.6L33.5 24.6L33.4 25.4L33.1 26.3L32.6 27.5L31.8 27.7L31 28.6L30.4 29.6L29.8 28.9L29.3 28L28.4 28L27.6 27.2L27.2 26.1L27.4 25.1L28 24.1L28.6 23.2L29.1 22.3L29.1 20.3Z"
          fill="white"
        />
      </g>
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-[1.15] md:group-hover:translate-x-0.5">
        <rect x="39.4741" y="4" width="32" height="32" rx="10" transform="rotate(15 39.4741 4)" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2.5" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        <path
          d="M49.2 28.5C48.4 28.5 47.6 28.3 46.9 27.9C46.2 27.6 45.6 27.1 45.1 26.4C44.6 25.8 44.3 25.1 44.1 24.3C43.9 23.5 44 22.7 44.2 21.9C44.4 21.1 44.8 20.4 45.3 19.8C45.8 19.2 46.5 18.8 47.2 18.5C48 18.2 48.8 18 49.6 18.1C50.4 18.2 51.2 18.4 51.8 18.8"
          stroke="white"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M55.6 20.9L54.7 20.3L50.3 24.2L52.7 25.8L52.1 27.9L57.5 24.7L55.6 20.9Z" fill="white" />
      </g>
    </svg>
  );
}

export function SvgVoiceCollections({ uid }: { uid: string }) {
  const p = `${uid}-vc`;
  return (
    <svg width="78" height="48" viewBox="0 0 78 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-full max-w-[90%]">
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-[1.15] md:group-hover:-translate-x-0.5">
        <rect x="7" y="12.2822" width="32" height="32" rx="10" transform="rotate(-15 7 12.2822)" fill="#60a5fa" stroke="#F3F4F6" strokeWidth="2.5" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        <rect x="7" y="12.2822" width="32" height="32" rx="10" transform="rotate(-15 7 12.2822)" fill={`url(#${p})`} fillOpacity="0.5" />
      </g>
      <g className="origin-center transition-all duration-200 ease-in-out md:group-hover:scale-[1.15] md:group-hover:translate-x-0.5">
        <rect x="39.4741" y="4.42325" width="32" height="32" rx="10" transform="rotate(15 39.4741 4.42325)" fill="#5D79DF" stroke="#F3F4F6" strokeWidth="2.5" className="transition-all md:group-hover:stroke-[#E5E7EB]" />
        <circle cx="53" cy="22" r="5" fill="white" opacity="0.9" />
        <circle cx="51" cy="20" r="1.5" fill="#5D79DF" />
      </g>
      <defs>
        <linearGradient id={p} x1="23" y1="12" x2="23" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B7DCA" stopOpacity="0" />
          <stop offset="1" stopColor="#3B7DCA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

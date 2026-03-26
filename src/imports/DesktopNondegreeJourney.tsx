import svgPaths from "./svg-b0go07ygvd";
import imgLogo from "figma:asset/ed52d950de27f23ebc18b225e72eff9d85fd6cb6.png";
import imgWarning from "figma:asset/4ba7088d2c708a930665935539cf258f32638828.png";

function Logo() {
  return (
    <div className="h-[48px] relative shrink-0 w-[95px]" data-name="Logo">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[147.98%] left-[-13.68%] max-w-none top-[-23.99%] w-[127.37%]" src={imgLogo} />
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Logo />
      <p className="font-['Arial:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[#191919] text-[24px] tracking-[-0.84px] whitespace-nowrap">Nondegree Journey Map</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[12px]">
        <div className="absolute inset-[-33.33%_-61.11%_-88.89%_-61.11%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.6667 26.6667">
            <g filter="url(#filter0_d_1_283)" id="Ellipse 19">
              <circle cx="13.3333" cy="10" fill="var(--fill-0, #191919)" r="6" />
              <circle cx="13.3333" cy="10" r="7.33333" stroke="var(--stroke-0, white)" strokeWidth="2.66667" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="26.6667" id="filter0_d_1_283" width="26.6667" x="2.38419e-07" y="-2.38419e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="3.33333" />
                <feGaussianBlur stdDeviation="2.33333" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_283" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_283" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <p className="font-['Arial:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#191919] text-[14px] whitespace-nowrap">Step</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[22px]" data-name="Warning">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgWarning} />
      </div>
      <p className="font-['Arial:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#191919] text-[14px] whitespace-nowrap">Painpoint</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame8 />
      <Frame9 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[162px]">
      <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic opacity-50 relative shrink-0 text-[12px] text-black tracking-[1.2px] uppercase w-full">Legend</p>
      <Frame5 />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[85px] py-[24px] relative w-full">
          <Frame26 />
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[2.86%_0_-4.29%_0]">
      <div className="absolute inset-[2.86%_0_-4.29%_0]" data-name="color background line">
        <div className="absolute inset-[-2.82%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 600">
            <path d={svgPaths.p3e52ceb4} id="color background line" stroke="url(#paint0_linear_1_281)" strokeWidth="32" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_281" x1="0" x2="1280" y1="300" y2="300">
                <stop stopColor="#78BE20" />
                <stop offset="0.2" stopColor="#78BE20" />
                <stop offset="0.2" stopColor="#00A3E0" />
                <stop offset="0.4" stopColor="#00A3E0" />
                <stop offset="0.4" stopColor="#FF7F32" />
                <stop offset="0.6" stopColor="#FF7F32" />
                <stop offset="0.6" stopColor="#E74973" />
                <stop offset="0.8" stopColor="#E74973" />
                <stop offset="0.8" stopColor="#FFC627" />
                <stop offset="1" stopColor="#FFC627" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute inset-[2.86%_0_-4.29%_0]" data-name="dashed line">
        <div className="absolute inset-[-0.26%_-0.12%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1283 571">
            <path d={svgPaths.p3d7cdd00} id="dashed line" stroke="var(--stroke-0, black)" strokeDasharray="12 12" strokeLinecap="round" strokeOpacity="0.25" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 157">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 157">
        <div className="absolute left-0 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-full absolute flex flex-col font-['Arial:Regular',sans-serif] justify-end leading-[0] left-[6px] not-italic text-[#191919] text-[14px] text-center top-[-24px] w-[100px]">
          <p className="leading-[1.4]">Finds non-degree option</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 157">
        <div className="absolute left-0 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-full absolute flex flex-col font-['Arial:Regular',sans-serif] justify-end leading-[0] left-[6px] not-italic text-[#191919] text-[14px] text-center top-[-24px] w-[100px]">
          <p className="leading-[1.4]">Browses class search</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="backdrop-blur-[16.667px] bg-[rgba(255,255,255,0.8)] mb-[-16px] relative rounded-[6px] shrink-0 w-full z-[1]">
      <div aria-hidden="true" className="absolute border-2 border-[#ffc627] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_0px_5.333px_0px_rgba(255,198,39,0.12),0px_0px_40px_0px_rgba(255,198,39,0.2),0px_0px_80px_0px_rgba(255,198,39,0.05)]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[12px] pt-[22px] px-[12px] relative w-full">
          <p className="font-['Arial:Bold',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">Submits application and pays fee</p>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col isolate items-center justify-center left-[calc(50%-1px)] pb-[16px] top-1/2 w-[138px]">
      <div className="mb-[-16px] relative shrink-0 size-[32px] z-[2]" data-name="Warning">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgWarning} />
      </div>
      <Frame1 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
        <Frame10 />
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Arial:Regular',sans-serif] justify-center leading-[0] left-[-74px] not-italic text-[#191919] text-[14px] text-center top-[6px] w-[100px]">
          <p className="leading-[1.4]">Navigates branching questions</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="absolute left-0 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Arial:Regular',sans-serif] justify-center leading-[0] left-[86px] not-italic text-[#191919] text-[14px] text-center top-1/2 w-[100px]">
          <p className="leading-[1.4]">Creates account</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 157">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="absolute left-0 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[1.4] left-1/2 not-italic text-[#191919] text-[14px] text-center top-[36px] w-[100px]">Submits application and pays fee</p>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 157">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="backdrop-blur-[16.667px] bg-[rgba(255,255,255,0.8)] mb-[-16px] relative rounded-[6px] shrink-0 w-full z-[1]">
      <div aria-hidden="true" className="absolute border-2 border-[#ffc627] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_0px_5.333px_0px_rgba(255,198,39,0.12),0px_0px_40px_0px_rgba(255,198,39,0.2),0px_0px_80px_0px_rgba(255,198,39,0.05)]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[12px] pt-[22px] px-[12px] relative w-full">
          <p className="font-['Arial:Bold',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">Unclear if credits will transfer</p>
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col isolate items-center justify-center left-[calc(50%-1px)] pb-[16px] top-1/2 w-[138px]">
      <div className="mb-[-16px] relative shrink-0 size-[32px] z-[2]" data-name="Warning">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgWarning} />
      </div>
      <Frame2 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="absolute left-0 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Arial:Regular',sans-serif] justify-center leading-[0] left-[86px] not-italic text-[#191919] text-[14px] text-center top-1/2 w-[100px]">
          <p className="leading-[1.4]">Awaits system review and propagation</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Arial:Regular',sans-serif] justify-center leading-[0] left-[-74px] not-italic text-[#191919] text-[14px] text-center top-[6px] w-[100px]">
          <p className="leading-[1.4]">Receives admit email</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="absolute left-0 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Arial:Regular',sans-serif] justify-center leading-[0] left-[86px] not-italic text-[#191919] text-[14px] text-center top-1/2 w-[100px]">
          <p className="leading-[1.4]">Becomes registration eligible</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 157">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
        <Frame11 />
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 157">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="backdrop-blur-[16.667px] bg-[rgba(255,255,255,0.8)] mb-[-16px] relative rounded-[6px] shrink-0 w-full z-[1]">
      <div aria-hidden="true" className="absolute border-2 border-[#ffc627] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_0px_5.333px_0px_rgba(255,198,39,0.12),0px_0px_40px_0px_rgba(255,198,39,0.2),0px_0px_80px_0px_rgba(255,198,39,0.05)]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[12px] pt-[22px] px-[12px] relative w-full">
          <p className="font-['Arial:Bold',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">Modality rules unclear</p>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col isolate items-center justify-center left-[calc(50%-1px)] pb-[16px] top-1/2 w-[138px]">
      <div className="mb-[-16px] relative shrink-0 size-[32px] z-[2]" data-name="Warning">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgWarning} />
      </div>
      <Frame3 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
        <Frame12 />
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="absolute left-0 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Arial:Regular',sans-serif] justify-center leading-[0] left-[86px] not-italic text-[#191919] text-[14px] text-center top-1/2 w-[100px]">
          <p className="leading-[1.4]">Clicks through to register or enroll</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 157">
        <div className="absolute left-0 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Arial:Regular',sans-serif] justify-center leading-[0] left-[86px] not-italic text-[#191919] text-[14px] text-center top-1/2 w-[100px]">
          <p className="leading-[1.4]">Checks eligibility</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="absolute left-0 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-full absolute flex flex-col font-['Arial:Regular',sans-serif] justify-end leading-[0] left-[6px] not-italic text-[#191919] text-[14px] text-center top-[-24px] w-[100px]">
          <p className="leading-[1.4]">Navigates to Finances tab</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] opacity-0 relative shrink-0 w-full" data-name="Component 157">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="absolute left-0 size-[12px] top-0">
          <div className="absolute inset-[-25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" fill="var(--fill-0, #191919)" id="Ellipse 24" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
            </svg>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-full absolute flex flex-col font-['Arial:Regular',sans-serif] justify-end leading-[0] left-[6px] not-italic text-[#191919] text-[14px] text-center top-[-24px] w-[100px]">
          <p className="leading-[1.4]">Pays tuition</p>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 157">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-[12px]">
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 154">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 155">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 159">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 156">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 157">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] relative shrink-0 w-full" data-name="Component 158">
        <div className="-translate-x-1/2 absolute left-1/2 size-[12px] top-0">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <circle cx="6" cy="6" fill="var(--fill-0, #191919)" id="Ellipse 24" opacity="0" r="7.5" stroke="var(--stroke-0, white)" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute content-stretch flex inset-[1.79%_0] items-center justify-between">
      <Frame15 />
      <Frame24 />
      <Frame16 />
      <Frame18 />
      <Frame19 />
      <Frame20 />
      <Frame21 />
      <Frame22 />
      <Frame23 />
      <Frame25 />
      <Frame27 />
    </div>
  );
}

function MapGrid() {
  return (
    <div className="h-[560px] mb-[-30px] relative shrink-0 w-full" data-name="Map grid">
      <Group />
      <Frame17 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#78be20] border-l-3 border-solid inset-[0_0_0_-1.5px] pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[12px] relative w-full">
          <p className="flex-[1_0_0] font-['Neue_Haas_Grotesk_Text_Pro:55_Roman',sans-serif] leading-[1.4] min-h-px min-w-px not-italic opacity-60 relative text-[#191919] text-[14px]">Prospective students find non-degree options via Google, admissions site, or course search. They browse and decide whether to start with a class or the application.</p>
        </div>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="7">
      <p className="font-['Arial:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[#78be20] text-[40px] tracking-[-1.4px] whitespace-nowrap">01</p>
      <p className="font-['Arial:Bold',sans-serif] leading-[1.1] min-w-full not-italic relative shrink-0 text-[24px] text-black tracking-[-0.84px] w-[min-content]">Research</p>
      <Frame4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#00a3e0] border-l-3 border-solid inset-[0_0_0_-1.5px] pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[12px] relative w-full">
          <p className="flex-[1_0_0] font-['Neue_Haas_Grotesk_Text_Pro:55_Roman',sans-serif] leading-[1.4] min-h-px min-w-px not-italic opacity-60 relative text-[#191919] text-[14px]">Students create accounts, navigate branching questions, complete biographical and academic history sections, and submit applications with payment.</p>
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="413630">
      <p className="font-['Arial:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[#00a3e0] text-[40px] tracking-[-1.4px] whitespace-nowrap">02</p>
      <p className="font-['Arial:Bold',sans-serif] leading-[1.1] min-w-full not-italic relative shrink-0 text-[24px] text-black tracking-[-0.84px] w-[min-content]">Apply</p>
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#ff7f32] border-l-3 border-solid inset-[0_0_0_-1.5px] pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[12px] relative w-full">
          <p className="flex-[1_0_0] font-['Neue_Haas_Grotesk_Text_Pro:55_Roman',sans-serif] leading-[1.4] min-h-px min-w-px not-italic opacity-60 relative text-[#191919] text-[14px]">Students await system review and propagation, receive admit emails, and become registration eligible.</p>
        </div>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="413631">
      <p className="font-['Arial:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[#ff7f32] text-[40px] tracking-[-1.4px] whitespace-nowrap">03</p>
      <p className="font-['Arial:Bold',sans-serif] leading-[1.1] min-w-full not-italic relative shrink-0 text-[24px] text-black tracking-[-0.84px] w-[min-content]">Decision</p>
      <Frame7 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e74973] border-l-3 border-solid inset-[0_0_0_-1.5px] pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[12px] relative w-full">
          <p className="flex-[1_0_0] font-['Neue_Haas_Grotesk_Text_Pro:55_Roman',sans-serif] leading-[1.4] min-h-px min-w-px not-italic opacity-60 relative text-[#191919] text-[14px]">Students search and add courses, check eligibility and seat availability, then click through to register or enroll.</p>
        </div>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="413632">
      <p className="font-['Arial:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[#e74973] text-[40px] tracking-[-1.4px] whitespace-nowrap">04</p>
      <p className="font-['Arial:Bold',sans-serif] leading-[1.1] min-w-full not-italic relative shrink-0 text-[24px] text-black tracking-[-0.84px] w-[min-content]">Register</p>
      <Frame13 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#ffc627] border-l-3 border-solid inset-[0_0_0_-1.5px] pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[12px] relative w-full">
          <p className="flex-[1_0_0] font-['Neue_Haas_Grotesk_Text_Pro:55_Roman',sans-serif] leading-[1.4] min-h-px min-w-px not-italic opacity-60 relative text-[#191919] text-[14px]">Students navigate to the Finances tab in MyASU and pay tuition — often with confusion about amounts and timing.</p>
        </div>
      </div>
    </div>
  );
}

function Component4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="413633">
      <p className="font-['Arial:Bold',sans-serif] leading-none not-italic relative shrink-0 text-[#ffc627] text-[40px] tracking-[-1.4px] whitespace-nowrap">05</p>
      <p className="font-['Arial:Bold',sans-serif] leading-[1.1] min-w-full not-italic relative shrink-0 text-[24px] text-black tracking-[-0.84px] w-[min-content]">Tuition</p>
      <Frame14 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="backdrop-blur-[25px] bg-[rgba(255,255,255,0.8)] flex-[1_0_0] max-w-[1110px] min-h-px min-w-px relative rounded-[12px]">
      <div className="max-w-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[30px] items-start max-w-[inherit] p-[32px] relative w-full">
          <Component />
          <Component1 />
          <Component2 />
          <Component3 />
          <Component4 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_252px_71px_0px_rgba(0,0,0,0),0px_161px_64px_0px_rgba(0,0,0,0.01),0px_91px_54px_0px_rgba(0,0,0,0.03),0px_40px_40px_0px_rgba(0,0,0,0.04),0px_10px_22px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Frame28() {
  return (
    <div className="mb-[-30px] relative shrink-0 w-full">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center px-[85px] relative w-full">
          <Frame30 />
        </div>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[30px] relative shrink-0 w-full">
      <MapGrid />
      <Frame28 />
    </div>
  );
}

export default function DesktopNondegreeJourney() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col gap-[32px] items-center pb-[80px] relative size-full" data-name="Desktop Nondegree Journey">
      <Header />
      <Frame29 />
    </div>
  );
}
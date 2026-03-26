import svgPaths from "./svg-62nfn9s237";

function Group() {
  return (
    <div className="h-[63.339px] relative shrink-0 w-[60px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 63.3381">
        <g id="Group 120166">
          <path d={svgPaths.p1d15bf00} fill="var(--fill-0, #DEDDDD)" id="Vector" />
          <path d={svgPaths.p36a0a000} fill="var(--fill-0, #FCD062)" id="Vector_2" />
          <path d={svgPaths.p1858f680} fill="var(--fill-0, #454545)" id="Vector (Stroke)" />
          <path d={svgPaths.p3f809f80} fill="var(--fill-0, #D5D5D4)" id="Vector_3" />
          <path d={svgPaths.p14692100} fill="var(--fill-0, #DEDDDD)" id="Vector_4" />
          <path d={svgPaths.p37d8cd80} fill="var(--fill-0, #DEDDDD)" id="Vector_5" />
          <path d={svgPaths.p18158300} fill="var(--fill-0, #BCBBBB)" id="Vector_6" />
          <path d={svgPaths.p8387600} fill="var(--fill-0, #BCBBBB)" id="Vector_7" />
          <path d={svgPaths.p362ae380} fill="var(--fill-0, #DEDDDD)" id="Vector_8" />
          <path d={svgPaths.p14860080} fill="var(--fill-0, #FEFEFE)" id="Vector_9" />
          <path d={svgPaths.p300b5780} fill="var(--fill-0, #BCBBBB)" id="Vector_10" />
          <path d={svgPaths.p732da00} fill="var(--fill-0, #FEFEFE)" id="Vector_11" />
          <path d={svgPaths.p320b7b00} fill="var(--fill-0, #DEDDDD)" id="Vector_12" />
          <path d={svgPaths.pfd3c300} fill="var(--fill-0, #FEFEFE)" id="Vector_13" />
          <path d={svgPaths.p77e5000} fill="var(--fill-0, #BCBBBB)" id="Vector_14" />
          <path d={svgPaths.p14f7c00} fill="var(--fill-0, #BCBBBB)" id="Vector_15" />
          <path d={svgPaths.p2f7da100} fill="var(--fill-0, #DEDDDD)" id="Vector_16" />
          <path d={svgPaths.p21823c80} fill="var(--fill-0, #DEDDDD)" id="Vector_17" />
          <path d={svgPaths.p27d1bef0} fill="var(--fill-0, #FEFEFE)" id="Vector_18" />
          <path d={svgPaths.pe5c3e00} fill="var(--fill-0, #DEDDDD)" id="Vector_19" />
          <path d={svgPaths.p26db0a00} fill="var(--fill-0, #FEFEFE)" id="Vector_20" />
          <path d={svgPaths.p17e2f100} fill="var(--fill-0, #FCD062)" id="Vector_21" />
          <path d={svgPaths.p2b797a80} fill="var(--fill-0, #FCD062)" id="Vector_22" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['Arial:Bold',sans-serif] leading-[1.2] min-h-px min-w-px not-italic relative text-[28px] text-white tracking-[-0.98px]">Each step is a story</p>
      <Group />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['Arial:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#f1f1f1] text-[16px]">{`Click any dot along the journey to see what the student experiences at that moment and what we're proposing to change.`}</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame2 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[25px] shrink-0" data-name="Button">
      <p className="font-['Arial:Bold',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#191919] text-[14px] text-center whitespace-nowrap">Got it</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Button />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0">
      <Frame />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full">
      <Frame1 />
    </div>
  );
}

export default function GuidedTourPopover() {
  return (
    <div className="bg-[rgba(25,25,25,0.8)] content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] shadow-[-3px_0px_24px_0px_rgba(0,0,0,0.03),-6px_0px_24px_0px_rgba(0,0,0,0.06)] size-full" data-name="Guided tour popover">
      <Frame5 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}
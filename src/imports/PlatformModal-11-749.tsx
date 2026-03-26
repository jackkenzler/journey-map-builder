function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-[60px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[19.5px] left-0 not-italic text-[#4a8500] text-[14px] top-0 tracking-[-0.49px] whitespace-nowrap">Research</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-[236px]" data-name="Heading 2">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[36px] left-0 not-italic text-[24px] text-black top-0 tracking-[-0.84px] whitespace-nowrap">Browses class search</p>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative">
        <Paragraph />
        <Heading />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M19 5L5 19" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M5 5L19 19" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[999px] shrink-0 size-[60px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] relative size-full">
        <Icon />
      </div>
    </div>
  );
}

export default function PlatformModal() {
  return (
    <div className="content-stretch flex items-center justify-between pb-[17px] pl-[24px] pr-[16px] pt-[16px] relative size-full" data-name="PlatformModal">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-b border-solid inset-0 pointer-events-none" />
      <Container />
      <Button />
    </div>
  );
}
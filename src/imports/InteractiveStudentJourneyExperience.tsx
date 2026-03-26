import svgPaths from "./svg-gjcu1703xj";
import imgImageAsuLogo from "figma:asset/ed52d950de27f23ebc18b225e72eff9d85fd6cb6.png";
import imgImage from "figma:asset/4ba7088d2c708a930665935539cf258f32638828.png";
import imgContainer from "figma:asset/e140f9072ed72d5ecae5f47012660a5c7f8b586a.png";
import imgContainer1 from "figma:asset/8b510fad6f19629ead6cb8cddfcde457bbbbf8fb.png";

function Paragraph() {
  return (
    <div className="absolute h-[24px] left-[111px] top-[12px] w-[262.422px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#191919] text-[24px] top-0 tracking-[-0.84px] whitespace-nowrap">Nondegree Journey Map</p>
    </div>
  );
}

function ImageAsuLogo() {
  return (
    <div className="absolute h-[71.031px] left-[-13.3px] top-[-11.52px] w-[120.641px]" data-name="Image (ASU Logo)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageAsuLogo} />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[48px] relative shrink-0 w-[373.422px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph />
        <ImageAsuLogo />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[18px] opacity-50 relative shrink-0 w-[161.203px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[18px] left-0 not-italic text-[12px] text-black top-0 tracking-[1.2px] uppercase whitespace-nowrap">Legend</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_11_701)" id="Icon">
          <path d={svgPaths.p3e7757b0} fill="var(--fill-0, #191919)" id="Vector" stroke="var(--stroke-0, white)" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_11_701">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#191919] text-[14px] top-0 whitespace-nowrap">Step</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[21px] relative shrink-0 w-[52.813px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Icon />
        <Text />
      </div>
    </div>
  );
}

function Image() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Image">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function Text1() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#191919] text-[14px] top-0 whitespace-nowrap">Painpoint</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] h-[22px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Image />
        <Text1 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[161.203px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container5 />
        <Container6 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[48px] relative shrink-0 w-[161.203px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Paragraph1 />
        <Container4 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[96px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[85px] relative size-full">
          <Container2 />
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-white h-[97px] relative shrink-0 w-[1579px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Container9() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container10() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container11() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container12() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container13() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container14() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container15() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container16() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container17() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container18() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container19() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Container20() {
  return <div className="absolute h-0 left-0 top-0 w-[1200px]" data-name="Container" />;
}

function Group() {
  return (
    <div className="absolute inset-[4.19%_-64.06%_4.19%_-62.5%]" data-name="Group">
      <div className="absolute inset-[-3.58%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2718.75 608.666">
          <g id="Group">
            <path d={svgPaths.p108bee80} id="Vector" stroke="url(#paint0_linear_11_710)" strokeDasharray="968.25 968.25" strokeLinejoin="round" strokeWidth="40.6663" />
            <path d={svgPaths.p108bee80} id="Vector_2" stroke="var(--stroke-0, black)" strokeDasharray="11.62 11.62" strokeOpacity="0.25" strokeWidth="2.90474" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_11_710" x1="0" x2="2718.75" y1="304.333" y2="304.333">
              <stop stopColor="#78BE20" />
              <stop offset="0.19" stopColor="#00A3E0" />
              <stop offset="0.39" stopColor="#FF7F32" />
              <stop offset="0.59" stopColor="#E74973" />
              <stop offset="0.79" stopColor="#FFC627" />
              <stop offset="1" stopColor="#FFC627" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute h-[620px] left-0 top-0 w-[1200px]" data-name="Icon">
      <Group />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[39.53px] top-[46.39px] w-[96.938px]" data-name="Text">
      <p className="font-['Arial:Bold',sans-serif] leading-[22.4px] not-italic relative shrink-0 text-[16px] text-black text-center whitespace-nowrap">and pays fee</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.8)] border-2 border-[#ffc627] border-solid h-[82.781px] left-0 rounded-[6px] shadow-[0px_0px_5.333px_0px_rgba(255,198,39,0.12),0px_0px_40px_0px_rgba(255,198,39,0.2),0px_0px_80px_0px_rgba(255,198,39,0.05)] top-[20px] w-[180px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Bold',sans-serif] leading-[22.4px] left-[88.5px] not-italic text-[16px] text-black text-center top-[22px] whitespace-nowrap">Submits application</p>
      <Text2 />
    </div>
  );
}

function Image1() {
  return (
    <div className="absolute left-[74px] size-[32px] top-0" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[103px] left-[499.33px] top-[49.03px] w-[180px]" data-name="Container">
      <Container22 />
      <Image1 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[43.09px] top-[46.39px] w-[89.813px]" data-name="Text">
      <p className="font-['Arial:Bold',sans-serif] leading-[22.4px] not-italic relative shrink-0 text-[16px] text-black text-center whitespace-nowrap">will transfer</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.8)] border-2 border-[#ffc627] border-solid h-[82.781px] left-0 rounded-[6px] shadow-[0px_0px_5.333px_0px_rgba(255,198,39,0.12),0px_0px_40px_0px_rgba(255,198,39,0.2),0px_0px_80px_0px_rgba(255,198,39,0.05)] top-[20px] w-[180px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Bold',sans-serif] leading-[22.4px] left-[88.08px] not-italic text-[16px] text-black text-center top-[22px] whitespace-nowrap">Unclear if credits</p>
      <Text3 />
    </div>
  );
}

function Image2() {
  return (
    <div className="absolute left-[74px] size-[32px] top-0" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute h-[103px] left-[587.75px] top-[534.81px] w-[180px]" data-name="Container">
      <Container24 />
      <Image2 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[59.53px] top-[46.39px] w-[56.922px]" data-name="Text">
      <p className="font-['Arial:Bold',sans-serif] leading-[22.4px] not-italic relative shrink-0 text-[16px] text-black text-center whitespace-nowrap">unclear</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.8)] border-2 border-[#ffc627] border-solid h-[82.781px] left-0 rounded-[6px] shadow-[0px_0px_5.333px_0px_rgba(255,198,39,0.12),0px_0px_40px_0px_rgba(255,198,39,0.2),0px_0px_80px_0px_rgba(255,198,39,0.05)] top-[20px] w-[180px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Bold',sans-serif] leading-[22.4px] left-[88.2px] not-italic text-[16px] text-black text-center top-[22px] whitespace-nowrap">Modality rules</p>
      <Text4 />
    </div>
  );
}

function Image3() {
  return (
    <div className="absolute left-[74px] size-[32px] top-0" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute h-[103px] left-[747.73px] top-[217.38px] w-[180px]" data-name="Container">
      <Container26 />
      <Image3 />
    </div>
  );
}

function Container27() {
  return <div className="absolute left-[39.5px] rounded-[33554400px] size-[80px] top-[408px]" data-name="Container" />;
}

function Container28() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[70.5px] rounded-[9px] size-[18px] top-[439px]" data-name="Container" />;
}

function Container29() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[69.188px] left-[5.79px] rounded-[6px] top-[480px] w-[147.422px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[73px] not-italic text-[#191919] text-[16px] text-center top-[13px] w-[126px]">Finds non-degree option</p>
    </div>
  );
}

function Container30() {
  return <div className="absolute left-[190.31px] rounded-[33554400px] size-[80px] top-[408px]" data-name="Container" />;
}

function Container31() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[221.31px] rounded-[9px] size-[18px] top-[439px]" data-name="Container" />;
}

function Container32() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[69.188px] left-[168.19px] rounded-[6px] top-[480px] w-[124.25px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[61.5px] not-italic text-[#191919] text-[16px] text-center top-[13px] w-[103px]">Browses class search</p>
    </div>
  );
}

function Container33() {
  return <div className="absolute left-[321.11px] rounded-[33554400px] size-[80px] top-[290.92px]" data-name="Container" />;
}

function Container34() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[352.11px] rounded-[9px] size-[18px] top-[321.92px]" data-name="Container" />;
}

function Container35() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[69.188px] left-[393.11px] rounded-[6px] top-[296.33px] w-[78.047px]" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[10px] not-italic text-[#191919] text-[16px] top-[13px] w-[57px]">Creates account</p>
    </div>
  );
}

function Container36() {
  return <div className="absolute left-[321.8px] rounded-[33554400px] size-[80px] top-[130.08px]" data-name="Container" />;
}

function Container37() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[352.8px] rounded-[9px] size-[18px] top-[161.08px]" data-name="Container" />;
}

function Container38() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[90.781px] left-[236.64px] rounded-[6px] top-[124.69px] w-[93.156px]" data-name="Container">
      <p className="-translate-x-full absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[82px] not-italic text-[#191919] text-[16px] text-right top-[13px] w-[72px]">Navigates branching questions</p>
    </div>
  );
}

function Container39() {
  return <div className="absolute left-[407.91px] rounded-[33554400px] size-[80px] top-[-9.06px]" data-name="Container" />;
}

function Container40() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[438.91px] rounded-[9px] size-[18px] top-[21.92px]" data-name="Container" />;
}

function Container41() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[90.781px] left-[286.27px] rounded-[6px] top-[-14.47px] w-[129.641px]" data-name="Container">
      <p className="-translate-x-full absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[118px] not-italic text-[#191919] text-[16px] text-right top-[13px] w-[108px]">Submits application and pays fee</p>
    </div>
  );
}

function Container42() {
  return <div className="absolute left-[560px] rounded-[33554400px] size-[80px] top-[219.66px]" data-name="Container" />;
}

function Container43() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[591px] rounded-[9px] size-[18px] top-[250.66px]" data-name="Container" />;
}

function Container44() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[69.188px] left-[436.63px] rounded-[6px] top-[225.06px] w-[131.375px]" data-name="Container">
      <p className="-translate-x-full absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[120px] not-italic text-[#191919] text-[16px] text-right top-[13px] w-[110px]">Receives admit email</p>
    </div>
  );
}

function Container45() {
  return <div className="absolute left-[560px] rounded-[33554400px] size-[80px] top-[420.75px]" data-name="Container" />;
}

function Container46() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[591px] rounded-[9px] size-[18px] top-[451.75px]" data-name="Container" />;
}

function Container47() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[90.781px] left-[444.05px] rounded-[6px] top-[415.36px] w-[123.953px]" data-name="Container">
      <p className="-translate-x-full absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[112px] not-italic text-[#191919] text-[16px] text-right top-[13px] w-[102px]">Awaits system review and propagation</p>
    </div>
  );
}

function Container48() {
  return <div className="absolute left-[783.39px] rounded-[33554400px] size-[80px] top-[487.63px]" data-name="Container" />;
}

function Container49() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[814.39px] rounded-[9px] size-[18px] top-[518.63px]" data-name="Container" />;
}

function Container50() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[90.781px] left-[855.39px] rounded-[6px] top-[482.23px] w-[101.156px]" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[10px] not-italic text-[#191919] text-[16px] top-[13px] w-[80px]">Becomes registration eligible</p>
    </div>
  );
}

function Container51() {
  return <div className="absolute left-[797.73px] rounded-[33554400px] size-[80px] top-[309.2px]" data-name="Container" />;
}

function Container52() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[828.73px] rounded-[9px] size-[18px] top-[340.2px]" data-name="Container" />;
}

function Container53() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[69.188px] left-[869.73px] rounded-[6px] top-[314.61px] w-[82.469px]" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[10px] not-italic text-[#191919] text-[16px] top-[13px] w-[61px]">Checks eligibility</p>
    </div>
  );
}

function Container54() {
  return <div className="absolute left-[817.13px] rounded-[33554400px] size-[80px] top-[152.31px]" data-name="Container" />;
}

function Container55() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[848.13px] rounded-[9px] size-[18px] top-[183.31px]" data-name="Container" />;
}

function Container56() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[90.781px] left-[701.75px] rounded-[6px] top-[146.92px] w-[123.375px]" data-name="Container">
      <p className="-translate-x-full absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[112px] not-italic text-[#191919] text-[16px] text-right top-[13px] w-[102px]">Clicks through to register or enroll</p>
    </div>
  );
}

function Container57() {
  return <div className="absolute left-[986.13px] rounded-[33554400px] size-[80px] top-[92px]" data-name="Container" />;
}

function Container58() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[1017.13px] rounded-[9px] size-[18px] top-[123px]" data-name="Container" />;
}

function Container59() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[69.188px] left-[969.32px] rounded-[6px] top-[30.81px] w-[113.609px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[56px] not-italic text-[#191919] text-[16px] text-center top-[13px] w-[92px]">Navigates to Finances tab</p>
    </div>
  );
}

function Container60() {
  return <div className="absolute left-[1136.94px] rounded-[33554400px] size-[80px] top-[92px]" data-name="Container" />;
}

function Container61() {
  return <div className="absolute bg-[#191919] border-3 border-solid border-white left-[1167.94px] rounded-[9px] size-[18px] top-[123px]" data-name="Container" />;
}

function Container62() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[69.188px] left-[1144.59px] rounded-[6px] top-[30.81px] w-[64.703px]" data-name="Container">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[21.6px] left-[31.5px] not-italic text-[#191919] text-[16px] text-center top-[13px] w-[43px]">Pays tuition</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[620px] left-[189.5px] top-[24px] w-[1200px]" data-name="Container">
      <Container9 />
      <Container10 />
      <Container11 />
      <Container12 />
      <Container13 />
      <Container14 />
      <Container15 />
      <Container16 />
      <Container17 />
      <Container18 />
      <Container19 />
      <Container20 />
      <Icon1 />
      <Container21 />
      <Container23 />
      <Container25 />
      <Container27 />
      <Container28 />
      <Container29 />
      <Container30 />
      <Container31 />
      <Container32 />
      <Container33 />
      <Container34 />
      <Container35 />
      <Container36 />
      <Container37 />
      <Container38 />
      <Container39 />
      <Container40 />
      <Container41 />
      <Container42 />
      <Container43 />
      <Container44 />
      <Container45 />
      <Container46 />
      <Container47 />
      <Container48 />
      <Container49 />
      <Container50 />
      <Container51 />
      <Container52 />
      <Container53 />
      <Container54 />
      <Container55 />
      <Container56 />
      <Container57 />
      <Container58 />
      <Container59 />
      <Container60 />
      <Container61 />
      <Container62 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[40px] left-0 not-italic text-[#78be20] text-[40px] top-px tracking-[-1.4px] whitespace-nowrap">01</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[26.391px] left-0 top-[48px] w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[26.4px] left-0 not-italic text-[24px] text-black top-[-1px] tracking-[-0.84px] whitespace-nowrap">Research</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[137.156px] left-0 opacity-60 top-0 w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[19.6px] left-[12px] not-italic text-[#191919] text-[14px] top-[-1px] w-[176px]">Prospective students find non-degree options via Google, admissions site, or course search. They browse and decide whether to start with a class or the application.</p>
    </div>
  );
}

function Container68() {
  return <div className="absolute bg-[#78be20] h-[137.156px] left-0 rounded-[33554400px] top-0 w-[3px]" data-name="Container" />;
}

function Container67() {
  return (
    <div className="absolute h-[137.156px] left-0 top-[82.39px] w-[193.203px]" data-name="Container">
      <Paragraph4 />
      <Container68 />
    </div>
  );
}

function Container66() {
  return (
    <div className="flex-[193.203_0_0] h-[219.547px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph2 />
        <Paragraph3 />
        <Container67 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[40px] left-0 not-italic text-[#00a3e0] text-[40px] top-px tracking-[-1.4px] whitespace-nowrap">02</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[26.391px] left-0 top-[48px] w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[26.4px] left-0 not-italic text-[24px] text-black top-[-1px] tracking-[-0.84px] whitespace-nowrap">Apply</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[117.563px] left-0 opacity-60 top-0 w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[19.6px] left-[12px] not-italic text-[#191919] text-[14px] top-[-1px] w-[173px]">Students create accounts, navigate branching questions, complete biographical and academic history sections, and submit applications with payment.</p>
    </div>
  );
}

function Container71() {
  return <div className="absolute bg-[#00a3e0] h-[117.563px] left-0 rounded-[33554400px] top-0 w-[3px]" data-name="Container" />;
}

function Container70() {
  return (
    <div className="absolute h-[117.563px] left-0 top-[82.39px] w-[193.203px]" data-name="Container">
      <Paragraph7 />
      <Container71 />
    </div>
  );
}

function Container69() {
  return (
    <div className="flex-[193.203_0_0] h-[219.547px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph5 />
        <Paragraph6 />
        <Container70 />
      </div>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[40px] left-0 not-italic text-[#ff7f32] text-[40px] top-px tracking-[-1.4px] whitespace-nowrap">03</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[26.391px] left-0 top-[48px] w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[26.4px] left-0 not-italic text-[24px] text-black top-[-1px] tracking-[-0.84px] whitespace-nowrap">Decision</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute h-[78.375px] left-0 opacity-60 top-0 w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[19.6px] left-[12px] not-italic text-[#191919] text-[14px] top-[-1px] w-[175px]">Students await system review and propagation, receive admit emails, and become registration eligible.</p>
    </div>
  );
}

function Container74() {
  return <div className="absolute bg-[#ff7f32] h-[78.375px] left-0 rounded-[33554400px] top-0 w-[3px]" data-name="Container" />;
}

function Container73() {
  return (
    <div className="absolute h-[78.375px] left-0 top-[82.39px] w-[193.203px]" data-name="Container">
      <Paragraph10 />
      <Container74 />
    </div>
  );
}

function Container72() {
  return (
    <div className="flex-[193.203_0_0] h-[219.547px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph8 />
        <Paragraph9 />
        <Container73 />
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[40px] left-0 not-italic text-[#e74973] text-[40px] top-px tracking-[-1.4px] whitespace-nowrap">04</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="absolute h-[26.391px] left-0 top-[48px] w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[26.4px] left-0 not-italic text-[24px] text-black top-[-1px] tracking-[-0.84px] whitespace-nowrap">Register</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="absolute h-[78.375px] left-0 opacity-60 top-0 w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[19.6px] left-[12px] not-italic text-[#191919] text-[14px] top-[-1px] w-[178px]">Students search and add courses, check eligibility and seat availability, then click through to register or enroll.</p>
    </div>
  );
}

function Container77() {
  return <div className="absolute bg-[#e74973] h-[78.375px] left-0 rounded-[33554400px] top-0 w-[3px]" data-name="Container" />;
}

function Container76() {
  return (
    <div className="absolute h-[78.375px] left-0 top-[82.39px] w-[193.203px]" data-name="Container">
      <Paragraph13 />
      <Container77 />
    </div>
  );
}

function Container75() {
  return (
    <div className="flex-[193.203_0_0] h-[219.547px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph11 />
        <Paragraph12 />
        <Container76 />
      </div>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[40px] left-0 not-italic text-[#ffc627] text-[40px] top-px tracking-[-1.4px] whitespace-nowrap">05</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="absolute h-[26.391px] left-0 top-[48px] w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[26.4px] left-0 not-italic text-[24px] text-black top-[-1px] tracking-[-0.84px] whitespace-nowrap">Tuition</p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="absolute h-[97.969px] left-0 opacity-60 top-0 w-[193.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[19.6px] left-[12px] not-italic text-[#191919] text-[14px] top-[-1px] w-[174px]">Students navigate to the Finances tab in MyASU and pay tuition — often with confusion about amounts and timing.</p>
    </div>
  );
}

function Container80() {
  return <div className="absolute bg-[#ffc627] h-[97.969px] left-0 rounded-[33554400px] top-0 w-[3px]" data-name="Container" />;
}

function Container79() {
  return (
    <div className="absolute h-[97.969px] left-0 top-[82.39px] w-[193.203px]" data-name="Container">
      <Paragraph16 />
      <Container80 />
    </div>
  );
}

function Container78() {
  return (
    <div className="flex-[193.203_0_0] h-[219.547px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph14 />
        <Paragraph15 />
        <Container79 />
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="h-[283.547px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[30px] items-start pl-[32px] pr-[31.984px] pt-[32px] relative size-full">
        <Container66 />
        <Container69 />
        <Container72 />
        <Container75 />
        <Container78 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[285.547px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_10px_22px_0px_rgba(0,0,0,0.05),0px_40px_40px_0px_rgba(0,0,0,0.04)]" />
      <div className="content-stretch flex flex-col items-start p-px relative size-full">
        <Container65 />
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute content-stretch flex flex-col h-[286px] items-start left-[189.5px] px-[24px] top-[644px] w-[1200px]" data-name="Container">
      <Container64 />
    </div>
  );
}

function Container7() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1579px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container8 />
        <Container63 />
      </div>
    </div>
  );
}

function JourneyMap() {
  return (
    <div className="bg-[#f2f1ef] content-stretch flex flex-col h-[1106.547px] items-start overflow-clip relative shrink-0 w-full" data-name="JourneyMap">
      <Container />
      <Container7 />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[993px] items-start left-0 top-0 w-[1579px]" data-name="Body">
      <JourneyMap />
    </div>
  );
}

function PlatformModal() {
  return <div className="absolute bg-[rgba(0,0,0,0.6)] h-[993px] left-0 top-0 w-[1579px]" data-name="PlatformModal" />;
}

function Paragraph17() {
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

function Container83() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative">
        <Paragraph17 />
        <Heading />
      </div>
    </div>
  );
}

function Icon2() {
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
        <Icon2 />
      </div>
    </div>
  );
}

function PlatformModal1() {
  return (
    <div className="relative shrink-0 w-full" data-name="PlatformModal">
      <div aria-hidden="true" className="absolute border-[#e8e8e8] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[17px] pl-[24px] pr-[16px] pt-[16px] relative w-full">
          <Container83 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[520px] items-start left-0 pl-[32px] py-[32px] top-0 w-[800px]" data-name="Container">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgContainer} />
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[520px] items-start left-0 pl-[32px] py-[32px] top-0 w-[800px]" data-name="Container">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgContainer1} />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <div className="absolute inset-[0_-2.45%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.5883 24">
          <g id="Icon">
            <path d={svgPaths.p36966700} fill="var(--fill-0, #191919)" id="arrows-left-right" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="bg-white h-[48px] relative rounded-[33554400px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] relative size-full">
          <Icon3 />
        </div>
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="-translate-y-1/2 absolute bg-white content-stretch flex flex-col h-[520px] items-center justify-center left-[568px] px-[-22.5px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1),0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] top-1/2 w-[3px]" data-name="Container">
      <Container88 />
    </div>
  );
}

function Container84() {
  return (
    <div className="bg-[#fafafa] h-[520px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Container85 />
        <Container86 />
        <Container87 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_5px_8px_0px_rgba(0,0,0,0.02),0px_12px_40px_0px_rgba(0,0,0,0.03),0px_26px_80px_0px_rgba(0,0,0,0.08)]" />
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[20px] relative shrink-0 w-[88px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-0 not-italic text-[#191919] text-[14px] top-0 whitespace-nowrap">Current state</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <div className="absolute inset-[0_0_-2.5%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0156 16.4">
          <g id="Icon">
            <path d={svgPaths.pd955300} fill="var(--fill-0, #4A8400)" id="circle-check" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[20px] relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] h-full items-center relative">
        <Icon4 />
        <p className="font-['Arial:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#4a8500] text-[14px] whitespace-nowrap">Proposed redesign</p>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="content-stretch flex h-[19.5px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph18 />
      <Paragraph19 />
    </div>
  );
}

function PlatformModal2() {
  return (
    <div className="relative shrink-0 w-full" data-name="PlatformModal">
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full">
        <Container84 />
        <Container89 />
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="-translate-x-1/2 absolute bg-white left-[calc(50%+0.5px)] rounded-[12px] top-[142px] w-[848px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <PlatformModal1 />
        <PlatformModal2 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_5px_8px_0px_rgba(0,0,0,0.02),0px_12px_40px_0px_rgba(0,0,0,0.03),0px_26px_80px_0px_rgba(0,0,0,0.08)]" />
    </div>
  );
}

function Container81() {
  return (
    <div className="absolute h-[993px] left-0 top-0 w-[1579px]" data-name="Container">
      <PlatformModal />
      <Container82 />
    </div>
  );
}

export default function InteractiveStudentJourneyExperience() {
  return (
    <div className="bg-white relative size-full" data-name="Interactive Student Journey Experience">
      <Body />
      <Container81 />
    </div>
  );
}
import imgWarning from "figma:asset/4ba7088d2c708a930665935539cf258f32638828.png";

function Frame() {
  return (
    <div className="backdrop-blur-[16.667px] bg-[rgba(255,255,255,0.8)] mb-[-16px] relative rounded-[6px] shrink-0 w-full z-[1]">
      <div aria-hidden="true" className="absolute border-2 border-[#ffc627] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_0px_5.333px_0px_rgba(255,198,39,0.12),0px_0px_40px_0px_rgba(255,198,39,0.2),0px_0px_80px_0px_rgba(255,198,39,0.05)]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[12px] pt-[22px] px-[12px] relative w-full">
          <p className="font-['Arial:Bold',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-center w-full">Unclear if credits will transfer</p>
        </div>
      </div>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="content-stretch flex flex-col isolate items-center justify-center pb-[16px] relative size-full">
      <div className="mb-[-16px] relative shrink-0 size-[32px] z-[2]" data-name="Warning">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgWarning} />
      </div>
      <Frame />
    </div>
  );
}
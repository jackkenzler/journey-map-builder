import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { journeyStages } from '../data/journeyData';
import { useState } from 'react';
import { PlatformModal } from './PlatformModal';
import imgLogo from "figma:asset/ed52d950de27f23ebc18b225e72eff9d85fd6cb6.png";

export function StageDetail() {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  
  const currentStageIndex = journeyStages.findIndex(s => s.id === Number(stageId));
  const stage = journeyStages[currentStageIndex];

  if (!stage) {
    navigate('/');
    return null;
  }

  const canGoPrev = currentStageIndex > 0;
  const canGoNext = currentStageIndex < journeyStages.length - 1;

  const handlePrev = () => {
    if (canGoPrev) {
      navigate(`/stage/${journeyStages[currentStageIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      navigate(`/stage/${journeyStages[currentStageIndex + 1].id}`);
    }
  };

  const platform = stage.platforms.find(p => p.id === selectedPlatform);

  return (
    <motion.div
      className="bg-[#fafafa] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between px-[85px] py-[24px] max-w-[1920px] mx-auto">
          <div className="flex gap-[16px] items-center">
            <div className="h-[48px] w-[95px] relative">
              <img alt="ASU Logo" className="absolute h-[147.98%] left-[-13.68%] max-w-none top-[-23.99%] w-[127.37%]" src={imgLogo} />
            </div>
            <p className="font-['Arial:Bold',sans-serif] text-[24px] text-[#191919] tracking-[-0.84px]">
              Nondegree Journey Map
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-[40px] md:px-[85px] pt-[32px]">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-[8px] text-[14px] text-[#191919] opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="size-[16px]" />
          <span className="font-['Arial:Regular',sans-serif]">Journey</span>
          <span className="font-['Arial:Regular',sans-serif]">→</span>
          <span className="font-['Arial:Bold',sans-serif]">{stage.title}</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-[40px] md:px-[85px] py-[40px] pb-[120px] md:pb-[40px]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Left Column - Narrative */}
            <div className="flex flex-col gap-[32px]">
              {/* Stage Header */}
              <div>
                <p
                  className="font-['Arial:Bold',sans-serif] text-[64px] tracking-[-2.24px] mb-[8px]"
                  style={{ color: stage.color }}
                >
                  {stage.number}
                </p>
                <h1 className="font-['Arial:Bold',sans-serif] text-[40px] text-black tracking-[-1.4px] mb-[16px]">
                  {stage.title}
                </h1>
                <p className="font-['Neue_Haas_Grotesk_Text_Pro:55_Roman',sans-serif] text-[16px] text-[#191919] opacity-80 leading-[1.6]">
                  {stage.description}
                </p>
              </div>

              {/* Key Decisions */}
              <div>
                <h2 className="font-['Arial:Bold',sans-serif] text-[20px] text-black mb-[16px]">
                  Key Student Decisions
                </h2>
                <ul className="flex flex-col gap-[12px]">
                  {stage.narrative.decisions.map((decision, idx) => (
                    <li key={idx} className="flex gap-[12px] items-start">
                      <div className="size-[6px] rounded-full bg-black mt-[8px] shrink-0" />
                      <p className="font-['Neue_Haas_Grotesk_Text_Pro:55_Roman',sans-serif] text-[15px] text-[#191919] opacity-70 leading-[1.5]">
                        {decision}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Communications */}
              <div>
                <h2 className="font-['Arial:Bold',sans-serif] text-[20px] text-black mb-[16px]">
                  Communications Triggered
                </h2>
                <div className="flex flex-wrap gap-[8px]">
                  {stage.narrative.communications.map((comm, idx) => (
                    <span
                      key={idx}
                      className="px-[12px] py-[6px] bg-white border border-[#e8e8e8] rounded-[6px] font-['Arial:Regular',sans-serif] text-[13px] text-[#191919]"
                    >
                      {comm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Systems Touched */}
              <div>
                <h2 className="font-['Arial:Bold',sans-serif] text-[20px] text-black mb-[16px]">
                  Systems Touched
                </h2>
                <div className="flex flex-wrap gap-[8px]">
                  {stage.narrative.systems.map((system, idx) => (
                    <span
                      key={idx}
                      className="px-[12px] py-[6px] bg-[#f5f5f3] rounded-[6px] font-['Arial:Bold',sans-serif] text-[13px] text-[#191919]"
                    >
                      {system}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Pain Points */}
              {stage.painPoints.length > 0 && (
                <div>
                  <h2 className="font-['Arial:Bold',sans-serif] text-[20px] text-black mb-[16px]">
                    Current Pain Points
                  </h2>
                  <div className="flex flex-col gap-[12px]">
                    {stage.painPoints.map((pain) => (
                      <div
                        key={pain.id}
                        className="backdrop-blur-[16.667px] bg-[rgba(255,255,255,0.8)] rounded-[8px] border-2 border-[#ffc627] shadow-[0px_0px_5.333px_0px_rgba(255,198,39,0.12),0px_0px_40px_0px_rgba(255,198,39,0.2)] p-[16px] flex gap-[12px] items-start"
                      >
                        <AlertTriangle className="size-[20px] text-[#ffc627] shrink-0 mt-[2px]" />
                        <div className="flex-1">
                          <p className="font-['Arial:Bold',sans-serif] text-[14px] text-black mb-[4px]">
                            {pain.title}
                          </p>
                          <p className="font-['Arial:Regular',sans-serif] text-[12px] text-[#191919] opacity-60 uppercase tracking-[1px]">
                            Severity: {pain.severity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - System Cards */}
            <div className="flex flex-col gap-[24px]">
              <h2 className="font-['Arial:Bold',sans-serif] text-[20px] text-black">
                Platform Touchpoints
              </h2>
              {stage.platforms.map((platform, idx) => (
                <motion.div
                  key={platform.id}
                  className="bg-white rounded-[12px] border border-[#e8e8e8] p-[24px] cursor-pointer transition-all hover:shadow-lg hover:border-[#191919]"
                  onClick={() => setSelectedPlatform(platform.id)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <h3 className="font-['Arial:Bold',sans-serif] text-[18px] text-black mb-[8px]">
                    {platform.name}
                  </h3>
                  <p className="font-['Neue_Haas_Grotesk_Text_Pro:55_Roman',sans-serif] text-[14px] text-[#191919] opacity-60 mb-[16px] leading-[1.5]">
                    {platform.description}
                  </p>
                  
                  {/* Mock UI Preview */}
                  <div className="bg-[#fafafa] rounded-[8px] h-[180px] mb-[16px] border border-[#e8e8e8] flex items-center justify-center">
                    <p className="font-['Arial:Regular',sans-serif] text-[13px] text-[#191919] opacity-40">
                      UI Preview
                    </p>
                  </div>

                  <button className="w-full py-[10px] px-[16px] bg-[#191919] text-white rounded-[6px] font-['Arial:Bold',sans-serif] text-[14px] hover:bg-[#333] transition-colors">
                    View redesign
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-[20px] md:bottom-[40px] left-0 right-0">
        <div className="max-w-[1400px] mx-auto px-[40px] md:px-[85px]">
          <div className="flex items-center justify-between bg-white/95 backdrop-blur-sm md:bg-transparent rounded-[12px] md:rounded-none p-[16px] md:p-0 shadow-lg md:shadow-none">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className="flex items-center gap-[8px] px-[16px] md:px-[20px] py-[10px] md:py-[12px] bg-white rounded-[8px] border border-[#e8e8e8] font-['Arial:Bold',sans-serif] text-[13px] md:text-[14px] text-[#191919] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f5f5f3] transition-colors"
            >
              <ArrowLeft className="size-[14px] md:size-[16px]" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Progress Dots */}
            <div className="flex gap-[8px] md:gap-[12px]">
              {journeyStages.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/stage/${s.id}`)}
                  className={`size-[10px] md:size-[12px] rounded-full transition-all ${
                    idx === currentStageIndex
                      ? 'scale-125'
                      : 'opacity-30 hover:opacity-60'
                  }`}
                  style={{
                    backgroundColor: idx === currentStageIndex ? stage.color : '#191919'
                  }}
                >
                  <span className="sr-only">Go to {s.title}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="flex items-center gap-[8px] px-[16px] md:px-[20px] py-[10px] md:py-[12px] bg-white rounded-[8px] border border-[#e8e8e8] font-['Arial:Bold',sans-serif] text-[13px] md:text-[14px] text-[#191919] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f5f5f3] transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="size-[14px] md:size-[16px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Platform Modal */}
      {selectedPlatform && platform && (
        <PlatformModal
          platform={platform}
          stageColor={stage.color}
          onClose={() => setSelectedPlatform(null)}
        />
      )}
    </motion.div>
  );
}
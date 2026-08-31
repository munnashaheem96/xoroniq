import React, { useState } from 'react';
import { DETAILING_STEPS } from '../data/x3Kit';
import { soundFx } from '../lib/SoundFx';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Award, Zap, Layers } from 'lucide-react';

interface DetailingWorkflowProps {
  onOpenCheckout?: () => void;
}

export const DetailingWorkflow: React.FC<DetailingWorkflowProps> = ({ onOpenCheckout }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const currentStep = DETAILING_STEPS[activeStepIndex];

  const handleSelectStep = (index: number) => {
    soundFx.play('click');
    setActiveStepIndex(index);
  };

  const handleNext = () => {
    if (activeStepIndex < DETAILING_STEPS.length - 1) {
      soundFx.play('whoosh');
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      soundFx.play('whoosh');
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  return (
    <section id="detailing-workflow" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-xoroniq-red/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase mb-4">
          <Zap className="w-3.5 h-3.5 text-xoroniq-red" />
          <span>Professional Masterclass // 4-Step Methodology</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-xoroniq-red via-red-500 to-white">4-Stage</span> Detailing Workflow
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 font-light">
          Follow the sequential system developed by professional detailers to achieve a swirl-free, mirror-finish result.
        </p>
      </div>

      {/* Step Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {DETAILING_STEPS.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isPassed = idx < activeStepIndex;

          return (
            <button
              key={step.stepNumber}
              onClick={() => handleSelectStep(idx)}
              className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 border relative overflow-hidden ${
                isActive
                  ? 'bg-white/[0.08] border-xoroniq-red/50 shadow-glow-red'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5'
              }`}
            >
              {/* Active top accent indicator */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-xoroniq-red" />
              )}

              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-mono font-bold ${
                    isActive ? 'text-xoroniq-red' : isPassed ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  STEP {step.stepNumber}
                </span>
                {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                className={`text-sm sm:text-base font-bold font-display line-clamp-1 ${
                  isActive ? 'text-white' : 'text-zinc-400'
                }`}
              >
                {step.title}
              </div>

              <div className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                {step.phase}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Showcase Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Step Details & Overview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-xoroniq-red to-red-400 font-mono">
                {currentStep.stepNumber}
              </span>
              <div>
                <span className="text-xs font-mono tracking-wider uppercase text-zinc-400 block">
                  {currentStep.phase}
                </span>
                <h3 className="text-2xl sm:text-4xl font-bold text-white font-display">
                  {currentStep.title}
                </h3>
              </div>
            </div>

            <p className="text-base text-zinc-300 leading-relaxed font-light">
              {currentStep.description}
            </p>

            {/* Paired Products Section */}
            <div className="pt-2">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-xoroniq-red" />
                <span>Dedicated Kit Tools For This Step:</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {currentStep.pairedProducts.map((product) => (
                  <div
                    key={product}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-medium text-white flex items-center gap-2 shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-xoroniq-red" />
                    <span>{product}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
              <button
                onClick={handlePrev}
                disabled={activeStepIndex === 0}
                className={`p-3 rounded-xl border border-white/10 flex items-center gap-2 text-xs font-medium transition-all ${
                  activeStepIndex === 0
                    ? 'opacity-30 cursor-not-allowed text-zinc-600'
                    : 'bg-white/5 hover:bg-white/15 text-white'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button
                onClick={handleNext}
                disabled={activeStepIndex === DETAILING_STEPS.length - 1}
                className={`p-3 rounded-xl border border-white/10 flex items-center gap-2 text-xs font-medium transition-all ${
                  activeStepIndex === DETAILING_STEPS.length - 1
                    ? 'opacity-30 cursor-not-allowed text-zinc-600'
                    : 'bg-white/5 hover:bg-white/15 text-white'
                }`}
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {activeStepIndex === DETAILING_STEPS.length - 1 && (
                <button
                  onClick={() => {
                    soundFx.play('open');
                    if (onOpenCheckout) onOpenCheckout();
                  }}
                  className="ml-auto px-6 py-3 rounded-xl bg-xoroniq-red hover:bg-red-600 text-xs font-semibold text-white tracking-wide shadow-glow-red transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get The Kit</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Expert Protocol & Tips */}
          <div className="lg:col-span-5 bg-black/50 border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-xoroniq-red mb-4">
              <Award className="w-4 h-4" />
              <span>Detailer's Pro Tips</span>
            </div>

            <div className="space-y-4">
              {currentStep.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-xoroniq-red/20 border border-xoroniq-red/40 text-xoroniq-red text-[11px] font-mono font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-xoroniq-red/10 to-transparent border border-xoroniq-red/20 text-xs text-zinc-300 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Guaranteed Safe On All Finishes</div>
                <div className="text-[11px] text-zinc-400">Clear coats, vinyl wraps, PPF & matte trims.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { UserProfile, CarCustomization } from '../types';
import { CAR_MODELS, PAINT_COLORS, UNDERGLOW_OPTIONS, UPGRADE_TIERS } from '../data/cars';
import { CarSvg } from './CarSvg';
import { saveActiveUser } from '../services/storage';
import { soundFx } from '../services/soundFx';
import { 
  Flame, 
  Palette, 
  Sparkles,
  ArrowRight,
  Shield,
  CircleDot
} from 'lucide-react';

interface GarageViewProps {
  user: UserProfile;
  onUserUpdate: (updated: UserProfile) => void;
  onStartRace: () => void;
}

export const GarageView: React.FC<GarageViewProps> = ({
  user,
  onUserUpdate,
  onStartRace,
}) => {
  const [selectedCarId, setSelectedCarId] = useState<string>(user.selectedCarId);
  const [activeTab, setActiveTab] = useState<'tune' | 'vehicle' | 'paint'>('tune');
  const [testBoosting, setTestBoosting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const selectedModel = CAR_MODELS.find((c) => c.id === selectedCarId) || CAR_MODELS[0];
  const isCarOwned = user.ownedCarIds.includes(selectedCarId);

  const carCustomization: CarCustomization = user.carCustomizations[selectedCarId] || {
    color: selectedModel.defaultColor,
    underglow: 'none',
    spoilerLevel: 0,
    engineLevel: 1,
    nitroLevel: 1,
    tiresLevel: 1,
    wheelsStyle: 'sport',
  };

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleBuyCar = (carId: string) => {
    const model = CAR_MODELS.find((c) => c.id === carId);
    if (!model) return;

    if (user.stats.nitroCoins < model.price) {
      showNotification(`Not enough Coins! Win more hill races to earn coins.`);
      soundFx.playError();
      return;
    }

    const updatedUser = { ...user };
    updatedUser.stats.nitroCoins -= model.price;
    updatedUser.ownedCarIds.push(carId);
    updatedUser.selectedCarId = carId;
    updatedUser.carCustomizations[carId] = {
      color: model.defaultColor,
      underglow: 'none',
      spoilerLevel: 1,
      engineLevel: 1,
      nitroLevel: 1,
      tiresLevel: 1,
      wheelsStyle: 'sport',
    };

    saveActiveUser(updatedUser);
    onUserUpdate(updatedUser);
    soundFx.playFanfare(true);
    showNotification(`Unlocked ${model.name}! Selected for hill climb.`);
  };

  const handleSelectActiveCar = (carId: string) => {
    const updatedUser = { ...user, selectedCarId: carId };
    saveActiveUser(updatedUser);
    onUserUpdate(updatedUser);
    soundFx.playButtonClick();
    showNotification(`${selectedModel.name} selected as active vehicle.`);
  };

  const handleUpgradePart = (
    partType: 'engine' | 'nitro' | 'spoilers' | 'tires',
    targetLevel: number,
    cost: number
  ) => {
    if (user.stats.nitroCoins < cost) {
      showNotification(`Need ${cost} Coins! Win more hill climbs to upgrade.`);
      soundFx.playError();
      return;
    }

    const updated = { ...user };
    updated.stats.nitroCoins -= cost;

    if (!updated.carCustomizations[selectedCarId]) {
      updated.carCustomizations[selectedCarId] = { ...carCustomization };
    }

    if (partType === 'engine') updated.carCustomizations[selectedCarId].engineLevel = targetLevel;
    if (partType === 'nitro') updated.carCustomizations[selectedCarId].nitroLevel = targetLevel;
    if (partType === 'spoilers') updated.carCustomizations[selectedCarId].spoilerLevel = targetLevel;
    if (partType === 'tires') updated.carCustomizations[selectedCarId].tiresLevel = targetLevel;

    saveActiveUser(updated);
    onUserUpdate(updated);
    soundFx.playFanfare(false);
    showNotification(`Upgraded to Level ${targetLevel}! Car tuned for steeper hills.`);
  };

  const triggerTestBurnout = () => {
    setTestBoosting(true);
    soundFx.playNitro();
    setTimeout(() => setTestBoosting(false), 1400);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="p-3 bg-amber-400 border-2 border-amber-900 text-amber-950 font-game rounded-xl text-sm shadow-lg flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-900" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Hill Climb Racing Top Bar: VEHICLE / TUNE / STAGE & START Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 rounded-2xl border-4 border-amber-950 shadow-xl">
        <div className="flex items-center gap-2">
          {/* Tabs matching Hill Climb Racing menu */}
          <button
            onClick={() => {
              soundFx.playButtonClick();
              setActiveTab('tune');
            }}
            className={`px-5 py-2.5 rounded-xl font-game text-base uppercase transition-all cursor-pointer ${
              activeTab === 'tune' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            TUNE
          </button>
          <button
            onClick={() => {
              soundFx.playButtonClick();
              setActiveTab('vehicle');
            }}
            className={`px-5 py-2.5 rounded-xl font-game text-base uppercase transition-all cursor-pointer ${
              activeTab === 'vehicle' ? 'btn-hcr-blue' : 'btn-hcr-wood'
            }`}
          >
            VEHICLE
          </button>
          <button
            onClick={() => {
              soundFx.playButtonClick();
              setActiveTab('paint');
            }}
            className={`px-5 py-2.5 rounded-xl font-game text-base uppercase transition-all cursor-pointer ${
              activeTab === 'paint' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            PAINT
          </button>
        </div>

        {/* Coins & Big Green START Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-400 border-3 border-amber-800 rounded-xl font-game text-amber-950 font-black shadow-md text-base">
            <span className="text-xl">🪙</span>
            <span>{user.stats.nitroCoins} COINS</span>
          </div>

          <button
            onClick={() => {
              soundFx.playButtonClick();
              onStartRace();
            }}
            className="btn-hcr-green px-7 py-3 rounded-xl font-game text-xl uppercase font-black stroke-black-sm flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>START</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Vehicle Showcase Hill Stage (Countryside Meadow Mound) */}
      <div className="relative rounded-2xl overflow-hidden border-4 border-emerald-950 shadow-2xl bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200 p-6 min-h-[300px] flex flex-col justify-between">
        {/* Sun Bloom Glow & Clouds */}
        <div className="absolute top-4 right-10 w-24 h-24 rounded-full bg-yellow-200/50 blur-xl pointer-events-none" />
        <div className="absolute top-6 right-14 w-12 h-12 rounded-full bg-yellow-300 border-3 border-yellow-100 shadow-md pointer-events-none" />

        {/* Vehicle Title & Tagline in Hill Climb Racing font */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-game px-3 py-0.5 rounded-full text-xs uppercase border border-red-900 shadow-sm">
                {selectedModel.category}
              </span>
              <h2 className="text-3xl font-game font-black text-white stroke-black-md">
                {selectedModel.name}
              </h2>
            </div>
            <p className="text-sm font-game text-amber-100 stroke-black-sm mt-0.5">
              {selectedModel.tagline}
            </p>
          </div>

          <button
            onClick={triggerTestBurnout}
            className="btn-hcr-yellow px-4 py-2 rounded-xl font-game text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-950" />
            REV ENGINE
          </button>
        </div>

        {/* Center Grassy Hill with Selected Vehicle */}
        <div className="relative py-8 flex flex-col items-center justify-center z-10">
          <div className="relative transition-transform duration-300">
            <CarSvg
              carId={selectedCarId}
              customization={carCustomization}
              isBoosting={testBoosting}
              className="w-72 sm:w-88 drop-shadow-[0_12px_16px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Grassy Rolling Hill Knoll Pedestal */}
          <div className="w-full max-w-lg h-12 rounded-full bg-gradient-to-b from-lime-400 to-emerald-700 border-3 border-emerald-950 shadow-2xl -mt-6 z-0 flex items-center justify-center">
            <span className="text-xs font-game text-emerald-950/70">
              HILL CLIMB RACING VEHICLE WORKSHOP
            </span>
          </div>
        </div>

        {/* Vehicle Selection / Purchase Bar */}
        <div className="relative z-10 flex items-center justify-between pt-2">
          <div className="text-xs font-game text-amber-950 bg-amber-200/90 px-3 py-1.5 rounded-lg border-2 border-amber-800">
            Engine: Lvl {carCustomization.engineLevel} · 4WD: Lvl {carCustomization.nitroLevel} · Suspension: Lvl {carCustomization.spoilerLevel} · Tires: Lvl {carCustomization.tiresLevel}
          </div>

          <div>
            {isCarOwned ? (
              user.selectedCarId === selectedCarId ? (
                <div className="btn-hcr-green px-5 py-2 rounded-xl font-game text-sm stroke-black-sm">
                  SELECTED VEHICLE
                </div>
              ) : (
                <button
                  onClick={() => handleSelectActiveCar(selectedCarId)}
                  className="btn-hcr-blue px-5 py-2 rounded-xl font-game text-sm stroke-black-sm cursor-pointer"
                >
                  SELECT THIS CAR
                </button>
              )
            ) : (
              <button
                onClick={() => handleBuyCar(selectedCarId)}
                className="btn-hcr-yellow px-6 py-2.5 rounded-xl font-game text-base stroke-black-sm cursor-pointer"
              >
                UNLOCK FOR {selectedModel.price} COINS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab 1: The Iconic 4 Hill Climb Racing Upgrade Boxes (ENGINE, SUSPENSION, TIRES, 4WD) */}
      {activeTab === 'tune' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1. ENGINE UPGRADE BOX */}
          {(() => {
            const currentLevel = carCustomization.engineLevel;
            const nextTier = UPGRADE_TIERS.engine.find((t) => t.level === currentLevel + 1);
            const isMax = currentLevel >= 5;

            return (
              <div className="hcr-panel p-4 flex flex-col justify-between border-4 border-amber-900 bg-gradient-to-b from-slate-900 to-amber-950/80">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl font-game text-yellow-400 stroke-black-sm">
                      ENGINE
                    </span>
                    <span className="font-game text-xs text-amber-200">
                      LVL {currentLevel}/5
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans leading-tight min-h-[32px]">
                    Increases top acceleration and hill climbing horsepower.
                  </p>

                  {/* Level Pips */}
                  <div className="flex items-center gap-1.5 my-3">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 h-3 rounded-md border border-black ${
                          lvl <= currentLevel
                            ? 'bg-gradient-to-b from-yellow-300 to-amber-500 shadow-sm'
                            : 'bg-slate-950'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  {isMax ? (
                    <div className="w-full py-2.5 text-center font-game text-sm bg-emerald-800 text-emerald-200 rounded-xl border-2 border-emerald-950">
                      MAX LEVEL
                    </div>
                  ) : nextTier ? (
                    <button
                      onClick={() => handleUpgradePart('engine', nextTier.level, nextTier.cost)}
                      className="w-full btn-hcr-yellow py-2.5 rounded-xl font-game text-sm stroke-black-sm cursor-pointer"
                    >
                      UPGRADE: {nextTier.cost} 🪙
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })()}

          {/* 2. 4WD / BOOST UPGRADE BOX */}
          {(() => {
            const currentLevel = carCustomization.nitroLevel;
            const nextTier = UPGRADE_TIERS.nitro.find((t) => t.level === currentLevel + 1);
            const isMax = currentLevel >= 5;

            return (
              <div className="hcr-panel p-4 flex flex-col justify-between border-4 border-amber-900 bg-gradient-to-b from-slate-900 to-amber-950/80">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl font-game text-red-400 stroke-black-sm">
                      4WD / BOOST
                    </span>
                    <span className="font-game text-xs text-amber-200">
                      LVL {currentLevel}/5
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans leading-tight min-h-[32px]">
                    Provides all-wheel drive traction and nitro blast multiplier.
                  </p>

                  {/* Level Pips */}
                  <div className="flex items-center gap-1.5 my-3">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 h-3 rounded-md border border-black ${
                          lvl <= currentLevel
                            ? 'bg-gradient-to-b from-red-400 to-red-600 shadow-sm'
                            : 'bg-slate-950'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  {isMax ? (
                    <div className="w-full py-2.5 text-center font-game text-sm bg-emerald-800 text-emerald-200 rounded-xl border-2 border-emerald-950">
                      MAX LEVEL
                    </div>
                  ) : nextTier ? (
                    <button
                      onClick={() => handleUpgradePart('nitro', nextTier.level, nextTier.cost)}
                      className="w-full btn-hcr-yellow py-2.5 rounded-xl font-game text-sm stroke-black-sm cursor-pointer"
                    >
                      UPGRADE: {nextTier.cost} 🪙
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })()}

          {/* 3. SUSPENSION UPGRADE BOX */}
          {(() => {
            const currentLevel = carCustomization.spoilerLevel;
            const nextTier = UPGRADE_TIERS.spoilers.find((t) => t.level === currentLevel + 1);
            const isMax = currentLevel >= 3;

            return (
              <div className="hcr-panel p-4 flex flex-col justify-between border-4 border-amber-900 bg-gradient-to-b from-slate-900 to-amber-950/80">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl font-game text-cyan-400 stroke-black-sm">
                      SUSPENSION
                    </span>
                    <span className="font-game text-xs text-amber-200">
                      LVL {currentLevel}/3
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans leading-tight min-h-[32px]">
                    Absorbs harsh hill bumps and dampens airtime landings.
                  </p>

                  {/* Level Pips */}
                  <div className="flex items-center gap-1.5 my-3">
                    {[1, 2, 3].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 h-3 rounded-md border border-black ${
                          lvl <= currentLevel
                            ? 'bg-gradient-to-b from-cyan-300 to-sky-500 shadow-sm'
                            : 'bg-slate-950'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  {isMax ? (
                    <div className="w-full py-2.5 text-center font-game text-sm bg-emerald-800 text-emerald-200 rounded-xl border-2 border-emerald-950">
                      MAX LEVEL
                    </div>
                  ) : nextTier ? (
                    <button
                      onClick={() => handleUpgradePart('spoilers', nextTier.level, nextTier.cost)}
                      className="w-full btn-hcr-yellow py-2.5 rounded-xl font-game text-sm stroke-black-sm cursor-pointer"
                    >
                      UPGRADE: {nextTier.cost} 🪙
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })()}

          {/* 4. TIRES UPGRADE BOX */}
          {(() => {
            const currentLevel = carCustomization.tiresLevel;
            const nextTier = UPGRADE_TIERS.tires.find((t) => t.level === currentLevel + 1);
            const isMax = currentLevel >= 5;

            return (
              <div className="hcr-panel p-4 flex flex-col justify-between border-4 border-amber-900 bg-gradient-to-b from-slate-900 to-amber-950/80">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl font-game text-lime-400 stroke-black-sm">
                      TIRES
                    </span>
                    <span className="font-game text-xs text-amber-200">
                      LVL {currentLevel}/5
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans leading-tight min-h-[32px]">
                    Deep offroad treads prevent hill spinouts and slip.
                  </p>

                  {/* Level Pips */}
                  <div className="flex items-center gap-1.5 my-3">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 h-3 rounded-md border border-black ${
                          lvl <= currentLevel
                            ? 'bg-gradient-to-b from-lime-300 to-emerald-500 shadow-sm'
                            : 'bg-slate-950'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  {isMax ? (
                    <div className="w-full py-2.5 text-center font-game text-sm bg-emerald-800 text-emerald-200 rounded-xl border-2 border-emerald-950">
                      MAX LEVEL
                    </div>
                  ) : nextTier ? (
                    <button
                      onClick={() => handleUpgradePart('tires', nextTier.level, nextTier.cost)}
                      className="w-full btn-hcr-yellow py-2.5 rounded-xl font-game text-sm stroke-black-sm cursor-pointer"
                    >
                      UPGRADE: {nextTier.cost} 🪙
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab 2: Vehicle Dealership Fleet Cards */}
      {activeTab === 'vehicle' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CAR_MODELS.map((model) => {
            const isOwned = user.ownedCarIds.includes(model.id);
            const isEquipped = user.selectedCarId === model.id;

            return (
              <div
                key={model.id}
                onClick={() => setSelectedCarId(model.id)}
                className={`p-4 rounded-2xl border-4 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedCarId === model.id
                    ? 'border-yellow-400 bg-amber-950/70 shadow-2xl scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-game text-yellow-300">
                      {model.category}
                    </span>
                    {isEquipped ? (
                      <span className="btn-hcr-green px-2 py-0.5 rounded-full text-[10px] font-game">
                        SELECTED
                      </span>
                    ) : isOwned ? (
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-game">
                        OWNED
                      </span>
                    ) : (
                      <span className="font-game text-yellow-300 text-sm">
                        {model.price} 🪙
                      </span>
                    )}
                  </div>

                  <h4 className="text-xl font-game text-white stroke-black-sm">{model.name}</h4>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{model.description}</p>

                  <div className="py-6 flex justify-center">
                    <CarSvg
                      carId={model.id}
                      customization={{
                        color: model.defaultColor,
                        spoilerLevel: 1,
                      }}
                      className="w-44 drop-shadow-md"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  {isOwned ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectActiveCar(model.id);
                      }}
                      disabled={isEquipped}
                      className={`w-full py-2 font-game text-xs rounded-xl ${
                        isEquipped
                          ? 'btn-hcr-green cursor-default'
                          : 'btn-hcr-blue cursor-pointer'
                      }`}
                    >
                      {isEquipped ? 'SELECTED' : 'SELECT VEHICLE'}
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyCar(model.id);
                      }}
                      className="w-full btn-hcr-yellow py-2 font-game text-xs stroke-black-sm cursor-pointer"
                    >
                      UNLOCK ({model.price} 🪙)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Paint Colors & Underglow */}
      {activeTab === 'paint' && (
        <div className="hcr-panel p-6 border-4 border-amber-900 bg-slate-900/90 space-y-6">
          <div>
            <h3 className="text-lg font-game text-yellow-300 stroke-black-sm mb-3">
              VEHICLE BODY PAINT
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {PAINT_COLORS.map((paint) => (
                <button
                  key={paint.hex}
                  onClick={() => {
                    const updated = { ...user };
                    if (!updated.carCustomizations[selectedCarId]) {
                      updated.carCustomizations[selectedCarId] = { ...carCustomization };
                    }
                    updated.carCustomizations[selectedCarId].color = paint.hex;
                    saveActiveUser(updated);
                    onUserUpdate(updated);
                    soundFx.playKeyClick();
                  }}
                  className={`p-3 rounded-xl border-3 flex items-center gap-2.5 transition-all cursor-pointer ${
                    carCustomization.color.toLowerCase() === paint.hex.toLowerCase()
                      ? 'border-yellow-400 bg-yellow-400/20'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border-2 border-black shrink-0 shadow-sm"
                    style={{ backgroundColor: paint.hex }}
                  />
                  <span className="font-game text-xs text-white">{paint.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';
import { useSheetStore } from '@/store/useSheetStore';
import { audio } from '@/lib/audio';

export const DamageCard = () => {
  const { theme, gamebook, attributes, setAttribute, inventory } = useSheetStore();
  const cardClasses = theme === 'papyrus' 
    ? 'bg-[#FDF6E3] border-[#4A3728] text-[#2C1E14]' 
    : 'bg-[#1a202c] border-[#4a5568] text-[#cbd5e0]';

  const isTraveller = gamebook === 'Nave Espacial Traveller';
  const activeId = attributes.activeCombatantId || 'captain';

  // Calculate damage reduction from equipped gear
  const maxReduction = inventory
    .filter(item => item.equipped && item.quantity > 0)
    .reduce((max, item) => {
      let reduction = item.modifiers?.damageReduction || 0;
      if (item.name.toLowerCase().includes('escudo') && reduction === 0) {
        reduction = 1; // Default reduction is 1 for items with "escudo" in their name
      }
      return Math.max(max, reduction);
    }, 0);

  const baseDamage = 2;
  const finalDamage = Math.max(1, baseDamage - maxReduction);
  const hasReduction = finalDamage < baseDamage;

  const activeName = isTraveller
    ? activeId === 'ship'
      ? 'Traveller'
      : attributes.traveller?.crew?.[activeId]?.name || 'Capitão'
    : '';

  const unitLabel = isTraveller && activeId === 'ship' ? 'Escudos' : 'Energia';

  const handleApplyDamage = () => {
    audio.playHurt();
    const store = useSheetStore.getState();
    if (isTraveller) {
      if (activeId === 'ship') {
        const currentShields = store.attributes.traveller?.ship?.shields?.current ?? 0;
        store.updateTravellerShipAttribute('shields', Math.max(0, currentShields - finalDamage), false);
        store.addCombatLog({ type: 'Dano', value: `-${finalDamage} Escudos (Astronave Traveller)` });
      } else {
        const crewMember = store.attributes.traveller?.crew?.[activeId];
        const currentEnergy = crewMember?.energy?.current ?? 0;
        store.updateTravellerCrewAttribute(activeId, 'energy', Math.max(0, currentEnergy - finalDamage), false);
        store.addCombatLog({ type: 'Dano', value: `-${finalDamage} Ener (${crewMember?.name || activeId})` });
      }
    } else {
      setAttribute('energy', Math.max(0, attributes.energy.current - finalDamage), false);
      store.addCombatLog({ type: 'Dano', value: `-${finalDamage} Ener` });
    }
  };

  return (
    <div className={`${cardClasses} border-2 p-4 shadow-[-5px_5px_0px_rgba(0,0,0,0.3)] transition-colors flex flex-col items-center justify-between w-full h-full`}>
      <h3 className={`text-md font-bold uppercase text-center mb-2 border-b pb-1 w-full ${theme === 'papyrus' ? 'border-[#2C1E14]' : 'border-[#cbd5e0]'}`}>Combate</h3>
      <button 
        onClick={handleApplyDamage}
        className={`w-full py-2 px-1 uppercase font-bold text-xs sm:text-sm tracking-wider transition rounded cursor-pointer ${theme === 'papyrus' ? 'bg-[#8B0000] text-[#EAD8B8] hover:bg-[#600000]' : 'bg-[#9b2c2c] text-[#cbd5e0] hover:bg-[#742a2a]'}`}
      >
        Dano (-{finalDamage} {unitLabel}) {hasReduction && '🛡️'}
        {isTraveller && <span className="block text-[10px] opacity-80 lowercase font-mono">({activeName})</span>}
      </button>
    </div>
  );
};

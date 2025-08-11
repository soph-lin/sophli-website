'use client';

import { useEffect, useState } from 'react';
import Lightbulb from './Lightbulb';
import Vault from '../ui/Vault';
import { showToast } from '@/utils/toast';

interface NavbarProps {
  onInitialLoad?: () => void;
}

export default function Navbar({ onInitialLoad }: NavbarProps) {
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'v') {
        setIsVaultOpen(prev => !prev);
        if (!isVaultOpen) {
          showToast.vaultOpened();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isVaultOpen]);

  return (
    <>
      <div className="w-full flex flex-row">
        <div className="inline-block ml-auto">
          <Lightbulb onInitialLoad={onInitialLoad} />
        </div>
      </div>

      <Vault isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />
    </>
  );
}

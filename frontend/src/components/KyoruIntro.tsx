import React, { useEffect, useState } from 'react';

const INTRO_DURATION_MS = 2700;

type KyoruIntroProps = {
  active: boolean;
  sessionKey: string;
  onStorageUnavailable: () => void;
};

const KyoruIntro: React.FC<KyoruIntroProps> = ({ active, sessionKey, onStorageUnavailable }) => {
  const [isVisible, setIsVisible] = useState(active);

  useEffect(() => {
    if (!active) {
      setIsVisible(false);
      return;
    }

    try {
      window.sessionStorage.setItem(sessionKey, 'true');
    } catch {
      setIsVisible(false);
      onStorageUnavailable();
      return;
    }

    setIsVisible(true);
    const timer = window.setTimeout(() => setIsVisible(false), INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [active, onStorageUnavailable, sessionKey]);

  if (!isVisible) return null;

  return (
    <div className="kyoru-intro" aria-hidden="true">
      <div className="kyoru-intro__field" />
      <div className="kyoru-intro__signal" />
      <div className="kyoru-intro__fragments">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="kyoru-intro__wordmark">
        <span className="kyoru-intro__name">KYORU</span>
        <span className="kyoru-intro__studio">STUDIO</span>
      </div>
    </div>
  );
};

export default KyoruIntro;

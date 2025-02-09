import { useState, useEffect } from 'react';

const PumpFunTokensDisplay = ({ connected }) => {
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);
  const [tokens, setTokens] = useState([]);
  const [flash, setFlash] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = (e) => setIsMobile(e.matches);

    mediaQuery.addListener(handleResize);
    return () => mediaQuery.removeListener(handleResize);
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_GET_PUMPFUN_TOKENS);
        const data = await response.json();
        setTokens(data);
        setFlash(true);
        setTimeout(() => setFlash(false), 1000);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
    const interval = setInterval(fetchTokens, 10000);

    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    marginTop: connected
      ? (isMobile ? '20px' : '160px')
      : (isMobile ? '20px' : '415px'),
    textAlign: 'center',
    padding: '2px',
    backgroundColor: '#1c1c1e',
    color: '#ffffff',
    border: '2px solid #9945FF',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    minHeight: isMobile ? '25px' : 'auto',
    marginBottom: '2px',
    animation: flash ? 'flash 1s ease-in-out' : 'none',
    fontSize: '13px'
  };

  const fixedSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingRight: '15px',
    whiteSpace: 'nowrap',
  };

  const linkStyle = {
    color: '#9945FF',
    textDecoration: 'none',
    fontWeight: 'bold',
    margin: '0 15px',
  };

  const iconStyle = {
    cursor: 'pointer',
    marginLeft: '5px',
    color: '#9945FF',
    fontSize: '14px',
  };

  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    width: isMobile ? '90%' : '300px',
    textAlign: 'center',
    border: '2px solid #9945FF',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  };

  return (
    <div style={containerStyle}>
      {}
      <div style={fixedSectionStyle}>
        <img
          src="/pumpfun.png"
          alt="PumpFun"
          width="50"
          height="30"
        />
        <span>PumpFun tokens</span>
        <i
          className="fas fa-info-circle"
          style={iconStyle}
          onClick={() => setShowInfo(true)}
        />
      </div>
      {}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {tokens.slice(0, 5).map((token, index) => (
          <a
            key={index}
            href={`https://www.dextools.io/app/en/solana/pair-explorer/${token.address}`}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            ${token.symbol}
          </a>
        ))}
      </div>
       {showInfo && (
        <>
          <div style={overlayStyle} onClick={() => setShowInfo(false)} />
          <div style={popupStyle}>
            <p>
              You find here in real time PumpFun Tokens who reach the bonding curve and are released on Raydium! 
              A refresh is made every 30 seconds.
              DYOR and good luck finding the next PUMP!
            </p>
            <button onClick={() => setShowInfo(false)} style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#9945FF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Fermer
            </button>
          </div>
        </>
      )}
      <style>
        {`
          @keyframes flash {
            0% {
              background-color: rgba(255, 255, 255, 0.5);
            }
            50% {
              background-color: rgba(255, 255, 255, 1);
            }
            100% {
              background-color: rgba(255, 255, 255, 0.5);
            }
          }
        `}
      </style>
    </div>
  );
};

export default PumpFunTokensDisplay;

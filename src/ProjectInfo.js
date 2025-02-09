import { useState, useEffect } from 'react';

const ProjectInfo = ({ connected }) => {
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = (e) => setIsMobile(e.matches);

    mediaQuery.addListener(handleResize);
    return () => mediaQuery.removeListener(handleResize);
  }, []);

  const containerStyle = {
    marginTop: connected 
      ? (isMobile ? '20px' : '0px')
      : (isMobile ? '10px' : '0px'),
    textAlign: 'center',
    padding: '0px',
    backgroundColor: '#1c1c1e',
    color: '#ffffff',
    border: '2px solid #9945FF',
    borderRadius: '10px',
    backgroundRepeat: 'no-repeat',
    fontSize: '13px'
  };

  const sectionStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    margin: '10px 0',
  };

  const linkStyle = {
    color: '#9945FF',
    textDecoration: 'none',
    fontWeight: 'bold',
  };

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "#9945FF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  };

  const buttonCopiedStyle = {
    ...buttonStyle,
    backgroundColor: "#4CAF50", // Vert pour indiquer le succès
  };

  const copyToClipboard = () => {
    const textToCopy = "B47jrQkyMsG7wEnri3iud4i5MQAaWQkgqTevrCU9Lj6R";
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Réinitialise après 2 secondes
      })
      .catch(() => {
        alert("Failed to copy.");
      });
  };

  return (
    <div style={containerStyle}>
     <div style={sectionStyle}>
      <span>CA</span>
      <a
        href="https://solscan.io/token/B47jrQkyMsG7wEnri3iud4i5MQAaWQkgqTevrCU9Lj6R"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        B47jrQkyMsG7wEnri3iud4i5MQAaWQkgqTevrCU9Lj6R
      </a>
      <button
        style={copied ? buttonCopiedStyle : buttonStyle}
        onClick={copyToClipboard}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>

      <div style={sectionStyle}>
        <span>PROJECT</span>
        <a
          href="https://whitepaper.solwall.live"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          White paper
        </a>
        <a
          href="https://whitepaper.solwall.live/sol-wall-project/user-guide"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          User guide
        </a>
        <a
          href="https://github.com/BlackPearlDev1/SolanaWall"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          Github
        </a>
        <a href="mailto:team@solwall.live" style={linkStyle}>
          Contact
        </a>
      </div>

      <div style={sectionStyle}>
        <span>FARM</span>
        <a
          href="https://app.meteora.ag/farms/SWL-SOL"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          SWL-SOL (1M $SWL rewards/month!)
        </a>
        <a
          href="https://whitepaper.solwall.live/sol-wall-project/stake-farm"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          Farm guide
        </a>
      </div>

      <div style={sectionStyle}>
        <span>SECURITY</span>
        <a
          href="https://rugcheck.xyz/tokens/B47jrQkyMsG7wEnri3iud4i5MQAaWQkgqTevrCU9Lj6R"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          RugCheck
        </a>
        <a
          href="https://app.meteora.ag/pools/7TZZE587SUQrytqXy229FnJQnAHmLvQXVQNQkoXxmAkr"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          LP 100% burned
        </a>
      </div>

      <div style={sectionStyle}>
        <span>SOCIAL LINKS</span>
        <a
          href="https://x.com/solwall_token"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          Twitter
        </a>
        <a
          href="https://t.me/solwall_token"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          Telegram
        </a>
      </div>

      <div style={sectionStyle}>
        <span>BUY ON</span>
        <a
          href="https://jup.ag/swap/SOL-B47jrQkyMsG7wEnri3iud4i5MQAaWQkgqTevrCU9Lj6R"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          Jupiter
        </a>
      </div>

      <div style={sectionStyle}>
        <span>CHARTS</span>
        <a
          href="https://www.dextools.io/app/en/solana/pair-explorer/B47jrQkyMsG7wEnri3iud4i5MQAaWQkgqTevrCU9Lj6R"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          DEXTools
        </a>
        <a
          href="https://dexscreener.com/solana/B47jrQkyMsG7wEnri3iud4i5MQAaWQkgqTevrCU9Lj6R"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          Dexscreener
        </a>
        <a
          href="https://birdeye.so/token/B47jrQkyMsG7wEnri3iud4i5MQAaWQkgqTevrCU9Lj6R"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          Birdeye
        </a>
      </div>
    </div>
  );
};

export default ProjectInfo;

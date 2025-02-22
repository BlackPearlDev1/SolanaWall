import React, { useState, useEffect, useRef } from 'react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import io from 'socket.io-client';
import { sendTransactionWithMemo, getTokenBalance } from './solanaTransactions';
import ProjectInfo from './ProjectInfo';
import PumpFunTokensDisplay from './PumpFunTokensDisplay';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Editor } from '@tinymce/tinymce-react';
import './styles.css';

const socket = io(process.env.REACT_APP_ENV, {
  transports: ['websocket', 'polling']
});

const getTextWithoutUrls = (htmlContent) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlContent;

  const anchorTags = tempElement.getElementsByTagName('a');
  for (let i = anchorTags.length - 1; i >= 0; i--) {
    const anchor = anchorTags[i];
    const textNode = document.createTextNode(anchor.textContent);
    anchor.parentNode.replaceChild(textNode, anchor);
  }

  return tempElement.textContent || tempElement.innerText || '';
};

const App = () => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [messages, setMessages] = useState([]);
  const [editorData, setEditorData] = useState('');
  const [visibleTextLength, setVisibleTextLength] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [platformFees, setPlatformFees] = useState(0);
  const [shortId, setShortId] = useState('');
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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

  const iconStyle = {
    cursor: 'pointer',
    marginLeft: '5px',
    color: '#9945FF',
    fontSize: '14px',
  };

  const checkIfMobile = () => {
    const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(isMobileDevice);
  };

  const walletButtonStyle = {
    width: '100%',
    marginBottom: '10px',
    marginTop: connected ? (isMobile ? '0px' : '0px') : (isMobile ? '20px' : '0px'),
  };

  const handleSendTransaction = async () => {
    if (!connected || !editorData) return;

    setLoading(true);
    setShortId('');

    try {
      const balance = await getTokenBalance(publicKey);
      const sanitizedData = editorData;
      const signature = await sendTransactionWithMemo({ publicKey, sendTransaction }, sanitizedData, balance);
      const solscanLink = `https://solscan.io/tx/${signature}`;

      const newMessage = {
        message: sanitizedData,
        signature: signature,
        solscanLink: solscanLink,
        balance: balance,
      };

      const response = await fetch(process.env.REACT_APP_GET_MESSAGES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      const result = await response.json();

      if (result.shortId) {
        setShortId(`https://solwall.live/${result.shortId}`);
      }

      socket.emit('message', newMessage);
      setEditorData('');
      setLoading(false);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  useEffect(() => {
    const fetchMessagesAndStats = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_GET_MESSAGES);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error retrieving messages and stats:', error);
      }
    };

    fetchMessagesAndStats();

    socket.on('message', (message) => {
      setMessages((prevMessages) => {
        const exists = prevMessages.some(msg => msg.signature === message.signature);
        if (!exists) {
          return [message, ...prevMessages];
        }
        return prevMessages;
      });
    });

    socket.on('allMessages', (allMessages) => {
      setMessages(allMessages);
    });

    socket.on('platformStats', (stats) => {
      setPlatformFees(stats.platformFees);
      setMessageCount(stats.messageCount);
    });

    return () => {
      socket.off('message');
      socket.off('allMessages');
      socket.off('platformStats');
    };
  }, []);

  const handleEditorChange = (content, editor) => {
    const textWithoutUrls = getTextWithoutUrls(content);
    if (textWithoutUrls.length <= 75) {
      setEditorData(content);
      setVisibleTextLength(textWithoutUrls.length);
    }
  };

  useEffect(() => {
    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div className='app-container' style={{ display: 'flex', height: '100vh', backgroundColor: 'black', color: '#14F195' }}>
      <div className='left-column' style={{backgroundImage: "url('/space.jpg')",  backgroundSize: 'cover', backgroundPosition: 'center 50px', backgroundRepeat: 'no-repeat'}}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="/logo.jpg"
              alt="Logo"
              className="app-logo"
              style={{ width: '40%', margin: '20px auto' }}
            />
          <p style={{ color: '#14F195', fontSize: '1.2em', marginTop: '-15px' }}>
            Write your message for eternity on chain 💫
            <i
              className="fas fa-info-circle"
              style={iconStyle}
              onClick={() => setShowInfo(true)}
            />
          </p>
          <WalletModalProvider>
            <WalletMultiButton style={walletButtonStyle} />
          </WalletModalProvider>
        </div>

        <div className='editor-container'>
          {connected && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <Editor
                  init={{
                    height: 150,
                    menubar: false,
                    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount emoticons',
                    toolbar: 'undo redo | bold italic | emoticons | link | removeformat',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    toolbar_mode: 'floating',
                    link_context_toolbar: true,
                    link_title: false,
                    setup: (editor) => {
                      editor.on('PreInit', function () {
                        editor.ui.registry.addButton('link', {
                          icon: 'link',
                          tooltip: 'Insert/edit link',
                          onAction: () => {
                            editor.windowManager.open({
                              title: 'Insert/Edit Link',
                              body: {
                                type: 'panel',
                                items: [
                                  {
                                    type: 'input',
                                    name: 'url',
                                    label: 'URL',
                                    placeholder: 'Enter the URL'
                                  }
                                ]
                              },
                              buttons: [
                                {
                                  text: 'Cancel',
                                  type: 'cancel'
                                },
                                {
                                  text: 'Save',
                                  type: 'submit',
                                  primary: true
                                }
                              ],
                              onSubmit: (api) => {
                                const data = api.getData();
                                editor.insertContent(`<a href="${data.url}" target="_blank" rel="noopener noreferrer">${data.url}</a>`);
                                api.close();
                              }
                            });
                          }
                        });
                      });
                    }
                  }}
                  value={editorData}
                  onEditorChange={handleEditorChange}
                  style={{
                    height: '200px',
                    borderRadius: '5px',
                    backgroundColor: '#333',
                  }}
                />
                <p style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', backgroundColor: 'black'}}>Remaining characters: {75 - visibleTextLength}</p>
              </div>
              <button
                onClick={handleSendTransaction}
                disabled={!connected || visibleTextLength > 75}
                style={{
                  padding: '10px',
                  backgroundColor: '#9945FF',
                  color: 'white',
                  border: 'none',
                  cursor: connected && visibleTextLength <= 75 ? 'pointer' : 'not-allowed',
                  width: '100%',
                  borderRadius: '5px',
                }}
              >
                {loading ? (
                  <div className="loader" style={{ margin: '0 auto', width: '20px', height: '20px', border: '3px solid #f3f3f3', borderTop: '3px solid #9945FF', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                ) : (
                  'Send message'
                )}
              </button>
              {shortId && (
                <p style={{ textAlign: 'center', marginTop: '10px', color: 'white', fontWeight: 'bold', backgroundColor: 'black' }}>
                  Your link: <a href={shortId} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontWeight: 'bold', backgroundColor: 'black' }}>{shortId} <FontAwesomeIcon icon={faExternalLinkAlt} /></a>
                </p>
              )}
            </>
          )}
        </div>
        
        {!isMobile && <PumpFunTokensDisplay connected={connected} />}
        {!isMobile && <ProjectInfo connected={connected} />}

      </div>

      <div className='right-column'>
        <h2 style={{ textAlign: 'center', fontSize: '0.8em', marginBottom: '2px' }}>
          💬 Total number of messages: {messageCount}&nbsp;
          💵 Platform has generated: {platformFees.toFixed(5)} SOL in fees
        </h2>
        <div style={{
          flex: 1,
          borderRadius: '5px',
          padding: '10px',
          paddingTop: '1px',
          backgroundColor: '#222',
          color: '#14F195',
          overflowY: 'auto',
        }}>
          {messages.map((msg, index) => (
            <div key={index} className="message-content" style={{ marginBottom: '5px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', fontSize: '0.9em' }}>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.message, { ALLOWED_TAGS: ['a', 'b', 'i', 'strong', 'em'], ALLOWED_ATTR: ['href', 'target', 'rel'] }) }} style={{ flex: 1 }} />
              <a href={msg.solscanLink} target="_blank" rel="noopener noreferrer" style={{ color: '#9945FF', marginLeft: '10px', fontSize: '0.8em' }}>
                <FontAwesomeIcon icon={faExternalLinkAlt} /> See on Solscan
              </a>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {isMobile && <PumpFunTokensDisplay connected={connected} />}
      {isMobile && <ProjectInfo connected={connected} />}

      {showInfo && (
        <>
          <div style={overlayStyle} onClick={() => setShowInfo(false)} />
          <div style={popupStyle}>
            <p>
              $SWL IS OPEN TO ALL SOLANA COMMUNITY $SWL or $SOL holder 💜<br/>
              Cost of a message:<br/>
              - $SWL holder: One $SWL burned.<br/>
              - $SOL holder: 0,000045 SOL fee (+- 1 CENT DOLLAR).
            </p>
            <button onClick={() => setShowInfo(false)} style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#9945FF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Fermer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'love_thegame_';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  'https://i.pinimg.com/originals/45/2c/58/452c58e20c10bfba89c7ea1346efafae.gif',
  'https://c.tenor.com/qqTxbzmwQwYAAAAC/exagerado-futbol.gif',
  'https://pa1.narvii.com/6171/1df2804b7924a2db19d4b9b14172177dc52621b9_hq.gif',
  'https://c.tenor.com/aUvtCuFuHjUAAAAd/eden-hazard-soccer.gif',
  'https://media0.giphy.com/media/LjsI6VUVlpmnK/giphy.gif',
  'https://i.pinimg.com/originals/16/59/b4/1659b45314d89677924d3ecf1097ce69.gif',
  'https://c.tenor.com/GGt5qgAnCkMAAAAC/cristiano-ronaldo.gif',
  'https://cdn.bleacherreport.net/temp_images/2014/01/16/Messi2.gif',
  'https://media4.giphy.com/media/3oEjI0yKL89NaKGgvK/giphy.gif',
  'https://c.tenor.com/idNy68AnC5UAAAAC/ronaldo-ronaldo-united.gif',
  'https://c.tenor.com/GE_kUeQVS8AAAAAC/fabregas-iniesta.gif',
  'https://i.gifer.com/NVPz.gif',
  'https://i.makeagif.com/media/11-27-2015/_5CiXX.gif'
]

const App = () => {

  // State 
  const [walletAddress, setWalletAddress] = useState(null);

  const [inputValue, setInputValue] = useState('');

  const [gifList, setGifList] = useState([]);

  // Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          // Invoke 'connect' method on solana object to connect to users wallet
          const response = solana.connect({ onlyIfTrusted: true })
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
        }

        // Set users publicKey in state
        setWalletAddress(response.publicKey.toString());

      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key: ', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again')
    }
  }

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value)
  };

  // Render 'Connect to Wallet' button if user isn't connected
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  // Contaner that maps throught all gif links and renders them
  const renderConnectedContainer = () => (
    <div className="connected-container">
    {/* Form for gif upload */}
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendGif();
      }}
    >
      <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange} />
      <button type="submit" className="cta-button submit-gif-button">Submit</button>
    </form>
    <div className="gif-grid">
      {gifList.map(gif => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
    </div>
  );

  // On mount, invoke checkIfWalletIsConnected
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');

      // Call Solana program

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">⚽️ Fútbol Gifs</p>
          <p className="sub-text">
            View and post your favorite fútbol gifs ✨
          </p>
          {/* Render connect to wallet button if walletAddress is falsy */}
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
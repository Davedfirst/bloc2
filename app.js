// Smooth scrolling for navigation buttons
document.querySelectorAll('.sidebar nav button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-target');
      const target = document.querySelector(targetSelector);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Sidebar toggle functionality
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  document.getElementById('toggleSidebar').addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('collapsed-content');
  });
  
  // Ethers.js: Setup for wallet connection and contract interactions
  let provider, signer;
  
  // Replace these with your deployed contract addresses
  const bloc2TokenAddress = "0xYourBloc2TokenContractAddress"; // Update with your contract address
  const bloc2StakingAddress = "0xYourBloc2StakingContractAddress"; // Update with your contract address
  
  // Replace with your contract ABIs (update as needed)
  const bloc2TokenABI = [
    // Example ABI entries
    "function balanceOf(address owner) view returns (uint256)",
    "function stakeTokens(uint256 _amount) external",
    "function transfer(address to, uint256 amount) external"
  ];
  const bloc2StakingABI = [
    "function claimRewards() external",
    "function fundRewardPool(uint256 amount) external"
    // Add additional functions as needed.
  ];
  
  // Connect wallet
  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        document.getElementById('connectWallet').textContent = "Wallet Connected";
        // Optionally load token balance after connecting
        getTokenBalance();
      } catch (err) {
        console.error("Wallet connection error:", err);
      }
    } else {
      alert("Please install MetaMask or another Ethereum wallet.");
    }
  }
  
  document.getElementById('connectWallet').addEventListener('click', connectWallet);
  
  // Get token balance from Bloc2Token
  async function getTokenBalance() {
    if (!signer) return;
    const bloc2Token = new ethers.Contract(bloc2TokenAddress, bloc2TokenABI, provider);
    const address = await signer.getAddress();
    try {
      const balance = await bloc2Token.balanceOf(address);
      document.getElementById('tokenBalance').textContent =
        "Your Bloc2Token Balance: " + ethers.utils.formatEther(balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  }
  
  document.getElementById('refreshBalance').addEventListener('click', getTokenBalance);
  
  // Stake tokens (calls stakeTokens in Bloc2Token contract)
  document.getElementById('stakeTokens').addEventListener('click', async () => {
    const amountInput = document.getElementById('stakeAmount').value;
    if (!amountInput || isNaN(amountInput)) return alert("Enter a valid number");
    const amount = ethers.utils.parseEther(amountInput);
    const bloc2Token = new ethers.Contract(bloc2TokenAddress, bloc2TokenABI, signer);
    try {
      const tx = await bloc2Token.stakeTokens(amount);
      await tx.wait();
      alert("Tokens staked successfully!");
    } catch (err) {
      console.error("Staking error:", err);
    }
  });
  
  // Claim rewards (calls claimRewards in Bloc2Staking contract)
  document.getElementById('claimRewards').addEventListener('click', async () => {
    const bloc2Staking = new ethers.Contract(bloc2StakingAddress, bloc2StakingABI, signer);
    try {
      const tx = await bloc2Staking.claimRewards();
      await tx.wait();
      alert("Rewards claimed successfully!");
    } catch (err) {
      console.error("Claiming rewards error:", err);
    }
  });
  
  // New: Button functionality for Intro section CTAs
  document.getElementById('contributeNow').addEventListener('click', () => {
    // Scroll to the Staking section
    const stakingSection = document.querySelector('#staking');
    if (stakingSection) {
      stakingSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  document.getElementById('learnMore').addEventListener('click', () => {
    // Scroll to the About section
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
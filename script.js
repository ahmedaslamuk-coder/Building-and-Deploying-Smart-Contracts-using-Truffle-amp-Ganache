
const DEFAULT_ADDRESS = "";
const abi = [
  "function castVote(uint8 option)",
  "function getResults() view returns (uint256[2])",
  "function hasVoted(address voter) view returns (bool)"
];
const el = id => document.getElementById(id);
el("address").value = DEFAULT_ADDRESS;
let ballot, account, alreadyVoted = false, busy = false;
function controls() {
  el("connect").disabled = busy || Boolean(ballot);
  el("address").disabled = busy || Boolean(ballot);
  el("vote").disabled = busy || !ballot || alreadyVoted;
  el("refresh").disabled = busy || !ballot;
}
async function run(action) {
  if (busy) return;
  busy = true;
  controls();
  try { await action(); }
  catch (err) {
    el("status").textContent = err.code === 4001 || err.code === "ACTION_REJECTED"
      ? "Wallet request cancelled." : (err.reason || err.shortMessage || err.message);
  } finally { busy = false; controls(); }
}
async function readBallot(contract, voter) {
  const [counts, used] = await Promise.all([contract.getResults(), contract.hasVoted(voter)]);
  alreadyVoted = used;
  const total = counts[0] + counts[1];
  counts.forEach((count, i) => {
    const percent = total ? Number(count * 1000n / total) / 10 : 0;
    el("n" + i).textContent = count + " votes · " + percent + "%";
    el("bar" + i).value = percent;
  });
  el("total").textContent = "Total votes: " + total;
}
function ballotStatus() {
  return alreadyVoted ? "This wallet has voted." : "Choose a poster, then cast your vote.";
}
async function connect() {
  if (!window.ethereum) throw Error("Open this page in a browser with MetaMask installed.");
  if (!window.ethers) throw Error("ethers.js could not load. Check your internet connection and reload.");
  const address = el("address").value.trim();
  if (!ethers.isAddress(address)) throw Error("Paste the contract address copied from Truffle.");
  el("status").textContent = "Approve the account connection in MetaMask.";
  await ethereum.request({method:"eth_requestAccounts"});
  if (BigInt(await ethereum.request({method:"eth_chainId"})) !== 1337n) {
    el("status").textContent = "Approve the switch to Ganache Local in MetaMask.";
    await ethereum.request({method:"wallet_switchEthereumChain", params:[{chainId:"0x539"}]});
  }
  const provider = new ethers.BrowserProvider(ethereum);
  if (await provider.getCode(address) === "0x") throw Error("No contract found at this address on Ganache Local.");
  const signer = await provider.getSigner();
  const voter = await signer.getAddress();
  const candidate = new ethers.Contract(address, abi, signer);
  await readBallot(candidate, voter);
  ballot = candidate;
  account = voter;
  el("wallet").textContent = "Ganache Local · " + account;
  el("status").textContent = ballotStatus();
}
async function cast() {
  const option = Number(document.querySelector('input[name="poster"]:checked').value);
  el("status").textContent = "Approve your vote in MetaMask.";
  const tx = await ballot.castVote(option);
  el("receipt").textContent = tx.hash;
  el("status").textContent = "Vote sent. Waiting for a block confirmation…";
  const receipt = await tx.wait();
  if (receipt.status !== 1) throw Error("Vote failed. Check the transaction receipt.");
  alreadyVoted = true;
  el("receipt").prepend("Confirmed in block " + receipt.blockNumber + " · ");
  await readBallot(ballot, account);
  el("status").textContent = "Vote confirmed for " + ["Night Market","Fresh Type"][option] + ".";
}
el("connect").onclick = () => run(connect);
el("vote").onclick = () => run(cast);
el("refresh").onclick = () => run(async () => {
  await readBallot(ballot, account);
  el("status").textContent = ballotStatus();
});
if (window.ethereum?.on) {
  ethereum.on("chainChanged", () => { if (ballot) location.reload(); });
  ethereum.on("accountsChanged", () => { if (ballot) location.reload(); });
}

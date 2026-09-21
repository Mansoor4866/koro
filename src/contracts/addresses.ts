export const ROBINHOOD_CONTRACTS = {
  // Robinhood Chain Mainnet Verified Contracts
  mainnet: {
    rpostsToken: "0x9AB63f447Ff7e6F68e65016CBcf794326cfB75AF" as `0x${string}`,
    usdgToken: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168" as `0x${string}`,
    postNFT: "0x5C8bB58f41E66Af86cFAF46406d00fff0dCe1927" as `0x${string}`,
    fixtureNFT: "0xcd3a5a9217B3aED56ec875cDb0D3298aB2442a9e" as `0x${string}`,
    harbergerPost: "0xe533Dca2Cf7991EaBFc5754F5a0e4889c016F5B3" as `0x${string}`,
    harbergerFixture: "0x076E393E86509d9aFA6c695e8ABE512329dC08d1" as `0x${string}`,
    leaseBook: "0x063Bb5840B13A80e8C9Da1bA01baAFc87C8E56c2" as `0x${string}`,
    callAuction: "0x5FA33A8126820Ade22EC3a356582e755E8c90A4D" as `0x${string}`,
    holdQueue: "0xA62ce562bE845CEfBd3618E977Ce0F1637568c77" as `0x${string}`,
    floorPool: "0x15c46Ab11e395900b034F20533701C3998c4d034" as `0x${string}`,
    treasury: "0x40791fF1784B43d8BB75eA41bdA6006a4736778C" as `0x${string}`,
    staking: "0x4E95D1231AAA434C2328026d2be64f40839FFb47" as `0x${string}`,
    ledger: "0x7a7DE55FBAfA3FDC272A8Abb4A32F5BdC69e5043" as `0x${string}`,
    primaryPost: "0xF4fe7ced06d9cA2280346F60F73c92Eb9D614569" as `0x${string}`,
    primaryFixture: "0x1B9D529A9bE43972e80B4466153eb2F5f2834c11" as `0x${string}`,
    multicall3: "0xcA11bde05977b3631167028862be2a173976CA11" as `0x${string}`,
  },
  testnet: {
    rpostsToken: "0x9AB63f447Ff7e6F68e65016CBcf794326cfB75AF" as `0x${string}`,
    postNFT: "0x5C8bB58f41E66Af86cFAF46406d00fff0dCe1927" as `0x${string}`,
    harbergerPost: "0xe533Dca2Cf7991EaBFc5754F5a0e4889c016F5B3" as `0x${string}`,
    multicall3: "0xcA11bde05977b3631167028862be2a173976CA11" as `0x${string}`,
  },
};

export function getContractsForChain(chainId: number = 4663) {
  if (chainId === 46630) {
    return ROBINHOOD_CONTRACTS.testnet;
  }
  return ROBINHOOD_CONTRACTS.mainnet;
}

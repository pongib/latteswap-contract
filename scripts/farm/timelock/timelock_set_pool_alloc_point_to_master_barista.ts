import { FileService, TimelockService, ITimelockResponse, getConfig, withNetworkFile } from "../../../utils";

interface IStakingPool {
  STAKING_TOKEN_ADDRESS: string;
  ALLOC_POINT: string;
  EXACT_ETA: string;
}

type IStakingPools = Array<IStakingPool>;

async function main() {
  /*
  ░██╗░░░░░░░██╗░█████╗░██████╗░███╗░░██╗██╗███╗░░██╗░██████╗░
  ░██║░░██╗░░██║██╔══██╗██╔══██╗████╗░██║██║████╗░██║██╔════╝░
  ░╚██╗████╗██╔╝███████║██████╔╝██╔██╗██║██║██╔██╗██║██║░░██╗░
  ░░████╔═████║░██╔══██║██╔══██╗██║╚████║██║██║╚████║██║░░╚██╗
  ░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║██║░╚███║██║██║░╚███║╚██████╔╝
  ░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝╚═╝░░╚══╝░╚═════╝░
  Check all variables below before execute the deployment script
  */
  const config = getConfig();
  const STAKING_POOLS: IStakingPools = [
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.BUSD,
      ALLOC_POINT: "0",
      EXACT_ETA: "1632279600",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.WBNB,
      ALLOC_POINT: "0",
      EXACT_ETA: "1632279600",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.ETH,
      ALLOC_POINT: "0",
      EXACT_ETA: "1632279600",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.BTCB,
      ALLOC_POINT: "0",
      EXACT_ETA: "1632279600",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.CAKE,
      ALLOC_POINT: "0",
      EXACT_ETA: "1632279600",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.XVS,
      ALLOC_POINT: "0",
      EXACT_ETA: "1632279600",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.EPS,
      ALLOC_POINT: "0",
      EXACT_ETA: "1632279600",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.BELT,
      ALLOC_POINT: "0",
      EXACT_ETA: "1632279600",
    },
  ];

  const timelockTransactions: Array<ITimelockResponse> = [];

  for (const STAKING_POOL of STAKING_POOLS) {
    console.log(">> Queue Transaction to set a staking token pool alloc point through Timelock");
    timelockTransactions.push(
      await TimelockService.queueTransaction(
        `setting staking token pool alloc point ${STAKING_POOL.STAKING_TOKEN_ADDRESS}`,
        config.MasterBarista,
        "0",
        "setPool(address,uint256)",
        ["address", "uint256"],
        [STAKING_POOL.STAKING_TOKEN_ADDRESS, STAKING_POOL.ALLOC_POINT],
        STAKING_POOL.EXACT_ETA
      )
    );
    console.log("✅ Done");
  }

  await FileService.write("set-staking-token-pool-alloc-point", timelockTransactions);
}

withNetworkFile(main)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

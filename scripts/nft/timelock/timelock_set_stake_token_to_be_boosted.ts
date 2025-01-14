import { getConfig, withNetworkFile, FileService, TimelockService, ITimelockResponse } from "../../../utils";

interface IStakingPool {
  STAKING_TOKEN_ADDRESS: string;
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
  const timelockTransactions: Array<ITimelockResponse> = [];
  const STAKING_POOLS: IStakingPools = [
    {
      STAKING_TOKEN_ADDRESS: "0xf1bE8ecC990cBcb90e166b71E368299f0116d421", //ibALPACA
    },
  ];
  const TIMELOCK_ETA = "1631863400";

  for (const STAKING_POOL of STAKING_POOLS) {
    console.log(`>> Queue BoosterConfig Transaction to setStakeTokenAllowance ${STAKING_POOL.STAKING_TOKEN_ADDRESS}`);
    timelockTransactions.push(
      await TimelockService.queueTransaction(
        `setStakeTokenAllowance in BoosterConfig to ${STAKING_POOL.STAKING_TOKEN_ADDRESS}`,
        config.BoosterConfig,
        "0",
        "setStakeTokenAllowance(address,bool)",
        ["address", "bool"],
        [STAKING_POOL.STAKING_TOKEN_ADDRESS, true],
        TIMELOCK_ETA
      )
    );
    console.log("✅ Done");

    console.log(
      `>> Queue Master Transaction to setStakeTokenCallerAllowancePool ${STAKING_POOL.STAKING_TOKEN_ADDRESS}`
    );
    timelockTransactions.push(
      await TimelockService.queueTransaction(
        `setStakeTokenCallerAllowancePool in MasterBarista to ${STAKING_POOL.STAKING_TOKEN_ADDRESS}`,
        config.MasterBarista,
        "0",
        "setStakeTokenCallerAllowancePool(address,bool)",
        ["address", "bool"],
        [STAKING_POOL.STAKING_TOKEN_ADDRESS, true],
        TIMELOCK_ETA
      )
    );
    console.log("✅ Done");

    console.log(
      `>> Queue Master Transaction to addStakeTokenCallerContract of ${STAKING_POOL.STAKING_TOKEN_ADDRESS} having this caller ${config.Booster}`
    );
    timelockTransactions.push(
      await TimelockService.queueTransaction(
        `addStakeTokenCallerContract in MasterBarista of ${STAKING_POOL.STAKING_TOKEN_ADDRESS} having this caller ${config.Booster}`,
        config.MasterBarista,
        "0",
        "addStakeTokenCallerContract(address,address)",
        ["address", "address"],
        [STAKING_POOL.STAKING_TOKEN_ADDRESS, config.Booster],
        TIMELOCK_ETA
      )
    );
    console.log("✅ Done");
  }

  await FileService.write("set-staking-token-to-be-boosted", timelockTransactions);
}

withNetworkFile(main)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import { ethers, network } from "hardhat";
import { MasterBarista, MasterBarista__factory } from "../../typechain";
import { withNetworkFile, getConfig } from "../../utils";

interface IStakingPool {
  STAKING_TOKEN_ADDRESS: string;
  ALLOC_POINT: string;
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
      ALLOC_POINT: "1250",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.WBNB,
      ALLOC_POINT: "1250",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.ETH,
      ALLOC_POINT: "1250",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.BTCB,
      ALLOC_POINT: "1250",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.CAKE,
      ALLOC_POINT: "250",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.XVS,
      ALLOC_POINT: "250",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.EPS,
      ALLOC_POINT: "250",
    },
    {
      STAKING_TOKEN_ADDRESS: config.Tokens.BELT,
      ALLOC_POINT: "250",
    },
    {
      STAKING_TOKEN_ADDRESS: "0xA4fdBf0c00fFA3F4e26B4E5ef5A23CB3cc8df4Fe", // BTCB-BUSD
      ALLOC_POINT: "1500",
    },
    {
      STAKING_TOKEN_ADDRESS: "0x849D4B13Aa9D9a6B90870524CefCD812F4e0040B", // WBNB-BUSD
      ALLOC_POINT: "2000",
    },
    {
      STAKING_TOKEN_ADDRESS: "0xd87670d3C46FBBb3629061D46C194Aa69Ca5d027", // ETH-BUSD
      ALLOC_POINT: "1500",
    },
    {
      STAKING_TOKEN_ADDRESS: "0x0080206AcE8997DfE2d84cEaDE2fDD00Ea8d3941", // ETH-WBNB
      ALLOC_POINT: "750",
    },
    {
      STAKING_TOKEN_ADDRESS: "0x4C5b1AE43D2E35090014C9ecFA892a30380034cb", // BTCB-WBNB
      ALLOC_POINT: "750",
    },
    {
      STAKING_TOKEN_ADDRESS: "0x818bfb8F8884da5b57C366D79B898e1d4d45580F", // ETH-BTCB
      ALLOC_POINT: "750",
    },
    {
      STAKING_TOKEN_ADDRESS: "0x8779B9468Be481844391912d5838B88D6F60fF45", // USDT-BUSD
      ALLOC_POINT: "1000",
    },
    {
      STAKING_TOKEN_ADDRESS: "0x187688C117132Bb57ED5C1a51e1860eb76c6f17d", // USDC-BUSD
      ALLOC_POINT: "500",
    },
    {
      STAKING_TOKEN_ADDRESS: "0x384d797a969745Fc6E6961f86Dc8490D46BDC011", // ALPACA-BUSD
      ALLOC_POINT: "500",
    },
  ];

  for (const STAKING_POOL of STAKING_POOLS) {
    const masterBarista = MasterBarista__factory.connect(
      config.MasterBarista,
      (await ethers.getSigners())[0]
    ) as MasterBarista;

    console.log(`>> Execute Transaction to add a staking token pool ${STAKING_POOL.STAKING_TOKEN_ADDRESS}`);
    const estimatedGas = await masterBarista.estimateGas.addPool(
      STAKING_POOL.STAKING_TOKEN_ADDRESS,
      STAKING_POOL.ALLOC_POINT
    );
    const tx = await masterBarista.addPool(STAKING_POOL.STAKING_TOKEN_ADDRESS, STAKING_POOL.ALLOC_POINT, {
      gasLimit: estimatedGas.add(100000),
    });
    await tx.wait();
    console.log(`>> returned tx hash: ${tx.hash}`);
    console.log("✅ Done");
  }
}

withNetworkFile(main)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

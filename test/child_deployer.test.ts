import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Child__factory, Factory__factory } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("Child Factory", () => {
  let childFactoryAddress: string;

  describe("Deploy Children", async () => {
    // Deploy ERC20 factory
    it("should create a new child", async () => {
      const [deployer] = await ethers.getSigners();
      const childMasterContractFactory = new Child__factory(deployer);
      let childMasterContract = await childMasterContractFactory.deploy();
      let childMasterContractAddress = childMasterContract.address;

      let deployed = await childMasterContract.deployed();

      // deploy factory
      let childFactoryFactory = new Factory__factory(deployer);
      let childFactoryContract = await childFactoryFactory.deploy(childMasterContractAddress);

      let childFactoryAddress = childFactoryContract.address;

      await childFactoryContract.createChild(1);
      await childFactoryContract.createChild(2);
      await childFactoryContract.createChild(3);

      let children = await childFactoryContract.getChildren();

      const child1 = Child__factory.connect(children[0], ethers.provider);
      const child2 = Child__factory.connect(children[1], ethers.provider);
      const child3 = Child__factory.connect(children[2], ethers.provider);

      const child1Data = await child1.data();
      const child2Data = await child2.data();
      const child3Data = await child3.data();

      console.log(child1Data);
      console.log(child2Data);
      console.log(child3Data);
    });
  });
});

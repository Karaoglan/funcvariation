const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");

const { expect } = require("chai");

describe("FuncVariation", function () {
  async function deployFuncVariationFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const FuncVariation = await ethers.getContractFactory("FuncVariation");
    const funcVariation = await FuncVariation.deploy();

    return { funcVariation, owner, otherAccount };
  }

  describe("Deployment", function () {
    it.skip("Should set the right default count", async function () {
      const { funcVariation } = await deployFuncVariationFixture();
      expect(await funcVariation.get()).to.equal(0);
    });
  });

  describe("Increment", function () {
    it.skip("Should increment the count", async function () {
      const { funcVariation } = await deployFuncVariationFixture();
      const beforeInc = await funcVariation.get();
      await funcVariation.inc();
      expect(await funcVariation.get()).to.equal(beforeInc + 1);
    });

    it.skip("Should add the val to count", async function () {
      const { funcVariation } = await deployFuncVariationFixture();
      const beforeInc = await funcVariation.get();
      const incVal = 10;
      await funcVariation.incWith(incVal);
      expect(await funcVariation.get()).to.equal(beforeInc + incVal);
    });

    it.skip("Should add the val to count with paying functionality", async function () {
      const { funcVariation } = await deployFuncVariationFixture();
      const beforeInc = await funcVariation.get();
      const incVal = 10;
      const valToPay = "100";
      await funcVariation.paymeToIncrement(incVal, { value: valToPay });
      expect(await funcVariation.get()).to.equal(beforeInc + incVal);
      expect(await ethers.provider.getBalance(funcVariation.address)).to.equal(
        valToPay
      );
    });

    it("Should add the val to count with paying functionality with no pay", async function () {
      const { funcVariation } = await deployFuncVariationFixture();
      const beforeInc = await funcVariation.get();
      const incVal = 10;
      await funcVariation.paymeToIncrement(incVal);
      expect(await funcVariation.get()).to.equal(beforeInc + incVal);
      expect(await ethers.provider.getBalance(funcVariation.address)).to.equal(
        0
      );
    });

    it("Should add the val to count with pay exact to functionality with not enough pay", async function () {
      const { funcVariation } = await deployFuncVariationFixture();
      const incVal = 10;
      const valToPay = "1000000000000000";
      await expect(
        funcVariation.payExactToIncrement(incVal, { value: valToPay })
      ).to.be.revertedWith("must pay 0.01 Eth");
    });

    it("Should add the val to count with pay exact to functionality with no pay at all", async function () {
      const { funcVariation } = await deployFuncVariationFixture();
      const incVal = 10;
      await expect(
        funcVariation.payExactToIncrement(incVal)
      ).to.be.revertedWith("must pay 0.01 Eth");
    });

    it("Should add the val to count with pay exact to functionality with pay", async function () {
      const { funcVariation } = await deployFuncVariationFixture();
      const beforeInc = await funcVariation.get();
      const incVal = 10;
      const valToPay = "10000000000000000";
      await funcVariation.payExactToIncrement(incVal, { value: valToPay });
      expect(await funcVariation.get()).to.equal(beforeInc + incVal);
      expect(await ethers.provider.getBalance(funcVariation.address)).to.equal(
        valToPay
      );
    });
  });

  describe("Decrement", function () {
    it.skip("Should decrement the count", async function () {
      const { funcVariation } = await deployFuncVariationFixture();
      await funcVariation.inc();
      const beforeDecrement = await funcVariation.get();
      await funcVariation.dec();
      expect(await funcVariation.get()).to.equal(beforeDecrement - 1);
    });

    it.skip("Should not decrement the count due to underflow, revert it!", async function () {
      const { funcVariation } = await deployFuncVariationFixture();
      await expect(funcVariation.dec()).to.be.revertedWithPanic(
        PANIC_CODES.ARITHMETIC_UNDER_OR_OVERFLOW
      );
    });
  });
});

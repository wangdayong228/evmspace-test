const { Conflux, Contract, format } = require('js-conflux-sdk');
const fs = require("fs");
const util = require("util");
const { expect } = require("chai");
const { expectPromiseRevert } = require("./util")

describe("Test CFX cross call EVM space", function () {

    let cfx, ct, account, results = []

    this.beforeAll(async function () {
        cfx = new Conflux({
            url: 'http://net8888cfx.confluxrpc.com',
            networkId: 8888,
            // logger: {
            //     info: v => console.log(util.inspect(v, false, 10, true)),
            //     error: v => console.error(util.inspect(v, false, 10, true)),
            // }, // for debug
        });
        account = cfx.wallet.addPrivateKey("0x0b56f3db5a57e57aa8ac44f0c4aecafe2db1643f302a6d634cf486ee774725bb");
        const { abi, bytecode } = require('../artifacts/contracts/crossCallEvm.sol/TestCrossCallEvm.json');
        ct = cfx.Contract({ abi, bytecode });
        const receipt = await ct.constructor("0x4710A853B5e8d803294a3913437F69E4364A5dF0")
            .sendTransaction({ from: account })
            .executed();
        ct.address = receipt.contractCreated;

        console.log('ct', ct.address);
        console.log('deployed TestCrossCallEvm', receipt.contractCreated);
        results.push({ method: "deploy", hash: receipt.transactionHash })
    })

    this.afterAll(async function () {
        const network = await ethers.provider.detectNetwork();
        const receiptsP = results.map(async function (v) {
            return {
                method: v.method,
                receipt: v.hash ? await cfx.getTransactionReceipt(v.hash) : ""
            }
        })
        const receipts = await Promise.all(receiptsP)
        // console.log("Test Cfx cross Evm result\n", JSON.stringify(receipts, null, 2));
        fs.writeFileSync(`./test/result/cfx_call_evm_test_${network.chainId}.json`, JSON.stringify(receipts, null, 2));

        // console.log("Test cross space result\n", JSON.stringify(results, null, 2));
    })

    it("should ok when StaticCall", async function () {
        await ct.StaticCall()
    })

    it("should ok when Call", async function () {
        let tx = await ct.Call().sendTransaction({ from: account }).executed()
        results.push({ method: "Call", hash: tx.transactionHash })
    })

    it("should ok when DelegateCall", async function () {
        let tx = await ct.DelegateCall().sendTransaction({ from: account }).executed()
        results.push({ method: "DelegateCall", hash: tx.transactionHash })
    })

    it("should ok when Create", async function () {
        let tx = await ct.Create().sendTransaction({ from: account }).executed()
        results.push({ method: "Create", hash: tx.transactionHash })
    })

    it("should ok when CreateAndKill", async function () {
        let tx = await ct.CreateAndKill().sendTransaction({ from: account }).executed()
        results.push({ method: "CreateAndKill", hash: tx.transactionHash })
    })

    it("should fail when StaticCallAndRevert", async function () {
        await expectPromiseRevert(ct.StaticCallAndRevert().sendTransaction({ from: account }).executed())
        await expectPromiseRevert(ct.StaticCallAndRevert().sendTransaction({ from: account, gas: 1000000, storaggeLimit: 1024 }).executed())
    })

    it("should fail when CallAndRevert", async function () {
        await expectPromiseRevert(ct.CallAndRevert().sendTransaction({ from: account }).executed())
    })

    it("should fail when CreateAndRevert", async function () {
        await expectPromiseRevert(ct.CreateAndRevert().sendTransaction({ from: account }).executed())
    })

    it("should ok when StaticCallAndCatch", async function () {
        await ct.StaticCallAndCatch()
    })

    it("should ok when CallAndCatch", async function () {
        let tx = await ct.CallAndCatch().sendTransaction({ from: account }).executed()
        results.push({ method: "CallAndCatch", hash: tx.transactionHash })
    })

    it("should ok when Integration1", async function () {
        let tx = await ct.Integration1().sendTransaction({ from: account }).executed()
        results.push({ method: "Integration1", hash: tx.transactionHash })
    })

    it("should ok when Integration2", async function () {
        let tx = await ct.Integration2().sendTransaction({ from: account }).executed()
        results.push({ method: "Integration2", hash: tx.transactionHash })
    })
})
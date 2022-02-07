// global.Promise=require("bluebird")
const { expect } = require("chai");
const fs = require("fs");
const { ethers } = require("hardhat");
const { expectPromiseRevert } = require("./util")
// ethers.provider.on('debug', i => console.log(i.request, i.response))

xdescribe("Test EVMSpace Contract", function () {
    let t;
    let results = [];

    // this.beforeAll(async function () {
    //     const Greeter = await ethers.getContractFactory("TestEVMSpace");
    //     t = await Greeter.deploy();
    //     results.push({ method: "deploy", hash: t.deployTransaction.hash })
    // })

    this.beforeEach(
        async function () {
            const Greeter = await ethers.getContractFactory("TestEVMSpace");
            t = await Greeter.deploy();
            results.push({ method: "deploy", hash: t.deployTransaction.hash })
        }
    )

    this.afterAll(async function () {
        const network = await ethers.provider.detectNetwork();
        const receiptsP = results.map(async function (v) {
            return {
                method: v.method,
                receipt: await ethers.provider.getTransactionReceipt(v.hash)
            }
        })
        const receipts = await Promise.all(receiptsP)
        // console.log("Test EVMSpace result\n", JSON.stringify(receipts, null, 2));
        fs.writeFileSync(`./test/result/evmspace_test_${network.chainId}.json`, JSON.stringify(receipts, null, 2));
    })

    it("should break if balance not enough", async function () {
        let wallet = ethers.Wallet.createRandom()
        wallet = wallet.connect(ethers.provider)
        let tx = await wallet.populateTransaction({ from: wallet.address, to: wallet.address, value: ethers.utils.parseEther("0.1") })
        let rawTx = await wallet.signTransaction(tx)

        // await expect(ethers.provider.send('eth_sendRawTransaction', [rawTx])).to.be.reverted

        await expectPromiseRevert(ethers.provider.send('eth_sendRawTransaction', [rawTx]))

        // tx = await ethers.provider.send('eth_sendRawTransaction', [rawTx])
        // console.log('tx',tx)
        // tx = await ethers.provider.getTransaction(tx)
        // console.log('tx',tx)
        // await tx.wait() 
    })

    it("should ok when Call", async function () {
        let tx = await t.Call()
        await tx.wait()
        results.push({ method: "Call", hash: tx.hash })
    });

    it("should ok when staticcall", async function () {
        await t.StaticCall()
    });

    it("should ok when DelegateCall", async function () {
        let tx = await t.DelegateCall()
        await tx.wait()
        results.push({ method: "DelegateCall", hash: tx.hash })
    });

    it("should ok when Create", async function () {
        let tx = await t.Create()
        await tx.wait()
        results.push({ method: "Create", hash: tx.hash })
    });

    it("should ok when CreateAndKill", async function () {
        let tx = await t.CreateAndKill()
        await tx.wait()
        results.push({ method: "CreateAndKill", hash: tx.hash })
    });

    it("should fail when StaticCallAndRevert", async function () {
        await expect(t.StaticCallAndRevert()).to.be.reverted
    });

    it("should fail when CallAndRevert", async function () {
        expectPromiseRevert((async () => {
            await expect(t.CallAndRevert()).to.be.reverted
            let tx = await t.CallAndRevert({ gasLimit: 1000000 })
            await tx.wait()
            results.push({ method: "CallAndRevert", hash: tx.hash })
        })())
    });

    it("should fail when CreateAndRevert", async function () {
        expectPromiseRevert((async () => {
            await expect(t.CreateAndRevert()).to.be.reverted
            let tx = await t.CreateAndRevert({ gasLimit: 1000000 })
            await tx.wait()
            results.push({ method: "CreateAndRevert", hash: tx.hash })
        })())
    });

    it("should ok when CallAndCatch", async function () {
        let tx = await t.CallAndCatch()
        await tx.wait()
        results.push({ method: "CallAndCatch", hash: tx.hash })
    });

    it("should ok when CreateAndCatch", async function () {
        let tx = await t.CreateAndCatch()
        await tx.wait()
        results.push({ method: "CreateAndCatch", hash: tx.hash })
    });

    it("should ok when Integration1", async function () {
        let tx = await t.Integration1()
        await tx.wait()
        results.push({ method: "Integration1", hash: tx.hash })
    });

    it("should ok when Integration2", async function () {
        let tx = await t.Integration2()
        await tx.wait()
        results.push({ method: "Integration2", hash: tx.hash })
    });
});


xdescribe("Test EVMSpace Nonce", function () {

    let p, wallet

    this.beforeAll(async function () {
        p = ethers.provider
        wallet = new ethers.Wallet("0b56f3db5a57e57aa8ac44f0c4aecafe2db1643f302a6d634cf486ee774725bb", p)
    })

    it("should nonce continue when continuous send", async function () {
        let lastNonce
        for (let i = 0; i < 200; i++) {
            let nonce = await p.getTransactionCount(wallet.address, "pending")
            let tx = await wallet.sendTransaction({ to: wallet.address, value: ethers.utils.parseEther("0"), nonce })
            // let nonce = await p.getTransactionCount(wallet.address, "pending")
            console.log("send tx last nonce", nonce)
            expect(nonce).to.be.eq(lastNonce + 1 || nonce)
            lastNonce = nonce
        }
    })
})
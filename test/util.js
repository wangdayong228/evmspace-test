
async function expectPromiseRevert(p) {
    try {
        await p
    }
    catch (e) {
        return
    }
    throw new Error("Expected revert but pass")
}

module.exports = {
    expectPromiseRevert
}
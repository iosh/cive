import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { deployTest20 } from '../../../test/src/utils.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getCode } from './getCode.js'

const client = devConflux.getClient({ account: getTestAccount(accounts[0]) })
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const { contractCreated } = await deployTest20(client)

  expect(
    await getCode(client, {
      address: accounts[0].base32Address,
    }),
  ).toBe(undefined)

  expect(
    await getCode(client, { address: contractCreated! }),
  ).toMatchInlineSnapshot(
    `"0x608060405234801561001057600080fd5b50600436106101215760003560e01c80635c975abb116100ad57806384b0196e1161007157806384b0196e146102e457806395d89b4114610308578063a9059cbb14610326578063d505accf14610356578063dd62ed3e1461037257610121565b80635c975abb1461024057806370a082311461025e57806379cc67901461028e5780637ecebe00146102aa5780638456cb59146102da57610121565b8063313ce567116100f4578063313ce567146101c25780633644e515146101e05780633f4ba83a146101fe57806340c10f191461020857806342966c681461022457610121565b806306fdde0314610126578063095ea7b31461014457806318160ddd1461017457806323b872dd14610192575b600080fd5b61012e6103a2565b60405161013b91906117f8565b60405180910390f35b61015e600480360381019061015991906118b3565b610434565b60405161016b919061190e565b60405180910390f35b61017c610457565b6040516101899190611938565b60405180910390f35b6101ac60048036038101906101a79190611953565b610461565b6040516101b9919061190e565b60405180910390f35b6101ca610490565b6040516101d791906119c2565b60405180910390f35b6101e8610499565b6040516101f591906119f6565b60405180910390f35b6102066104a8565b005b610222600480360381019061021d91906118b3565b6104b2565b005b61023e60048036038101906102399190611a11565b6104c0565b005b6102486104d4565b604051610255919061190e565b60405180910390f35b61027860048036038101906102739190611a3e565b6104eb565b6040516102859190611938565b60405180910390f35b6102a860048036038101906102a391906118b3565b610533565b005b6102c460048036038101906102bf9190611a3e565b610553565b6040516102d19190611938565b60405180910390f35b6102e2610565565b005b6102ec61056f565b6040516102ff9796959493929190611b73565b60405180910390f35b610310610619565b60405161031d91906117f8565b60405180910390f35b610340600480360381019061033b91906118b3565b6106ab565b60405161034d919061190e565b60405180910390f35b610370600480360381019061036b9190611c4f565b6106ce565b005b61038c60048036038101906103879190611cf1565b610816565b6040516103999190611938565b60405180910390f35b6060600380546103b190611d60565b80601f01602080910402602001604051908101604052809291908181526020018280546103dd90611d60565b801561042a5780601f106103ff5761010080835404028352916020019161042a565b820191906000526020600020905b81548152906001019060200180831161040d57829003601f168201915b5050505050905090565b60008061043f61089d565b905061044c8185856108a5565b600191505092915050565b6000600254905090565b60008061046c61089d565b90506104798582856108b7565b61048485858561094b565b60019150509392505050565b60006012905090565b60006104a3610a3f565b905090565b6104b0610af6565b565b6104bc8282610b59565b5050565b6104d16104cb61089d565b82610bdb565b50565b6000600560009054906101000a900460ff16905090565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6105458261053f61089d565b836108b7565b61054f8282610bdb565b5050565b600061055e82610c5d565b9050919050565b61056d610ca6565b565b600060608060008060006060610583610d09565b61058b610d44565b46306000801b600067ffffffffffffffff8111156105ac576105ab611d91565b5b6040519080825280602002602001820160405280156105da5781602001602082028036833780820191505090505b507f0f00000000000000000000000000000000000000000000000000000000000000959493929190965096509650965096509650965090919293949596565b60606004805461062890611d60565b80601f016020809104026020016040519081016040528092919081815260200182805461065490611d60565b80156106a15780601f10610676576101008083540402835291602001916106a1565b820191906000526020600020905b81548152906001019060200180831161068457829003601f168201915b5050505050905090565b6000806106b661089d565b90506106c381858561094b565b600191505092915050565b8342111561071357836040517f6279130200000000000000000000000000000000000000000000000000000000815260040161070a9190611938565b60405180910390fd5b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886107428c610d7f565b8960405160200161075896959493929190611dc0565b604051602081830303815290604052805190602001209050600061077b82610dd6565b9050600061078b82878787610df0565b90508973ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146107ff57808a6040517f4b800e460000000000000000000000000000000000000000000000000000000081526004016107f6929190611e21565b60405180910390fd5b61080a8a8a8a6108a5565b50505050505050505050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b6108b28383836001610e20565b505050565b60006108c38484610816565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146109455781811015610935578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161092c93929190611e4a565b60405180910390fd5b61094484848484036000610e20565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036109bd5760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016109b49190611e81565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610a2f5760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401610a269190611e81565b60405180910390fd5b610a3a838383610ff7565b505050565b60007f000000000000000000000000880b89d966d9b4c1cd965351863040c540b8833173ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16148015610abb57507f000000000000000000000000000000000000000000000000000000000003114546145b15610ae8577f3e69d3118bb1550249ff362d596646575383d1bb0156772b4a55036353162d279050610af3565b610af0611007565b90505b90565b610afe61109d565b6000600560006101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa610b4261089d565b604051610b4f9190611e81565b60405180910390a1565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610bcb5760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401610bc29190611e81565b60405180910390fd5b610bd760008383610ff7565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610c4d5760006040517f96c6fd1e000000000000000000000000000000000000000000000000000000008152600401610c449190611e81565b60405180910390fd5b610c5982600083610ff7565b5050565b6000600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b610cae6110dd565b6001600560006101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610cf261089d565b604051610cff9190611e81565b60405180910390a1565b6060610d3f60067f546573743230000000000000000000000000000000000000000000000000000661111e90919063ffffffff16565b905090565b6060610d7a60077f310000000000000000000000000000000000000000000000000000000000000161111e90919063ffffffff16565b905090565b6000600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000815480929190600101919050559050919050565b6000610de9610de3610a3f565b836111ce565b9050919050565b600080600080610e028888888861120f565b925092509250610e128282611303565b829350505050949350505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610e925760006040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610e899190611e81565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610f045760006040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610efb9190611e81565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015610ff1578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610fe89190611938565b60405180910390a35b50505050565b611002838383611467565b505050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f7f8a58eccce1e1d88823fa704c82cd0b370f5589cf604f30c1911ade27753935f07fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc64630604051602001611082959493929190611e9c565b60405160208183030381529060405280519060200120905090565b6110a56104d4565b6110db576040517f8dfc202b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b6110e56104d4565b1561111c576040517fd93c066500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b606060ff60001b831461113b576111348361147f565b90506111c8565b81805461114790611d60565b80601f016020809104026020016040519081016040528092919081815260200182805461117390611d60565b80156111c05780601f10611195576101008083540402835291602001916111c0565b820191906000526020600020905b8154815290600101906020018083116111a357829003601f168201915b505050505090505b92915050565b60006040517f190100000000000000000000000000000000000000000000000000000000000081528360028201528260228201526042812091505092915050565b60008060007f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08460001c111561124f5760006003859250925092506112f9565b6000600188888888604051600081526020016040526040516112749493929190611eef565b6020604051602081039080840390855afa158015611296573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036112ea57600060016000801b935093509350506112f9565b8060008060001b935093509350505b9450945094915050565b6000600381111561131757611316611f34565b5b82600381111561132a57611329611f34565b5b0315611463576001600381111561134457611343611f34565b5b82600381111561135757611356611f34565b5b0361138e576040517ff645eedf00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600260038111156113a2576113a1611f34565b5b8260038111156113b5576113b4611f34565b5b036113fa578060001c6040517ffce698f70000000000000000000000000000000000000000000000000000000081526004016113f19190611938565b60405180910390fd5b60038081111561140d5761140c611f34565b5b8260038111156114205761141f611f34565b5b0361146257806040517fd78bce0c00000000000000000000000000000000000000000000000000000000815260040161145991906119f6565b60405180910390fd5b5b5050565b61146f6110dd565b61147a8383836114f3565b505050565b6060600061148c83611718565b90506000602067ffffffffffffffff8111156114ab576114aa611d91565b5b6040519080825280601f01601f1916602001820160405280156114dd5781602001600182028036833780820191505090505b5090508181528360208201528092505050919050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036115455780600260008282546115399190611f92565b92505081905550611618565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050818110156115d1578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016115c893929190611e4a565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361166157806002600082825403925050819055506116ae565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161170b9190611938565b60405180910390a3505050565b60008060ff8360001c169050601f81111561175f576040517fb3512b0c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80915050919050565b600081519050919050565b600082825260208201905092915050565b60005b838110156117a2578082015181840152602081019050611787565b60008484015250505050565b6000601f19601f8301169050919050565b60006117ca82611768565b6117d48185611773565b93506117e4818560208601611784565b6117ed816117ae565b840191505092915050565b6000602082019050818103600083015261181281846117bf565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061184a8261181f565b9050919050565b61185a8161183f565b811461186557600080fd5b50565b60008135905061187781611851565b92915050565b6000819050919050565b6118908161187d565b811461189b57600080fd5b50565b6000813590506118ad81611887565b92915050565b600080604083850312156118ca576118c961181a565b5b60006118d885828601611868565b92505060206118e98582860161189e565b9150509250929050565b60008115159050919050565b611908816118f3565b82525050565b600060208201905061192360008301846118ff565b92915050565b6119328161187d565b82525050565b600060208201905061194d6000830184611929565b92915050565b60008060006060848603121561196c5761196b61181a565b5b600061197a86828701611868565b935050602061198b86828701611868565b925050604061199c8682870161189e565b9150509250925092565b600060ff82169050919050565b6119bc816119a6565b82525050565b60006020820190506119d760008301846119b3565b92915050565b6000819050919050565b6119f0816119dd565b82525050565b6000602082019050611a0b60008301846119e7565b92915050565b600060208284031215611a2757611a2661181a565b5b6000611a358482850161189e565b91505092915050565b600060208284031215611a5457611a5361181a565b5b6000611a6284828501611868565b91505092915050565b60007fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b611aa081611a6b565b82525050565b611aaf8161183f565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611aea8161187d565b82525050565b6000611afc8383611ae1565b60208301905092915050565b6000602082019050919050565b6000611b2082611ab5565b611b2a8185611ac0565b9350611b3583611ad1565b8060005b83811015611b66578151611b4d8882611af0565b9750611b5883611b08565b925050600181019050611b39565b5085935050505092915050565b600060e082019050611b88600083018a611a97565b8181036020830152611b9a81896117bf565b90508181036040830152611bae81886117bf565b9050611bbd6060830187611929565b611bca6080830186611aa6565b611bd760a08301856119e7565b81810360c0830152611be98184611b15565b905098975050505050505050565b611c00816119a6565b8114611c0b57600080fd5b50565b600081359050611c1d81611bf7565b92915050565b611c2c816119dd565b8114611c3757600080fd5b50565b600081359050611c4981611c23565b92915050565b600080600080600080600060e0888a031215611c6e57611c6d61181a565b5b6000611c7c8a828b01611868565b9750506020611c8d8a828b01611868565b9650506040611c9e8a828b0161189e565b9550506060611caf8a828b0161189e565b9450506080611cc08a828b01611c0e565b93505060a0611cd18a828b01611c3a565b92505060c0611ce28a828b01611c3a565b91505092959891949750929550565b60008060408385031215611d0857611d0761181a565b5b6000611d1685828601611868565b9250506020611d2785828601611868565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611d7857607f821691505b602082108103611d8b57611d8a611d31565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600060c082019050611dd560008301896119e7565b611de26020830188611aa6565b611def6040830187611aa6565b611dfc6060830186611929565b611e096080830185611929565b611e1660a0830184611929565b979650505050505050565b6000604082019050611e366000830185611aa6565b611e436020830184611aa6565b9392505050565b6000606082019050611e5f6000830186611aa6565b611e6c6020830185611929565b611e796040830184611929565b949350505050565b6000602082019050611e966000830184611aa6565b92915050565b600060a082019050611eb160008301886119e7565b611ebe60208301876119e7565b611ecb60408301866119e7565b611ed86060830185611929565b611ee56080830184611aa6565b9695505050505050565b6000608082019050611f0460008301876119e7565b611f1160208301866119b3565b611f1e60408301856119e7565b611f2b60608301846119e7565b95945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611f9d8261187d565b9150611fa88361187d565b9250828201905080821115611fc057611fbf611f63565b5b9291505056fea2646970667358221220ca0c2b9341045086ccb124082891f3320bdd97a4ad0c8b1890522d1ab3af3a7164736f6c63430008180033"`,
  )
})

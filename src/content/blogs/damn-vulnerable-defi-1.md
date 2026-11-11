---
title: "Damn Vulnerable DeFi Solution 1: Unstoppable"
pubDate: '2022-05-08T12:00:00Z'
description: Learn how the Damn Vulnerable DeFi Unstoppable challenge works, including flash loans, lending pools, and the smart contract invariant that stops the pool.
tags: [auditor, blockchain, smart contracts, python]
language: en
canonicalURL: https://kevdevto.hashnode.dev/dvd-1
---
In this series of articles we are going to make a walkthrough of the famous CTF **Damn Vulnerable Defi**, created by one of the top auditors of OpenZeppelin,

My goal with this series of articles is to show you, not only the solution but also what was my process to reach that solution, also explain basic and advanced topics of blockchain development, Defi, EVM…

Our approach will be the same as we were doing in the [ethernaut series](https://kevdevto.hashnode.dev/series/ethernaut), we are going to describe the contracts and some concepts that you may not be familiar with, explain how we can hack the contract and hack the contract.

*Ready?*

To set up the development environment you can go to the Damn Vulnerable Defi web and follow the instructions to download the code and start hacking.

Let's start with our first Challenge: **Unstoppable**

## The challenge

> There's a **lending pool** with a million DVT tokens in balance, offering **flash loans** for free. If only there was a way to **attack and stop the pool from offering flash loans** … You start with 100 DVT tokens in balance.

Let's first understand a couple of concepts, *Lending Pool* and *Flash loans*

## Explaining some concepts

### Lending pools

In the world of decentralized finance, Lending pools act as accounts in where any user who wants to **lend** their money, can deposit it in that account for any other user who wants to **borrow** some money. That's the reason why they are called pools, because many users can lend money (lenders) in a single account to make a pool of money for any other user who wants to borrow from (borrowers). These accounts are smart contracts. Of course, the idea is much more complex than that, but let's keep it simple.

To be able to borrow money from a lending pool we have to provide some kind of collateral, **this is to maintain the liquidity in the pool** The most “basic” way is by providing over-collateralization to borrow some money. Example

Let's say we have a pool in which users can lend DAI, for any other user who wants to borrow DAI from the pool they have to provide 110% in any other currency as collateral.

E.g: If I want to borrow 100 DAI I have to provide 110 ETH as collateral.

Of course, protocols use different types of mechanisms to maintain liquidity, this is just the most simple example.

### Flash loans

Well, flash loans allow us to borrow some money but without providing any kind of collateral, WHAT? Free money??

Yeah, kinda, but why?

This is thanks to smart contract technology, to be able to do a flash loan we have to return the same amount that we borrow in the same block transaction.

*Remember, when smart contracts call a function of other smart contracts they do not execute another transaction, they only pass a message within them in the same transaction.* You can read more about that [here](https://kevdevto.hashnode.dev/ethernaut-3-solution-coin-flip#heading-how-transactions-and-messages-works)

But, why do I want to borrow money to return it immediately? Well, the most common example is to do **”arbitrage”**

Let's say `Token A` is in `DEX A` at 10 ETH but that same `Token A` is in `DEX B` at 11 ETH, you can buy `Token A` in `DEX A` at 10 ETH and then sell it in `DEX B` for 11ETH, and bum!!! PROFIT.

![Stonks meme](/assets/blog/damn-vulnerable-defi-1/s8UzkFvE_.avif)

Of course, **you have to take into account the fees, gas and interest of both dexes** to be able to successfully execute the flash loan.

Now,

## Let's take a look at the contracts.

### ReceiverUnstoppable.sol

```plaintext
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../unstoppable/UnstoppableLender.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ReceiverUnstoppable
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract ReceiverUnstoppable {

    UnstoppableLender private immutable pool;
    address private immutable owner;

    constructor(address poolAddress) {
        pool = UnstoppableLender(poolAddress);
        owner = msg.sender;
    }

    // Pool will call this function during the flash loan
    function receiveTokens(address tokenAddress, uint256 amount) external {
        require(msg.sender == address(pool), "Sender must be pool");
        // Return all tokens to the pool
        require(IERC20(tokenAddress).transfer(msg.sender, amount), "Transfer of tokens failed");
    }

    function executeFlashLoan(uint256 amount) external {
        require(msg.sender == owner, "Only owner can execute flash loan");
        pool.flashLoan(amount);
    }
}
```

We have a function `receiveTokens` that receives the address of a Token (an ERC20) and an amount.

It evaluates whether the caller of the function is the smart contract referenced in the `pool` variable,. If not, it’ll revert the transaction

Then, it transfers the amount that we introduce as a parameter to the lending pool contract, if the transaction fails, it will revert.

The other function is `executeFlashLoan` that receives an amount as a parameter and requires that only the `owner` of the contract, who is set during the deployment of the contract, can call it.

Then it will active the `flashLoan` function of the `pool` contract

### UnstoppableLender.sol

```plaintext
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IReceiver {
    function receiveTokens(address tokenAddress, uint256 amount) external;
}

/**
 * @title UnstoppableLender
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract UnstoppableLender is ReentrancyGuard {

    IERC20 public immutable damnValuableToken;
    uint256 public poolBalance;

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Token address cannot be zero");
        damnValuableToken = IERC20(tokenAddress);
    }

    function depositTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "Must deposit at least one token");
        // Transfer token from sender. Sender must have first approved them.
        damnValuableToken.transferFrom(msg.sender, address(this), amount);
        poolBalance = poolBalance + amount;
    }

    function flashLoan(uint256 borrowAmount) external nonReentrant {
        require(borrowAmount > 0, "Must borrow at least one token");

        uint256 balanceBefore = damnValuableToken.balanceOf(address(this));
        require(balanceBefore >= borrowAmount, "Not enough tokens in pool");

        // Ensured by the protocol via the `depositTokens` function
        assert(poolBalance == balanceBefore);
        
        damnValuableToken.transfer(msg.sender, borrowAmount);
        
        IReceiver(msg.sender).receiveTokens(address(damnValuableToken), borrowAmount);
        
        uint256 balanceAfter = damnValuableToken.balanceOf(address(this));
        require(balanceAfter >= balanceBefore, "Flash loan hasn't been paid back");
    }
}
```

We have a `depositTokens` function that allows us to provide liquidity to the pool, to lend some Damn Vulnerable Token, it uses the `transferFrom` function of the ERC20 interface to transfer tokens from our balance to the balance of the contract and updates the `poolBalance` state variable adding the amount of tokens we transferred.

Then, we have a `flashLoan` function, that receives a uint256 as a parameter, this is the amount we want to borrow.

It checks what is the current balance of the tokens that this contract has in the DVT tokens, stores it in a local variable `balanceBefore` and It requires that the pool have enough tokens for us to borrow, if not it reverts.

Then it asserts that the `poolBalace` storage variable is equal to the `balanceBefore`

Iit transfer to us the amount we want to borrow, to do whatever operations we want

Calls the `receiveTokens` function of the UnstoppableReceiver contract

It checks again the current balance of tokens of the contract in the DVT smart contract and stores it in a variable `balanceAfter`

And finally checks whether `balanceAfter` &gt;= `balanceBefore`, to assert that all the liquidity borrowed was returned.

## Let's think

Ok, since we have to **stop** the flash loan function, there has to be some storage variable we can modify to revert all the calls made to the function, or at least some change we can make in the contract that allows us to modify its behavior forever. And what are those errors that can revert and stop smart contracts during execution? Of course, we can run out of gas, but that problem can be solved by putting more gas into the transaction. I’m referring to those specific lines of code that can revert transactions based on some parameters… exactly, the `require` , `asserts`, and `if throw` statements. So, let's check those…

In the `depositTokens` function there isn't an error or bug we can exploit to stop the flash loan, since only increments the balance of the contract

In the `flashLoan` function there are 3 points to which the contract can revert.

The first one, checks if the amount passed as a parameter is greater than zero, this is the most basic prevention you have to add when you are receiving tokens; so we can’t exploit it

```plaintext
require(amount > 0, "Must deposit at least one token");
```

The last require statement checks if all the money borrowed was returned successfully, the variables it checks are available only during the execution of the function since those are memory variables. So, at least we can modify those variables during the execution of the function to cause an error, every time someone calls it, there is nothing to do there.

With the assert statement, something is interesting;

```plaintext
assert(poolBalance == balanceBefore);
```

It checks if `poolBalance` and `balanceBefore` are equal.

If we see, `poolBalance` always updates when someone execute the `depositToken` function, it tracks **internally** how many DVTs the contract has.

But, `balanceBefore` is a memory variable that is set during the execution of `flashLoan` and it checks, not the internal amount of tokens that this contract has, but the number of tokens that the address of this contract has in the ERC20 DVT contract.

Is there a condition - escenario in where those variables can differ

```solidity
uint256 balanceBefore = damnValuableToken.balanceOf(address(this));
```

> Remember that the specification of every ERC20 contract must have a mapping that tracks how many tokens a specific account has.

You got it? Exactly, **we have to find a way to increment our balance directly in the DVT ERC20 smart contract.** Since we are not calling the `depositToken` function, `poolBalance` wouldn't be updated, but since we are updating our balance in the DVT contract our balance in that contract will update and the assertion will no longer be true.

## Lets hack the contract

> HEY, try to hack the contract on your own, it's better to have hands-on experience by yourself.

Remember we have to code our solutions in the provided `.challenge.js` files (*inside each challenge's folder in the test folder*)

First, we have to execute a function that allows us to increment our DVT token balance in the DVT token contract. The `transfer` function will allow us to do that, every ERC20 smart contract must have a `transfer` function.

Since we were given 100 DVT (in the `attacker` address) tokens at the beginning, we can just transfer those to the `UnstoppableLender` smart contract.

```plaintext
await this.token.connect(attacker)
await this.token.transfer(this.pool.address, INITIAL_ATTACKER_TOKEN_BALANCE);
```

In the first line of code, we are just telling hardhat, that we want to interact with the DVT smart contract using the `attacker` address

In the second line of code, we are effectively transferring all our tokens to the `UnstoppableLender` contract. Using the transfer function which receives the address we want to send the tokens and the number of tokens we want to send

That's it.

Now just run

```plaintext
$ yarn hardhat test test/unstoppable/unstoppable.challenge.js
```

Done

---

That's all folks…

You can see the complete solution in this [GitHub repo](https://github.com/mustafinho/damn-vulnerable-defi-solutions/blob/a82f8c50fc9765ad9de09bfb810b541c372acc59/test/unstoppable/unstoppable.challenge.js#L42-L43)

If you have any comments or suggestions, send me a message on [X](https://x.com/0bkevin) or open a PR if you see any problem with the code.

You can follow me on my Twitter @0bkevin and DM me, I’m always happy to talk and get to know more people in this amazing community.

Stay tuned for the next Damn Vulnerable Token solution: **Naive receiver**


     /* Configure Ethereum provider */
     const magic = new Magic("pk_live_FD62AAB7386C0B17", {
        network: "rinkeby"
      });
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider);

      /*  Smart contract values */
      const contractABI =
        '[{"constant":false,"inputs":[{"name":"newMessage","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"message","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initMessage","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
      const contractByteCode =
        "0x608060405234801561001057600080fd5b5060405161047f38038061047f8339818101604052602081101561003357600080fd5b81019080805164010000000081111561004b57600080fd5b8281019050602081018481111561006157600080fd5b815185600182028301116401000000008211171561007e57600080fd5b5050929190505050806000908051906020019061009c9291906100a3565b5050610148565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100e457805160ff1916838001178555610112565b82800160010185558215610112579182015b828111156101115782518255916020019190600101906100f6565b5b50905061011f9190610123565b5090565b61014591905b80821115610141576000816000905550600101610129565b5090565b90565b610328806101576000396000f3fe608060405234801561001057600080fd5b5060043610610053576000357c0100000000000000000000000000000000000000000000000000000000900480633d7403a314610058578063e21f37ce14610113575b600080fd5b6101116004803603602081101561006e57600080fd5b810190808035906020019064010000000081111561008b57600080fd5b82018360208201111561009d57600080fd5b803590602001918460018302840111640100000000831117156100bf57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610196565b005b61011b6101b0565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561015b578082015181840152602081019050610140565b50505050905090810190601f1680156101885780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b80600090805190602001906101ac92919061024e565b5050565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102465780601f1061021b57610100808354040283529160200191610246565b820191906000526020600020905b81548152906001019060200180831161022957829003601f168201915b505050505081565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061028f57805160ff19168380011785556102bd565b828001600101855582156102bd579182015b828111156102bc5782518255916020019190600101906102a1565b5b5090506102ca91906102ce565b5090565b6102f091905b808211156102ec5760008160009055506001016102d4565b5090565b9056fea265627a7a7230582003ae1ef5a63bf058bfd2b31398bdee39d3cbfbb7fbf84235f4bc2ec352ee810f64736f6c634300050a0032";
      let contractAddress = "0x8b211dfebf490a648f6de859dfbed61fa22f35e0";

      const render = async () => {
        const isLoggedIn = await magic.user.isLoggedIn();
        /* Show login form if user is not logged in */
        let authHtml = `
          <div class="container">
            <h1>Please sign up or login</h1>
            <form onsubmit="handleLogin(event)">
              <input type="email" name="email" required="required" placeholder="Enter your email" />
              <button type="submit">Send</button>
            </form>
          </div>
        `;
        let userHtml = "";
        let txnHtml = "";
        let signHtml = "";
        let contractHtml = "";
        const target = document.querySelector("#app");
        if (isLoggedIn) {
          /* Get user metadata including email */
          const userMetadata = await magic.user.getMetadata();
          const signer = provider.getSigner();
          const network = await provider.getNetwork();
          const userAddress = await signer.getAddress();
          const userBalance = ethers.utils.formatEther(
            await provider.getBalance(userAddress)
          );
          authHtml = `
            <div class="container">
              <h1>Current user: ${userMetadata.email}</h1>
              <button onclick="handleLogout()">Logout</button>
            </div>
          `;
          userHtml = `
            <div class="container">
              <h1>Ethereum address</h1>
              <div class="info">
                <a href="https://rinkeby.etherscan.io/address/${userAddress}" target="_blank">${userAddress}</a>
              </div>
              <h1>Network</h1>
              <div class="info">${network.name}</div>
              <h1>Balance</h1>
              <div class="info">${userBalance} ETH</div>
            </div>
          `;
          txnHtml = `
            <div class="container">
              <h1>Send Transaction</h1>
              <form onsubmit="handleSendTxn(event)">
                <input type="text" name="destination" class="full-width" required="required" placeholder="Destination address" />
                <input type="text" name="amount" class="full-width" required="required" placeholder="Amount in ETH" />
                <button id="btn-send-txn" type="submit">Send Transaction</button>
              </form>
            </div>
          `;
          signHtml = `
            <div class="container">
              <h1>Sign Message</h1>
              <form onsubmit="handleSignMsg(event)">
                <input type="text" name="message" class="full-width" placeholder="Message" />
                <button id="btn-sign-msg" type="submit">Sign Message</button>
              </form>
            </div>
          `;
          let contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          const currentMessage = await contract.message();
          contractHtml = `
            <div class="container">
              <h1>Smart Contract</h1>
              <div class="info">
                <a href="https://rinkeby.etherscan.io/address/${contractAddress}" target="_blank">${contractAddress}</a>
              </div>
              <h1>Message</h1>
              <div class="info">${currentMessage}</div>
              <form onsubmit="handleUpdateMsg(event)">
                <input type="text" name="new-message" class="full-width" required="required" placeholder="New Message" />
                <button id="btn-deploy" onclick="handleDeploy()">New Contract</button>
                <button id="btn-update-msg" type="submit">Update Message</button>
              </form>
            </div>
          `;
        }
        target.innerHTML =
          authHtml + userHtml + txnHtml + signHtml + contractHtml;
      };

      const handleLogin = async e => {
        e.preventDefault();
        const email = new FormData(e.target).get("email");
        if (email) {
          /* One-liner login 🤯 */
          await magic.auth.loginWithMagicLink({ email });
          render();
        }
      };

      const handleSendTxn = async e => {
        e.preventDefault();
        const destination = new FormData(e.target).get("destination");
        const amount = new FormData(e.target).get("amount");
        if (destination && amount) {
          const btnSendTxn = document.getElementById("btn-send-txn");
          btnSendTxn.disabled = true;
          btnSendTxn.innerText = "Sending...";
          const signer = provider.getSigner();
          const tx = await signer.sendTransaction({
            to: destination,
            value: ethers.utils.parseEther(amount)
          });
          console.log("Submitted:", tx);
          const receipt = await tx.wait();
          console.log("Completed:", receipt);
          render();
        }
      };

      const handleSignMsg = async e => {
        e.preventDefault();
        const message = new FormData(e.target).get("message");
        if (message) {
          const signer = provider.getSigner();
          const userAddress = await signer.getAddress();
          const signedMessage = await signer.signMessage(message);
          alert(`Signed Message: ${signedMessage}`);
          console.log(signedMessage);
          const signerAddress = ethers.utils.verifyMessage(
            message,
            signedMessage
          );
          console.log(signerAddress == userAddress);
        }
      };

      const handleUpdateMsg = async e => {
        e.preventDefault();
        const newMessage = new FormData(e.target).get("new-message");
        if (newMessage) {
          const btnUpdateMsg = document.getElementById("btn-update-msg");
          btnUpdateMsg.disabled = true;
          btnUpdateMsg.innerText = "Updating...";
          const signer = provider.getSigner();
          let contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          const tx = await contract.update(newMessage);
          console.log("Submitted:", tx);
          const receipt = await tx.wait();
          console.log("Completed:", receipt);
          render();
        }
      };

      const handleDeploy = async () => {
        const btnDeploy = document.getElementById("btn-deploy");
        btnDeploy.disabled = true;
        btnDeploy.innerText = "Deploying...";
        const signer = provider.getSigner();
        const factory = new ethers.ContractFactory(
          contractABI,
          contractByteCode,
          signer
        );
        const contract = await factory.deploy("Hello World!");
        console.log("Submitted:", contract.deployTransaction);
        const receipt = await contract.deployed();
        console.log("Completed:", receipt);
        contractAddress = contract.address;
        render();
      };

      const handleLogout = async () => {
        await magic.user.logout();
        render();
      };
      
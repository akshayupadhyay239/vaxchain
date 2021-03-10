import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, 
            accounts: null, 
            contract: null,
            name:"",
            vaccine:"",
            age:0,
            adhar:0,
            records:[]
            };

   componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getRecords);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getRecords = async () => {
    const { contract } = this.state;

    const noOfFile = await contract.methods.getNo().call();

    for(var i=noOfFile; i>=1;i--){
      console.log("working");
      const record = await contract.methods.getRecordFromId(i).call();
      this.setState({
        records:[...this.state.records,record]
      })
    }
  };

  clickHandler = async() => {
    const { accounts, contract } = this.state;
    const {name,vaccine,age,adhar} = this.state;
    const data = "{name:"+name+",vaccine:"+vaccine+",age:"+age+",adhar:"+adhar+"}"
    await contract.methods.uploadRecord(data).send({ from: accounts[0] });
  }

  changeHandler = (e) => {
    const { name , value} = e.target
    this.setState({
      [name]:value
    })
  }

  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>VaxChain</h1>
        <div className="form">
          <ul>
            <li><label>Name</label><input name="name" onChange={this.changeHandler}/></li>
            <li><label>vaccine</label><input name="vaccine" onChange={this.changeHandler}/></li>
            <li><label>age</label><input name="age" onChange={this.changeHandler}/></li>
            <li><label>adhar</label><input name="adhar" onChange={this.changeHandler}/></li>
            <li><input type="submit" onClick={this.clickHandler}/></li>
          </ul>  
        </div>
        {this.state.records}
      </div>
    );
  }
}

export default App;

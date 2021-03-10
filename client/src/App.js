import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import Reciever from "./Reciever";
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
    console.log(this.state.records)
  };

  clickHandler = async() => {
    const { accounts, contract } = this.state;
    const {name,vaccine,age,adhar} = this.state;
    const data = '{"name":"'+name+'","vaccine":"'+vaccine+'","age":'+age+',"adhar":'+adhar+'}'
    await contract.methods.uploadRecord(String(data)).send({ from: accounts[0] });
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
          <label for="fname">Name</label>
          <input type="text" name="name" placeholder="Your name" onChange={this.changeHandler}/>

          <label for="fvaccine">Vaccine</label>
          <input type="text" name="vaccine" placeholder="Vaccine" onChange={this.changeHandler}/>

          <label for="fage">Age</label>
          <input type="text" name="age" placeholder="Your age" onChange={this.changeHandler}/>

          <label for="fadhar">Aadhar no.</label>
          <input type="text" name="adhar" placeholder="Aadhar no." onChange={this.changeHandler}/>

          <input type="submit" value="Submit" onClick={this.clickHandler} />
        </div>
        
        
        <div className="tbl">
          {this.state.records.map( (data , index) => <Reciever id={index+1} rData={data} /> )}
        </div>
      </div>
    );
  }
}

export default App;

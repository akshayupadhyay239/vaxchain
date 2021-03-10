// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

contract SimpleStorage {
 uint nonce = 0;

  mapping(uint => string) Record;

  function getNo() public view returns(uint no){
      no = nonce;
    }

  function getRecordFromId(uint id) public view returns(string memory record){
        record = Record[id];
    }

  function uploadRecord(string memory _record) public {
        nonce++;
        Record[nonce] = _record;     
    }

}

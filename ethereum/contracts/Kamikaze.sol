pragma solidity ^0.4.17;


contract KamikazeFactory{
    address [] public deployedUsers;

    mapping(address => bool) public contractCreated;
    mapping(address => address) public kamikazeOwner;

    function createUser(string _name, string _description, string _pictureHash) public {
        require(contractCreated[msg.sender] == false);
        address newUser =new Kamikaze(msg.sender,_name,_description,_pictureHash);
        contractCreated[msg.sender] = true;

        deployedUsers.push(newUser);
        kamikazeOwner[msg.sender] = newUser;

    }

    function isCreated() public view returns (bool){
        return contractCreated[msg.sender];
    }

    function getDeployedUsers() public view returns (address[]){
        return deployedUsers;
    }

    function getUserContract(address userAddress) public view returns(address){
        return kamikazeOwner[userAddress];
    }

}

contract Kamikaze{
    struct Item{
        string name;
        string iType;
        string itemHash;
        string description;
        uint downloads;
        uint price;
        address owner;
        string pictureHash;
    }

    modifier restricted(){
        require(msg.sender == creator);
        _;
    }

    Item[] public items;
    address public creator;
    string public name;
    string public description;
    string public pictureHash;

    function Kamikaze(address manager, string _name, string _description, string _pictureHash) public {
        creator = manager;
        name = _name;
        description = _description;
        pictureHash = _pictureHash;
    }


    function newFile (string _name, string _iType, string _itemHash, string _pictureHash,string _description, uint _price) public restricted {
        Item memory newItem = Item({
            name: _name,
            iType:_iType,
            description:_description,
            itemHash:_itemHash,
            downloads  :0,
            price : _price,
            owner: creator,
            pictureHash: _pictureHash
            });

        items.push(newItem);

    }

    function setPhoto(string _pictureHash)public {
        pictureHash = _pictureHash;
    }



    function buyFile(uint index) public payable{
        require(msg.value == items[index].price);
        creator.transfer(msg.value);
        items[index].downloads++;
    }

    function getItemsCount() public view returns (uint256){
        return items.length;
    }


}
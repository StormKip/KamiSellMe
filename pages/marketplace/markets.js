import React, {Component} from 'react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout.js';
import web3 from '../../ethereum/web3';
import Kamikaze from '../../ethereum/kamikaze';
import FileCards from '../../components/FileCards';
import {Container, Card} from "semantic-ui-react";
// import ipfs from '../../ethereum/jsIpfs';

class ItemShow extends Component{
    static async getInitialProps(props){

        // const validCID = 'QmQ2r6iMNpky5f1m4cnm3Yqw8VSvjuKpTcK1X7dBR1LkJF'
        //
        // const stream = ipfs.lsReadableStream(validCID);
        //
        // stream.on('data', (file) => {
        //     // write the file's path and contents to standard out
        //     console.log(file.path)
        // })

        const type = props.query.header;
        const deployedContracts = await factory.methods.getDeployedUsers().call();

        let allItems = [];
        let typeItems=[];
        let contractAddress=[];
        let userArray=[];
        let userAddress=''
        // const contractCount = deployedContracts.length;

        for(let k = 0; k<deployedContracts.length; k++) {
            let kamikaze = Kamikaze(deployedContracts[k]);

            let itemCount = await kamikaze.methods.getItemsCount().call();

            let items = await Promise.all(
                Array(parseInt(itemCount))
                    .fill()
                    .map((element, index) => {
                        //const kamikaze = Kamikaze(deployedContracts[index]);

                        return kamikaze.methods.items(index).call();
                    })
            );


            for (let i = 0; i < items.length; i++) {
                if(items[i].iType == type){
                    console.log(type)
                    allItems.push(items[i]);
                    contractAddress.push(deployedContracts[k]);

                }
            }

        }


        console.log(contractAddress)
        for(let i = 0; i<contractAddress.length -1 ;i++){
            let kamikaze = Kamikaze(contractAddress[i]);
            let userName = await kamikaze.methods.name().call();
            userAddress =userName
            userArray.push(userAddress)
        }


    return{deployedContracts,allItems, contractAddress, userArray}

    }


    renderThings(){
        return this.props.allItems.map((allItems, index) =>{
            return (
                <FileCards
                    key={index}
                id={index}
                items={allItems}
                    userName={this.props.userArray[index]}
                address={this.props.contractAddress[index]}

            />)
        })
    }


    render() {


        return (

            <Layout>
                <Container >
                <Card.Group>
                    {this.renderThings()}
                    </Card.Group>
                </Container>
            </Layout>

        );
    }
}

export default ItemShow;
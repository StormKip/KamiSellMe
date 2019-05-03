import React, {Component} from 'react';
import {Card, Container,Image} from 'semantic-ui-react';
import Layout from '../../components/Layout.js';
import {Link, Router} from '../../routes';
import factory from "../../ethereum/factory";
import Kamikaze from "../../ethereum/kamikaze";



class Explore extends Component{
    static async getInitialProps(props){
        const type = props.query.header;
        const deployedContracts = await factory.methods.getDeployedUsers().call();

        let allItems = [];
        let typeItems=[];
        let contractAddress=[];
        let userArray=[];
        let userAddress=''
        let gamesCount=0;
        let booksCount=0;
        let musicCount =0;
        let instrumentalCount=0;
        let videosCount=0;
        let otherCount =0;
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
                if(items[i].iType == "Games"){
                    gamesCount++
                } else if(items[i].iType == "Books"){
                    booksCount++
                }else if(items[i].iType == "Music"){
                    musicCount++
                }else if(items[i].iType == "Instrumentals"){
                    instrumentalCount++
                }else if(items[i].iType == "Videos"){
                    videosCount++
                }else if(items[i].iType == "Other"){
                    otherCount++
                }
            }

        }


        return{gamesCount,booksCount,musicCount,instrumentalCount,videosCount,otherCount}
    }

    handleClick =(event, data) =>{
        Router.pushRoute(`/marketplace/${data.header}/`)
        console.log(data.header)
    }


    render() {
        return (
            <Layout>
                <Container >
                <Card.Group itemsPerRow={3}>
                    <Card color='red'
                          id="games"
                          image={{src:'../static/games.png', height:'250px',width:'356px'}}
                          header="Games"
                          meta ={this.props.gamesCount}
                          value="games"
                          onClick = {this.handleClick}
                    />
                    <Card color='black'
                          image={{src:'../static/books.png', height:'250px',width:'356px'}}
                          header="Books"
                          meta ={this.props.booksCount}
                          onClick = {this.handleClick}
                    />
                    <Card color='red'
                          image={{src:'../static/music.png', height:'250px',width:'356px'}}
                          header="Music"
                          meta = {this.props.musicCount}
                          onClick = {this.handleClick}
                    />
                    <Card color='black'
                          image={{src:'../static/instrumentals.png', height:'250px',width:'356px'}}
                          header = "Instrumentals"
                          meta = {this.props.instrumentalCount}
                          onClick = {this.handleClick}
                    />
                    <Card color='red'
                          image={{src:'../static/videos.png', height:'250px',width:'356px'}}
                          header = "Videos"
                          meta = {this.props.videosCount}
                          onClick = {this.handleClick}
                    />
                    <Card color='black'
                          image={{src:'../static/Other.png', height:'250px',width:'356px'}}
                          header = "Other"
                          meta = {this.props.otherCount}
                          onClick = {this.handleClick}/>

                </Card.Group>
                </Container>
            </Layout>
        );
    }
}

export default Explore;
import React, {Component} from 'react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout.js';
import Segmant from '../components/Segmant.js';
import {Container,Image, Button,Label, Divider} from 'semantic-ui-react';
import web3 from '../ethereum/web3'

class KamikazeIndex extends Component{

static async getInitialProps(){
    const kamikazes = await factory.methods.getDeployedUsers().call();

    return{kamikazes};
    console.log(kamikazes);
}

render() {
    return (

        <Layout  >
            <style jsx global>{`
      body {
        background-image:url("static/homeBack.jpg")
      }
    `}</style>
            <div >
             <Image src="../static/Logo.png" centered/>
            <Image src="../static/kamisellme.png" centered/>
            </div>
            <Container style={{marginTop:10, marginBottom:20}} textAlign='center'>
                <h1>Decentralised Market Place for All Talented Individuals</h1>
                <h3>Helping talented people get rewarded for who they are</h3>
            </Container>

            <Segmant/>


        </Layout>

    );
}
}

export default KamikazeIndex;
import React, {Component} from 'react';
import {Table, Button, Card, Icon, Image, Divider, Header,Modal} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Kamikaze from '../ethereum/kamikaze';
import ipfs from '../ethereum/ipfs';
import Routes from '../routes';


class fileCards extends Component{

    state = { open: false , loadingButton:false, completed:''
    }

    show = dimmer => () => this.setState({ dimmer, open: true })
    close = () => this.setState({ open: false })

    buyFiles= async (event) =>{
        event.preventDefault();
        this.setState({loading:true});
        const accounts = await web3.eth.getAccounts();
        const kamikaze = Kamikaze(this.props.address)

        await kamikaze.methods.buyFile(this.props.id).send({from:accounts[0],
            value: this.props.items.price})
        this.setState({loading:false, completed:`https://ipfs.io/ipfs/${this.props.items.itemHash}`});
        Routes.pushRoute('/marketplace/explore')
    }

    renderModal(extra,items,file) {
        const { open, dimmer } = this.state
        return (
            <div style={{visibility: extra}}>

                <Button  basic onClick={this.show('blurring')} style={{marginLeft:'60%'}}>Buy</Button>

                <Modal dimmer={dimmer} open={open} onClose={this.close}>
                    <Modal.Header>Buy this file</Modal.Header>
                    <Modal.Content image>
                        <Image wrapped size='medium' src={file} />
                        <Modal.Description>
                            <Header>{items.name}</Header>
                            <p>You are about to redeem {items.price} wei </p>
                            <p>{this.state.completed}</p>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={this.close}>
                            Cancel
                        </Button>
                        <Button
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content="Proceed to buy"
                            onClick={this.buyFiles}
                            loading = {this.state.loadingButton}
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }



    render(){

        const {id, items, address,userName,extra} = this.props;
        const fileDir=`https://ipfs.io/ipfs/${items.pictureHash }`
        const kamikaze = Kamikaze(address);


        return (
            <Card>
                <Image src={fileDir} width="200px" height="200px" />
                <Card.Content>
                    <Card.Header>{items.name}</Card.Header>
                    <Card.Meta>{userName}</Card.Meta>
                    <Card.Description>{items.description}</Card.Description>
                </Card.Content>
                <Card.Content extra  style={{display: 'flex'}}>
                        <Icon name='user' />
                        {items.downloads} download(s)
                    {this.renderModal(extra,items,fileDir,id,address)}
                </Card.Content>

            </Card>

        );
    }
}
export default fileCards;
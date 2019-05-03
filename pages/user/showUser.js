import React, {Component} from 'react';
import Layout from '../../components/Layout.js';
import Kamikaze from '../../ethereum/kamikaze';
import factory from '../../ethereum/factory';
import {Container, Image, Segment, Grid, Divider, Header, Button, Label} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import FileCards from "../../components/FileCards";
import {Card, Icon} from "semantic-ui-react/";
import {Modal, Form, Loader, Dimmer} from "semantic-ui-react/";
import ipfs from '../../ethereum/ipfs';
import {Router} from "../../routes";


const options = [
    { key: 'g', text: 'Game', value: 'Games' },
    { key: 'b', text: 'Book', value: 'Books' },
    { key: 'm', text: 'Music', value: 'Music' },
    { key: 'i', text: 'Instrumentals', value: 'Instrumental' },
    { key: 'v', text: 'Video', value: 'Videos' },
    { key: 'o', text: 'Other', value: 'Other' }
]

class showUser extends Component{
    state={
        address:'',
        userName:'',
        ipfsHash1:'tt',
        ipfsHash2:'',
        ipfsDir:'',
        ipfsPicture:'',
        description:'',
        open: false,
        file:`https://ipfs.io/ipfs/QmYSBUj2B6D5fbHdgghUEjC8wHcjL5ndmVE2unDhU6HND2`,
        buffer:'',
        buffer2:'',
        iconName:'',
        loading:false,
        fileDescription:'',
        fileName:'',
        iType:'',
        loadState:false

    }
    static async getInitialProps(props){
        const {address} = props.query;
        const userAddress = await factory.methods.getUserContract(address).call();
        const kamikaze=Kamikaze(userAddress);
        const userName = await kamikaze.methods.name().call();
        const ipfsPicture = await kamikaze.methods.pictureHash().call();
        const description = await kamikaze.methods.description().call();
        const ipfsDir =  `https://ipfs.io/ipfs/${ipfsPicture}`;
        let itemCount = await kamikaze.methods.getItemsCount().call();
        let items = await Promise.all(
            Array(parseInt(itemCount))
                .fill()
                .map((element, index) => {
                    //const kamikaze = Kamikaze(deployedContracts[index]);

                    return kamikaze.methods.items(index).call();
                })
        );
        let downloads=0;
        for(let i=0;i<itemCount;i++){
            downloads+= parseInt(items[i].downloads);
        }
        let placeHolderVal=true;

        return {address, userName, ipfsPicture, description,ipfsDir,downloads, items,placeHolderVal,userAddress};

    }




    show = dimmer => () => this.setState({ loadState:true, open: true ,iconName: ''})
    close = () => this.setState({ open: false ,file:`https://ipfs.io/ipfs/QmYSBUj2B6D5fbHdgghUEjC8wHcjL5ndmVE2unDhU6HND2`, loadState:false})

    captureFile2 =(event2) => {
        event2.stopPropagation()
        event2.preventDefault()
        // this.setState({
        //     file: URL.createObjectURL(event.target.files[0])
        // })

        const file = event2.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer2(reader)
        this.setState({iconName:'thumbs up'})
    };

    convertToBuffer2 = async(reader) => {
        const buffer2 = await Buffer.from(reader.result);
        this.setState({buffer2});
    };

    captureFile =(event) => {
        console.log("event1")
        event.stopPropagation()
        event.preventDefault()
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })

        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
    };

    convertToBuffer = async(reader) => {
        const buffer = await Buffer.from(reader.result);
        this.setState({buffer});
    };

    onSubmit = async (event) => {
         event.preventDefault();
         this.setState({loadState:true});
         const kamikaze = Kamikaze(this.props.userAddress);
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
            this.setState({ ipfsHash1:ipfsHash[0].hash });

        });
        await ipfs.add(this.state.buffer2, (err, ipfsHash) => {

            this.setState({ ipfsHash2:ipfsHash[0].hash });
            kamikaze.methods.newFile(this.state.fileName, this.state.iType, this.state.ipfsHash2,this.state.ipfsHash1,this.state.fileDescription,200).send({
                from:accounts[0]
            },(err) =>{
                console.log(err)
            })
        });
        this.setState({loadState:false})

       //  const accounts = await web3.eth.getAccounts();
       // this.setState({loading:true});
       //  await ipfs.add(this.state.buffer (err, ipfsHash) => {
       //     // console.log(err,ipfsHash);
       //      this.setState({ ipfsHash:ipfsHash2[0].hash });
       //      this.setState({ ipfsHash2:ipfsHash2[1].hash });
       //
       //      // this.props.kamikaze.methods.newFile(this.state.fileName,).send({
       //      //     from: accounts[0]
       //      // }, (error) => {
       //      //     this.setState({errorMessage: err});
       //      // }).then(()=>{
       //      //     Router.pushRoute(`/`)
       //      //     this.setState({loading:false, buttonColor:'black'})}
       //      // );
       //
       //  });
       //  await ipfs.add(this.state.buffer,this.state.buffer2 (err, ipfsHash) => {
       //
       //  });

        //console.log(this.state.fileName, this.state.iType,ipfsHash1,ipfsHash2,this.state.description, '200')
        //await ipfs.add


    };
    renderModal(extra) {

        const { open, dimmer } = this.state
        return (

            <div style={{visibility: extra, display:'flex'}}>

                    <Button  basic onClick={this.show('blurring')} style={{marginLeft:'48%'}}>Upload</Button>

                <Modal dimmer={dimmer} open={open} onClose={this.close}>
                    <Modal.Header>Upload a file</Modal.Header>
                    <Modal.Content>
                        <Container style={{marginLeft:'48%'}}>

                        <Image src={this.state.file} height="100px" width="100px"/>
                        <Label
                            as="label"
                            basic
                            htmlFor="upload"
                            style={{height:'10%'}}

                        >
                            <Button
                                icon="upload"
                                label={{
                                    basic: true,
                                    content: 'Upload Image'
                                }}
                                labelPosition="right"
                            />
                            <input
                                hidden
                                id="upload"
                                multiple
                                type="file"
                                onChange={this.captureFile}

                            /></Label></Container>
                        <Modal.Description>
                            <Form onSubmit={this.onSubmit}>
                                    <label>First Name</label>
                                    <Form.Input
                                        fluid label='File name'
                                        placeholder='File name'
                                        value={this.state.fileName}

                                        onChange={event =>{
                                            this.setState({fileName: event.target.value})
                                        }}
                                    />
                                <Form.TextArea
                                    label='Description'
                                    placeholder='Description'
                                    value = {this.state.fileDescription}
                                    onChange={event =>{
                                        this.setState({fileDescription: event.target.value})
                                    }}
                                />

                                    <Label
                                        as="label"
                                        basic
                                        htmlFor="upload2"
                                        style={{height:'10%'}}

                                    >
                                        <Button
                                            icon="upload"
                                            label={{
                                                basic: true,
                                                content: 'Upload File'
                                            }}
                                            labelPosition="right"
                                        />
                                        <input
                                            hidden
                                            id="upload2"
                                            multiple
                                            type="file"
                                            onChange={this.captureFile2}

                                        />
                                    </Label>
                                <Icon name={this.state.iconName}/>
                                <Form.Field>
                                <Form.Select fluid label='Type' options={options} placeholder='Type' onChange={(e, { value }) => this.setState({iType:value})}/>
                                </Form.Field>
                            </Form>
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
                            content="Upload"
                            onClick={this.onSubmit}
                        />
                    </Modal.Actions>
                </Modal>

            </div>

        )
    }






    renderThings(){
        return this.props.items.map((items, index) =>{
            return (
                <FileCards
                    key={index}
                    id={index}
                    items={items}
                    userName={this.props.userName}
                    address={this.props.address}
                    extra='hidden'

                />)
        })
    }



    render() {
        return (

            <Layout>
                <Segment secondary style={{ width:"80%" , marginLeft:"10%"}}>
                <Grid >

                        <Grid.Column width={3}>
                            <Image src={this.props.ipfsDir} size='medium' circular />
                        </Grid.Column>

                        <Grid.Column width={9}>
                            <Header size='huge'>
                                {this.props.userName}
                            </Header>
                            <Container>{this.props.description}</Container>


                        </Grid.Column>
                </Grid>
                    <Container textAlign='right'>Total downloads: {this.props.downloads}</Container>
            </Segment>
                <Container >
                    <Card.Group itemsPerRow={3}>
                        {this.renderThings()}
                    </Card.Group>
                </Container>

                <Container  textAlign='center'>

                    <Header icon>
                        <Icon name='upload' />
                        Upload a File
                    </Header>
                    <Divider horizontal hidden fitted/>
                   {this.renderModal(true)}
                    </Container>

            </Layout>

        );
    }
}

export default showUser;
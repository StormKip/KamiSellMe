import React, {Component} from 'react';
import ipfs from '../ethereum/ipfs';
import {Form,Container,Image,Input, Button, Label, Message} from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory'
import web3 from '../ethereum/web3';
import {Router} from '../routes';


class Register extends Component{


       state = {
           ipfsHash:'',
            buffer:null,
            file:`https://ipfs.io/ipfs/QmYSBUj2B6D5fbHdgghUEjC8wHcjL5ndmVE2unDhU6HND2`,
            loading:false,
            errorMessage:'',
            authorName:'',
            authorBio:'',
            buttonColor: 'black',
            buttonDisabled:true,
            gotFile:false,
            gotName:false,
            gotBio:false
        };




    captureFile =(event) => {
        event.stopPropagation()
        event.preventDefault()
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })

        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
        this.setState({gotFile:true});
        this.enableButton(this.state.gotName,this.state.gotBio,this.state.gotFile);
    };

    convertToBuffer = async(reader) => {
        const buffer = await Buffer.from(reader.result);
        this.setState({buffer});
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        this.setState({loading:true, buttonColor:'red'})
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
            console.log(err,ipfsHash);
            this.setState({ ipfsHash:ipfsHash[0].hash });
            factory.methods.createUser(this.state.authorName,this.state.authorBio,this.state.ipfsHash).send({
                from: accounts[0]
            }, (error) => {
                this.setState({errorMessage: err});
            }).then(()=>{
                Router.pushRoute(`/`)
            this.setState({loading:false, buttonColor:'black'})}
            );

        });
        //await ipfs.add


    }; //onSubmit


    enableButton(gName, gBio, gFile){
        if(gName && gBio && gFile){
            this.setState({buttonDisabled:false});
        } else{
            this.setState({buttonDisabled:true});
        }
    }

    render(){
    return(
        <Layout>
            <style jsx global>{`
      body {
        background-image:url("../static/homeBack4.jpg")
      }
    `}</style>
        <Container>
        <div>
            <Image src={this.state.file} height="150px" width="150px" alt="" style={{marginLeft:'41.5%'}}/>
            <Form onSubmit = {this.onSubmit} error={!!this.state.errorMessage}>
                <Label
                    as="label"
                    basic
                    htmlFor="upload"
                    style={{marginLeft:'40%'}}
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

                    />
                </Label>
                <input type="file" id="file" style={{display:'none'}}/>
                <Form.Field>
                    <Form.Input
                        fluid label='First name'
                        placeholder='First name'
                        value={this.state.authorName}

                        onChange={event =>{
                            this.setState({authorName: event.target.value})
                            if(event.target.value>""){
                                this.setState({gotName:true})
                                this.enableButton(this.state.gotName,this.state.gotBio,this.state.gotFile);
                            } else{
                                this.setState({gotName:false})
                                this.enableButton(this.state.gotName,this.state.gotBio,this.state.gotFile);
                            }
                            }}
                    />
                    <Form.TextArea
                        label='About You'
                        placeholder='About You'
                        value = {this.state.authorBio}
                        onChange={event =>{
                            this.setState({authorBio: event.target.value})
                            if(event.target.value>""){
                                this.setState({gotBio:true})
                                this.enableButton(this.state.gotName,this.state.gotBio,this.state.gotFile);
                            } else{
                                this.setState({gotBio:false})
                                this.enableButton(this.state.gotName,this.state.gotBio,this.state.gotFile);
                            }

                            }}
                    />
                </Form.Field>
                <Message error header="Oops" content = {this.state.errorMessage}/>
                <Button basic disabled={this.state.buttonDisabled} loading ={this.state.loading} color={this.state.buttonColor} type="submit">Register</Button>

            </Form>
        </div>


        </Container>
        </Layout>
    );

}}

export default Register;